// @ts-ignore
import pdf from 'pdf-parse'
import Groq from 'groq-sdk'
import { getAdminClient } from '../supabase-admin'
import { ParsedResume } from '@/types/resume'

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || '',
})

const GROQ_MODEL = 'llama-3.3-70b-versatile'

/**
 * Parses a PDF resume from a signed URL, extracts its text, and structures it into
 * a JSON schema using Groq API. The result is saved to the interviews table.
 * 
 * @param resumeUrl The signed URL of the uploaded resume PDF
 * @param interviewId The ID of the interview to link the parsed data to
 * @returns The parsed resume structure
 */
export async function parseResume(resumeUrl: string, interviewId: string): Promise<ParsedResume> {
  if (!process.env.GROQ_API_KEY) {
    throw new Error('GROQ_API_KEY is not configured in environment variables.')
  }

  // 1. Fetch PDF binary from the signed URL
  const response = await fetch(resumeUrl)
  if (!response.ok) {
    throw new Error(`Failed to fetch PDF from URL. Status: ${response.status}`)
  }

  const arrayBuffer = await response.arrayBuffer()
  const pdfBuffer = Buffer.from(arrayBuffer)

  // 2. Extract plain text from PDF using pdf-parse
  let resumeText = ''
  try {
    const parsedPdf = await pdf(pdfBuffer)
    resumeText = parsedPdf.text || ''
  } catch (pdfError: any) {
    console.error('Error parsing PDF content locally:', pdfError)
    throw new Error(`Failed to parse PDF resume text: ${pdfError.message || pdfError}`)
  }

  if (!resumeText.trim()) {
    throw new Error('Extracted resume text is empty or invalid.')
  }

  // 3. Construct extraction prompt for Groq
  const prompt = `You are an expert resume parser. Extract information from the following resume text and structure it into a single, valid JSON object matching the requested schema.

Resume Text:
"""
${resumeText}
"""

Return ONLY a valid JSON object matching the schema below. Do not include markdown code block backticks (like \`\`\`json), no preamble, and no explanation.

Target JSON Schema:
{
  "candidate_name": "<full name>",
  "total_experience_years": <number or null>,
  "current_role": "<most recent job title or null>",
  "skills": {
    "primary": ["<top 5-8 core technical skills>"],
    "secondary": ["<other mentioned skills>"],
    "soft": ["<soft skills if mentioned>"]
  },
  "experience": [
    {
      "company": "<company name>",
      "role": "<job title>",
      "duration": "<e.g. 2 years 3 months>",
      "highlights": ["<key achievement or responsibility 1>", "<2>"]
    }
  ],
  "education": [
    {
      "degree": "<e.g. B.Tech Computer Science>",
      "institution": "<college/university name>",
      "year": <graduation year or null>
    }
  ],
  "projects": [
    {
      "name": "<project name>",
      "description": "<1 sentence>",
      "tech_stack": ["<tech 1>", "<tech 2>"]
    }
  ],
  "certifications": ["<cert 1>", "<cert 2>"],
  "gaps_or_flags": ["<any red flags like employment gaps, short tenures>"]
}`

  // 4. Query Groq with JSON mode enabled
  let structuredData: ParsedResume
  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: GROQ_MODEL,
      temperature: 0.1, // High determinism
      response_format: { type: 'json_object' } // Restricts response to valid JSON only
    })

    const rawJson = chatCompletion.choices[0]?.message?.content || '{}'
    structuredData = JSON.parse(rawJson) as ParsedResume
  } catch (apiError: any) {
    console.error('Groq LLM parsing error:', apiError)
    throw new Error(`Groq extraction failed: ${apiError.message || apiError}`)
  }

  // 5. Basic Schema Integrity checks
  if (!structuredData.candidate_name) {
    structuredData.candidate_name = 'Candidate'
  }
  if (!structuredData.skills) {
    structuredData.skills = { primary: [], secondary: [], soft: [] }
  }
  if (!Array.isArray(structuredData.experience)) {
    structuredData.experience = []
  }

  // 6. Save structured data to interviews database
  const supabase = getAdminClient()
  const { error: dbUpdateError } = await supabase
    .from('interviews')
    .update({ parsed_resume: structuredData })
    .eq('id', interviewId)

  if (dbUpdateError) {
    console.error('Failed to save parsed resume to database:', dbUpdateError.message)
    throw new Error(`Database save error: ${dbUpdateError.message}`)
  }

  return structuredData
}
