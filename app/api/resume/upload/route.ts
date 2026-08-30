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
      .select('id, recruiter_email')
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

    return NextResponse.json({ url: urlData.signedUrl })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('Resume upload route error:', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
