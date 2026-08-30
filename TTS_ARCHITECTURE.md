# ElevenLabs TTS Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         INTERVIEW FLOW                          │
└─────────────────────────────────────────────────────────────────┘

┌──────────────┐         ┌──────────────┐         ┌──────────────┐
│   Frontend   │         │   Backend    │         │  ElevenLabs  │
│  (React/TS)  │         │  (Express)   │         │     API      │
└──────────────┘         └──────────────┘         └──────────────┘
       │                        │                        │
       │                        │                        │
       │  1. Start Interview    │                        │
       ├───────────────────────>│                        │
       │                        │                        │
       │  2. Generate Questions │                        │
       │  (Gemini AI)           │                        │
       │<───────────────────────┤                        │
       │                        │                        │
       │  3. playVoice(question)│                        │
       ├───────────────────────>│                        │
       │  POST /api/tts         │                        │
       │  {text: "question"}    │                        │
       │                        │                        │
       │                        │  4. POST /v1/tts       │
       │                        ├───────────────────────>│
       │                        │  {text, voice_config}  │
       │                        │                        │
       │                        │  5. MP3 Audio Data     │
       │                        │<───────────────────────┤
       │                        │                        │
       │  6. MP3 Audio Stream   │                        │
       │<───────────────────────┤                        │
       │                        │                        │
       │  7. Play Audio         │                        │
       │  (HTML5 Audio)         │                        │
       │                        │                        │
       │  8. Listen for Answer  │                        │
       │  (Speech Recognition)  │                        │
       │                        │                        │
       │  9. Evaluate Answer    │                        │
       │  (Gemini AI)           │                        │
       │<───────────────────────┤                        │
       │                        │                        │
       │  10. playVoice(feedback)                        │
       ├───────────────────────>│                        │
       │  POST /api/tts         │                        │
       │                        ├───────────────────────>│
       │                        │<───────────────────────┤
       │<───────────────────────┤                        │
       │                        │                        │
       │  [Repeat 3-10 for each question]                │
       │                        │                        │
       │  11. End Interview     │                        │
       │  playVoice(completion) │                        │
       ├───────────────────────>│                        │
       │                        ├───────────────────────>│
       │                        │<───────────────────────┤
       │<───────────────────────┤                        │
       │                        │                        │
