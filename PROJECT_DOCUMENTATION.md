# AI Voice Recruiter - Comprehensive Project Documentation

## 1. Project Overview
**Name**: AI Voice Recruiter
**Version**: 1.0.0
**Description**: A full-stack, AI-powered Voice Recruiter Assistant web application that automates the entire recruitment process using voice-based AI interactions. It evaluates candidates in real-time and provides comprehensive reports to recruiters and admins.

---

## 2. Core Features

### 🎙️ For Candidates (The Interview Experience)
- **Voice-Based AI Interviews**: Candidates can conduct natural conversations with an AI agent using speech recognition and text-to-speech technologies.
- **Dynamic Questioning**: Questions are generated dynamically by AI based on the job requirements.
- **Real-Time Interaction**: Smooth voice-to-voice flow simulating a real human interview.

### 👥 For Recruiters
- **Interview Management**: Create new interviews with specific job details (title, description, interview type, candidate type).
- **Seamless Sharing**: Generate and share unique interview links with candidates.
- **Automated Reports**: View comprehensive evaluation reports generated immediately after the interview concludes.
- **Real-Time Evaluation**: AI evaluates candidates on communication, confidence, technical skills, and problem-solving.

### 👑 For Administrators
- **Global Dashboard**: Complete dashboard with interview trends, success metrics, and performance insights across all recruiters.
- **Analytics & Insights**: Score distributions by category, recruiter activity summaries, and total interview tracking.
- **System Management**: Export data and manage role-based access control.

---

## 3. Technology Stack

### Frontend Architecture
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom Glassmorphism UI
- **Animations**: Framer Motion
- **State Management**: Zustand
- **Data Visualization**: Recharts
- **Code Editing/Display**: Monaco Editor (`@monaco-editor/react`)
- **Notifications**: React Hot Toast
- **Other**: Canvas Confetti for success states

### Backend Architecture
- **Framework**: Express.js (Node.js)
- **Database**: Supabase (PostgreSQL)
- **Authentication**: NextAuth.js (Google OAuth provider)

### AI & External Services Integrations
- **Google Generative AI (Gemini)**: Used for dynamic question generation and real-time candidate evaluation.
- **ElevenLabs API**: Text-to-Speech & Speech-to-Text capabilities for natural voice interactions.
- **Vapi AI**: Web SDK for voice AI agents (`@vapi-ai/web`).
- **Groq API**: Lightning-fast language model inference.
- **Email Service**: Nodemailer for sending notifications.

---

## 4. Application Structure

The application follows the Next.js App Router paradigm, organized into functional domains:
- `/app/admin`: Administrative dashboard and analytics views.
- `/app/dashboard`: Recruiter dashboard for managing interviews.
- `/app/interview/[id]`: The core candidate interview interface.
- `/app/login`: Authentication flows.
- `/app/api`: Next.js API routes handling serverless operations.
- `/backend/server`: Standalone Express backend for specialized processing.

---

## 5. Database Schema (Supabase)

The database utilizes PostgreSQL hosted on Supabase, consisting of three primary tables:

### `users`
| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary Key |
| `email` | TEXT | Unique identifier for login |
| `name` | TEXT | User's full name |
| `role` | TEXT | `recruiter` or `admin` |
| `created_at` | TIMESTAMP | Creation timestamp |

### `interviews`
| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary Key |
| `recruiter_id` | UUID | Foreign Key references `users(id)` |
| `job_title` | TEXT | Target job role |
| `job_description`| TEXT | Full job description |
| `interview_type` | TEXT | e.g., Technical, HR |
| `candidate_type` | TEXT | e.g., Fresher, Experienced |
| `duration` | INTEGER | Time limit for interview |
| `candidate_name` | TEXT | Candidate's name |
| `candidate_email`| TEXT | Candidate's email address |
| `interview_link` | TEXT | Unique URL for candidate |
| `status` | TEXT | `scheduled`, `in_progress`, `completed` |

### `interview_sessions`
| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary Key |
| `interview_id` | UUID | Foreign Key references `interviews(id)` |
| `questions` | JSONB | Array of AI-generated questions |
| `answers` | JSONB | Array of candidate responses |
| `evaluation` | JSONB | Raw AI feedback per answer |
| `transcript` | TEXT | Full conversation transcript |
| `scores` | JSONB | Calculated scores across metrics |
| `recommendation` | TEXT | Final AI hiring recommendation |

---

## 6. Evaluation Metrics

The AI system evaluates candidates across four primary dimensions:
1. **Technical Skills**: Domain-specific knowledge assessment.
2. **Communication**: Clarity and articulation of thoughts.
3. **Confidence**: Speaking confidence and presence.
4. **Problem Solving**: Analytical thinking approach.
*(An overall score is calculated as a weighted average, culminating in a final recommendation).*

---

## 7. Development & Deployment

### Scripts
- `npm run dev`: Starts the Next.js frontend development server with Turbopack.
- `npm run server`: Starts the separate Express backend server.
- `npm run start:all`: Concurrently runs both frontend and backend using `concurrently`.
- `npm run build`: Creates a production-ready build.

### Environment Requirements
Requires configuration of:
- NextAuth (`NEXTAUTH_URL`, `NEXTAUTH_SECRET`, Google Client ID/Secret)
- Supabase (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`)
- AI Providers (`GEMINI_API_KEY`, `ELEVENLABS_API_KEY`, Vapi, Groq)
