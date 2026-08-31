import { NextRequest, NextResponse } from 'next/server'
import { getAdminClient } from '@/lib/supabase-admin'
import { verifyCandidateJWT } from '@/lib/auth-candidate'
import { evaluateAnswer } from '@/lib/ai/evaluateAnswer'
import { AdaptiveDifficultyEngine, Question } from '@/lib/ai/adaptiveDifficulty'
import Groq from 'groq-sdk'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || '',
})

/**
 * Helper to generate a dynamic bonus or supportive question using Groq
 */
async function generateDynamicQuestion(
  jobTitle: string,
  jobDescription: string,
  hint: string,
  parsedResume?: any
): Promise<Question> {
  const prompt = `You are a senior technical interviewer. Generate a single interview question for the role of ${jobTitle}.
Context / Target Objective: ${hint}
${jobDescription ? `Job Description:\n${jobDescription}\n` : ''}
${parsedResume ? `Candidate's parsed resume details:\n${JSON.stringify(parsedResume)}\n` : ''}

Generate a single question. If the objective is a bonus challenge, make it advanced and deep. If the objective is supportive, make it behavioral or basic conceptual.
Return ONLY a valid JSON object matching the requested schema. Do not include markdown backticks (like \`\`\`json), no preamble, and no explanation.

JSON Schema:
{
  "id": "<generate a random UUID>",
  "text": "<the question text>",
  "type": "technical" | "behavioral" | "situational",
  "difficulty": "easy" | "medium" | "hard",
  "target_skill": "<skill being tested>",
  "ideal_answer_hints": ["<hint 1>", "<hint 2>"]
}`

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
      response_format: { type: 'json_object' }
    })

    const rawJson = chatCompletion.choices[0]?.message?.content || '{}'
    const result = JSON.parse(rawJson)

    return {
      id: result.id || crypto.randomUUID(),
      text: result.text || 'Tell me about a challenging technical decision you had to make recently.',
      difficulty: result.difficulty || 'medium',
      type: result.type || 'technical',
      target_skill: result.target_skill || 'Problem Solving',
      ideal_answer_hints: result.ideal_answer_hints || []
    }
  } catch (error) {
    console.error('Error generating dynamic bonus question:', error)
    return {
      id: crypto.randomUUID(),
      text: 'Tell me about a challenging technical decision you had to make recently.',
      difficulty: 'medium',
      type: 'behavioral',
      target_skill: 'Problem Solving',
      ideal_answer_hints: []
    }
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { sessionId } = await params
    const body = await request.json()
    const { questionId, answer, questionIndex } = body

    // 1. Authenticate candidate using candidate JWT
    const authHeader = request.headers.get('Authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Missing authorization header' }, { status: 401 })
    }

    const token = authHeader.split(' ')[1]
    const payload = verifyCandidateJWT(token)
    if (!payload) {
      return NextResponse.json({ error: 'Invalid or expired candidate token' }, { status: 401 })
    }

    const supabase = getAdminClient()

    // 2. Fetch session details
    const { data: session, error: sessionErr } = await supabase
      .from('interview_sessions')
      .select('*')
      .eq('id', sessionId)
      .single()

    if (sessionErr || !session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 })
    }

    // Verify session belongs to the candidate's interview
    if (session.interview_id !== payload.interviewId) {
      return NextResponse.json({ error: 'Forbidden. Interview ID mismatch.' }, { status: 403 })
    }

    // 3. Fetch interview details
    const { data: interview, error: intErr } = await supabase
      .from('interviews')
      .select('id, job_title, job_description, parsed_resume, question_set')
      .eq('id', session.interview_id)
      .single()

    if (intErr || !interview) {
      return NextResponse.json({ error: 'Interview details not found' }, { status: 404 })
    }

    // 4. Retrieve question text
    const questionPool: Question[] = (interview.question_set as any)?.questions || []
    let questionObj = questionPool.find(q => q.id === questionId)
    const questionText = questionObj ? questionObj.text : 'General Question'

    // 5. Evaluate the answer
    console.log(`⌛ Scoring answer to: "${questionText.substring(0, 40)}..."`)
    const evalResult = await evaluateAnswer(questionText, answer, interview.job_title)
    console.log(`✅ Score: ${evalResult.score}/10`)

    // 6. Update Adaptive Difficulty state
    // Load historical scores to reconstruct state
    const previousScores: any[] = session.scores || []
    const scoreHistory = previousScores.map(s => typeof s === 'number' ? s : s.score || 5)
    
    const engine = AdaptiveDifficultyEngine.reconstructFromHistory(scoreHistory)
    const action = engine.recordAnswer(evalResult.score)

    // 7. Select or Generate next question
    let nextQuestionObj: Question | null = null
    
    // Find all answered question IDs so far in this session
    // Map existing answers or questions asked to their pool IDs
    const askedQuestionsText: string[] = session.questions || []
    const answeredIds = questionPool
      .filter(q => askedQuestionsText.includes(q.text) || q.id === questionId)
      .map(q => q.id)

    if (action.shouldAddBonusQuestion && action.bonusQuestionHint) {
      console.log(`🌟 Triggering dynamic question generation: ${action.bonusQuestionHint}`)
      nextQuestionObj = await generateDynamicQuestion(
        interview.job_title,
        interview.job_description || '',
        action.bonusQuestionHint,
        interview.parsed_resume
      )
    } else {
      nextQuestionObj = engine.getNextQuestion(questionPool, answeredIds)
    }

    // 8. Prepare update arrays
    const updatedAnswers = [...(session.answers || []), answer]
    const updatedScores = [...previousScores, {
      questionId,
      questionText,
      score: evalResult.score,
      feedback: evalResult.brief_feedback
    }]
    const updatedQuestions = [...askedQuestionsText]
    
    // If the answered question wasn't in questions array, add it
    if (!updatedQuestions.includes(questionText)) {
      updatedQuestions.push(questionText)
    }

    // If next question is selected/generated, add it to database questions pool
    if (nextQuestionObj) {
      updatedQuestions.push(nextQuestionObj.text)
    }

    // 9. Update Database
    const { error: updateErr } = await supabase
      .from('interview_sessions')
      .update({
        questions: updatedQuestions,
        answers: updatedAnswers,
        scores: updatedScores,
        current_question_index: questionIndex + 1,
        difficulty_level: action.newDifficulty
      })
      .eq('id', sessionId)

    if (updateErr) {
      console.error('Failed to update session answer progress:', updateErr.message)
      throw new Error(`DB Update failed: ${updateErr.message}`)
    }

    return NextResponse.json({
      score: evalResult.score,
      feedback: evalResult.brief_feedback,
      nextQuestion: nextQuestionObj ? nextQuestionObj.text : null,
      nextQuestionId: nextQuestionObj ? nextQuestionObj.id : null,
      newDifficulty: action.newDifficulty,
      shouldAddBonusQuestion: action.shouldAddBonusQuestion
    })

  } catch (err: any) {
    console.error('API evaluate answer error:', err)
    return NextResponse.json(
      { error: `Failed to process answer: ${err.message}` },
      { status: 500 }
    )
  }
}
