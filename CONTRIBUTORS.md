# Project Contributors

Thank you to everyone who has built, hardened, and maintained the **AI Voice Recruiter (AIRA)** platform.

## Core Contributors Team (5 Key Contributors)

| # | Contributor | Role & Domain | Primary Focus Areas | Status |
|---|-------------|---------------|---------------------|--------|
| 1 | **Kushal M N** ([@KUSHALMN](https://github.com/KUSHALMN)) | **Founder & Lead Architect** | Core System Architecture, Next.js 16 App Router, Supabase Integration, End-to-End Orchestration | Lead Maintainer |
| 2 | **Security & Infrastructure Specialist** | **AppSec & Cloud Security Engineer** | Enterprise HTTP Security Headers (HSTS, CSP, X-Frame-Options), NextAuth JWT RBAC, Endpoint Protection & Rate Limiting | Core Maintainer |
| 3 | **AI & Voice Systems Specialist** | **LLM & Speech Engineer** | Gemini 1.5/2.0 Flash Prompt Engineering, ElevenLabs & Vapi Voice Synthesis, Dynamic Question Generation | Active Contributor |
| 4 | **UI/UX & Design Systems Lead** | **Frontend Experience Specialist** | Claude-style Editorial Typography, Hardware-Accelerated Liquid Glassmorphism, Responsive Mobile Sidebar & Portal Navigation | Active Contributor |
| 5 | **Backend & Integrity Systems Engineer** | **Python Services & Anti-Cheat Specialist** | FastAPI Microservices, Resume PDF Vector Parsing, Real-time Anti-Cheat Proctoring Engine & Integrity Scoring | Active Contributor |

---

## Areas of Contribution

### 1. Core Platform & Architecture
- Next.js 16 App Router with Turbopack compilation.
- Supabase PostgreSQL database schemas, Row Level Security (RLS) policies, and storage buckets.
- Full recruiter workspace and superadmin governance console.

### 2. Enterprise Security & Hardening
- Zero-trust API authorization on sensitive routes (`delete-report`, `ats/config`, `ats/sync`, `candidate/nudge`).
- Sliding-window in-memory rate limiting against DDoS and API credit depletion.
- Automated HTML and URL sanitization to prevent Stored XSS and Email Injection attacks.
- Strict production HTTP security headers (A+ grade on SecurityHeaders/Observatory).

### 3. Voice & Generative AI Systems
- Real-time conversational AI loop with dynamic follow-up probing.
- Multi-lingual voice screening (English, Spanish, Hindi, German, French, Japanese).
- 48-hour candidate scheduling nudges with Google Calendar one-click links.

### 4. Frontend & User Experience
- Hardware-accelerated GPU shader passes with zero layout shifts and 60/120 FPS animations.
- Universal back navigation and intuitive portal switching.
- Adaptive voice wave audio visualizer and live transcription telemetry.

### 5. Proctoring & Anti-Cheat Engine
- Tab-switch and multi-screen focus loss detection with dynamic integrity score penalties.
- Scripted answer detection and voice pacing manager to ensure smooth candidate experience.
- Monaco Code Editor integration with real-time automated AI code evaluation.

---

## Becoming a Contributor
We welcome community contributions! Please read our [CONTRIBUTING.md](./.github/CONTRIBUTING.md) to get started with local development, security guidelines, and pull request procedures.
