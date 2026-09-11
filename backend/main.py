import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.config import settings
from backend.routers import resume, interview, session, evaluation, reports

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("AIRecruiterBackend")

app = FastAPI(
    title="AIRA — AI Voice Recruiter Backend",
    description="High-performance Python FastAPI backend powering autonomous resume extraction, adaptive voice interviews, and candidate evaluations across 7 continents.",
    version="2.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS configuration allowing requests from Next.js frontend securely
allowed_origins_env = settings.CORS_ALLOWED_ORIGINS if hasattr(settings, 'CORS_ALLOWED_ORIGINS') and settings.CORS_ALLOWED_ORIGINS else ""
default_origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3001",
]
custom_origins = [o.strip() for o in allowed_origins_env.split(",") if o.strip()]
cors_origins = list(set(default_origins + custom_origins))

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# Register routers
app.include_router(resume.router)
app.include_router(interview.router)
app.include_router(session.router)
app.include_router(evaluation.router)
app.include_router(reports.router)

@app.get("/")
async def root():
    return {
        "status": "online",
        "service": "AIRA Python FastAPI Backend",
        "version": "2.0.0",
        "docs": "/docs"
    }

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "groq_configured": bool(settings.GROQ_API_KEY),
        "supabase_configured": bool(settings.NEXT_PUBLIC_SUPABASE_URL)
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host=settings.HOST, port=settings.PORT, reload=True)
