# 🎙️ AI Voice Recruiter

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js%2014-black?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Groq](https://img.shields.io/badge/Groq%20LLaMA%203.3-F55036?style=for-the-badge&logo=groq&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![ElevenLabs](https://img.shields.io/badge/ElevenLabs_Voice-FF5722?style=for-the-badge&logo=soundcharts&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)

**Next-Generation Autonomous Voice AI Recruiter & Technical Interview Intelligence Platform**

*Conduct real-time voice interviews, evaluate coding challenges on the fly, detect cheating, and generate deep hiring scorecards instantly.*

[Live Demo](#-quick-start) • [Architecture](#-architecture) • [Candidate Experience](#-candidate-interview-room) • [Recruiter Suite](#-recruiter--admin-intelligence)

</div>

---

## ⚡ What is AI Voice Recruiter?

**AI Voice Recruiter** transforms the traditional hiring funnel into an autonomous, voice-first AI evaluation pipeline. Candidates converse naturally with an AI interviewer that listens, asks contextual follow-up questions tailored to their resume, evaluates live coding submissions in real-time, and generates multi-dimensional scoring reports with zero human bias.

```
       [ 📄 Job Description + Resume ]
                     │
                     ▼
          ┌─────────────────────┐
          │   AI Voice Engine   │ ◄─── (Groq LLaMA 3.3 + ElevenLabs TTS)
          └──────────┬──────────┘
                     │  (Voice & Code Interaction)
                     ▼
        ┌───────────────────────────┐
        │  Candidate Interview Room │
        │  • Real-time Voice STT/TTS│
        │  • Live Monaco Code Editor│
        │  • Tab-Switch Anti-Cheat  │
        │  • Script-Reading Detector│
        └────────────┬──────────────┘
                     │
                     ▼
       [ 📊 Comprehensive Report & Scorecard ] ──► Recruiter Email & Dashboard
```

---

## 📸 Visual Workflow

### 1. The Autonomous Hiring Lifecycle

```mermaid
sequenceDiagram
    autonumber
    actor Recruiter
    actor Candidate
    participant App as Web App (Next.js)
    participant AI as AI Engine (Groq / Gemini)
    participant DB as Supabase PostgreSQL

    Recruiter->>App: 1. Create Interview & Upload JD / Resume
    App->>AI: Generate Tailored Questions
    App->>Recruiter: Generates Unique Candidate Link (UUID)
    Candidate->>App: 2. Opens Link & Accepts Camera / Mic
    loop Live Voice & Code Round
        App->>Candidate: Voice Speaks Question (TTS + Waveform)
        Candidate->>App: Verbal Response (STT) + Live Monaco Code
        App->>AI: Real-Time Quality & Scripted-Answer Check
        AI-->>App: Adaptive Follow-up / Transition
    end
    App->>AI: 3. Compile Comprehensive Evaluation
    AI-->>DB: Store Scores, Strengths, Weaknesses, Verdict
    DB-->>Recruiter: Instant Dashboard Alert & PDF Email Report
```

---

## ✨ Key Features & Capabilities

| Feature | Description |
| :--- | :--- |
| 🎙️ **Voice-to-Voice AI** | Human-like conversational flow using ElevenLabs voice synthesis & browser-native speech recognition. |
| 💻 **Integrated Monaco Code Editor** | Live coding challenges with syntax highlighting (JS, Python, C++, Java, Go) and automated AI evaluation. |
| 📄 **Smart Resume Parsing** | Automatically extracts skills, experience, and past projects from PDF resumes to tailor ~50% of the interview questions. |
| 🛡️ **Anti-Cheat Proctoring** | Active tab-switch detection, webcam presence monitoring, and speech cadence analysis to flag scripted reading. |
| 📊 **Multi-Metric Rubric** | Scores candidates across **Technical Depth**, **Communication**, **Problem Solving**, and **Professionalism**. |
| 👑 **Enterprise Admin Suite** | Aggregated hiring funnels, recruiter leaderboards, score distributions, and reusable template libraries. |

---

## 🏛️ Architecture

```mermaid
graph LR
    subgraph Frontend["Frontend (Next.js 14 / TypeScript)"]
        UI[Glassmorphic UI + Framer Motion]
        Wave[Voice Waveform Visualizer]
        Monaco[Monaco Code Editor]
        Audio[Web Speech / Vapi SDK]
    end

    subgraph Backend["API & Serverless Layer"]
        Auth[NextAuth.js Google OAuth]
        Routes[App Router API Endpoints]
        Parser[PDF Resume Parser]
    end

    subgraph AI_Engine["AI & Voice Services"]
        LLM[Groq LLaMA 3.3 70B Versatile]
        Gemini[Google Gemini AI]
        TTS[ElevenLabs Voice Synthesis]
    end

    subgraph Storage["Data & Distribution"]
        DB[(Supabase PostgreSQL + RLS)]
        Mail[Nodemailer Email Service]
    end

    Frontend --> Backend
    Backend --> AI_Engine
    Backend --> Storage
```

---

## 🎯 Candidate Interview Room

The candidate interface (`/interview/[id]`) is optimized for focus, low latency, and ease of use:

```
┌────────────────────────────────────────────────────────────────────────┐
│ 🎙️ AI Voice Recruiter               ⏱️ Time Left: 14:32   [End Session]│
├───────────────────────────────────┬────────────────────────────────────┤
│                                   │                                    │
│   🤖 AI Interviewer               │   💻 Live Coding Workspace         │
│   "Explain how you optimize       │   ┌────────────────────────────┐   │
│    database queries in Postgres." │   │ function optimizeQuery() { │   │
│                                   │   │   // Candidate writes code │   │
│       (( ılılılllılı ))           │   │ }                          │   │
│    [ Voice Waveform Playing ]     │   └────────────────────────────┘   │
│                                   │   [ Run Code ]    [ Submit ]       │
│ ───────────────────────────────── │ ────────────────────────────────── │
│   🧑 Candidate Video & Live STT   │   🛡️ Proctoring Monitor            │
│   "I usually start by indexing... │   • Camera: Active  • Tabs: 0 Sw.  │
└───────────────────────────────────┴────────────────────────────────────┘
```

---

## 🗄️ Database Schema

The database runs on **Supabase (PostgreSQL)** with Row-Level Security:

```mermaid
erDiagram
    USERS ||--o{ INTERVIEWS : creates
    INTERVIEW_TEMPLATES ||--o{ INTERVIEWS : provides_structure
    INTERVIEWS ||--|| INTERVIEW_SESSIONS : records
    INTERVIEW_SESSIONS ||--o{ ANSWERS : contains

    USERS {
        uuid id PK
        string email
        string name
        string role "recruiter | admin"
        timestamp created_at
    }

    INTERVIEWS {
        uuid id PK
        uuid recruiter_id FK
        string job_title
        string candidate_name
        string candidate_email
        string status "scheduled | in_progress | completed"
        string interview_link
    }

    INTERVIEW_SESSIONS {
        uuid id PK
        uuid interview_id FK
        jsonb questions
        jsonb answers
        jsonb scores
        string recommendation "Strong Hire | Hire | Reject"
        timestamp completed_at
    }
```

---

## 🚀 Quick Start

### 1. Prerequisites
* **Node.js**: `v18.0.0` or higher
* **Package Manager**: `npm` or `pnpm`
* **Accounts**: Supabase, Groq / Google AI Studio, Google Cloud OAuth

### 2. Clone & Install
```bash
# Clone the repository
git clone https://github.com/KUSHALMN/ai-voice-recruiter.git
cd ai-voice-recruiter

# Install all dependencies
npm install
```

### 3. Configure Environment Variables
Create a `.env.local` file in the root directory:

```env
# App URL & Auth Secret
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-super-secret-key-32-chars

# Google OAuth Credentials
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Supabase Credentials
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# AI Providers
GROQ_API_KEY=gsk_your_groq_api_key
GEMINI_API_KEY=your_gemini_api_key
ELEVENLABS_API_KEY=your_elevenlabs_api_key

# Email Dispatch
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

### 4. Run Development Server
```bash
# Launch Next.js with Turbopack
npm run dev

# Open http://localhost:3000 in your browser
```

---

## 📊 Evaluation Scorecard Preview

Every completed interview generates an actionable AI hiring dossier:

| Evaluation Metric | Max Score | AI Criteria |
| :--- | :---: | :--- |
| 🧠 **Technical Accuracy** | `10/10` | Algorithm correctness, conceptual clarity, language mastery |
| 🗣️ **Communication** | `10/10` | Conciseness, structure, articulation, lack of filler |
| 💡 **Problem Solving** | `10/10` | Analytical approach, handling edge cases, optimization |
| 🎯 **Confidence** | `10/10` | Delivery tone, hesitation index, speech pacing |
| 📋 **Resume Fidelity** | `10/10` | Verification of claims made in candidate CV against answers |

---

## 📂 Project Structure

```
ai-voice-recruiter/
├── app/
│   ├── admin/                # Admin portal & enterprise analytics
│   ├── api/                  # 20+ Serverless API routes (AI, TTS, evaluation)
│   ├── dashboard/            # Recruiter workspace, interview creator & reports
│   ├── interview/[id]/       # Live candidate voice & code interview room
│   ├── login/                # Google OAuth authentication flow
│   └── page.tsx              # High-conversion landing page
├── components/
│   ├── interview/            # VoiceWave, Monaco CodeEditor, ResumeModal
│   ├── DashboardCharts.tsx   # Visual metrics & radar scorecards
│   └── TopBar.tsx            # Navigation & session controls
├── lib/
│   ├── ai/                   # AI prompts, scoring rubrics & LLM clients
│   ├── gemini.ts             # Groq & Gemini multi-model fallback handler
│   ├── supabase.ts           # Supabase client & connection pooling
│   └── resume/               # PDF parse and extraction pipeline
├── public/                   # Static assets, logos & sound effects
├── supabase-schema.sql       # Complete database migration SQL
└── package.json              # Project dependencies & scripts
```

---

## 🛡️ License

Distributed under the **MIT License**. See `LICENSE` for details.

<div align="center">

**Crafted with ❤️ by [KUSHAL M N](https://github.com/KUSHALMN)**

</div>