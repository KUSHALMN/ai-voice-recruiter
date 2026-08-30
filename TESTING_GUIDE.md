# Interview Flow Testing Guide

## Quick Test Steps

### 1. Start the Application

```bash
# Terminal 1 - Frontend
npm run dev

# Terminal 2 - Backend (if needed)
npm run server
```

### 2. Create a Test Interview

1. Login to dashboard
2. Click "Create Interview"
3. Fill in:
   - **Job Title**: "Full Stack Developer"
   - **Interview Type**: "Technical" (or any type)
   - **Candidate Type**: "Experienced"
   - **Duration**: 5 minutes (for quick testing)
   - **Candidate Name**: "Test Candidate"
   - **Candidate Email**: "test@example.com"
4. Submit and copy the interview link

### 3. Open Interview Link

1. Open the interview link in a new tab/window
2. You should see:
   - Position: Full Stack Developer
   - Type: Technical
   - Duration: 5 minutes
   - Instructions

### 4. Start Interview & Monitor Console

**Open Browser DevTools (F12) → Console Tab**

Click "Start Interview" and watch for these logs:

```
🚀 Starting interview...
📝 Generating questions...
Calling generate-questions API...
API returned 12 questions
✅ Generated 12 questions for Technical interview
👋 Speaking greeting...
✅ Greeting complete, starting question loop...
❓ Asking question 1/12
🔊 Speaking: [question text]
✅ Question spoken
🎤 Waiting for answer...
```

### 5. Expected Behavior

#### ✅ What Should Happen:

