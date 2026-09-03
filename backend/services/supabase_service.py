import logging
from typing import Optional
from supabase import create_client, Client
from backend.config import settings

logger = logging.getLogger(__name__)

_supabase_client: Optional[Client] = None

def get_supabase_client() -> Client:
    global _supabase_client
    if _supabase_client is not None:
        return _supabase_client

    url = settings.NEXT_PUBLIC_SUPABASE_URL
    key = settings.SUPABASE_SERVICE_ROLE_KEY or settings.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if not url or not key:
        logger.warning("Supabase credentials missing from environment.")

    _supabase_client = create_client(url, key)
    return _supabase_client
