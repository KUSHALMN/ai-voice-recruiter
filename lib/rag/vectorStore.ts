import { getAdminClient } from '@/lib/supabase-admin'
import { generateEmbedding, generateBatchEmbeddings, cosineSimilarity } from './embeddings'
import { TextChunk } from './chunker'

export interface ResumeChunkMatch {
  id: string
  interview_id?: string
  candidate_name?: string
  chunk_index?: number
  content: string
  metadata?: Record<string, any>
  similarity: number
}

export interface RubricMatch {
  id: string
  job_title: string
  category: string
  question_concept: string
  ideal_answer: string
  criteria: string[]
  difficulty: string
  similarity: number
}

export interface CandidateProfileMatch {
  id: string
  candidate_name: string
  candidate_email: string
  resume_url?: string
  headline?: string
  skills: string[]
  experience_summary?: string
  similarity: number
}

/**
 * Stores chunked resume segments and their 768-dimensional embeddings into Supabase.
 */
export async function storeResumeChunks(
  interviewId: string,
  candidateName: string,
  candidateEmail: string,
  chunks: TextChunk[]
): Promise<{ success: boolean; count: number; error?: string }> {
  try {
    const supabase = getAdminClient()
    if (!chunks || chunks.length === 0) {
      return { success: true, count: 0 }
    }

    // Step 1: Remove any previous chunks for this interview to prevent duplicates
    await supabase
      .from('resume_embeddings')
      .delete()
      .eq('interview_id', interviewId)

    // Step 2: Generate batch embeddings for all chunks
    const texts = chunks.map(c => `${c.section}: ${c.content}`)
    const embeddings = await generateBatchEmbeddings(texts)

    // Step 3: Prepare records
    const rows = chunks.map((c, i) => ({
      interview_id: interviewId,
      candidate_name: candidateName,
      candidate_email: candidateEmail,
      chunk_index: c.index,
      content: c.content,
      metadata: {
        section: c.section,
        ...c.metadata,
      },
      embedding: embeddings[i],
    }))

    // Step 4: Batch insert
    const { error } = await supabase.from('resume_embeddings').insert(rows)

    if (error) {
      console.warn('Vector insert warning (tables might need rag-migration.sql):', error.message)
      return { success: false, count: 0, error: error.message }
    }

    return { success: true, count: rows.length }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown vector store error'
    console.error('storeResumeChunks error:', msg)
    return { success: false, count: 0, error: msg }
  }
}

/**
 * Queries the resume vector space to retrieve the top-k most relevant resume chunks.
 */
export async function queryResumeChunks(
  interviewId: string,
  query: string,
  limit = 4,
  threshold = 0.25
): Promise<ResumeChunkMatch[]> {
  try {
    const supabase = getAdminClient()
    const queryEmbedding = await generateEmbedding(query)

    // Attempt RPC match function
    const { data: rpcData, error: rpcError } = await supabase.rpc('match_resume_chunks', {
      query_embedding: queryEmbedding,
      match_threshold: threshold,
      match_count: limit,
      filter_interview_id: interviewId,
    })

    if (!rpcError && Array.isArray(rpcData) && rpcData.length > 0) {
      return rpcData as ResumeChunkMatch[]
    }

    // Fallback: Query rows directly and calculate cosine similarity in-memory
    const { data: directRows, error: directError } = await supabase
      .from('resume_embeddings')
      .select('id, interview_id, candidate_name, chunk_index, content, metadata, embedding')
      .eq('interview_id', interviewId)
      .limit(50)

    if (directError || !directRows) {
      return []
    }

    const scored: ResumeChunkMatch[] = directRows
      .map(row => {
        const rawEmb = typeof row.embedding === 'string' ? JSON.parse(row.embedding) : row.embedding
        const similarity = Array.isArray(rawEmb) ? cosineSimilarity(queryEmbedding, rawEmb) : 0
        return {
          id: row.id,
          interview_id: row.interview_id,
          candidate_name: row.candidate_name,
          chunk_index: row.chunk_index,
          content: row.content,
          metadata: row.metadata,
          similarity,
        }
      })
      .filter(item => item.similarity >= threshold)
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, limit)

    return scored
  } catch (err: unknown) {
    console.warn('queryResumeChunks error:', err instanceof Error ? err.message : err)
    return []
  }
}

/**
 * Stores or updates a full candidate profile for ATS smart talent matching.
 */
export async function storeCandidateProfile(profile: {
  candidateName: string
  candidateEmail: string
  resumeUrl?: string
  headline?: string
  skills: string[]
  experienceSummary?: string
  fullProfileText: string
}): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = getAdminClient()
    const combinedText = `Candidate: ${profile.candidateName}\nHeadline: ${profile.headline || ''}\nSkills: ${profile.skills.join(', ')}\nSummary: ${profile.experienceSummary || ''}\nProfile Details: ${profile.fullProfileText}`
    const embedding = await generateEmbedding(combinedText)

    // Check existing by email
    const { data: existing } = await supabase
      .from('candidate_profiles')
      .select('id')
      .eq('candidate_email', profile.candidateEmail)
      .maybeSingle()

    const payload = {
      candidate_name: profile.candidateName,
      candidate_email: profile.candidateEmail,
      resume_url: profile.resumeUrl || null,
      headline: profile.headline || 'Software Professional',
      skills: profile.skills,
      experience_summary: profile.experienceSummary || '',
      full_profile_text: profile.fullProfileText,
      profile_embedding: embedding,
      updated_at: new Date().toISOString(),
    }

    if (existing?.id) {
      await supabase.from('candidate_profiles').update(payload).eq('id', existing.id)
    } else {
      await supabase.from('candidate_profiles').insert([payload])
    }

    return { success: true }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown profile store error'
    console.warn('storeCandidateProfile error:', msg)
    return { success: false, error: msg }
  }
}

