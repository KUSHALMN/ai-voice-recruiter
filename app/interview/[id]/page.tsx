'use client'

import { useState, useEffect, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Mic, Volume2, Loader2, CheckCircle, Clock, Send, Code2, Layout, Sparkles, Briefcase, Wifi, ShieldAlert, ArrowRight } from 'lucide-react'
import Image from 'next/image'
import toast from 'react-hot-toast'
import CodeEditor from '@/components/CodeEditor'
import confetti from 'canvas-confetti'
import { supabase } from '@/lib/supabase'
import type { QuestionSet, GeneratedQuestion } from '@/types/resume'
import ResumeModal from '@/components/interview/ResumeModal'
import { InterviewSessionManager, InterviewState } from '@/lib/interview/sessionManager'
import { AdaptiveDifficultyEngine } from '@/lib/ai/adaptiveDifficulty'
import ProgressBar from '@/components/interview/ProgressBar'
import VoiceWave from '@/components/interview/VoiceWave'

interface InterviewScores {
  technical: number
  communication: number
  confidence: number
  problem_solving: number
}

export default function InterviewPage() {
  const params = useParams()
  const router = useRouter()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [interview, setInterview] = useState<Record<string, any> | null>(null)
  const [loading, setLoading] = useState(true)
  const [started, setStarted] = useState(false)
  const [completed, setCompleted] = useState(false)
  const [currentQ, setCurrentQ] = useState(0)
  const [questions, setQuestions] = useState<string[]>([])
  const [questionsLoaded, setQuestionsLoaded] = useState(false)
  const [answers, setAnswers] = useState<string[]>([])
  const [scores, setScores] = useState<InterviewScores[]>([])
  const [listening, setListening] = useState(false)
  const [speaking, setSpeaking] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [timeLeft, setTimeLeft] = useState(0)
  const [questionStartTime, setQuestionStartTime] = useState(0)
  const [answerStartTime, setAnswerStartTime] = useState(0)
  const [processingResponse, setProcessingResponse] = useState(false)
  const [violationCount, setViolationCount] = useState(0)
  const [violationLog, setViolationLog] = useState<string[]>([])
  const [showCodeEditor, setShowCodeEditor] = useState(false)
  const [code, setCode] = useState('// Write your solution here...')
  const [isSubmittingCode, setIsSubmittingCode] = useState(false)

  // Adaptive difficulty & session tracking states
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [sessionToken, setSessionToken] = useState<string | null>(null)
  const [difficultyLevel, setDifficultyLevel] = useState<'easy' | 'medium' | 'hard'>('medium')
  const [fullQuestionPool, setFullQuestionPool] = useState<any[]>([])
  const [usedQuestionIds, setUsedQuestionIds] = useState<string[]>([])

  const [showResumeModal, setShowResumeModal] = useState(false)
  const [resumeState, setResumeState] = useState<InterviewState | null>(null)
  const sessionManagerRef = useRef<InterviewSessionManager | null>(null)

  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const isEndingRef = useRef(false)
  const currentIndexRef = useRef(0)
  const questionsRef = useRef<string[]>([])
  const answersRef = useRef<string[]>([])
  const scoresRef = useRef<InterviewScores[]>([])
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // References to avoid stale closure issues in speech event loop
  const sessionIdRef = useRef<string | null>(null)
  const sessionTokenRef = useRef<string | null>(null)
  const difficultyLevelRef = useRef<'easy' | 'medium' | 'hard'>('medium')
  const usedQuestionIdsRef = useRef<string[]>([])
  const fullQuestionPoolRef = useRef<any[]>([])

  useEffect(() => {
    loadInterview()
    initSpeech()

    // Proctoring: Detect tab switching and focus loss
    const handleVisibilityChange = () => {
      if (document.hidden) {
        logViolation('Tab switch detected')
        toast.error('⚠️ Warning: Please stay on this tab!', { icon: '👁️' })
      }
    }

    const handleBlur = () => {
      logViolation('Window focus lost')
      toast.error('⚠️ Warning: Focus lost. Please stay on this window!', { icon: '👁️' })
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('blur', handleBlur)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
      if (recognitionRef.current) recognitionRef.current.stop()
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('blur', handleBlur)
    }
  }, [])

  useEffect(() => {
    if (interview?.interview_type === 'Technical' || interview?.interview_type === 'technical') {
      setShowCodeEditor(true)
    }
  }, [interview])

  const logViolation = (type: string) => {
    if (!started || completed) return

    setViolationCount(prev => prev + 1)
    const timestamp = new Date().toLocaleTimeString()
    setViolationLog(prev => [...prev, `${timestamp}: ${type}`])
  }

  const silenceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const currentTranscriptRef = useRef<string>('')

  const initSpeech = () => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as Window & { SpeechRecognition?: typeof window.SpeechRecognition; webkitSpeechRecognition?: typeof window.SpeechRecognition }).SpeechRecognition || (window as Window & { webkitSpeechRecognition?: typeof window.SpeechRecognition }).webkitSpeechRecognition
      if (SpeechRecognition) {
        // Only initialize once
        if (!recognitionRef.current) {
          recognitionRef.current = new SpeechRecognition()
        }
        const recognition = recognitionRef.current
        if (recognition) {
          recognition.continuous = true
          recognition.interimResults = true
          recognition.lang = 'en-US'
        }
      }
    }
  }

  const loadInterview = async () => {
    try {
      // Use module-level singleton instead of creating new client each time
      const { data } = await supabase.from('interviews').select('id, candidate_name, candidate_email, job_title, job_description, interview_type, candidate_type, status, duration, enable_probing, enable_strict_proctoring, recruiter_email, created_at, question_set').eq('id', params.id).single()
      if (data) {
        setInterview(data)
        setTimeLeft(data.duration * 60)

        // Initialize Session Manager and restore session if one exists
        const manager = new InterviewSessionManager(data.id, '')
        sessionManagerRef.current = manager

        const restored = await manager.restoreSession()
        if (restored && restored.answeredQuestions.length > 0) {
          setResumeState(restored)
          setShowResumeModal(true)
        }
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const playVoice = async (text: string): Promise<boolean> => {
    setSpeaking(true)
    try {
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      })

      if (!response.ok) {
        throw new Error(`TTS request failed: ${response.status}`)
      }

      const audioBlob = await response.blob()
      const audioUrl = URL.createObjectURL(audioBlob)

      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }

      const audio = new Audio(audioUrl)
      audioRef.current = audio

      return await new Promise<boolean>((resolve) => {
        audio.onended = () => {
          setSpeaking(false)
          URL.revokeObjectURL(audioUrl)
          resolve(true)
        }

        audio.onerror = () => {
          setSpeaking(false)
          URL.revokeObjectURL(audioUrl)
          resolve(true)
        }

        audio.play().catch(() => {
          setSpeaking(false)
          URL.revokeObjectURL(audioUrl)
          resolve(true)
        })
      })
    } catch {
      setSpeaking(false)

      // Fallback to browser TTS
      try {
        return await new Promise<boolean>((resolve) => {
          const utterance = new SpeechSynthesisUtterance(text)
          utterance.rate = 0.9
          utterance.onend = () => {
            setSpeaking(false)
            resolve(true)
          }
          utterance.onerror = () => {
            setSpeaking(false)
            resolve(true)
          }
          speechSynthesis.speak(utterance)
        })
      } catch {
        setSpeaking(false)
        return true
      }
    }
  }

  const playPreRecordedAudio = (filename: string): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      setSpeaking(true)

      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }

      const audio = new Audio(`/audio/${filename}`)
      audioRef.current = audio

      audio.onended = () => {
        setSpeaking(false)
        resolve(true)
      }

      audio.onerror = () => {
        setSpeaking(false)
        reject(new Error('Audio playback failed'))
      }

      audio.play().catch(reject)
    })
  }

  const listen = (): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (!recognitionRef.current) {
        reject('Speech recognition not supported')
        return
      }

      const recognition = recognitionRef.current
      setListening(true)
      currentTranscriptRef.current = ''
      setTranscript('')

      let finalTranscript = ''
      let lastConfidence = 1.0 // Track ASR confidence from final results

      // Clear any old timers
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current)
      }

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let interimTranscript = ''

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript + ' '
            // Capture ASR confidence from final result
            if (event.results[i][0].confidence !== undefined) {
              lastConfidence = event.results[i][0].confidence
            }
          } else {
            interimTranscript += event.results[i][0].transcript
          }
        }

        const fullText = (finalTranscript + interimTranscript).trim()

        // Only update state if there's actual speech
        if (fullText) {
          currentTranscriptRef.current = fullText
          setTranscript(fullText)
        }

        // Voice Activity Detection: Reset silence timer
        if (silenceTimerRef.current) {
          clearTimeout(silenceTimerRef.current)
        }

        // 4 seconds of silence triggers auto-submit
        silenceTimerRef.current = setTimeout(() => {

          try {
            recognition.stop()
          } catch (e) { }
        }, 4000)
      }

      recognition.onend = () => {
        setListening(false)
        if (silenceTimerRef.current) {
          clearTimeout(silenceTimerRef.current)
        }
        // Always resolve with whatever we captured
        resolve(currentTranscriptRef.current + '|||' + lastConfidence.toFixed(3))
      }

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.warn('Speech recognition warning/error:', event.error)
        if (event.error !== 'no-speech') {
          setListening(false)
          if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current)
          reject('Speech recognition error: ' + event.error)
        }
      }

      try {
        recognition.start()
      } catch (e) {
        // Already started
        console.warn('Recognition already started')
      }
    })
  }

  const generateQuestions = async () => {
    if (!interview) return null;

    const questionsMin = Math.max(3, Math.floor(interview.duration * 1.5))
    const fallbackCount = Math.floor(Math.random() * (interview.duration * 2.5 - questionsMin + 1)) + questionsMin

    const fallbackQuestions = Array.from({ length: fallbackCount }, (_, i) => {
      const templates = [
        `Tell me about your background and experience as a ${interview.job_title}.`,
        `What interests you most about this ${interview.job_title} position?`,
        `Describe a challenging project you have worked on and how you approached it.`,
        `How do you stay updated with the latest trends in your field?`,
        `Tell me about a time when you had to work under pressure or tight deadlines.`,
        `What are your greatest strengths that make you suitable for this role?`,
        `Describe a situation where you had to solve a complex problem.`,
        `How do you handle feedback and criticism from colleagues or managers?`,
        `Tell me about a time you worked in a team. What was your role?`,
        `Where do you see yourself professionally in the next 3 to 5 years?`,
        `What motivates you to perform well in your work?`,
        `Describe a time when you had to learn something new quickly.`,
        `How do you prioritize tasks when managing multiple projects?`,
        `Tell me about a time you disagreed with a team member.`,
        `What is your approach to continuous learning and development?`
      ]
      return templates[i % templates.length]
    })

    try {
      const res = await fetch('/api/generate-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          interviewId: interview.id,
          jobTitle: interview.job_title,
          jobDescription: interview.job_description,
          interviewType: interview.interview_type,
          candidateType: interview.candidate_type,
          duration: interview.duration
        })
      })

      const data = await res.json()

      if (data.questionSet && data.questionSet.questions) {
        return data.questionSet
      } else if (data.questions && data.questions.length > 0) {
        return {
          questions: data.questions.map((text: string) => ({
            id: crypto.randomUUID(),
            text,
            difficulty: 'medium',
            type: 'technical',
            target_skill: 'General',
            ideal_answer_hints: []
          }))
        }
      }

      throw new Error('No questions from API')
    } catch (error) {
      console.error('API failed, using fallback questions:', error)
      return {
        questions: fallbackQuestions.map((text: string) => ({
          id: crypto.randomUUID(),
          text,
          difficulty: 'medium',
          type: 'technical',
          target_skill: 'General',
          ideal_answer_hints: []
        }))
      }
    }
  }

  const evaluateAnswer = async (question: string, answer: string, _questionIndex: number, responseDelay: number = 0, answerDuration: number = 0, asrConfidence: number = 1.0) => {
    if (!interview || !sessionIdRef.current) {
      return {
        scores: { technical: 5, communication: 5, confidence: 5, problem_solving: 5 },
        scriptedDetection: null,
        nextQuestion: null,
        nextQuestionId: null,
        newDifficulty: 'medium' as const
      }
    }

    const pool = fullQuestionPoolRef.current
    const questionObj = pool.find((q: any) => q.text === question)
    const questionId = questionObj ? questionObj.id : `q-${_questionIndex}`

    // ⚡ PERF FIX: Run scripted detection + answer evaluation in parallel
    const [scriptedResult, evalResult] = await Promise.allSettled([
      fetch('/api/detect-scripted', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobDescription: interview.job_description,
          question,
          answer,
          responseDelay,
          answerDuration
        })
      }).then(r => r.json()),

      fetch(`/api/interview/session/${sessionIdRef.current}/answer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionTokenRef.current}`
        },
        body: JSON.stringify({
          questionId,
          answer,
          questionIndex: _questionIndex
        })
      }).then(r => r.json())
    ])

    // Process scripted detection
    const scriptedDetection = scriptedResult.status === 'fulfilled' ? scriptedResult.value : null
    if (interview?.enable_strict_proctoring && scriptedDetection?.Scripted_Risk_Level === 'High') {
      logViolation('High Risk Scripted Answer Detected: ' + (scriptedDetection?.Suspicion_Flags?.[0] || 'Unnatural speech pattern'))
    }

    // Process evaluation scores
    const evalData = evalResult.status === 'fulfilled' ? evalResult.value : null
    const finalScore = evalData ? evalData.score : 5

    // Normalize score to 4 metrics for frontend backwards-compatibility
    const scores = {
      technical: finalScore,
      communication: finalScore,
      confidence: finalScore,
      problem_solving: finalScore
    }

    return {
      scores,
      scriptedDetection,
      nextQuestion: evalData?.nextQuestion || null,
      nextQuestionId: evalData?.nextQuestionId || null,
      newDifficulty: (evalData?.newDifficulty || 'medium') as 'easy' | 'medium' | 'hard'
    }
  }

  const generateConversationalResponse = async (currentQuestion: string, answer: string, nextQuestion: string) => {
    if (!interview) return { responseText: `Thank you. ${nextQuestion}`, isFollowUp: false, followUpQuestion: null };
    
    try {
      const res = await fetch('/api/generate-response', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentQuestion,
          candidateAnswer: answer,
          nextQuestion,
          jobTitle: interview.job_title,
          candidateName: interview.candidate_name,
          enableProbing: interview.enable_probing
        })
      })
      const data = await res.json()
      return data // Returns { responseText, isFollowUp, followUpQuestion }
    } catch (error) {
      console.error('Failed to generate conversational response:', error)
      return { responseText: `Thank you. ${nextQuestion}`, isFollowUp: false, followUpQuestion: null }
    }
  }

  const handleResumeSession = async () => {
    if (!resumeState || !interview) return

    setStarted(true)
    isEndingRef.current = false

    // Restore token and session variables
    setSessionId(resumeState.sessionId)
    sessionIdRef.current = resumeState.sessionId
    const token = sessionManagerRef.current?.candidateToken || ''
    setSessionToken(token)
    sessionTokenRef.current = token

    const currentDiff = resumeState.difficultyLevel || 'medium'
    setDifficultyLevel(currentDiff)
    difficultyLevelRef.current = currentDiff

    // Restore answers and scores
    const restoredAnswers = resumeState.answeredQuestions.map((aq: any) => aq.answer)
    const restoredScores = resumeState.answeredQuestions.map((aq: any) => ({
      technical: aq.score,
      communication: aq.score,
      confidence: aq.score,
      problem_solving: aq.score
    }))

    answersRef.current = restoredAnswers
    setAnswers(restoredAnswers)

    scoresRef.current = restoredScores
    setScores(restoredScores)

    // Set asked questions list
    const askedTexts = resumeState.answeredQuestions.map((aq: any) => aq.text)

    const pool = fullQuestionPoolRef.current.length > 0 ? fullQuestionPoolRef.current : (interview.question_set?.questions || [])
    const usedIds = resumeState.answeredQuestions.map((aq: any) => aq.id)
    setUsedQuestionIds(usedIds)
    usedQuestionIdsRef.current = usedIds

    // Determine the next question dynamically
    const engine = new AdaptiveDifficultyEngine({
      currentDifficulty: currentDiff,
      scoreHistory: restoredAnswers.map((_, idx) => restoredScores[idx]?.technical || 5)
    })

    const nextQObj = engine.getNextQuestion(pool, usedIds)
    const activeQuestions = [...askedTexts]

    if (nextQObj) {
      activeQuestions.push(nextQObj.text)
      const updatedUsedIds = [...usedIds, nextQObj.id]
      setUsedQuestionIds(updatedUsedIds)
      usedQuestionIdsRef.current = updatedUsedIds
    }

    setQuestions(activeQuestions)
    questionsRef.current = activeQuestions

    const nextIndex = resumeState.answeredQuestions.length
    currentIndexRef.current = nextIndex
    setCurrentQ(nextIndex)

    setQuestionsLoaded(true)
    setShowResumeModal(false)

    // Start countdown timer
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1 && !isEndingRef.current) {
          endInterview()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    if (nextQObj) {
      toast.success('Session restored!')
      await playVoice(`Welcome back, ${interview.candidate_name}. Let's resume with question ${nextIndex + 1}: ${nextQObj.text}`)
    }

    askNextQuestion(false)
  }

  const handleRestartSession = () => {
    sessionManagerRef.current?.clearSession()
    setShowResumeModal(false)
    setResumeState(null)
    startInterview()
  }

  const startInterview = async () => {
    if (!interview) return;

    setStarted(true)
    isEndingRef.current = false
    currentIndexRef.current = 0
    answersRef.current = []
    scoresRef.current = []

    // 1. Fetch/Generate the question set
    const qSet = await generateQuestions()

    if (!qSet || !qSet.questions || qSet.questions.length === 0) {
      console.error('❌ FAILED TO GENERATE QUESTIONS')
      alert('Failed to generate questions. Please refresh and try again.')
      return
    }

    // Store in references and state
    const pool = qSet.questions
    setFullQuestionPool(pool)
    fullQuestionPoolRef.current = pool

    // 2. Initialize dynamic session tracking in DB
    try {
      const sessionRes = await fetch(`/api/interview/${interview.id}/session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'start' })
      })
      const sessionData = await sessionRes.json()
      if (sessionData.success) {
        setSessionId(sessionData.sessionId)
        sessionIdRef.current = sessionData.sessionId
        setSessionToken(sessionData.sessionToken)
        sessionTokenRef.current = sessionData.sessionToken
        
        const currentDiff = sessionData.difficultyLevel || 'medium'
        setDifficultyLevel(currentDiff as any)
        difficultyLevelRef.current = currentDiff as any
      }
    } catch (sessionErr) {
      console.error('Failed to initialize session database row:', sessionErr)
    }

    // 3. Select the first question (starting at 'medium' difficulty)
    const initialDifficulty = 'medium'
    const firstQ = pool.find((q: any) => q.difficulty === initialDifficulty) || pool[0]
    
    const activeQuestionsList = [firstQ.text]
    setQuestions(activeQuestionsList)
    questionsRef.current = activeQuestionsList
    setQuestionsLoaded(true)

    const updatedUsedIds = [firstQ.id]
    setUsedQuestionIds(updatedUsedIds)
    usedQuestionIdsRef.current = updatedUsedIds

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1 && !isEndingRef.current) {
          endInterview()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    try {
      await playPreRecordedAudio('greeting.mp3')
    } catch (error) {

      await playVoice(`Hello ${interview.candidate_name}! Welcome to your ${interview.interview_type} interview for ${interview.job_title}. Let's begin.`)
    }



    // Update status via server-side API to bypass RLS
    fetch('/api/update-status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ interviewId: interview.id, status: 'in_progress' })
    }).catch(err => console.error('Status update failed:', err))

    askNextQuestion(true) // Pass true for first question
  }

  const [technicalAnswersLog, setTechnicalAnswersLog] = useState<Array<{ question: string; code: string; evaluation: Record<string, unknown> }>>([])

  const handleCodeSubmit = async (submittedCode: string) => {
    setIsSubmittingCode(true)
    try {


      const res = await fetch('/api/evaluate-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: submittedCode,
          language: 'javascript',
          problemDescription: questions[currentQ] || 'General coding task'
        })
      })

      const evaluation = await res.json()


      // Store the answer and evaluation
      setTechnicalAnswersLog(prev => [...prev, {
        question: questions[currentQ],
        code: submittedCode,
        evaluation: evaluation
      }])

      // Neutral transition - NO feedback on score
      const transitions = [
        "Code received, let's move on.",
        "Thanks, continuing to the next one.",
        "Alright, next task."
      ]
      const randomTransition = transitions[Math.floor(Math.random() * transitions.length)]

      toast.success('Code submitted')
      await playVoice(randomTransition)

      // Move to next question — sync both state AND ref to prevent desync
      if (currentQ < questions.length - 1) {
        const nextIndex = currentQ + 1
        setCurrentQ(nextIndex)
        currentIndexRef.current = nextIndex
        setAnswers(prev => [...prev, `[CODE SUBMITTED]: ${submittedCode.substring(0, 50)}...`]) // Placeholder for main answers log
      } else {
        handleEndInterview()
      }

    } catch (error) {
      console.error('Code submission error:', error)
      toast.error('Failed to submit code')
    } finally {
      setIsSubmittingCode(false)
    }
  }

  const handleEndInterview = async () => {
    // Delegate to the main endInterview() to avoid duplicate end-logic
    endInterview()
  }

  const askNextQuestion = async (isFirstQuestion = false) => {
    const qs = questionsRef.current
    let shouldSpeak = isFirstQuestion

    // ── Iterative loop replaces recursive setTimeout ──────────────
    while (!isEndingRef.current) {
      const index = currentIndexRef.current

      if (!qs || qs.length === 0) {
        console.error('❌ No questions available')
        return
      }

      if (index >= qs.length) {
        endInterview()
        return
      }

      const question = qs[index]
      setCurrentQ(index)

      // Play the question only on the first iteration.
      // On subsequent iterations, the conversational response already voiced it.
      if (shouldSpeak) {
        await playVoice(question)
      }

      const questionEndTime = Date.now()
      setQuestionStartTime(questionEndTime)

      try {
        const answerStart = Date.now()
        const rawResult = await listen() as string
        const answerEnd = Date.now()

        // Parse ASR confidence from listen() result (format: "transcript|||0.850")
        let answer: string
        let asrConfidence = 1.0
        if (rawResult.includes('|||')) {
          const parts = rawResult.split('|||')
          answer = parts[0].trim()
          asrConfidence = parseFloat(parts[1]) || 1.0
        } else {
          answer = rawResult
        }

        const responseDelay = (answerStart - questionEndTime) / 1000
        const answerDuration = (answerEnd - answerStart) / 1000

        setProcessingResponse(true)

        // Evaluate answer
        const evaluation = await evaluateAnswer(question, answer, index, responseDelay, answerDuration, asrConfidence)

        // Store the answer and scores
        answersRef.current.push(answer)
        scoresRef.current.push(evaluation.scores)
        setAnswers([...answersRef.current])
        setScores([...scoresRef.current])

        const currentDiff = evaluation.newDifficulty || 'medium'
        difficultyLevelRef.current = currentDiff
        setDifficultyLevel(currentDiff)

        let finalAudioText = ''
        let hasMoreQuestions = false
        const nextQText = evaluation.nextQuestion

        if (nextQText) {
          hasMoreQuestions = true
          qs.push(nextQText)
          setQuestions([...qs])
          questionsRef.current = qs

          if (evaluation.nextQuestionId) {
            const updatedUsedIds = [...usedQuestionIdsRef.current, evaluation.nextQuestionId]
            setUsedQuestionIds(updatedUsedIds)
            usedQuestionIdsRef.current = updatedUsedIds
          }

          const conversationalData = await generateConversationalResponse(question, answer, nextQText)
          finalAudioText = conversationalData.responseText

          // Dynamic Probing Injection
          if (conversationalData.isFollowUp && conversationalData.followUpQuestion) {
            qs.splice(index + 1, 0, conversationalData.followUpQuestion)
            setQuestions([...qs])
            questionsRef.current = qs
            toast('AI Follow-up question generated', { icon: '🧠', duration: 3000 })
            finalAudioText = conversationalData.responseText
          }
        } else {
          const conversationalData = await generateConversationalResponse(question, answer, '')
          finalAudioText = `${conversationalData.responseText}. We have completed all questions for this session.`
        }

        // Save progress to localStorage (and trigger Supabase backup sync)
        if (interview && sessionManagerRef.current && sessionIdRef.current && sessionTokenRef.current) {
          const pool = fullQuestionPoolRef.current
          const answeredQuestions = answersRef.current.map((ans, i) => {
            const qText = qs[i]
            const qObj = pool.find((pq: any) => pq.text === qText)
            const scoreVal = scoresRef.current[i]?.technical ?? 5
            return {
              id: qObj ? qObj.id : `q-${i}`,
              text: qText,
              answer: ans,
              score: scoreVal,
              feedback: 'Answer saved.'
            }
          })

          sessionManagerRef.current.saveProgress({
            interviewId: interview.id,
            sessionId: sessionIdRef.current,
            currentQuestionIndex: index + 1,
            difficultyLevel: currentDiff,
            answeredQuestions,
            startedAt: new Date().toISOString(),
            lastSavedAt: new Date().toISOString()
          })
        }

        setProcessingResponse(false)

        // Play the conversational response
        await playVoice(finalAudioText)

        currentIndexRef.current++

        // Check if more questions remain
        if (hasMoreQuestions && currentIndexRef.current < qs.length) {
          setCurrentQ(currentIndexRef.current)
          await new Promise(resolve => setTimeout(resolve, 500))
          shouldSpeak = false // Next question already spoken
          continue
        } else {
          endInterview()
          return
        }

      } catch (err) {
        console.error('❌ Error in question loop:', err)
        setProcessingResponse(false)
        currentIndexRef.current++
        await new Promise(resolve => setTimeout(resolve, 1000))
        shouldSpeak = true
        continue
      }
    }
  }

  const endInterview = async () => {
    // Guard FIRST — prevent duplicate calls (timer expiry + question loop can race)
    if (isEndingRef.current) {

      return
    }


    isEndingRef.current = true

    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }

    if (recognitionRef.current) {
      try {
        // Use abort() for immediate cleanup when available
        if ('abort' in recognitionRef.current) {
          recognitionRef.current.abort()
        } else {
          recognitionRef.current.stop()
        }
      } catch { /* already stopped */ }
    }

    // Clear any silence timer
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current)
      silenceTimerRef.current = null
    }

    setCompleted(true)
    sessionManagerRef.current?.clearSession()

    // Trigger confetti AFTER guard check
    const duration = 5 * 1000
    const animationEnd = Date.now() + duration
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min

    const confettiInterval: ReturnType<typeof setInterval> = setInterval(function () {
      const remaining = animationEnd - Date.now()

      if (remaining <= 0) {
        return clearInterval(confettiInterval)
      }

      const particleCount = 50 * (remaining / duration)
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } })
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } })
    }, 250)

    // Play completion audio NON-BLOCKING — don't wait for it
    playPreRecordedAudio('completion.mp3').catch(() =>
      playVoice(`Thank you ${interview?.candidate_name ?? 'candidate'}. Your interview is complete. Your report will be ready shortly.`).catch(() => { })
    )

    const finalQuestions = questionsRef.current
    const finalAnswers = answersRef.current
    const finalScores = scoresRef.current



    // Instant fallback report (computed from per-answer scores already collected)
    const avgT = Math.round(finalScores.reduce((s: number, x: InterviewScores) => s + (x.technical || 0), 0) / (finalScores.length || 1))
    const avgC = Math.round(finalScores.reduce((s: number, x: InterviewScores) => s + (x.communication || 0), 0) / (finalScores.length || 1))
    const avgConf = Math.round(finalScores.reduce((s: number, x: InterviewScores) => s + (x.confidence || 0), 0) / (finalScores.length || 1))
    const avgPS = Math.round(finalScores.reduce((s: number, x: InterviewScores) => s + (x.problem_solving || 0), 0) / (finalScores.length || 1))
    const fastOverall = Math.round((avgT + avgC + avgConf + avgPS) / 4)

    let report: Record<string, unknown> = {
      summary: `${interview?.candidate_name ?? 'Candidate'} completed the ${interview?.interview_type ?? ''} interview for ${interview?.job_title ?? 'the position'}. Overall score: ${fastOverall}/10.`,
      recommendation: fastOverall >= 8 ? 'Recommended for next round' : fastOverall >= 6 ? 'Strong candidate with minor gaps' : fastOverall >= 4 ? 'Needs improvement' : 'Not suitable for this role',
      scores: { overall: fastOverall, technical: avgT, communication: avgC, confidence: avgConf, problem_solving: avgPS, clarity: avgC, professionalism: Math.round((avgConf + avgC) / 2), integrity_score: 10 },
      strengths: ['Completed the interview', 'Engaged throughout the session'],
      weaknesses: ['Further review recommended'],
      integrity_notes: violationLog.length > 0 ? `${violationLog.length} proctoring events detected.` : 'No violations.',
    }

    if (finalAnswers.length > 0) {
      try {
        const reportRes = await fetch('/api/generate-report', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            questions: finalQuestions,
            answers: finalAnswers,
            allScores: finalScores,
            jobTitle: interview?.job_title,
            candidateName: interview?.candidate_name,
            interviewType: interview?.interview_type,
            proctoringLog: violationLog
          })
        })

        if (reportRes.ok) {
          report = await reportRes.json()

          // Play spoken summary NON-BLOCKING
          if (report.spokenSummary) {
            playVoice(report.spokenSummary as string).catch(() => { })
          }
        } else {
          console.error('❌ AI report failed, using score-based fallback')
        }
      } catch (err) {
        console.error('❌ Report generation error, using fallback:', err)
      }
    } else {
      report = {
        summary: `${interview?.candidate_name ?? 'Candidate'} completed the interview but did not provide any spoken answers.`,
        recommendation: 'Review Required',
        scores: { overall: 0, technical: 0, communication: 0, confidence: 0, problem_solving: 0, clarity: 0, professionalism: 0, integrity_score: 10 },
        strengths: ['None'],
        weaknesses: ['No answers provided'],
        integrity_notes: 'Candidate did not speak or answer any questions.',
      }
    }

    try {
      const fullTranscript = finalQuestions.map((q, i) =>
        `Q${i + 1}: ${q}\n\nA${i + 1}: ${finalAnswers[i] || 'No answer recorded'}`
      ).join('\n\n')



      const saveRes = await fetch('/api/save-interview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          interviewId: interview?.id ?? params.id,
          questions: finalQuestions,
          answers: finalAnswers,
          report: report,
          finalScores: finalScores,
          fullTranscript: fullTranscript
        })
      })

      if (!saveRes.ok) {
        throw new Error('Failed to save interview via API')
      }


      // ⚡ Redirect immediately after save completes
      router.push(`/dashboard/reports/${interview?.id ?? params.id}`)
    } catch (err) {
      console.error('❌ Save error:', err)
      toast.error('Save issue — redirecting to report...')
      setTimeout(() => router.push(`/dashboard/reports/${interview?.id ?? params.id}`), 2000)
    }
  }

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60)
    const s = secs % 60
    return `${m}:${s.toString().padStart(2, '0')}`
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
      </div>
    )
  }

  if (!interview) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="bg-white/80 backdrop-blur-lg p-8 rounded-2xl shadow-xl text-center border border-white/20">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Interview Not Found</h2>
          <button onClick={() => router.push('/dashboard')} className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20">
            Back to Dashboard
          </button>
        </div>
      </div>
    )
  }

  if (completed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-12 max-w-lg w-full text-center border border-white/50"
        >
          {/* Success icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle className="w-12 h-12 text-green-600" />
          </motion.div>

          <h1 className="text-3xl font-bold text-gray-900 mb-3">Interview Completed!</h1>
          <p className="text-gray-500 mb-8">Great job! Your responses have been recorded.</p>

          {/* Live generating indicator */}
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 mb-6">
            <div className="flex items-center justify-center gap-3 mb-3">
              <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
              <span className="font-semibold text-blue-700">Generating your report...</span>
            </div>
            <div className="w-full bg-blue-100 rounded-full h-2 overflow-hidden">
              <motion.div
                className="h-full bg-blue-500 rounded-full"
                initial={{ width: '5%' }}
                animate={{ width: '95%' }}
                transition={{ duration: 9, ease: 'easeOut' }}
              />
            </div>
            <p className="text-xs text-blue-500 mt-2">You will be redirected automatically</p>
          </div>

          <button
            onClick={() => router.push('/dashboard')}
            className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
          >
            Back to Dashboard
          </button>
        </motion.div>
      </div>
    )
  }



  if (started) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 lg:p-8 flex flex-col">
        {/* Header */}
        <header className="flex justify-between items-center mb-8 px-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-blue-600/20">
              AI
            </div>
            <div>
              <h2 className="font-bold text-gray-900">AI Recruiter</h2>
              <p className="text-xs text-blue-600 font-medium">{interview.job_title}</p>
            </div>
          </div>
          <div className="bg-white/80 backdrop-blur-md px-4 py-2 rounded-full shadow-sm border border-white/50 flex items-center gap-2 text-gray-700 font-medium">
            <Clock className="w-4 h-4 text-blue-600" />
            {formatTime(timeLeft)}
          </div>
          <button
            onClick={() => setShowCodeEditor(!showCodeEditor)}
            className={`ml-4 flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all ${showCodeEditor
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
              : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
              }`}
          >
            {showCodeEditor ? <Layout className="w-4 h-4" /> : <Code2 className="w-4 h-4" />}
            {showCodeEditor ? 'Close Editor' : 'Open Code Editor'}
          </button>
        </header>

        {/* Real-time Progress Tracker */}
        <div className="max-w-6xl w-full mx-auto mb-6 shrink-0">
          <ProgressBar
            current={currentQ + 1}
            total={fullQuestionPool.length || interview?.question_set?.questions?.length || Math.max(3, Math.floor(interview.duration * 1.5))}
            difficulty={difficultyLevel}
            timeElapsed={Math.max(0, (interview.duration * 60) - timeLeft)}
          />
        </div>

        <main className={`flex-1 w-full gap-6 transition-all duration-500 ${showCodeEditor
          ? 'grid grid-cols-1 lg:grid-cols-12 h-[calc(100vh-140px)] overflow-hidden'
          : 'max-w-6xl mx-auto grid lg:grid-cols-[400px_1fr] items-start'
          }`}>
          {/* Left Panel (Avatar + Chat) */}
          <div className={`transition-all duration-500 ${showCodeEditor
            ? 'lg:col-span-4 flex flex-col h-full gap-4'
            : 'contents'
            }`}>
            {/* AI Avatar Section */}
            <div className={`${showCodeEditor ? 'h-[200px] shrink-0' : 'hidden lg:block sticky top-8'}`}>
              <div className={`relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-gradient-to-b from-blue-100 to-white ${showCodeEditor ? 'h-full w-full' : 'aspect-[3/4]'
                }`}>
                {/* Avatar Image with Speaking Animation */}
                <motion.div
                  className="absolute inset-0"
                  animate={speaking ? {
                    scale: [1, 1.03, 1],
                    filter: ['brightness(1)', 'brightness(1.1)', 'brightness(1)']
                  } : {
                    scale: 1,
                    filter: 'brightness(1)'
                  }}
                  transition={{ repeat: speaking ? Infinity : 0, duration: 1.5, ease: "easeInOut" }}
                >
                  <img
                    src="/aira-avatar.png"
                    alt="AIRA — AI Hiring Interviewer"
                    className="w-full h-full object-cover object-top"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                  <div className="hidden absolute inset-0 bg-gradient-to-b from-blue-50 to-indigo-100 flex items-center justify-center">
                    <span className={`${showCodeEditor ? 'text-6xl' : 'text-9xl'}`}>👩‍💼</span>
                  </div>
                </motion.div>

                {/* Speaking Indicator */}
                <AnimatePresence>
                  {speaking && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-white/50"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex gap-1 h-4 items-center">
                          {[1, 2, 3, 4].map(i => (
                            <motion.div
                              key={i}
                              animate={{ height: [8, 16, 8] }}
                              transition={{ repeat: Infinity, duration: 0.5, delay: i * 0.1 }}
                              className="w-1 bg-blue-600 rounded-full"
                            />
                          ))}
                        </div>
                        <span className="text-sm font-medium text-blue-900">AI is speaking...</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Chat Interface */}
            <div className={`flex flex-col bg-white/60 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 overflow-hidden relative ${showCodeEditor ? 'flex-1' : 'h-[600px] lg:h-[700px]'
              }`}>
              {/* Voice Visualizer Area */}
              <div className="p-4 bg-white/40 border-b border-slate-100/50 flex items-center justify-center shrink-0">
                <VoiceWave isAISpeaking={speaking} isCandidateSpeaking={listening} />
              </div>

              {/* Chat Area */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentQ}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex gap-4 max-w-[85%]"
                  >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shrink-0">
                      <span className="text-sm font-bold">AI</span>
                    </div>
                    <div className="bg-white p-5 rounded-2xl rounded-tl-none shadow-md border border-gray-100 text-gray-800 leading-relaxed">
                      {questions[currentQ] || 'Loading question...'}
                    </div>
                  </motion.div>
                </AnimatePresence>

                {transcript && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex gap-4 max-w-[85%] ml-auto flex-row-reverse"
                  >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white shadow-lg shrink-0">
                      <span className="text-sm font-bold">Me</span>
                    </div>
                    <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white p-5 rounded-2xl rounded-tr-none shadow-md leading-relaxed">
                      {transcript}
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Input Area */}
              <div className="p-6 bg-white border-t border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="flex-1 bg-gray-50 rounded-2xl p-4 border border-gray-200 flex items-center gap-3 transition-colors focus-within:border-blue-300 focus-within:ring-4 focus-within:ring-blue-50">
                    {listening ? (
                      <div className="flex items-center gap-2 text-blue-600 w-full">
                        <Mic className="w-5 h-5 animate-pulse" />
                        <span className="font-medium animate-pulse">Listening...</span>
                      </div>
                    ) : processingResponse ? (
                      <div className="flex items-center gap-2 text-purple-600 w-full">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span className="font-medium">Thinking...</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-gray-400 w-full">
                        <Mic className="w-5 h-5" />
                        <span>Waiting...</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel (Code Editor) */}
          {showCodeEditor && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="lg:col-span-8 h-full"
            >
              <CodeEditor
                initialCode={code}
                onChange={(val) => setCode(val || '')}
                onSubmit={handleCodeSubmit}
                isSubmitting={isSubmittingCode}
              />
            </motion.div>
          )}
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 lg:p-8">
      {showResumeModal && resumeState && (
        <ResumeModal
          candidateName={interview.candidate_name}
          currentQuestionIndex={resumeState.answeredQuestions.length}
          totalQuestions={interview?.question_set?.questions?.length || Math.max(3, Math.floor(interview.duration * 1.5))}
          onResume={handleResumeSession}
          onRestart={handleRestartSession}
        />
      )}
      <div className="max-w-6xl w-full grid lg:grid-cols-12 gap-8 items-start">
        {/* Left Column - Details & Prep */}
        <div className="lg:col-span-8 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm"
          >
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <Sparkles className="w-4 h-4" />
              AI-Powered Interview
            </div>

            <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 leading-tight mb-4">
              Welcome to your <br />
              <span className="text-blue-600">
                {interview.job_title}
              </span> Interview
            </h1>
            <p className="text-lg text-slate-600 mb-8 max-w-2xl">
              You will be speaking with AIRA, our autonomous AI interviewer. This session is designed to be conversational and completely paced by you.
            </p>

            <div className="grid sm:grid-cols-3 gap-4 border-t border-slate-100 pt-8">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <Clock className="w-6 h-6 text-blue-600 mb-2" />
                <h3 className="font-semibold text-slate-900">Duration</h3>
                <p className="text-sm text-slate-500">~{interview.duration} Minutes</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <Briefcase className="w-6 h-6 text-blue-600 mb-2" />
                <h3 className="font-semibold text-slate-900">Format</h3>
                <p className="text-sm text-slate-500">{interview.interview_type}</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <CheckCircle className="w-6 h-6 text-blue-600 mb-2" />
                <h3 className="font-semibold text-slate-900">Questions</h3>
                <p className="text-sm text-slate-500">Adaptive</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm"
          >
            <h2 className="text-xl font-bold text-slate-900 mb-6">Preparation Checklist</h2>
            <div className="space-y-4">
              <div className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center shrink-0 mt-1">
                  <Mic className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900">Check your microphone</h4>
                  <p className="text-sm text-slate-600">Ensure you speak clearly. The AI will listen and wait for you to finish.</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center shrink-0 mt-1">
                  <Wifi className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900">Stable connection</h4>
                  <p className="text-sm text-slate-600">A strong internet connection is required for seamless real-time analysis.</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center shrink-0 mt-1">
                  <ShieldAlert className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900">Anti-cheat is active</h4>
                  <p className="text-sm text-slate-600">Do not switch tabs or exit fullscreen mode. Proctoring events are recorded.</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Column - Avatar & Start */}
        <div className="lg:col-span-4 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-navy rounded-3xl p-6 shadow-xl relative overflow-hidden"
          >
            {/* Background elements */}
            <div className="absolute top-0 right-0 p-32 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

            <div className="aspect-[4/5] rounded-2xl overflow-hidden relative mb-6 border border-slate-700">
              <img
                src="/aira-avatar.png"
                alt="AIRA — AI Hiring Interviewer"
                className="w-full h-full object-cover object-top"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling?.classList.remove('hidden');
                }}
              />
              <div className="hidden absolute inset-0 bg-slate-800 flex items-center justify-center text-6xl">
                👩‍💼
              </div>

              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-900 p-4 pb-6">
                <p className="text-white font-bold text-lg">AIRA</p>
                <p className="text-slate-300 text-sm">Lead Technical AI Interviewer</p>
              </div>
              <div className="absolute top-4 right-4 bg-slate-900/80 backdrop-blur-sm border border-slate-700 px-3 py-1.5 rounded-full flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-white text-xs font-medium tracking-wide">ONLINE</span>
              </div>
            </div>

            <button
              onClick={startInterview}
              className="w-full bg-blue-600 text-white text-lg px-8 py-4 rounded-xl font-bold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 shadow-[0_4px_12px_rgba(37,99,235,0.3)] hover:shadow-[0_6px_16px_rgba(37,99,235,0.4)]"
            >
              Start Interview
              <ArrowRight className="w-5 h-5" />
            </button>
            <p className="text-center text-xs text-slate-400 mt-4">
              By starting, you agree to video/audio recording and AI analysis.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