1. **Timer starts** counting down from 5:00
2. **AI speaks greeting**: "Hello Test Candidate! Welcome to your Technical interview for Full Stack Developer. Let's begin."
3. **AI asks Question 1** (e.g., "What is your experience with React?")
4. **Microphone activates** (you'll see "Listening..." indicator)
5. **You speak your answer**
6. **AI evaluates** your answer
7. **AI provides feedback** (e.g., "That's a great explanation, thank you.")
8. **AI asks Question 2**
9. **Process repeats** for all 10-12 questions
10. **Interview ends** when:
    - All questions completed, OR
    - Timer reaches 0:00
11. **AI speaks**: "Thank you Test Candidate. Your interview is complete."
12. **Completion screen** appears with green checkmark

#### ❌ What Should NOT Happen:

- ❌ Interview ending immediately after greeting
- ❌ No questions being asked
- ❌ Stuck on "Loading..."
- ❌ Empty question list
- ❌ Loop breaking after first question

### 6. Console Log Verification

You should see a complete sequence like this:

```
🚀 Starting interview...
📝 Generating questions...
✅ Generated 12 questions for Technical interview
👋 Speaking greeting...
✅ Greeting complete, starting question loop...

❓ Asking question 1/12
🔊 Speaking: "What is your experience with React and Next.js?"
✅ Question spoken
🎤 Waiting for answer...
✅ Answer received: "I have worked with React for 3 years..."
🤔 Evaluating answer...
✅ Evaluation complete: {technical: 8, communication: 7, confidence: 8, problem_solving: 7}
💬 Feedback: "That's a comprehensive overview of your experience."
➡️ Moving to next question...

❓ Asking question 2/12
🔊 Speaking: "Can you explain the difference between SSR and CSR?"
✅ Question spoken
🎤 Waiting for answer...
✅ Answer received: "SSR is server-side rendering..."
🤔 Evaluating answer...
✅ Evaluation complete: {technical: 9, communication: 8, confidence: 8, problem_solving: 8}
💬 Feedback: "Excellent explanation!"
➡️ Moving to next question...

[... continues for all questions ...]

🏁 Ending interview...
📊 Interview stats: 12 answers out of 12 questions
📄 Generating final report...
✅ Report generated
💾 Saving interview session...
✅ Interview saved successfully
```

### 7. Test Different Interview Types

Test each type to verify question generation:

#### Technical Interview
- Should generate 12 questions
- Focus: coding, system design, technical skills
- Example: "Explain the concept of closures in JavaScript"

#### Behavioral Interview
- Should generate 10 questions
- Focus: teamwork, conflict resolution, soft skills
- Example: "Tell me about a time you disagreed with a team member"

#### Problem Solving Interview
- Should generate 10 questions
- Focus: analytical thinking, scenarios
- Example: "How would you approach debugging a production issue?"

#### Leadership Interview
- Should generate 10 questions
- Focus: management, decision-making
- Example: "Describe your leadership style"

#### Mixed Interview
- Should generate 15 questions
- Focus: balanced mix of all types
- Example: Mix of technical, behavioral, and problem-solving

### 8. Test Different Candidate Levels

#### Fresher
- Questions should be entry-level
- Focus on foundational concepts
- Example: "What is the difference between var, let, and const?"

#### Experienced
- Questions should be intermediate to advanced
- Focus on real-world scenarios
- Example: "How would you optimize a slow-performing React application?"

#### Managerial
- Questions should be senior-level
- Focus on strategic thinking and leadership
- Example: "How do you balance technical debt with feature development?"

### 9. Error Scenarios to Test

#### Test 1: API Failure
- Disconnect internet briefly
- Start interview
- Should use fallback questions (10 generic questions)
- Interview should still proceed

#### Test 2: Microphone Permission Denied
- Deny microphone access
- Start interview
- Should skip to next question after timeout
- Interview should continue

#### Test 3: Timer Expiry
- Set duration to 1 minute
- Start interview
- Let timer reach 0:00
- Should end gracefully with "Interview complete" message

### 10. Database Verification

After completing an interview, check Supabase:

1. Go to Supabase Dashboard
2. Check `interview_sessions` table
3. Verify record exists with:
   - ✅ `interview_id`
   - ✅ `questions` (array of 10-15 questions)
   - ✅ `answers` (array of candidate responses)
   - ✅ `scores` (evaluation scores)
   - ✅ `evaluation` (summary and recommendation)
   - ✅ `transcript`
   - ✅ `completed_at` timestamp

4. Check `interviews` table
5. Verify `status` changed from "scheduled" to "completed"

## Troubleshooting

### Issue: No questions generated
**Check:**
- Console for API errors
- Gemini API key in `.env.local`
- Network tab for failed requests

**Solution:**
- Fallback questions should activate automatically
- Check `GEMINI_API_KEY` is set correctly

### Issue: Speech not working
**Check:**
- Browser supports Web Speech API (Chrome/Edge recommended)
- Microphone permissions granted
- No other app using microphone

**Solution:**
- Use Chrome or Edge browser
- Grant microphone permission when prompted
- Close other apps using microphone

### Issue: Interview ends immediately
**Check:**
- Console logs for errors
- Questions array length
- Timer value

**Solution:**
- This should be fixed with the new code
- Check console for "❌ No questions generated" error
- Verify API is responding

### Issue: Stuck on one question
**Check:**
- Console for "Waiting for answer..." message
- Microphone indicator
- Speech recognition errors

**Solution:**
- Speak clearly into microphone
- Check microphone is working in system settings
- Try refreshing and starting again

## Success Criteria

✅ Interview generates 10-15 questions based on type
✅ AI speaks greeting
✅ AI asks all questions sequentially
✅ Microphone captures answers
✅ AI evaluates each answer
✅ AI provides feedback after each answer
✅ Timer counts down correctly
✅ Interview ends when complete or timer expires
✅ Final report is generated
✅ Data is saved to database
✅ Completion screen is shown

## Performance Benchmarks

- **Question Generation**: < 5 seconds
- **Question Speaking**: 3-5 seconds per question
- **Answer Listening**: 10-30 seconds (depends on candidate)
- **Answer Evaluation**: 2-4 seconds
- **Feedback Speaking**: 2-3 seconds
- **Total per Question**: ~20-45 seconds
- **Full Interview (10 questions)**: ~5-8 minutes

## Browser Compatibility

✅ **Recommended:**
- Chrome 80+
- Edge 80+

⚠️ **Limited Support:**
- Firefox (no Web Speech API)
- Safari (limited Speech Recognition)

❌ **Not Supported:**
- Internet Explorer
- Opera Mini

## Next Steps After Testing

1. ✅ Verify all questions are asked
2. ✅ Check console logs are clean
3. ✅ Confirm data saved to database
4. ✅ Test with different interview types
5. ✅ Test with different candidate levels
6. ✅ Test error scenarios
7. ✅ Verify completion flow
8. 🚀 Deploy to production!

---

**Need Help?**
- Check console logs for detailed error messages
- Review `INTERVIEW_FLOW_FIX.md` for technical details
- Verify all environment variables are set
- Ensure Gemini API has sufficient quota
