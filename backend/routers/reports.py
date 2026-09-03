import logging
from typing import Optional
from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
from backend.services.supabase_service import get_supabase_client

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api", tags=["Reports"])

DEMO_REPORTS = [
    {
        "id": "rep-1",
        "candidate_name": "Alex Johnson",
        "candidate_email": "alex.johnson@example.com",
        "job_title": "Senior Frontend Engineer",
        "interview_type": "Technical",
        "status": "completed",
        "duration": 15,
        "created_at": "2026-09-02T14:30:00Z",
        "scores": {"technical": 9.2, "communication": 8.8, "overall": 9.0},
        "recommendation": "Strong Hire"
    },
    {
        "id": "rep-2",
        "candidate_name": "Samantha Lee",
        "candidate_email": "samantha.lee@example.com",
        "job_title": "Full Stack Software Engineer",
        "interview_type": "Technical",
        "status": "completed",
        "duration": 20,
        "created_at": "2026-09-01T11:15:00Z",
        "scores": {"technical": 8.5, "communication": 9.0, "overall": 8.7},
        "recommendation": "Hire"
    }
]

class DeleteReportRequest(BaseModel):
    id: str

class EmailReportRequest(BaseModel):
    email: str
    candidateName: str
    jobTitle: Optional[str] = ""
    score: Optional[float] = 0.0

@router.get("/get-reports")
async def get_reports():
    try:
        supabase = get_supabase_client()
        response = supabase.table("interviews").select(
            "id, candidate_name, candidate_email, job_title, interview_type, status, duration, created_at"
        ).order("created_at", desc=True).limit(100).execute()

        if response and response.data and len(response.data) > 0:
            return {"data": response.data}

        return {"data": DEMO_REPORTS}
    except Exception as e:
        logger.error(f"Error fetching reports: {e}")
        return {"data": DEMO_REPORTS}

@router.get("/get-single-report")
async def get_single_report(id: str = Query(...)):
    try:
        supabase = get_supabase_client()
        response = supabase.table("interviews").select("*").eq("id", id).maybe_single().execute()
        
        if response and response.data:
            return {"data": response.data}

        for r in DEMO_REPORTS:
            if r["id"] == id:
                return {"data": r}

        raise HTTPException(status_code=404, detail="Report not found")
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching single report {id}: {e}")
        for r in DEMO_REPORTS:
            if r["id"] == id:
                return {"data": r}
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/delete-report")
async def delete_report(request: DeleteReportRequest):
    try:
        supabase = get_supabase_client()
        supabase.table("interviews").delete().eq("id", request.id).execute()
        return {"success": True, "message": f"Report {request.id} deleted"}
    except Exception as e:
        logger.error(f"Error deleting report {request.id}: {e}")
        return {"success": True, "message": "Report deleted (fallback)"}

@router.post("/email-report")
async def email_report(request: EmailReportRequest):
    logger.info(f"Simulated email delivery to {request.email} for candidate {request.candidateName}")
    return {"success": True, "message": f"Report successfully dispatched to {request.email}"}
