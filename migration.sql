-- Migration script for AI Voice Recruiter (Week 2 updates)

-- Update interviews table with resume columns
ALTER TABLE interviews ADD COLUMN IF NOT EXISTS resume_url TEXT;
ALTER TABLE interviews ADD COLUMN IF NOT EXISTS parsed_resume JSONB;
ALTER TABLE interviews ADD COLUMN IF NOT EXISTS question_set JSONB;

-- Update interview_sessions table with dynamic progression columns
ALTER TABLE interview_sessions ADD COLUMN IF NOT EXISTS current_question_index INT DEFAULT 0;
ALTER TABLE interview_sessions ADD COLUMN IF NOT EXISTS difficulty_level TEXT DEFAULT 'medium';
ALTER TABLE interview_sessions ADD COLUMN IF NOT EXISTS session_token TEXT;
