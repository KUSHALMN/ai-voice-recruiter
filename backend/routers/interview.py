import logging
import uuid
from typing import Optional
from fastapi import APIRouter, HTTPException, Query
from backend.schemas import CreateInterviewRequest, SaveInterviewRequest
from backend.services.supabase_service import get_supabase_client

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api", tags=["Interview"])

DEMO_INTERVIEWS = {
    "demo-1": {
        "id": "demo-1",
        "candidate_name": "Alex Johnson",
        "candidate_email": "alex.johnson@example.com",
        "job_title": "Senior Frontend Engineer",
        "job_description": "We are seeking a talented Senior Frontend Engineer experienced in React, Next.js, and TypeScript.",
        "interview_type": "Technical",
        "candidate_type": "Experienced",
        "status": "completed",
        "duration": 15,
        "enable_probing": True,
        "enable_strict_proctoring": True
    },
    "demo-2": {
        "id": "demo-2",
        "candidate_name": "Samantha Lee",
        "candidate_email": "samantha.lee@example.com",
        "job_title": "Full Stack Software Engineer",
        "job_description": "Full stack engineer proficient in Node.js, Python, PostgreSQL, and cloud deployments.",
        "interview_type": "Technical",
        "candidate_type": "mid",
        "status": "completed",
        "duration": 20,
        "enable_probing": True,
        "enable_strict_proctoring": True
    }
}

@router.post("/create-interview")
async def create_interview(request: CreateInterviewRequest):
    try:
        supabase = get_supabase_client()
        interview_id = request.id or str(uuid.uuid4())

        # Exact DB columns matching Supabase schema
        interview_data = {
            "id": interview_id,
            "candidate_name": request.candidate_name,
            "candidate_email": request.candidate_email,
            "job_title": request.job_title,
            "job_description": request.job_description or "",
            "interview_type": request.interview_type,
            "candidate_type": request.candidate_type or "mid",
            "duration": request.duration,
            "status": request.status or "scheduled",
            "interview_link": request.interview_link or "",
        }

        if request.recruiter_email:
            interview_data["recruiter_email"] = request.recruiter_email

        response = supabase.table("interviews").insert(interview_data).execute()
        return {"data": response.data}
    except Exception as e:
        logger.error(f"Error creating interview: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/interview/{interview_id}")
async def get_interview(interview_id: str):
    try:
        supabase = get_supabase_client()
        response = supabase.table("interviews").select("*").eq("id", interview_id).maybe_single().execute()
        
        if response and response.data:
            data = response.data
            return {
                "data": {
                    **data,
                    "enable_probing": data.get("enable_probing", True),
                    "enable_strict_proctoring": data.get("enable_strict_proctoring", True)
                }
            }

        # Fallback to demo interviews
        if interview_id in DEMO_INTERVIEWS:
            return {"data": DEMO_INTERVIEWS[interview_id]}

        raise HTTPException(status_code=404, detail="Interview not found")
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching interview {interview_id}: {e}")
        # Return demo fallback if available
        if interview_id in DEMO_INTERVIEWS:
            return {"data": DEMO_INTERVIEWS[interview_id]}
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/get-interviews")
async def get_interviews(recruiter_email: Optional[str] = Query(None)):
    try:
        supabase = get_supabase_client()
        query = supabase.table("interviews").select("*").order("created_at", desc=True).limit(50)
        
        if recruiter_email:
            query = query.eq("recruiter_email", recruiter_email)

        response = query.execute()
        return {"data": response.data or []}
    except Exception as e:
        logger.error(f"Error fetching interviews: {e}")
        return {"data": list(DEMO_INTERVIEWS.values())}

@router.post("/save-interview")
async def save_interview(request: SaveInterviewRequest):
    try:
        supabase = get_supabase_client()
        # Save completion to interview_sessions or interviews
        update_data = {
            "status": "completed"
        }
        supabase.table("interviews").update(update_data).eq("id", request.interviewId).execute()
        return {"success": True, "message": "Interview saved successfully"}
    except Exception as e:
        logger.error(f"Error saving interview: {e}")
        raise HTTPException(status_code=500, detail=str(e))