/**
 * Executes a semantic similarity search across all candidate profiles for ATS matching.
 */
export async function queryCandidatesSemantic(
  searchQuery: string,
  limit = 20,
  threshold = 0.2
): Promise<CandidateProfileMatch[]> {
  try {
    const supabase = getAdminClient()
    const queryEmbedding = await generateEmbedding(searchQuery)

    // Attempt RPC match function
    const { data: rpcData, error: rpcError } = await supabase.rpc('match_candidates_semantic', {
      query_embedding: queryEmbedding,
      match_threshold: threshold,
      match_count: limit,
    })

    if (!rpcError && Array.isArray(rpcData) && rpcData.length > 0) {
      return rpcData as CandidateProfileMatch[]
    }

    // In-memory fallback
    const { data: directRows, error: directError } = await supabase
      .from('candidate_profiles')
      .select('id, candidate_name, candidate_email, resume_url, headline, skills, experience_summary, profile_embedding')
      .limit(100)

    if (directError || !directRows) {
      return []
    }

    const scored: CandidateProfileMatch[] = directRows
      .map(row => {
        const rawEmb = typeof row.profile_embedding === 'string' ? JSON.parse(row.profile_embedding) : row.profile_embedding
        const similarity = Array.isArray(rawEmb) ? cosineSimilarity(queryEmbedding, rawEmb) : 0
        return {
          id: row.id,
          candidate_name: row.candidate_name,
          candidate_email: row.candidate_email,
          resume_url: row.resume_url,
          headline: row.headline,
          skills: Array.isArray(row.skills) ? row.skills : [],
          experience_summary: row.experience_summary,
          similarity,
        }
      })
      .filter(item => item.similarity >= threshold)
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, limit)

    return scored
  } catch (err: unknown) {
    console.warn('queryCandidatesSemantic error:', err instanceof Error ? err.message : err)
    return []
  }
}

/**
 * Stores evaluation rubric benchmark in the vector store.
 */
export async function storeEvaluationRubric(rubric: {
  jobTitle: string
  category: string
  questionConcept: string
  idealAnswer: string
  criteria: string[]
  difficulty: 'easy' | 'medium' | 'hard'
}): Promise<boolean> {
  try {
    const supabase = getAdminClient()
    const textToEmbed = `Category: ${rubric.category}\nConcept: ${rubric.questionConcept}\nIdeal Answer: ${rubric.idealAnswer}\nCriteria: ${rubric.criteria.join('; ')}`
    const embedding = await generateEmbedding(textToEmbed)

    const { error } = await supabase.from('evaluation_rubrics').insert([
      {
        job_title: rubric.jobTitle,
        category: rubric.category,
        question_concept: rubric.questionConcept,
        ideal_answer: rubric.idealAnswer,
        criteria: rubric.criteria,
        difficulty: rubric.difficulty,
        embedding,
      },
    ])

    return !error
  } catch (err) {
    console.warn('storeEvaluationRubric error:', err)
    return false
  }
}

/**
 * Retrieves the best matching evaluation rubric for a question.
 */
export async function queryEvaluationRubric(
  question: string,
  category?: string,
  limit = 2,
  threshold = 0.3
): Promise<RubricMatch[]> {
  try {
    const supabase = getAdminClient()
    const queryEmbedding = await generateEmbedding(question)

    // Attempt RPC match function
    const { data: rpcData, error: rpcError } = await supabase.rpc('match_evaluation_rubrics', {
      query_embedding: queryEmbedding,
      match_threshold: threshold,
      match_count: limit,
      filter_category: category || null,
    })

    if (!rpcError && Array.isArray(rpcData) && rpcData.length > 0) {
      return rpcData as RubricMatch[]
    }

    // Fallback: in-memory cosine similarity
    const { data: rows } = await supabase
      .from('evaluation_rubrics')
      .select('id, job_title, category, question_concept, ideal_answer, criteria, difficulty, embedding')
      .limit(50)

    if (!rows || rows.length === 0) return []

    const scored: RubricMatch[] = rows
      .map(row => {
        const rawEmb = typeof row.embedding === 'string' ? JSON.parse(row.embedding) : row.embedding
        const similarity = Array.isArray(rawEmb) ? cosineSimilarity(queryEmbedding, rawEmb) : 0
        return {
          id: row.id,
          job_title: row.job_title,
          category: row.category,
          question_concept: row.question_concept,
          ideal_answer: row.ideal_answer,
          criteria: Array.isArray(row.criteria) ? row.criteria : [],
          difficulty: row.difficulty,
          similarity,
        }
      })
      .filter(item => item.similarity >= threshold)
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, limit)

    return scored
  } catch (err) {
    console.warn('queryEvaluationRubric error:', err)
    return []
  }
}
