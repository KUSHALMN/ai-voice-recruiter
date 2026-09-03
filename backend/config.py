import os
from pathlib import Path
from dotenv import load_dotenv

# Load .env.local first (common in Next.js), then fallback to .env
current_dir = Path(__file__).resolve().parent
root_dir = current_dir.parent

env_local = root_dir / ".env.local"
if env_local.exists():
    load_dotenv(dotenv_path=env_local)
else:
    load_dotenv()

class Settings:
    GROQ_API_KEY: str = os.getenv("GROQ_API_KEY", "")
    GROQ_MODEL: str = "llama-3.3-70b-versatile"
    
    NEXT_PUBLIC_SUPABASE_URL: str = os.getenv("NEXT_PUBLIC_SUPABASE_URL", "")
    NEXT_PUBLIC_SUPABASE_ANON_KEY: str = os.getenv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "")
    SUPABASE_SERVICE_ROLE_KEY: str = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")
    
    JWT_SECRET: str = os.getenv("JWT_SECRET", os.getenv("NEXTAUTH_SECRET", "default-jwt-secret-key-recruiter-ai"))
    PORT: int = int(os.getenv("FASTAPI_PORT", "8000"))
    HOST: str = os.getenv("FASTAPI_HOST", "127.0.0.1")

settings = Settings()
