/**
 * Client-side helper function to securely upload a candidate's resume.
 * Validates the file format (PDF only) and size limit (max 5MB) before
 * sending it to the secure backend API route.
 * 
 * @param file The PDF file object selected by the user.
 * @param interviewId The ID of the interview session.
 * @returns An object containing the signed URL of the uploaded resume.
 */
export async function uploadResume(file: File, interviewId: string): Promise<{ url: string }> {
  // 1. File Type Validation
  if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
    throw new Error('Only PDF files are allowed.')
  }

  // 2. File Size Validation (Max 5MB)
  const maxBytes = 5 * 1024 * 1024
  if (file.size > maxBytes) {
    throw new Error('File size exceeds the 5MB limit.')
  }

  // 3. Send file to the secure backend API route via FormData
  const formData = new FormData()
  formData.append('file', file)
  formData.append('interviewId', interviewId)

  const response = await fetch('/api/resume/upload', {
    method: 'POST',
    body: formData,
  })

  const result = await response.json()

  if (!response.ok) {
    throw new Error(result.error || 'Failed to upload resume.')
  }

  return { url: result.url }
}
