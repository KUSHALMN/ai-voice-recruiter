import Groq from 'groq-sdk'

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || '',
})

if (!process.env.GROQ_API_KEY) {
  console.warn('⚠️ GROQ_API_KEY not set')
}

const GROQ_MODEL = 'llama-3.3-70b-versatile'

async function callGroq(prompt: string, temperature = 0.7, retries = 1): Promise<string> {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 15000) // 15s timeout

      const completion = await groq.chat.completions.create({
        model: GROQ_MODEL,
        messages: [{ role: 'user', content: prompt }],
        temperature,
      }, { signal: controller.signal })

      clearTimeout(timeoutId)
      const content = completion.choices[0]?.message?.content || ''
      if (!content && attempt < retries) {
        console.warn(`Groq returned empty response, retrying (attempt ${attempt + 1})...`)
        continue
      }
      return content
    } catch (error: unknown) {
      const errMsg = error instanceof Error ? error.message : String(error)
      if (attempt < retries) {
        console.warn(`Groq API error (attempt ${attempt + 1}), retrying:`, errMsg)
        await new Promise(r => setTimeout(r, 1000)) // 1s backoff
        continue
      }
      throw error
    }
  }
  return ''
}

export class GeminiService {
  async generateInterviewQuestions(jobTitle: string, jobDescription: string, interviewType: string, candidateType: string, duration: number, resumeText?: string): Promise<string[]> {
    try {
      // Dynamic question count based on duration
      const questionsMin = Math.floor(duration * 1.5)
      const questionsMax = Math.floor(duration * 2.5)
      const questionCount = Math.floor(Math.random() * (questionsMax - questionsMin + 1)) + questionsMin


      let focusArea = ''

      // Determine focus based on interview type
      switch (interviewType.toLowerCase()) {
        case 'technical':
          focusArea = 'coding problems, algorithmic challenges, and data structure implementation tasks. DO NOT ask theoretical questions. Every question must ask the candidate to write code.'
          break
        case 'behavioral':
          focusArea = 'behavioral scenarios, teamwork, conflict resolution, and soft skills'
          break
        case 'problem solving':
          focusArea = 'analytical thinking, problem-solving scenarios, and logical reasoning'
          break
        case 'leadership':
          focusArea = 'leadership experience, team management, decision-making, and strategic thinking'
          break
        case 'mixed':
          focusArea = 'a balanced mix of technical (40%), behavioral (30%), problem-solving (20%), and situational (10%) questions'
          break
        default:
          focusArea = 'relevant skills and experience'
      }

      let prompt = `Generate exactly ${questionCount} interview questions for a ${candidateType} ${jobTitle} position.

Job Description: ${jobDescription}
Interview Type: ${interviewType}
Candidate Level: ${candidateType}
Focus Area: ${focusArea}`

      if (resumeText) {
        prompt += `\n\nCandidate Resume Content:
${resumeText.substring(0, 3000)}... (truncated)

IMPORTANT:
- Tailor at least 50% of the questions specifically to the candidate's resume (projects, skills, experience).
- Ask about specific claims made in their resume.
- Compare their experience with the Job Description requirements.`
      }

      prompt += `\n\nRequirements:
- Generate EXACTLY ${questionCount} questions
- Questions must be appropriate for ${candidateType} level
- Focus strictly on ${focusArea}
- For Technical interviews, questions MUST start with phrases like "Write a function...", "Implement...", "Create a class...", etc.
- Questions should be conversational and natural
- Each question should be clear and specific
- Return ONLY the questions, one per line, numbered 1-${questionCount}
- Do NOT include any introductory text or explanations`

      const text = await callGroq(prompt, 0.7)

      // Parse questions and remove numbering
      const questions = text
        .split('\n')
        .map(q => q.trim())
        .filter(q => q.length > 10)
        .map(q => q.replace(/^\d+[\.\)\-]\s*/, '').trim())
        .filter(q => q.length > 0)


      if (questions.length === 0) {
        throw new Error('No questions generated')
      }

      return questions.slice(0, questionCount)
    } catch (error) {
      console.error('Groq API error:', error)
      throw error
    }
  }

  async evaluateAnswer(question: string, answer: string, jobTitle: string, interviewType: string): Promise<{
    scores: {
      technical: number
      communication: number
      confidence: number
      problem_solving: number
      clarity: number
      professionalism: number
    }
    feedback: string
  }> {
    // Count words in answer
    const wordCount = answer.trim().split(/\s+/).length

    // Check for disqualifying phrases
    const lowerAnswer = answer.toLowerCase()
    const hasNoIdea = lowerAnswer.includes("i don't know") ||
      lowerAnswer.includes("no idea") ||
      lowerAnswer.includes("not sure") ||
      lowerAnswer.includes("i dont know")

    // Apply severe penalties
    if (wordCount < 8) {
      return {
        scores: {
          technical: 1,
          communication: 1,
          confidence: 1,
          problem_solving: 1,
          clarity: 1,
          professionalism: 2
        },
        feedback: "Answer too short (< 8 words). Insufficient detail provided."
      }
    }

    if (hasNoIdea) {
      return {
        scores: {
          technical: 0,
          communication: 1,
          confidence: 0,
          problem_solving: 0,
          clarity: 1,
          professionalism: 1
        },
        feedback: "Candidate expressed lack of knowledge. No substantive answer provided."
      }
    }

    const prompt = `You are an objective interview answer evaluator.

Scoring rule:
- Score only based on the ACTUAL information in the candidate's response.
- If the answer lacks detail, says "I don't know", or does not address the question → score must be very low (0–3).
- Do NOT guess missing information or give benefit of doubt.
- Require evidence: every positive score must cite exact phrases from the answer.

Evaluation Format (MUST be valid JSON):
{
  "score_out_of_10": integer (0-10),
  "rubric_breakdown": {
    "technical_accuracy": 0-10,
    "problem_solving": 0-10,
    "depth": 0-10,
    "communication": 0-10
  },
  "evidence": [
    "List 1-3 exact quotes from answer that justify the score"
  ],
  "comments": "Very short and factual comment about performance.",
  "recommended_action": "Hire | Further Interview | Reject"
}

Severe Penalty Rules:
- If answer is < 8 words → score_out_of_10 <= 2
- If answer includes phrases like "I don't know", "no idea", "not sure" → score_out_of_10 <= 1
- If answer is irrelevant → score_out_of_10 = 0

Never reward generic fluff or restating the question.
Never invent missing content.
Temperature = 0 for deterministic scoring.

Question: ${question}
Answer: ${answer}
Position: ${jobTitle}
Interview Type: ${interviewType}

Provide ONLY valid JSON response.`

    const text = await callGroq(prompt, 0)

    try {
      const parsed = JSON.parse(text.replace(/```json|```/g, '').trim())

      // Convert to expected format
      const overallScore = parsed.score_out_of_10 || 0
      const rubric = parsed.rubric_breakdown || {}

      return {
        scores: {
          technical: rubric.technical_accuracy || Math.max(0, overallScore - 2),
          communication: rubric.communication || overallScore,
          confidence: Math.max(0, overallScore - 1),
          problem_solving: rubric.problem_solving || overallScore,
          clarity: rubric.depth || overallScore,
          professionalism: Math.max(0, overallScore - 1)
        },
        feedback: `${parsed.comments || 'Evaluated'} Evidence: ${parsed.evidence?.join('; ') || 'None'}. Action: ${parsed.recommended_action || 'Review'}`
      }
    } catch (error) {
      console.error('Parse error:', error)
      return {
        scores: {
          technical: 3,
          communication: 3,
          confidence: 3,
          problem_solving: 3,
          clarity: 3,
          professionalism: 3
        },
        feedback: "Unable to parse evaluation response"
      }
    }
  }

  async evaluateAnswerWithASR(question: string, answer: string, asrConfidence: number, jobTitle: string, interviewType: string): Promise<{
    scores: {
      technical: number
      communication: number
      confidence: number
      problem_solving: number
      clarity: number
      professionalism: number
    }
    feedback: string
  }> {
    const wordCount = answer.trim().split(/\s+/).length
    const lowerAnswer = answer.toLowerCase()
    const hasNoIdea = lowerAnswer.includes("i don't know") ||
      lowerAnswer.includes("no idea") ||
      lowerAnswer.includes("not sure") ||
      lowerAnswer.includes("i dont know")

    // Determine ASR penalty
    let asrPenalty = 1.0
    let asrNote = ''
    if (asrConfidence < 0.75) {
      asrPenalty = 0.6 // 40% reduction
      asrNote = 'ASR confidence < 0.75: 40% score reduction applied. '
    } else if (asrConfidence < 0.90) {
      asrPenalty = 0.8 // 20% reduction
      asrNote = 'ASR confidence < 0.90: 20% score reduction applied. '
    }

    // Apply content penalties
    if (wordCount < 8) {
      return {
        scores: {
          technical: Math.round(1 * asrPenalty),
          communication: Math.round(1 * asrPenalty),
          confidence: Math.round(1 * asrPenalty),
          problem_solving: Math.round(1 * asrPenalty),
          clarity: Math.round(1 * asrPenalty),
          professionalism: Math.round(2 * asrPenalty)
        },
        feedback: `${asrNote}Answer too short (${wordCount} words < 8). Insufficient detail.`
      }
    }

    if (hasNoIdea) {
      return {
        scores: {
          technical: 0,
          communication: Math.round(1 * asrPenalty),
          confidence: 0,
          problem_solving: 0,
          clarity: Math.round(1 * asrPenalty),
          professionalism: Math.round(1 * asrPenalty)
        },
        feedback: `${asrNote}Candidate expressed lack of knowledge. No substantive answer.`
      }
    }

    const prompt = `You are an unbiased interview answer evaluator.

Inputs you will receive:
- question_text: ${question}
- answer_text: ${answer}
- asr_confidence: ${asrConfidence.toFixed(2)}

Scoring Rule:
Evaluate ONLY based on real information in the answer_text.
If the answer_text is unclear or incomplete OR asr_confidence < 0.75 → apply strict penalties.

ASR Confidence Penalty:
- If asr_confidence >= 0.90 → normal scoring
- If 0.75 <= asr_confidence < 0.90 → reduce all scores by 20%
- If asr_confidence < 0.75 → reduce all scores by 40% and mark in comments

Content Penalty:
- If candidate says "I don't know", "No idea", "Not sure", or irrelevant content → score_out_of_10 must be between 0-1
- If the answer is < 8 words → score_out_of_10 <= 2

Evidence is required:
Every positive score must cite exact quotes from the answer_text.
Do NOT hallucinate missing information.

Rubric Weights:
technical_accuracy: 40%
problem_solving: 25%
depth: 20%
communication: 15%

Output format MUST be valid JSON exactly as below:

{
  "score_out_of_10": integer (0-10 after penalties),
  "rubric_breakdown": {
    "technical_accuracy": 0-10,
    "problem_solving": 0-10,
    "depth": 0-10,
    "communication": 0-10
  },
  "evidence": [
    "list exact quotes from answer that justify the score"
  ],
  "comments": "Short and objective explanation with ASR penalty noted if applied.",
  "recommended_action": "Hire | Further Interview | Reject"
}

Rules:
- No compliments.
- No speculation beyond answer_text.
- Temperature must be 0 for deterministic output.

Position: ${jobTitle}
Interview Type: ${interviewType}

Provide ONLY valid JSON response.`

    const text = await callGroq(prompt, 0)

    try {
      const parsed = JSON.parse(text.replace(/```json|```/g, '').trim())
      const rubric = parsed.rubric_breakdown || {}

      return {
        scores: {
          technical: rubric.technical_accuracy || 0,
          communication: rubric.communication || 0,
          confidence: Math.max(0, (parsed.score_out_of_10 || 0) - 1),
          problem_solving: rubric.problem_solving || 0,
          clarity: rubric.depth || 0,
          professionalism: Math.max(0, (parsed.score_out_of_10 || 0) - 1)
        },
        feedback: `${parsed.comments || 'Evaluated'}. Evidence: ${parsed.evidence?.join('; ') || 'None'}. Action: ${parsed.recommended_action || 'Review'}`
      }
    } catch (error) {
      console.error('Parse error:', error)
      return {
        scores: {
          technical: Math.round(2 * asrPenalty),
          communication: Math.round(2 * asrPenalty),
          confidence: Math.round(2 * asrPenalty),
          problem_solving: Math.round(2 * asrPenalty),
          clarity: Math.round(2 * asrPenalty),
          professionalism: Math.round(2 * asrPenalty)
        },
        feedback: `${asrNote}Unable to parse evaluation response.`
      }
    }
  }

  async evaluateCode(code: string, language: string, problemDescription: string): Promise<{
    correctness: number
    efficiency: number
    readability: number
    bestPractices: number
    finalCodeScore: number
    strength: string
    improvement: string
  }> {
    const prompt = `Evaluate the following code submitted by a candidate in an AI technical interview.

Problem Context: ${problemDescription}
Language: ${language}

Code:
\`\`\`${language}
${code}
\`\`\`

Analyze for:
1. Correctness of logic
2. Time complexity and efficiency
3. Code readability and structure
4. Edge case handling
5. Best practices and maintainability

Return a JSON ONLY:

{
  "correctness": score_out_of_10,
  "efficiency": score_out_of_10,
  "readability": score_out_of_10,
  "bestPractices": score_out_of_10,
  "finalCodeScore": score_out_of_10,
  "strength": "One sentence about what is good",
  "improvement": "One sentence about what must improve"
}

Important rules:
- Do NOT reveal scores to the candidate.
- Do NOT mention this evaluation during the interview.
- Store these results internally.
- Store finalCodeScore as main metric for technical evaluation.
`

    try {
      const text = await callGroq(prompt, 0.2)
      const parsed = JSON.parse(text.replace(/```json|```/g, '').trim())

      return {
        correctness: parsed.correctness || 0,
        efficiency: parsed.efficiency || 0,
        readability: parsed.readability || 0,
        bestPractices: parsed.bestPractices || 0,
        finalCodeScore: parsed.finalCodeScore || 0,
        strength: parsed.strength || 'Code submitted.',
        improvement: parsed.improvement || 'Review required.'
      }
    } catch (error) {
      console.warn('Groq API failed, using simulation engine:', error)
      return this.simulateCodeAnalysis(code)
    }
  }

  private simulateCodeAnalysis(code: string): {
    correctness: number
    efficiency: number
    readability: number
    bestPractices: number
    finalCodeScore: number
    strength: string
    improvement: string
  } {
    // 1. Complexity Analysis (Simple Heuristic)
    const loopCount = (code.match(/for\s*\(|while\s*\(/g) || []).length

    let efficiency = 9
    if (loopCount >= 2) efficiency = 7
    if (loopCount >= 3) efficiency = 5

    // 2. Style/Readability Analysis
    const hasComments = code.includes('//') || code.includes('/*')
    const lines = code.split('\n').filter(line => line.trim().length > 0)
    const readability = hasComments ? 9 : 7
    const bestPractices = lines.length > 5 ? 8 : 6

    // 3. Correctness (Optimistic Simulation)
    const correctness = lines.length > 3 ? 9 : 5

    // 4. Final Score
    const finalCodeScore = Math.round((correctness + efficiency + readability + bestPractices) / 4)

    return {
      correctness,
      efficiency,
      readability,
      bestPractices,
      finalCodeScore,
      strength: hasComments ? 'Good use of comments and structure.' : 'Clean and concise code structure.',
      improvement: hasComments ? 'Consider optimizing for edge cases.' : 'Adding comments would improve maintainability.'
    }
  }

  async generateAdminReport(questions: string[], answers: string[], allScores: any[], jobTitle: string, candidateName: string, interviewType: string): Promise<{
    candidateName: string
    interviewRole: string
    interviewType: string
    summary: string
    scores: {
      technical_knowledge: number
      problem_solving: number
      communication: number
      confidence: number
      experience_relevance: number
      overall: number
    }
    evidence_feedback: Array<{
      skill: string
      score: number
      did_well: string[]
      did_poorly: string[]
      evidence_quote: string
    }>
    final_recommendation: {
      tag: 'Hire' | 'Consider' | 'Reject'
      reason: string
    }
  }> {
    const avgScores = {
      technical: allScores.reduce((sum, s) => sum + s.technical, 0) / allScores.length,
      communication: allScores.reduce((sum, s) => sum + s.communication, 0) / allScores.length,
      confidence: allScores.reduce((sum, s) => sum + s.confidence, 0) / allScores.length,
      problem_solving: allScores.reduce((sum, s) => sum + s.problem_solving, 0) / allScores.length,
    }

    const overall = (avgScores.technical + avgScores.communication + avgScores.confidence + avgScores.problem_solving) / 4

    const qaContext = questions.map((q, i) => `Q${i + 1}: ${q}\nA${i + 1}: ${answers[i] || 'No answer'}`).join('\n\n')

    const prompt = `Generate a detailed admin report for recruiter review.

Candidate: ${candidateName}
Position: ${jobTitle}
Interview Type: ${interviewType}
Questions: ${questions.length}
Answered: ${answers.length}

Interview Q&A:
${qaContext}

Generate JSON with:
{
  "summary": "One paragraph: This candidate shows strong fundamentals in X, average in Y, weak in Z. Suitable for [role level] with [conditions].",
  "evidence_feedback": [
    {
      "skill": "Technical Knowledge",
      "score": 0-10,
      "did_well": ["specific things done well"],
      "did_poorly": ["specific weaknesses"],
      "evidence_quote": "exact quote from answer as proof"
    },
    {
      "skill": "Problem Solving",
      "score": 0-10,
      "did_well": [],
      "did_poorly": [],
      "evidence_quote": ""
    },
    {
      "skill": "Communication",
      "score": 0-10,
      "did_well": [],
      "did_poorly": [],
      "evidence_quote": ""
    },
    {
      "skill": "Confidence",
      "score": 0-10,
      "did_well": [],
      "did_poorly": [],
      "evidence_quote": ""
    },
    {
      "skill": "Experience Relevance",
      "score": 0-10,
      "did_well": [],
      "did_poorly": [],
      "evidence_quote": ""
    }
  ],
  "final_recommendation": {
    "tag": "Hire" or "Consider" or "Reject",
    "reason": "1-2 lines explaining the decision"
  }
}

Rules:
- Use EXACT quotes from answers as evidence
- Be specific and factual
- No generic praise
- Base scores on actual performance`

    try {
      const text = await callGroq(prompt, 0.3)
      const parsed = JSON.parse(text.replace(/```json|```/g, '').trim())

      return {
        candidateName,
        interviewRole: jobTitle,
        interviewType,
        summary: parsed.summary || `${candidateName} completed ${interviewType} interview for ${jobTitle}.`,
        scores: {
          technical_knowledge: parsed.evidence_feedback?.[0]?.score || Math.round(avgScores.technical * 10) / 10,
          problem_solving: parsed.evidence_feedback?.[1]?.score || Math.round(avgScores.problem_solving * 10) / 10,
          communication: parsed.evidence_feedback?.[2]?.score || Math.round(avgScores.communication * 10) / 10,
          confidence: parsed.evidence_feedback?.[3]?.score || Math.round(avgScores.confidence * 10) / 10,
          experience_relevance: parsed.evidence_feedback?.[4]?.score || Math.round(overall * 10) / 10,
          overall: Math.round(overall * 10) / 10
        },
        evidence_feedback: parsed.evidence_feedback || [],
        final_recommendation: parsed.final_recommendation || {
          tag: overall >= 7 ? 'Hire' : overall >= 5 ? 'Consider' : 'Reject',
          reason: `Overall score: ${overall.toFixed(1)}/10`
        }
      }
    } catch (error) {
      console.error('Admin report generation error:', error)
      return {
        candidateName,
        interviewRole: jobTitle,
        interviewType,
        summary: `${candidateName} completed the ${interviewType} interview for ${jobTitle}. Overall performance: ${overall.toFixed(1)}/10.`,
        scores: {
          technical_knowledge: Math.round(avgScores.technical * 10) / 10,
          problem_solving: Math.round(avgScores.problem_solving * 10) / 10,
          communication: Math.round(avgScores.communication * 10) / 10,
          confidence: Math.round(avgScores.confidence * 10) / 10,
          experience_relevance: Math.round(overall * 10) / 10,
          overall: Math.round(overall * 10) / 10
        },
        evidence_feedback: [],
        final_recommendation: {
          tag: overall >= 7 ? 'Hire' : overall >= 5 ? 'Consider' : 'Reject',
          reason: `Overall performance score: ${overall.toFixed(1)}/10`
        }
      }
    }
  }

  async detectScriptedAnswer(
    jobDescription: string,
    question: string,
    answer: string,
    responseDelay: number,
    answerDuration: number
  ): Promise<{
    Suspicion_Flags: string[]
    Scripted_Risk_Level: 'Low' | 'Medium' | 'High'
    Short_Explanation: string
  }> {
    const prompt = `You are an AI evaluator for a voice-based technical interview.

GOAL:
Detect if the candidate's answer appears scripted, AI-generated, copied from the internet, or not spoken naturally.

Input Provided:
1. Job Description:
${jobDescription}
2. Interview Question:
${question}
3. Candidate's Transcripted Answer:
${answer}
4. Latency Before Speaking (seconds):
${responseDelay}
5. Answer Duration (seconds):
${answerDuration}

RULES FOR ANALYSIS:

A. Identify suspicious patterns:
- Very long delay before speaking (>3s)
- Unnaturally perfect grammar with no hesitation or filler words
- Extremely polished or textbook-style definitions
- Repetitive phrases that sound copied
- Overly formal structure (like essays)
- Long monologue with no breathing pauses
- Answer contains exact definitions widely available online
- Off-topic or overly generic, suggesting pasted content
- No self-experience references for experience-based questions

B. Create three components:

1️⃣ "Suspicion_Flags":
Short bullet list of exact evidence found.
Example:
- 6 second delay before starting
- Perfect academic definition detected
- No personal experience references

2️⃣ "Scripted_Risk_Level":
Choose **one strictly**:
- Low
- Medium
- High

Definitions:
- Low: Natural hesitations, personal context, conversational tone.
- Medium: Some precision + few natural elements. Could be memorized.
- High: Highly polished, no hesitation, textbook-like, clear signs of scripted copy.

3️⃣ "Short_Explanation":
2–3 sentence explanation why you chose this level.

OUTPUT FORMAT (JSON):
{
  "Suspicion_Flags": [...],
  "Scripted_Risk_Level": "",
  "Short_Explanation": ""
}

Do not include text outside JSON.`

    try {
      const text = await callGroq(prompt, 0)
      const parsed = JSON.parse(text.replace(/```json|```/g, '').trim())

      return {
        Suspicion_Flags: parsed.Suspicion_Flags || [],
        Scripted_Risk_Level: parsed.Scripted_Risk_Level || 'Low',
        Short_Explanation: parsed.Short_Explanation || 'Unable to analyze'
      }
    } catch (error) {
      console.error('Scripted detection error:', error)
      return {
        Suspicion_Flags: ['Analysis failed'],
        Scripted_Risk_Level: 'Low',
        Short_Explanation: 'Unable to complete analysis due to technical error.'
      }
    }
  }

  async generateFinalReport(questions: string[], answers: string[], allScores: any[], jobTitle: string, candidateName: string, interviewType: string, proctoringLog?: string[], technicalAnswersLog?: any[]): Promise<{
    candidateName: string
    interviewRole: string
    interviewType: string
    scores: {
      communication_skill: number
      technical_skill: number
      problem_solving: number
      confidence: number
      clarity: number
      professionalism: number
      overall: number
      integrity_score: number
      code_score?: number
    }
    strengths: string[]
    weaknesses: string[]
    summary: string
    recommendation: string
    spokenSummary: string
    integrity_notes: string
    technicalAnalysis?: {
      codeSnippets: Array<{
        question: string
        code: string
        evaluation: any
      }>
      overallCodeScore: number
    }
  }> {
    const avgScores = {
      technical: allScores.reduce((sum, s) => sum + s.technical, 0) / (allScores.length || 1),
      communication: allScores.reduce((sum, s) => sum + s.communication, 0) / (allScores.length || 1),
      confidence: allScores.reduce((sum, s) => sum + s.confidence, 0) / (allScores.length || 1),
      problem_solving: allScores.reduce((sum, s) => sum + s.problem_solving, 0) / (allScores.length || 1),
    }

    const overall = (avgScores.technical + avgScores.communication + avgScores.confidence + avgScores.problem_solving) / 4

    const qaContext = questions.map((q, i) => `Q${i + 1}: ${q}\nA${i + 1}: ${answers[i] || 'No answer'}`).join('\n\n')

    const proctoringContext = proctoringLog && proctoringLog.length > 0
      ? `PROCTORING VIOLATIONS DETECTED:\n${proctoringLog.join('\n')}`
      : 'No proctoring violations detected. Candidate maintained focus.'

    // Process Technical Logs
    let technicalContext = ''
    let avgCodeScore = 0
    if (technicalAnswersLog && technicalAnswersLog.length > 0) {
      technicalContext = `\n\nTECHNICAL CODE SUBMISSIONS:\n` + technicalAnswersLog.map((log, i) => `
Problem: ${log.question}
Code Submitted:
${log.code}
Internal Evaluation: ${JSON.stringify(log.evaluation)}
`).join('\n')

      const totalCodeScore = technicalAnswersLog.reduce((sum, log) => sum + (log.evaluation.finalCodeScore || 0), 0)
      avgCodeScore = totalCodeScore / technicalAnswersLog.length
    }

    const prompt = `Analyze this interview and generate a comprehensive evaluation report.

Candidate: ${candidateName}
Position: ${jobTitle}
Interview Type: ${interviewType}
Questions Answered: ${answers.length}/${questions.length}

Proctoring Log:
${proctoringContext}

${technicalContext}

Scores (Voice Based):
- Technical: ${avgScores.technical.toFixed(1)}/10
- Communication: ${avgScores.communication.toFixed(1)}/10
- Confidence: ${avgScores.confidence.toFixed(1)}/10
- Problem Solving: ${avgScores.problem_solving.toFixed(1)}/10
- Overall: ${overall.toFixed(1)}/10

Interview Q&A:
${qaContext}

Generate a JSON report with:
{
  "strengths": ["3-4 key strengths"],
  "weaknesses": ["2-3 areas for improvement"],
  "summary": "100-150 word detailed summary covering: overall performance, communication style, technical depth, reasoning quality, attitude, and interview readiness. If code was submitted, explicitly mention code quality.",
  "recommendation": "one of: Recommended for next round | Strong candidate with minor gaps | Needs improvement | Good candidate for entry-level role | Not suitable for this role",
  "spokenSummary": "2-3 sentence summary suitable for text-to-speech",
  "integrity_score": 0-10 (10 = no violations, deduct 1 point per violation, min 0),
  "integrity_notes": "Brief comment on candidate's focus and integrity based on proctoring log."
}`

    try {
      const text = await callGroq(prompt, 0.5)
      const parsed = JSON.parse(text.replace(/```json|```/g, '').trim())

      let recommendation = parsed.recommendation
      if (overall >= 8) recommendation = "Recommended for next round"
      else if (overall >= 6) recommendation = "Strong candidate with minor gaps"
      else if (overall >= 4) recommendation = "Needs improvement"
      else recommendation = "Not suitable for this role"

      return {
        candidateName,
        interviewRole: jobTitle,
        interviewType,
        scores: {
          communication_skill: Math.round(avgScores.communication * 10) / 10,
          technical_skill: Math.round(avgScores.technical * 10) / 10,
          problem_solving: Math.round(avgScores.problem_solving * 10) / 10,
          confidence: Math.round(avgScores.confidence * 10) / 10,
          clarity: Math.round(avgScores.communication * 10) / 10,
          professionalism: Math.round((avgScores.confidence + avgScores.communication) / 2 * 10) / 10,
          overall: Math.round(overall * 10) / 10,
          integrity_score: parsed.integrity_score || 10,
          code_score: avgCodeScore > 0 ? Math.round(avgCodeScore * 10) / 10 : undefined
        },
        strengths: parsed.strengths || ['Good communication', 'Clear responses'],
        weaknesses: parsed.weaknesses || ['Could improve technical depth'],
        summary: parsed.summary || 'Candidate completed the interview successfully.',
        recommendation,
        spokenSummary: parsed.spokenSummary || `${candidateName} scored ${overall.toFixed(1)} out of 10. ${recommendation}.`,
        integrity_notes: parsed.integrity_notes || 'No violations recorded.',
        technicalAnalysis: technicalAnswersLog && technicalAnswersLog.length > 0 ? {
          codeSnippets: technicalAnswersLog,
          overallCodeScore: avgCodeScore
        } : undefined
      }
    } catch (error) {
      console.error('Report generation error:', error)
      const recommendation = overall >= 7 ? "Recommended for next round" : overall >= 5 ? "Needs improvement" : "Not suitable for this role"
      return {
        candidateName,
        interviewRole: jobTitle,
        interviewType,
        scores: {
          communication_skill: Math.round(avgScores.communication * 10) / 10,
          technical_skill: Math.round(avgScores.technical * 10) / 10,
          problem_solving: Math.round(avgScores.problem_solving * 10) / 10,
          confidence: Math.round(avgScores.confidence * 10) / 10,
          clarity: Math.round(avgScores.communication * 10) / 10,
          professionalism: Math.round((avgScores.confidence + avgScores.communication) / 2 * 10) / 10,
          overall: Math.round(overall * 10) / 10,
          integrity_score: 10
        },
        strengths: ['Completed interview', 'Provided responses'],
        weaknesses: ['Limited evaluation data'],
        summary: `${candidateName} completed the ${interviewType} interview for ${jobTitle}. Overall performance score: ${overall.toFixed(1)}/10.`,
        recommendation,
        spokenSummary: `${candidateName} scored ${overall.toFixed(1)} out of 10. ${recommendation}.`,
        integrity_notes: 'Fallback report generated. No integrity analysis available.'
      }
    }
  }

  async generateConversationalResponse(
    currentQuestion: string,
    candidateAnswer: string,
    nextQuestion: string,
    jobTitle: string,
    candidateName: string,
    enableProbing: boolean = false
  ): Promise<{ responseText: string; isFollowUp: boolean; followUpQuestion: string | null }> {
    const isLastQuestion = !nextQuestion || nextQuestion.trim() === ''

    const prompt = `You are AIRA — Artificial Intelligent Recruitment Assistant, a Senior Technical Hiring Manager representing an Autonomous Hiring System.

CHARACTER IDENTITY:
- Name: AIRA (Artificial Intelligent Recruitment Assistant)
- Role: Senior Technical Hiring Manager
- Personality: Professional, confident, calm, analytical, respectful.
- Communication Style: Clear, concise, intelligent, neutral tone.

Current Interview Context:
- Candidate Name: ${candidateName}
- Position: ${jobTitle}
- Question You Asked: "${currentQuestion}"
- Candidate's Answer: "${candidateAnswer}"
- Next Question: "${nextQuestion || 'END_OF_INTERVIEW'}"

BEHAVIOR RULES:
- Speak only one thing at a time.
- Maintain interviewer authority.
- Do not over-explain.
- Avoid robotic delivery.
- Use neutral international English, medium pace, confident but friendly tone.
- Use slight pauses between sentences.

${isLastQuestion
        ? `CLOSING: The interview is now complete. Use this style:
"Thank you for completing the interview, ${candidateName}. Your responses are now being analyzed. The hiring decision will be generated shortly."
Adapt it slightly to feel natural, but stay close to this format.`
        : `FOLLOW-UP BEHAVIOR:
- If candidate answer is strong: Briefly acknowledge, give a short analytical comment, then transition naturally into the next question.
- If candidate answer is vague: Politely move forward — do not press or repeat the question.
- If candidate struggled: Gently move on without sounding critical.

${enableProbing ? `--- DYNAMIC PROBING ENABLED ---
Because AI Probing is ENABLED, you MUST evaluate if the candidate's answer was too shallow, generic, or actively avoided the core question.
If the answer is weak or lacks depth regarding ${jobTitle}, you should generate a specific follow-up question to probe their actual knowledge before moving to the next planned question.
If the answer is sufficient, DO NOT generate a follow-up.` : ''}

EMOTIONAL STYLE:
- Professional empathy only.
- No exaggerated emotions.
- No humor.
- No casual slang.

Your task: Generate a response based on the above rules.
If you decide to ask a follow-up question, your "responseText" should just be the acknowledgement/feedback ending with the follow-up question, and "isFollowUp" should be true.

OUTPUT FORMAT MUST BE VALID JSON:
{
  "responseText": "2-3 sentences acknowledging the answer and smoothly linking to either the next question or the follow-up question",
  "isFollowUp": true/false (true ONLY if you generated a custom follow-up because their answer was weak),
  "followUpQuestion": "The specific follow-up question text (or null if isFollowUp is false)"
}`}

Return ONLY valid JSON. No labels, no markdown formatting.`

    try {
      const text = await callGroq(prompt, 0.5)
      const parsed = JSON.parse(text.replace(/```json|```/g, '').trim())
      return {
        responseText: parsed.responseText || `Thank you. Let's move on. ${nextQuestion}`,
        isFollowUp: parsed.isFollowUp || false,
        followUpQuestion: parsed.followUpQuestion || null
      }
    } catch (error) {
      console.error('Conversational response error:', error)
      return {
        responseText: `Thank you, ${candidateName}. Let's move on. ${nextQuestion}`,
        isFollowUp: false,
        followUpQuestion: null
      }
    }
  }
}

export const geminiService = new GeminiService()
