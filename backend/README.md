# AIRA — Python FastAPI Backend

High-performance, async Python FastAPI backend for the AI Voice & Technical Recruiter platform.

---

## Features
- **Fast & Lightweight**: Built on `FastAPI` and `uvicorn`.
- **Interactive OpenAPI Documentation**: Available at `http://localhost:8000/docs`.
- **Groq AI Integration**: Uses official `groq` Python SDK with intelligent model fallback (`qwen/qwen3.6-27b`, `openai/gpt-oss-120b`).
- **PDF Resume Parsing**: Extracts structured skills, experience, and custom job descriptions using `pypdf` with heuristic regex backup.
- **Supabase PostgreSQL Support**: Direct admin connection using the `supabase` Python SDK.
- **Dynamic Probing & Proctoring**: Real-time answer scoring and anti-scripted response detection.

---

## Quick Start

### 1. Install Dependencies
```bash
python -m pip install -r backend/requirements.txt
```

### 2. Start the FastAPI Server
```bash
# Using Python
python run_backend.py

# Or using NPM
npm run backend
```
The server will start on:
- API Base: `http://127.0.0.1:8000`
- Interactive Swagger UI: `http://127.0.0.1:8000/docs`
- Health Check: `http://127.0.0.1:8000/health`

---

## Available Endpoints

| Method | Path | Description |
| :--- | :--- | :--- |
| `POST` | `/api/parse-resume` | Upload candidate PDF resume and extract structured role details |
| `POST` | `/api/create-interview` | Create and store interview in Supabase |
| `GET` | `/api/interview/{id}` | Fetch interview details by ID |
| `GET` | `/api/get-interviews` | List all interviews |
| `POST` | `/api/evaluate-answer` | Evaluate candidate verbal answer (1-10 scoring + feedback) |
| `POST` | `/api/detect-scripted` | Anti-cheating LLM script reading detection |
| `POST` | `/api/generate-questions` | Generate customized question pool for duration & role |
| `POST` | `/api/generate-job-description` | Generate professional job description from skills |
| `POST` | `/api/interview/{id}/session` | Start or resume candidate interview session |
| `POST` | `/api/interview/session/{sessionId}/answer` | Process answer and record progress |
| `GET` | `/api/get-reports` | List completed candidate evaluation reports |
| `GET` | `/api/get-single-report` | Fetch single candidate evaluation scorecard |
