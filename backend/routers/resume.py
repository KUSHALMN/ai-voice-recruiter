import io
import re
import logging
from fastapi import APIRouter, File, UploadFile, HTTPException
from pypdf import PdfReader
from backend.services.groq_service import groq_service

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api", tags=["Resume"])

@router.post("/parse-resume")
async def parse_resume(file: UploadFile = File(...)):
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="File must be a PDF")

    try:
        content = await file.read()
        pdf_file = io.BytesIO(content)
        
        clean_text = ""
        try:
            reader = PdfReader(pdf_file)
            for page in reader.pages:
                t = page.extract_text()
                if t:
                    clean_text += t + "\n"
            clean_text = re.sub(r'\n{3,}', '\n\n', clean_text).strip()
        except Exception as read_err:
            logger.warning(f"pypdf extraction error: {read_err}")
            # Fallback raw byte string extraction
            raw_str = content[:50000].decode("utf-8", errors="ignore")
            clean_text = re.sub(r'[^\x20-\x7E\n]', ' ', raw_str).strip()

        if not clean_text or len(clean_text) < 10:
            raise HTTPException(
                status_code=400,
                detail="Could not extract text from this PDF. Please ensure it is not password protected or image-only."
            )

        result = await groq_service.parse_resume(clean_text)
        return {
            "text": clean_text,
            **result
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to parse resume: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to parse resume: {str(e)}")
