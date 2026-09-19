import { NextRequest, NextResponse } from 'next/server'
import { getAdminClient } from '@/lib/supabase-admin'
import { getToken } from 'next-auth/jwt'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    // 1. Authenticate Request using NextAuth token
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    })

    if (!token || !token.email) {
      return NextResponse.json(
        { error: 'Unauthorized. Please sign in.' },
        { status: 401 }
      )
    }

    // 2. Parse Form Data
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const interviewId = formData.get('interviewId') as string | null

    if (!file || !interviewId) {
      return NextResponse.json(
        { error: 'Missing file or interviewId parameter.' },
        { status: 400 }
      )
    }

    // 3. Double Validation (Type & Size)
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      return NextResponse.json(
        { error: 'Invalid file format. Only PDF files are allowed.' },
        { status: 400 }
      )
    }

    const maxBytes = 5 * 1024 * 1024 // 5MB
    if (file.size > maxBytes) {
      return NextResponse.json(
        { error: 'File size exceeds the 5MB limit.' },
        { status: 400 }
      )
    }

    // 4. Initialize Supabase Admin Client
    const supabase = getAdminClient()

    // 5. Check if the interview exists and belongs to the recruiter
    const { data: interview, error: dbCheckError } = await supabase
      .from('interviews')
      .select('id, recruiter_email, candidate_name, candidate_email, job_title')
      .eq('id', interviewId)
      .single()

    if (dbCheckError || !interview) {
      return NextResponse.json(
        { error: 'Interview not found.' },
        { status: 404 }
      )
    }

    // Admins can upload, or the owner recruiter
    const userEmail = token.email
    const isAdmin = token.role === 'admin' || userEmail.includes('admin')
    if (!isAdmin && interview.recruiter_email !== userEmail) {
      return NextResponse.json(
        { error: 'Forbidden. You do not own this interview.' },
        { status: 403 }
      )
    }

    // 6. Upload file to Supabase Storage resumes bucket
    const fileId = crypto.randomUUID()
    const filePath = `resumes/${interviewId}/${fileId}.pdf`

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const { error: uploadError } = await supabase.storage
      .from('resumes')
      .upload(filePath, buffer, {
        contentType: 'application/pdf',
        upsert: true,
      })

    if (uploadError) {
      console.error('Storage upload error:', uploadError.message)
      return NextResponse.json(
        { error: `Upload failed: ${uploadError.message}` },
        { status: 500 }
      )
    }

    // 7. Create signed URL with 1 year expiry (31536000 seconds)
    const { data: urlData, error: signedUrlError } = await supabase.storage
      .from('resumes')
      .createSignedUrl(filePath, 31536000)

    if (signedUrlError || !urlData?.signedUrl) {
      console.error('Signed URL generation error:', signedUrlError?.message)
      return NextResponse.json(
        { error: 'Failed to generate signed URL.' },
        { status: 500 }
      )
    }

    // 8. Update interviews table with the signed URL
    const { error: updateError } = await supabase
      .from('interviews')
      .update({ resume_url: urlData.signedUrl })
      .eq('id', interviewId)

    if (updateError) {
      console.error('DB update error:', updateError.message)
      return NextResponse.json(
        { error: `Failed to save resume URL to database: ${updateError.message}` },
        { status: 500 }
      )
    }

    // 9. RAG Automation: Chunk, Embed, and Index into Supabase Vector Store
    let chunksIndexed = 0
    try {
      const pdf = require('pdf-parse/lib/pdf-parse.js')
      const data = await pdf(buffer)
      const rawText = data.text || ''
      const cleanText = rawText.replace(/\r\n/g, '\n').trim()

      if (cleanText.length > 50) {
        const { chunkResumeText } = await import('@/lib/rag/chunker')
        const { storeResumeChunks, storeCandidateProfile } = await import('@/lib/rag/vectorStore')

        const chunks = chunkResumeText(cleanText)
        const candName = interview.candidate_name || 'Candidate'
        const candEmail = interview.candidate_email || `candidate_${interviewId}@hire.ai`

        const storeResult = await storeResumeChunks(interviewId, candName, candEmail, chunks)
        chunksIndexed = storeResult.count

        // Also index candidate profile for ATS smart matching
        await storeCandidateProfile({
          candidateName: candName,
          candidateEmail: candEmail,
          resumeUrl: urlData.signedUrl,
          headline: interview.job_title ? `${interview.job_title} Candidate` : 'Software Professional',
          skills: [],
          experienceSummary: cleanText.slice(0, 500),
          fullProfileText: cleanText,
        })
      }
    } catch (ragErr) {
      console.warn('RAG indexing error during resume upload (continuing without failure):', ragErr)
    }

    return NextResponse.json({
      url: urlData.signedUrl,
      ragIndexed: chunksIndexed > 0,
      chunksCount: chunksIndexed,
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('Resume upload route error:', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
