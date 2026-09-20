import sys
import os

# Add project root to sys.path so backend module can be imported
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

import uvicorn
from backend.config import settings

# Ensure UTF-8 output encoding for Windows terminals
if hasattr(sys.stdout, 'reconfigure'):
    try:
        sys.stdout.reconfigure(encoding='utf-8', errors='replace')
    except Exception:
        pass

if __name__ == "__main__":
    print(f"[Backend] Starting AIRA Python FastAPI Server on http://{settings.HOST}:{settings.PORT}")
    print(f"[Backend] Interactive Swagger UI: http://{settings.HOST}:{settings.PORT}/docs")
    uvicorn.run("backend.main:app", host=settings.HOST, port=settings.PORT, reload=True)
