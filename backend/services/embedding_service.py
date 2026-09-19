import math
import os
import re
import logging
from typing import List

logger = logging.getLogger("EmbeddingService")

EMBEDDING_DIMENSION = 768

def generate_local_deterministic_embedding(text: str, dimensions: int = EMBEDDING_DIMENSION) -> List[float]:
    """
    Deterministic semantic projection generating normalized 768-dim float vector.
    Matches TypeScript lib/rag/embeddings.ts algorithm for cross-runtime compatibility.
    """
    vector = [0.0] * dimensions
    normalized = re.sub(r'[\r\n\t]+', ' ', text.lower().strip())
    words = [w for w in normalized.split(' ') if w]

    ngrams = []
    for i, word in enumerate(words):
        ngrams.append(word)
        if len(word) >= 3:
            for j in range(len(word) - 2):
                ngrams.append(word[j:j+3])
        if i < len(words) - 1:
            ngrams.append(f"{word}_{words[i+1]}")

    for feature in ngrams:
        hash1 = 5381
        hash2 = 0x811c9dc5
        for ch in feature:
            code = ord(ch)
            hash1 = (((hash1 << 5) + hash1) ^ code) & 0xFFFFFFFF
            hash2 = ((hash2 ^ code) * 0x01000193) & 0xFFFFFFFF

        idx = abs(hash1) % dimensions
        sign = 1.0 if (hash2 & 1) == 0 else -1.0
        weight = 1.5 if len(feature) > 3 else 1.0
        vector[idx] += sign * weight

    # L2 normalize
    norm = math.sqrt(sum(v * v for v in vector))
    if norm > 0:
        vector = [v / norm for v in vector]

    return vector

async def get_embedding(text: str) -> List[float]:
    """
    Generate 768-dimensional embedding vector for input text.
    Uses Gemini API if configured, otherwise deterministic projection fallback.
    """
    if not text or not text.strip():
        return [0.0] * EMBEDDING_DIMENSION

    clean_text = text.strip()[:8000]
    gemini_key = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")

    if gemini_key:
        try:
            import httpx
            async with httpx.AsyncClient(timeout=10.0) as client:
                url = f"https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent?key={gemini_key}"
                resp = await client.post(
                    url,
                    json={
                        "model": "models/text-embedding-004",
                        "content": {"parts": [{"text": clean_text}]}
                    }
                )
                if resp.status_code == 200:
                    data = resp.json()
                    values = data.get("embedding", {}).get("values", [])
                    if len(values) == EMBEDDING_DIMENSION:
                        return values
        except Exception as e:
            logger.warning(f"Gemini API embedding call failed: {e}. Falling back to local embedding.")

    return generate_local_deterministic_embedding(clean_text, EMBEDDING_DIMENSION)

def compute_cosine_similarity(vec_a: List[float], vec_b: List[float]) -> float:
    if len(vec_a) != len(vec_b) or not vec_a:
        return 0.0
    dot = sum(a * b for a, b in zip(vec_a, vec_b))
    norm_a = math.sqrt(sum(a * a for a in vec_a))
    norm_b = math.sqrt(sum(b * b for b in vec_b))
    if norm_a == 0 or norm_b == 0:
        return 0.0
    return max(-1.0, min(1.0, dot / (norm_a * norm_b)))
