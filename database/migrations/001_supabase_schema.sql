-- Users table
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT DEFAULT 'recruiter' CHECK (role IN ('recruiter', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Interview Templates table
CREATE TABLE interview_templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_id UUID REFERENCES users(id),
  name TEXT NOT NULL,
  job_position TEXT NOT NULL,
  job_description TEXT NOT NULL,
  interview_level TEXT NOT NULL CHECK (interview_level IN ('Fresher', 'Experienced', 'Management')),
  interview_type TEXT NOT NULL CHECK (interview_type IN ('Technical', 'Behavioral', 'Problem Solving', 'Leadership')),
  duration INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Interviews table
CREATE TABLE interviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  recruiter_id UUID REFERENCES users(id),
  template_id UUID REFERENCES interview_templates(id),
  job_title TEXT NOT NULL,
  job_description TEXT NOT NULL,
  interview_type TEXT NOT NULL,
  candidate_type TEXT NOT NULL,
  duration INTEGER NOT NULL,
  candidate_name TEXT NOT NULL,
  candidate_email TEXT NOT NULL,
  interview_link TEXT NOT NULL,
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  scheduled_at TIMESTAMP WITH TIME ZONE
);

-- Interview sessions table
CREATE TABLE interview_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  interview_id UUID REFERENCES interviews(id),
  questions JSONB NOT NULL,
  answers JSONB NOT NULL,
  evaluation JSONB NOT NULL,
  transcript TEXT,
  scores JSONB NOT NULL,
  recommendation TEXT NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Questions table (for AI-generated questions)
CREATE TABLE questions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  template_id UUID REFERENCES interview_templates(id),
  question_text TEXT NOT NULL,
  question_type TEXT NOT NULL,
  difficulty_level TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Answers table (for candidate responses)
CREATE TABLE answers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID REFERENCES interview_sessions(id),
  question_id UUID REFERENCES questions(id),
  answer_text TEXT NOT NULL,
  audio_url TEXT,
  evaluation_score INTEGER,
  ai_feedback TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE interview_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE interviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE interview_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE answers ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own data" ON users FOR SELECT USING (auth.uid()::text = id::text);
CREATE POLICY "Admins can view all templates" ON interview_templates FOR ALL USING (true);
CREATE POLICY "Users can view own interviews" ON interviews FOR ALL USING (auth.uid()::text = recruiter_id::text);
CREATE POLICY "Users can view related sessions" ON interview_sessions FOR SELECT USING (
  EXISTS (SELECT 1 FROM interviews WHERE interviews.id = interview_sessions.interview_id AND interviews.recruiter_id::text = auth.uid()::text)
);

-- Indexes for performance
CREATE INDEX idx_interviews_recruiter_id ON interviews(recruiter_id);
CREATE INDEX idx_interviews_status ON interviews(status);
CREATE INDEX idx_interview_sessions_interview_id ON interview_sessions(interview_id);
CREATE INDEX idx_templates_admin_id ON interview_templates(admin_id);
CREATE INDEX idx_questions_template_id ON questions(template_id);
CREATE INDEX idx_answers_session_id ON answers(session_id);