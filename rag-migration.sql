-- ============================================================================
-- Enterprise RAG (Retrieval-Augmented Generation) & pgvector Migration
-- AI Voice Recruiter (AIRA)
-- ============================================================================

-- 1. Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. Resume Embeddings Table (Option A: Resume RAG)
CREATE TABLE IF NOT EXISTS resume_embeddings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  interview_id UUID REFERENCES interviews(id) ON DELETE CASCADE,
  candidate_email TEXT,
  candidate_name TEXT,
  chunk_index INTEGER NOT NULL,
  content TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  embedding vector(768),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Evaluation Rubrics Table (Option B: Rubric RAG)
CREATE TABLE IF NOT EXISTS evaluation_rubrics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  job_title TEXT NOT NULL,
  category TEXT NOT NULL,
  question_concept TEXT NOT NULL,
  ideal_answer TEXT NOT NULL,
  criteria JSONB NOT NULL DEFAULT '[]'::jsonb,
  difficulty TEXT DEFAULT 'medium' CHECK (difficulty IN ('easy', 'medium', 'hard')),
  embedding vector(768),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Candidate Talent Profiles Table (Option C: ATS Smart Resume Matching)
CREATE TABLE IF NOT EXISTS candidate_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  candidate_name TEXT NOT NULL,
  candidate_email TEXT NOT NULL,
  resume_url TEXT,
  headline TEXT,
  skills TEXT[] DEFAULT ARRAY[]::TEXT[],
  experience_summary TEXT,
  full_profile_text TEXT,
  profile_embedding vector(768),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Vector & Performance Indexes
CREATE INDEX IF NOT EXISTS idx_resume_embeddings_interview_id ON resume_embeddings(interview_id);
CREATE INDEX IF NOT EXISTS idx_resume_embeddings_candidate_email ON resume_embeddings(candidate_email);
CREATE INDEX IF NOT EXISTS idx_candidate_profiles_email ON candidate_profiles(candidate_email);
CREATE INDEX IF NOT EXISTS idx_evaluation_rubrics_category ON evaluation_rubrics(category);

-- HNSW Cosine Similarity Indexes for sub-millisecond similarity search
CREATE INDEX IF NOT EXISTS idx_resume_embeddings_vector ON resume_embeddings 
  USING hnsw (embedding vector_cosine_ops);

CREATE INDEX IF NOT EXISTS idx_evaluation_rubrics_vector ON evaluation_rubrics 
  USING hnsw (embedding vector_cosine_ops);

CREATE INDEX IF NOT EXISTS idx_candidate_profiles_vector ON candidate_profiles 
  USING hnsw (embedding vector_cosine_ops);

-- ============================================================================
-- 6. RPC Functions for Supabase Vector Similarity Search
-- ============================================================================

-- Function 1: Match Resume Chunks (Used during targeted interview question generation & live probing)
CREATE OR REPLACE FUNCTION match_resume_chunks (
  query_embedding vector(768),
  match_threshold float DEFAULT 0.5,
  match_count int DEFAULT 5,
  filter_interview_id uuid DEFAULT NULL
)
RETURNS TABLE (
  id uuid,
  interview_id uuid,
  candidate_name text,
  chunk_index int,
  content text,
  metadata jsonb,
  similarity float
)
LANGUAGE plpgsql
STABLE
AS $$
BEGIN
  RETURN QUERY
  SELECT
    re.id,
    re.interview_id,
    re.candidate_name,
    re.chunk_index,
    re.content,
    re.metadata,
    1 - (re.embedding <=> query_embedding) AS similarity
  FROM resume_embeddings re
  WHERE (filter_interview_id IS NULL OR re.interview_id = filter_interview_id)
    AND (1 - (re.embedding <=> query_embedding)) >= match_threshold
  ORDER BY
    similarity DESC
  LIMIT match_count;
END;
$$;

-- Function 2: Match Evaluation Rubrics (Used during candidate answer grading)
CREATE OR REPLACE FUNCTION match_evaluation_rubrics (
  query_embedding vector(768),
  match_threshold float DEFAULT 0.4,
  match_count int DEFAULT 3,
  filter_category text DEFAULT NULL
)
RETURNS TABLE (
  id uuid,
  job_title text,
  category text,
  question_concept text,
  ideal_answer text,
  criteria jsonb,
  difficulty text,
  similarity float
)
LANGUAGE plpgsql
STABLE
AS $$
BEGIN
  RETURN QUERY
  SELECT
    er.id,
    er.job_title,
    er.category,
    er.question_concept,
    er.ideal_answer,
    er.criteria,
    er.difficulty,
    1 - (er.embedding <=> query_embedding) AS similarity
  FROM evaluation_rubrics er
  WHERE (filter_category IS NULL OR er.category ILIKE '%' || filter_category || '%')
    AND (1 - (er.embedding <=> query_embedding)) >= match_threshold
  ORDER BY
    similarity DESC
  LIMIT match_count;
END;
$$;

-- Function 3: Match Candidates Semantic (Used by Recruiter ATS Smart Talent Matching)
CREATE OR REPLACE FUNCTION match_candidates_semantic (
  query_embedding vector(768),
  match_threshold float DEFAULT 0.3,
  match_count int DEFAULT 20
)
RETURNS TABLE (
  id uuid,
  candidate_name text,
  candidate_email text,
  resume_url text,
  headline text,
  skills text[],
  experience_summary text,
  similarity float
)
LANGUAGE plpgsql
STABLE
AS $$
BEGIN
  RETURN QUERY
  SELECT
    cp.id,
    cp.candidate_name,
    cp.candidate_email,
    cp.resume_url,
    cp.headline,
    cp.skills,
    cp.experience_summary,
    1 - (cp.profile_embedding <=> query_embedding) AS similarity
  FROM candidate_profiles cp
  WHERE (1 - (cp.profile_embedding <=> query_embedding)) >= match_threshold
  ORDER BY
    similarity DESC
  LIMIT match_count;
END;
$$;