```

## Component Breakdown

### 1. Frontend (app/interview/[id]/page.tsx)

```typescript
┌─────────────────────────────────────────────────┐
│           Interview Component                   │
├─────────────────────────────────────────────────┤
│                                                 │
│  ┌──────────────────────────────────────┐      │
│  │  playVoice(text: string)             │      │
│  │  ─────────────────────────────────   │      │
│  │  1. Fetch MP3 from backend           │      │
│  │  2. Create Audio blob                │      │
│  │  3. Play audio                       │      │
│  │  4. Wait for completion              │      │
│  │  5. Cleanup resources                │      │
│  └──────────────────────────────────────┘      │
│                                                 │
│  ┌──────────────────────────────────────┐      │
│  │  playPreRecordedAudio(filename)      │      │
│  │  ─────────────────────────────────   │      │
│  │  1. Load from /audio/ folder         │      │
│  │  2. Play audio                       │      │
│  │  3. Fallback to playVoice() if fail  │      │
│  └──────────────────────────────────────┘      │
│                                                 │
│  ┌──────────────────────────────────────┐      │
│  │  Interview Flow                      │      │
│  │  ─────────────────────────────────   │      │
│  │  • startInterview()                  │      │
│  │    └─> playVoice(greeting)           │      │
│  │                                      │      │
│  │  • askNextQuestion()                 │      │
│  │    └─> playVoice(question)           │      │
│  │                                      │      │
│  │  • evaluateAnswer()                  │      │
│  │    └─> playVoice(feedback)           │      │
│  │                                      │      │
│  │  • endInterview()                    │      │
│  │    └─> playVoice(completion)         │      │
│  └──────────────────────────────────────┘      │
│                                                 │
└─────────────────────────────────────────────────┘
```

### 2. Backend (backend/server/index.js)

```javascript
┌─────────────────────────────────────────────────┐
│           Express Server                        │
├─────────────────────────────────────────────────┤
│                                                 │
│  POST /api/tts                                  │
│  ─────────────────────────────────────────      │
│                                                 │
│  1. Receive { text }                            │
│  2. Validate input                              │
│  3. Configure ElevenLabs request:               │
│     • voice_id: Rachel                          │
│     • model_id: eleven_multilingual_v2          │
│     • stability: 0.65                           │
│     • similarity_boost: 0.80                    │
│     • style: 0.05                               │
│  4. Forward to ElevenLabs API                   │
│  5. Stream MP3 response to client               │
│  6. Handle errors gracefully                    │
│                                                 │
│  Security:                                      │
│  • API key from environment variable            │
│  • Never exposed to frontend                    │
│  • Request validation                           │
│                                                 │
└─────────────────────────────────────────────────┘
```

### 3. Pre-recorded Audio System

```
┌─────────────────────────────────────────────────┐
│         Pre-recorded Audio Files                │
├─────────────────────────────────────────────────┤
│                                                 │
│  public/audio/                                  │
│  ├── greeting.mp3                               │
│  │   "Hello! Welcome to your interview..."      │
│  │   • Used at interview start                  │
│  │   • Reduces API calls                        │
│  │   • Faster playback                          │
│  │                                              │
│  └── completion.mp3                             │
│      "Thank you for completing..."              │
│      • Used at interview end                    │
│      • Consistent experience                    │
│      • No network dependency                    │
│                                                 │
│  Generation:                                    │
│  $ npm run generate-audio                       │
│                                                 │
│  Fallback:                                      │
│  If file not found → playVoice() with TTS       │
│                                                 │
└─────────────────────────────────────────────────┘
```

## Data Flow

### Request Flow
```
playVoice("Hello")
    │
    ├─> fetch('http://localhost:5000/api/tts')
    │   body: { text: "Hello" }
    │
    └─> Backend receives request
        │
        ├─> Validate text parameter
        │
        ├─> Build ElevenLabs request
        │   {
        │     text: "Hello",
        │     model_id: "eleven_multilingual_v2",
        │     voice_settings: {
        │       stability: 0.65,
        │       similarity_boost: 0.80,
        │       style: 0.05
        │     }
        │   }
        │
        ├─> POST to ElevenLabs API
        │   Headers: { xi-api-key: ELEVENLABS_API_KEY }
        │
        └─> Receive MP3 binary data
            │
            └─> Stream to frontend
                │
                └─> Frontend creates Audio object
                    │
                    └─> Play audio
                        │
                        └─> Resolve promise on completion
```

### Error Handling Flow
```
playVoice("Hello")
    │
    ├─> Network Error?
    │   └─> Catch → Log → Continue interview
    │
    ├─> Backend Error?
    │   └─> 500 Response → Log → Continue interview
    │
    ├─> ElevenLabs API Error?
    │   └─> Backend catches → Returns 500 → Continue
    │
    └─> Audio Playback Error?
        └─> Catch → Log → Continue interview
```

## Integration Points

### Point 1: Interview Start
```typescript
Location: startInterview()
Line: ~290

Code:
try {
  await playPreRecordedAudio('greeting.mp3')
} catch {
  await playVoice(`Hello ${candidateName}...`)
}
```

### Point 2: Question Delivery
```typescript
Location: askNextQuestion()
Line: ~305

Code:
const question = questions[currentIndex]
await playVoice(question)  // ← ElevenLabs TTS
```

### Point 3: Feedback Response
```typescript
Location: askNextQuestion() → after evaluation
Line: ~320

Code:
const evaluation = await evaluateAnswer(question, answer)
await playVoice(evaluation.conversationalResponse)  // ← ElevenLabs TTS
```

### Point 4: Interview Completion
```typescript
Location: endInterview()
Line: ~340

Code:
try {
  await playPreRecordedAudio('completion.mp3')
} catch {
  await playVoice(`Thank you ${candidateName}...`)
}
```

### Point 5: Final Summary
```typescript
Location: endInterview() → after report generation
Line: ~380

Code:
if (report.spokenSummary) {
  await playVoice(report.spokenSummary)  // ← ElevenLabs TTS
}
```

## Performance Characteristics

### Latency Breakdown
```
Total Time: ~1-3 seconds per request

