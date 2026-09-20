# AI Interview System - Complete Setup Guide

## ✅ What's Implemented

### 1. Full AI Interview Workflow
- ✅ Voice-based Q&A using Web Speech API
- ✅ Real-time AI evaluation using Gemini
- ✅ Automatic question generation based on job role
- ✅ Live scoring (Technical, Communication, Confidence, Problem Solving)
- ✅ Timer-based interview management
- ✅ Comprehensive final report generation
- ✅ Admin report storage in Supabase

### 2. Interview Flow
```
User clicks "Attend Interview" 
  → Interview page loads with job details
  → Click "Start Interview"
  → AI greets candidate via voice
  → AI asks questions (TTS)
  → Candidate responds (STT)
  → AI evaluates silently
  → AI acknowledges and moves to next question
  → Timer runs in background
  → At end: Generate full report
  → Save to database for admin review
```

## 🗄️ Database Setup

### Step 1: Run the Schema
Go to your Supabase project → SQL Editor → Run this:

```sql
-- Run the main schema first
-- (Copy from supabase-schema.sql)

-- Then run this migration
ALTER TABLE interviews ADD COLUMN IF NOT EXISTS recruiter_email TEXT;
CREATE INDEX IF NOT EXISTS idx_interviews_recruiter_email ON interviews(recruiter_email);
```

### Step 2: Disable RLS for Testing (Optional)
For quick testing, you can temporarily disable RLS:

```sql
ALTER TABLE interviews DISABLE ROW LEVEL SECURITY;
ALTER TABLE interview_sessions DISABLE ROW LEVEL SECURITY;
```

## 🧪 Testing the Interview System

### 1. Create an Interview
1. Sign in with Google
2. Go to Dashboard → Create Interview
3. Fill in:
   - Job Title: "Senior Software Engineer"
   - Job Description: "Full-stack developer with React and Node.js"
   - Interview Type: "Technical"
   - Candidate Level: "Experienced"
   - Duration: 5 minutes (for testing)
   - Candidate Name: "Test Candidate"
   - Candidate Email: "test@example.com"
4. Click "Create Interview"

### 2. Start the Interview
1. Go to Dashboard → Interviews
2. Find your created interview
3. Click "Attend Interview"
4. Review the instructions
5. **Allow microphone access when prompted**
6. Click "Start Interview"

### 3. During Interview
- AI will greet you and ask questions
- Wait for AI to finish speaking
- Speak your answer clearly
- AI will evaluate and move to next question
- Timer shows remaining time

### 4. After Interview
- Interview auto-completes when timer ends
- Final report is generated using AI
- Report saved to database
- Status updated to "completed"

## 🎯 Interview Evaluation Criteria

Each answer is scored 1-10 on:
- **Technical Skills**: Domain knowledge
- **Communication**: Clarity and articulation
- **Confidence**: Speaking confidence
- **Problem Solving**: Analytical thinking

**Overall Score**: Average of all categories

**Recommendation**:
- 7-10: "Recommended for next round"
- 5-6: "Needs improvement"
- 0-4: "Not recommended"

## 🔧 Troubleshooting

### Microphone Not Working
- Check browser permissions
- Use Chrome/Edge (best support)
- Ensure microphone is not used by other apps

### Speech Recognition Errors
- Speak clearly and at normal pace
- Reduce background noise
- Check internet connection

### API Errors
- Verify all API keys in .env.local
- Check Gemini API quota
- Restart dev server after env changes

### Database Errors
- Run database-setup.sql in Supabase
- Check Supabase connection
- Verify table structure

## 📊 Viewing Reports

### For Recruiters
1. Go to Dashboard → Reports
2. View completed interviews
3. See scores, transcript, and recommendation

### For Admins
1. Login with admin email (contains 'admin')
2. Access Admin Dashboard
3. View all interviews across recruiters
4. Export reports

## 🚀 Next Steps

1. **Run the database migration**:
   ```bash
   # Copy database-setup.sql content
   # Paste in Supabase SQL Editor
   # Click Run
   ```

2. **Restart your dev server**:
   ```bash
   npm run dev
   ```

3. **Test the flow**:
   - Create interview
   - Start interview
   - Complete interview
   - View report

## 🎤 Voice Technology

**Text-to-Speech**: Browser SpeechSynthesis API
- No API costs
- Works offline
- Natural voice

**Speech-to-Text**: Browser SpeechRecognition API
- No API costs
- Real-time transcription
- English language support

**AI Evaluation**: Google Gemini 1.5 Pro
- Question generation
- Answer evaluation
- Report generation

## ✨ Features Included

✅ No placeholder text
✅ No "coming soon" messages
✅ Instant interview start
✅ Real-time voice interaction
✅ Silent background evaluation
✅ Comprehensive final reports
✅ Admin dashboard integration
✅ Timer management
✅ Error handling
✅ State management

## 🔑 Environment Variables Required

```env
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-key
GEMINI_API_KEY=your-gemini-api-key
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret
```

All set! Your AI interview system is ready to use. 🎉
