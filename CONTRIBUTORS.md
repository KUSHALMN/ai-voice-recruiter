# Project Contributors

Thank you to everyone who has built, hardened, and maintained the **AI Voice Recruiter (AIRA)** platform.

## Core Contributors Team (Key Domains)

| # | Contributor | Role & Domain | Primary Focus Areas | Status |
|---|-------------|---------------|---------------------|--------|
| 1 | **Kushal M N** ([@KUSHALMN](https://github.com/KUSHALMN)) | **Founder & Lead Architect** | Enterprise RAG System Architecture, Next.js 16 App Router, Supabase `pgvector` Integration, End-to-End Orchestration | Lead Maintainer |
| 2 | **RAG & Vector AI Specialist** | **Retrieval-Augmented Generation Engineer** | Supabase `pgvector` HNSW 768-dim indexing, Resume Semantic Chunking, Gold-Standard Rubric Grounding, ATS Talent Matching | Core Maintainer |
| 3 | **Security & Infrastructure Specialist** | **AppSec & Cloud Security Engineer** | Enterprise HTTP Security Headers (HSTS, CSP, X-Frame-Options), NextAuth JWT RBAC, Endpoint Protection & Rate Limiting | Core Maintainer |
| 4 | **AI & Voice Systems Specialist** | **LLM & Speech Engineer** | Groq Llama 3.3 70B, Gemini 1.5/2.0 Flash Prompt Engineering, ElevenLabs & Vapi Voice Synthesis, Adaptive Questioning | Active Contributor |
| 5 | **UI/UX & Design Systems Lead** | **Frontend Experience Specialist** | AI Talent Matcher Console, Hardware-Accelerated Liquid Glassmorphism, Responsive Mobile Sidebar & Portal Navigation | Active Contributor |
| 6 | **Backend & Integrity Systems Engineer** | **Python Services & Anti-Cheat Specialist** | FastAPI Microservices & RAG Endpoints, Resume PDF Parsing, Real-time Anti-Cheat Proctoring Engine & Integrity Scoring | Active Contributor |

---

## Areas of Contribution

### 1. Enterprise RAG (Retrieval-Augmented Generation) Architecture
- **Option A: Resume RAG (Targeted Live Interview Questions)**
  - Automated PDF resume parsing, section-aware recursive text chunking, and 768-dimensional vector indexing.
  - Dynamic retrieval of candidate project metrics, tech stacks, and accomplishments during live interview pacing.
  - Contextual follow-up question generation probing claims, system architecture decisions, and real-world metrics.
- **Option B: Evaluation Rubric RAG (Objective Answer Scoring)**
  - Pre-indexed library of gold-standard technical and behavioral rubrics stored in `evaluation_rubrics`.
  - Candidate responses scored objectively against multi-point criteria rather than subjective LLM estimation.
- **Option C: ATS Smart Resume Matching (Vector Search across Candidates)**
  - Semantic applicant search allowing recruiters to search candidates in natural language (e.g. *"Senior React engineer with WebSockets and Docker experience"*).
  - High-performance glassmorphic **AI Talent Matcher** console (`/dashboard/talent-search`) with real-time match scores and highlight pills.
- **Option D: All-in-One Shared Architecture (TypeScript & Python FastAPI)**
  - Shared Supabase PostgreSQL vector store with HNSW cosine distance indexing (`rag-migration.sql`).
  - Unified 768-dimension embeddings supporting Google Gemini `text-embedding-004`, OpenAI, and deterministic semantic projection fallback.
  - Parallel Python FastAPI endpoints (`/api/rag/embed`, `/api/rag/similarity`, `/api/rag/status`).

### 2. Core Platform & Architecture
- Next.js 16 App Router with Turbopack compilation and ultra-fast client-side route prefetching.
- Supabase PostgreSQL database schemas, Row Level Security (RLS) policies, and storage buckets.
- Full recruiter workspace and superadmin governance console.

### 3. Enterprise Security & Hardening
- Zero-trust API authorization on sensitive routes (`delete-report`, `ats/config`, `ats/sync`, `candidate/nudge`).
- Sliding-window in-memory rate limiting against DDoS and API credit depletion.
- Automated HTML and URL sanitization to prevent Stored XSS and Email Injection attacks.
- Strict production HTTP security headers (A+ grade on SecurityHeaders/Observatory).

### 4. Voice & Generative AI Systems
- Real-time conversational AI loop with dynamic follow-up probing and low-latency voice synthesis.
- Multi-lingual voice screening (English, Spanish, Hindi, German, French, Japanese).
- 48-hour candidate scheduling nudges with Google Calendar one-click links.

### 5. Frontend & User Experience
- Hardware-accelerated GPU shader passes with zero layout shifts and 60/120 FPS animations.
- Glassmorphic AI Talent Matcher interface with interactive query suggestions and match calibration.
- Universal back navigation and intuitive portal switching.
- Adaptive voice wave audio visualizer and live transcription telemetry.

### 6. Proctoring & Anti-Cheat Engine
- Tab-switch and multi-screen focus loss detection with dynamic integrity score penalties.
- Scripted answer detection and voice pacing manager to ensure smooth candidate experience.
- Monaco Code Editor integration with real-time automated AI code evaluation.

---

## Becoming a Contributor
We welcome community contributions! Please read our [CONTRIBUTING.md](./.github/CONTRIBUTING.md) to get started with local development, security guidelines, and pull request procedures.