┌─────────────────────────────────────────┐
│ Frontend → Backend:     50-100ms        │
│ Backend → ElevenLabs:   100-200ms       │
│ ElevenLabs Processing:  500-1500ms      │
│ Audio Download:         200-500ms       │
│ Audio Playback Start:   50-100ms        │
└─────────────────────────────────────────┘

Optimization:
• Pre-recorded audio: 0ms API time
• Cached responses: Future enhancement
• Parallel processing: Not applicable (sequential)
```

### Resource Usage
```
Per Interview (7 questions):
├─ Questions:     7 × 100 chars = 700 chars
├─ Feedback:      7 × 50 chars  = 350 chars
├─ Greeting:      Pre-recorded  = 0 chars
├─ Completion:    Pre-recorded  = 0 chars
└─ Total:         ~1,050 characters

ElevenLabs Free Tier: 10,000 chars/month
Interviews per month: ~9 interviews
```

## Security Model

```
┌─────────────────────────────────────────────────┐
│              Security Layers                    │
├─────────────────────────────────────────────────┤
│                                                 │
│  Layer 1: Environment Variables                 │
│  • API key stored in .env.local                 │
│  • Never committed to git                       │
│  • Backend only                                 │
│                                                 │
│  Layer 2: Backend Proxy                         │
│  • Frontend never sees API key                  │
│  • All requests go through backend              │
│  • Backend validates requests                   │
│                                                 │
│  Layer 3: Request Validation                    │
│  • Text parameter required                      │
│  • Length limits enforced                       │
│  • Rate limiting (future)                       │
│                                                 │
│  Layer 4: Error Handling                        │
│  • No sensitive data in error messages          │
│  • Generic errors to frontend                   │
│  • Detailed logs on backend only                │
│                                                 │
└─────────────────────────────────────────────────┘
```

## Testing Strategy

```
┌─────────────────────────────────────────────────┐
│              Test Levels                        │
├─────────────────────────────────────────────────┤
│                                                 │
│  1. Unit Tests                                  │
│     • playVoice() function                      │
│     • Audio blob creation                       │
│     • Error handling                            │
│                                                 │
│  2. Integration Tests                           │
│     • Backend endpoint                          │
│     • ElevenLabs API connection                 │
│     • Audio streaming                           │
│                                                 │
│  3. End-to-End Tests                            │
│     • Full interview flow                       │
│     • Question → Answer → Feedback cycle        │
│     • Pre-recorded audio fallback               │
│                                                 │
│  4. Manual Tests                                │
│     • Audio quality verification                │
│     • Voice consistency                         │
│     • Timing and pacing                         │
│                                                 │
│  Test Script:                                   │
│  $ npm run test-tts                             │
│                                                 │
└─────────────────────────────────────────────────┘
```

## Deployment Considerations

### Environment Setup
```
Development:
├─ Backend:  http://localhost:5000
├─ Frontend: http://localhost:3000
└─ ELEVENLABS_API_KEY in .env.local

Production:
├─ Backend:  https://api.yourapp.com
├─ Frontend: https://yourapp.com
├─ ELEVENLABS_API_KEY in environment
└─ Update TTS endpoint URL in frontend
```

### Configuration Changes for Production
```typescript
// Frontend: app/interview/[id]/page.tsx
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

const playVoice = async (text: string) => {
  const response = await fetch(`${API_URL}/api/tts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text })
  })
  // ... rest of code
}
```

## Monitoring & Debugging

### Backend Logs
```javascript
// backend/server/index.js
console.log('TTS Request:', { textLength: text.length })
console.log('TTS Response:', { size: response.data.length })
console.error('TTS Error:', error.response?.data || error.message)
```

### Frontend Logs
```typescript
// app/interview/[id]/page.tsx
console.log('Playing voice:', text.substring(0, 50))
console.log('Audio loaded:', audioUrl)
console.error('TTS Error:', error)
```

### Monitoring Checklist
- [ ] API response times
- [ ] Error rates
- [ ] Character usage
- [ ] Audio quality
- [ ] User feedback
