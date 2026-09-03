import { NextResponse } from 'next/server'
import Groq from 'groq-sdk'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

// Heuristic fallback parser when LLM is unavailable
function fallbackHeuristicParser(text: string) {
  // Extract email
  const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/)
  const candidateEmail = emailMatch ? emailMatch[0] : ''

  // Extract name (usually at the very top of resume)
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean)
  let candidateName = ''
  for (const line of lines.slice(0, 5)) {
    if (line.length > 2 && line.length < 35 && !line.includes('@') && !line.includes('http') && !line.match(/\d/)) {
      candidateName = line
      break
    }
  }

  // Detect skills safely without RegExp syntax errors on C++, C#, .NET etc.
  const commonSkills = [
    'React', 'Next.js', 'Node.js', 'TypeScript', 'JavaScript', 'Python', 'Java', 'C++', 'C#',
    'AWS', 'Docker', 'Kubernetes', 'SQL', 'PostgreSQL', 'MongoDB', 'GraphQL', 'Tailwind',
    'Machine Learning', 'AI', 'DevOps', 'Go', 'Rust', 'Product Management', 'Figma'
  ]
  
  const detectedSkills = commonSkills.filter(skill => {
    try {
      const escaped = escapeRegExp(skill)
      return new RegExp(`(?:^|[^a-zA-Z0-9#+])${escaped}(?:$|[^a-zA-Z0-9#+])`, 'i').test(text)
    } catch {
      return text.toLowerCase().includes(skill.toLowerCase())
    }
  })

  // Experience level inference
  const lower = text.toLowerCase()
  let candidateType = 'Experienced'
  if (lower.includes('lead') || lower.includes('manager') || lower.includes('director') || lower.includes('head of')) {
    candidateType = 'Managerial'
  } else if (lower.includes('intern') || lower.includes('student') || lower.includes('graduate') || lower.includes('fresher')) {
    candidateType = 'Fresher'
  }

  // Continent inference
  let continent = 'North America'
  if (lower.includes('india') || lower.includes('singapore') || lower.includes('japan') || lower.includes('china') || lower.includes('asia')) {
    continent = 'Asia'
  } else if (lower.includes('uk') || lower.includes('germany') || lower.includes('france') || lower.includes('europe') || lower.includes('london') || lower.includes('berlin')) {
    continent = 'Europe'
  } else if (lower.includes('brazil') || lower.includes('argentina') || lower.includes('colombia')) {
    continent = 'South America'
  } else if (lower.includes('nigeria') || lower.includes('kenya') || lower.includes('south africa') || lower.includes('egypt')) {
    continent = 'Africa'
  } else if (lower.includes('australia') || lower.includes('sydney') || lower.includes('melbourne') || lower.includes('new zealand')) {
    continent = 'Australia / Oceania'
  } else if (lower.includes('antarctica') || lower.includes('mcmurdo')) {
    continent = 'Antarctica'
  }

  const jobTitle = detectedSkills.length > 0 
    ? `Senior ${detectedSkills.slice(0, 2).join(' / ')} Engineer`
    : 'Full Stack Software Engineer'

  const jobDescription = `Role Overview:
We are seeking an exceptional professional to join our fast-paced engineering team. The ideal candidate demonstrates strong capability in modern software architecture, robust engineering principles, and scalable system design.

Key Responsibilities:
- Design, build, and maintain efficient, reusable, and reliable systems.
- Collaborate with cross-functional teams to define, design, and ship new features.
- Ensure optimal performance, quality, and responsiveness of applications.
- Identify bottlenecks and devise solutions to technical problems.

Required Qualifications & Skills:
- Hands-on experience with: ${detectedSkills.length > 0 ? detectedSkills.join(', ') : 'modern software stacks and tools'}.
- Strong problem-solving, communication, and teamwork skills.`

  return {
    candidateName: candidateName || 'Candidate',
    candidateEmail,
    suggestedJobTitle: jobTitle,
    suggestedJobDescription: jobDescription,
    candidateType,
    interviewType: 'Technical',
    continent,
    keySkills: detectedSkills,
    experienceYears: candidateType === 'Fresher' ? 1 : candidateType === 'Managerial' ? 8 : 4,
    summary: 'Candidate profile extracted successfully from resume.'
  }
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      return NextResponse.json({ error: 'File must be a PDF' }, { status: 400 })
    }

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    let cleanText = ''
    try {
      const pdf = require('pdf-parse/lib/pdf-parse.js')
      const data = await pdf(buffer)
      cleanText = (data.text || '')
        .replace(/\r\n/g, '\n')
        .replace(/\n{3,}/g, '\n\n')
        .trim()
    } catch (parseErr) {
      console.warn('pdf-parse error, attempting buffer string extraction:', parseErr)
      const rawStr = buffer.toString('utf-8', 0, Math.min(buffer.length, 50000))
      const textMatches = rawStr.match(/\(([^()]+)\)Tj/g) || []
      cleanText = textMatches.map(m => m.slice(1, -3)).join(' ')
      if (!cleanText || cleanText.length < 20) {
        cleanText = rawStr.replace(/[^\x20-\x7E\n]/g, ' ')
      }
    }

    if (!cleanText || cleanText.trim().length < 10) {
      return NextResponse.json(
        { error: 'Could not extract text from this PDF. Please ensure it is not password protected or image-only.' },
        { status: 400 }
      )
    }

    // Try AI-powered parsing with Groq
    const apiKey = process.env.GROQ_API_KEY
    if (apiKey) {
      try {
        const groq = new Groq({ apiKey })
        const prompt = `You are an elite AI Recruiter and Resume Parser.
Analyze the following candidate resume text and extract key structured hiring details, plus generate a comprehensive, tailored Job Description matching this candidate's background.

Resume Text (first 4000 characters):
"""
${cleanText.slice(0, 4000)}
"""

Respond ONLY with a valid JSON object matching the following structure:
{
  "candidateName": "<Candidate's Full Name or null>",
  "candidateEmail": "<Candidate's Email or null>",
  "suggestedJobTitle": "<Ideal Job Title for this candidate e.g. Senior Full-Stack Engineer, Lead Product Designer, Data Scientist>",
  "suggestedJobDescription": "<A well-formatted 3-4 paragraph professional job description with Role Overview, Key Responsibilities, and Technical Requirements customized to this candidate's profile>",
  "candidateType": "<Fresher | Experienced | Managerial>",
  "interviewType": "<Technical | Behavioral | Problem Solving | Leadership | Experience-based>",
  "continent": "<North America | South America | Europe | Asia | Africa | Australia / Oceania | Antarctica>",
  "keySkills": ["Skill 1", "Skill 2", "Skill 3", "Skill 4", "Skill 5"],
  "experienceYears": <estimated years of experience as a number e.g. 4>,
  "summary": "<2-sentence executive summary of the candidate's core strength and background>"
}`

        const completion = await groq.chat.completions.create({
          model: 'llama-3.3-70b-versatile',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.2,
          response_format: { type: 'json_object' },
        })

        const rawJson = completion.choices[0]?.message?.content || '{}'
        const parsed = JSON.parse(rawJson)

        const validContinents = [
          'North America', 'South America', 'Europe', 'Asia', 'Africa', 'Australia / Oceania', 'Antarctica'
        ]
        const continent = validContinents.includes(parsed.continent) ? parsed.continent : 'North America'

        return NextResponse.json({
          text: cleanText,
          candidateName: parsed.candidateName || 'Candidate',
          candidateEmail: parsed.candidateEmail || '',
          suggestedJobTitle: parsed.suggestedJobTitle || 'Software Engineer',
          suggestedJobDescription: parsed.suggestedJobDescription || '',
          candidateType: ['Fresher', 'Experienced', 'Managerial'].includes(parsed.candidateType) ? parsed.candidateType : 'Experienced',
          interviewType: ['Technical', 'Behavioral', 'Problem Solving', 'Leadership', 'Experience-based'].includes(parsed.interviewType) ? parsed.interviewType : 'Technical',
          continent,
          keySkills: Array.isArray(parsed.keySkills) ? parsed.keySkills : [],
          experienceYears: typeof parsed.experienceYears === 'number' ? parsed.experienceYears : 3,
          summary: parsed.summary || 'Resume analyzed successfully.'
        })
      } catch (aiErr) {
        console.error('Groq parsing error, using heuristic fallback:', aiErr)
      }
    }

    // Heuristic fallback if Groq unavailable or failed
    const fallback = fallbackHeuristicParser(cleanText)
    return NextResponse.json({
      text: cleanText,
      ...fallback
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error('Resume parsing API error:', message)
    return NextResponse.json(
      { error: `Failed to parse resume: ${message}` },
      { status: 500 }
    )
  }
}
