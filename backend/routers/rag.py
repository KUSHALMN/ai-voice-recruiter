import logging
from typing import List, Optional
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from backend.services.embedding_service import (
    get_embedding,
    compute_cosine_similarity,
    EMBEDDING_DIMENSION,
)

logger = logging.getLogger("RAGRouter")
router = APIRouter(prefix="/api/rag", tags=["Enterprise RAG"])

class EmbedRequest(BaseModel):
    text: str = Field(..., min_length=1, description="Text string to embed")

class EmbedResponse(BaseModel):
    dimension: int
    embedding: List[float]

class SimilarityRequest(BaseModel):
    vector_a: List[float]
    vector_b: List[float]

class SimilarityResponse(BaseModel):
    cosine_similarity: float

class StatusResponse(BaseModel):
    status: str
    dimension: int
    service: str

@router.get("/status", response_model=StatusResponse)
async def rag_status():
    return {
        "status": "operational",
        "dimension": EMBEDDING_DIMENSION,
        "service": "AIRA Python RAG Engine"
    }

@router.post("/embed", response_model=EmbedResponse)
async def embed_text(req: EmbedRequest):
    try:
        vec = await get_embedding(req.text)
        return {
            "dimension": len(vec),
            "embedding": vec
        }
    except Exception as e:
        logger.error(f"Embedding error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/similarity", response_model=SimilarityResponse)
async def compare_similarity(req: SimilarityRequest):
    if len(req.vector_a) != len(req.vector_b):
        raise HTTPException(status_code=400, detail="Vector dimensions must match.")
    sim = compute_cosine_similarity(req.vector_a, req.vector_b)
    return {"cosine_similarity": round(sim, 4)}
