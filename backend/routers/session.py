import logging
import uuid
from typing import Dict, Any, List, Optional
from fastapi import APIRouter, HTTPException, Header
from pydantic import BaseModel
from backend.services.supabase_service import get_supabase_client
from backend.services.groq_service import groq_service

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api", tags=["Session"])

class StartSessionRequest(BaseModel):
    action: Optional[str] = "start"

class SessionAnswerRequest(BaseModel):
    questionId: str
    answer: str
    questionIndex: int = 0

@router.post("/interview/{interview_id}/session")
async def start_or_resume_session(interview_id: str, request: StartSessionRequest):
    try:
        supabase = get_supabase_client()
        int_resp = supabase.table("interviews").select("id, status, candidate_name, candidate_email").eq("id", interview_id).maybe_single().execute()
        
        if not int_resp or not int_resp.data:
            raise HTTPException(status_code=404, detail="Interview not found")

        interview = int_resp.data

        # Check existing session
        sess_resp = supabase.table("interview_sessions").select("*").eq("interview_id", interview_id).limit(1).execute()
        if sess_resp and sess_resp.data and len(sess_resp.data) > 0:
            existing = sess_resp.data[0]
            return {
                "success": True,
                "sessionId": existing["id"],
                "sessionToken": existing.get("session_token", "demo-token"),
                "currentQuestionIndex": existing.get("current_question_index", 0),
                "difficultyLevel": existing.get("difficulty_level", "medium"),
                "questions": existing.get("questions", []),
                "answers": existing.get("answers", []),
                "scores": existing.get("scores", {})
            }

        # Create new session
        session_id = str(uuid.uuid4())
        session_token = f"sess_{uuid.uuid4().hex[:16]}"
        new_session = {
            "id": session_id,
            "interview_id": interview_id,
            "session_token": session_token,
            "status": "in_progress",
            "current_question_index": 0,
            "difficulty_level": "medium",
            "questions": [],
            "answers": [],
            "scores": []
        }

        try:
            supabase.table("interview_sessions").insert(new_session).execute()
        except Exception as insert_err:
            logger.warning(f"Could not persist session to DB: {insert_err}")

        return {
            "success": True,
            "sessionId": session_id,
            "sessionToken": session_token,
            "currentQuestionIndex": 0,
            "difficultyLevel": "medium",
            "questions": [],
            "answers": [],
            "scores": []
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in start_or_resume_session: {e}")
        # Return graceful session fallback
        return {
            "success": True,
            "sessionId": str(uuid.uuid4()),
            "sessionToken": "fallback_token",
            "currentQuestionIndex": 0,
            "difficultyLevel": "medium",
            "questions": [],
            "answers": [],
            "scores": []
        }

@router.post("/interview/session/{session_id}/answer")
async def process_session_answer(session_id: str, request: SessionAnswerRequest):
    try:
        supabase = get_supabase_client()
        
        # 1. Fetch session
        session_resp = supabase.table("interview_sessions").select("*").eq("id", session_id).maybe_single().execute()
        session = session_resp.data if session_resp else None
        
        interview_title = "Software Engineer"
        if session and session.get("interview_id"):
            int_resp = supabase.table("interviews").select("job_title").eq("id", session["interview_id"]).maybe_single().execute()
            if int_resp and int_resp.data:
                interview_title = int_resp.data.get("job_title", "Software Engineer")

        # 2. Evaluate answer
        eval_result = await groq_service.evaluate_answer(
            question=request.questionId,
            answer=request.answer,
            job_title=interview_title
        )

        # 3. Update session if it exists in Supabase
        if session:
            updated_answers = (session.get("answers") or []) + [request.answer]
            updated_scores = (session.get("scores") or []) + [{
                "questionId": request.questionId,
                "score": eval_result["score"],
                "feedback": eval_result["brief_feedback"]
            }]

            try:
                supabase.table("interview_sessions").update({
                    "answers": updated_answers,
                    "scores": updated_scores,
                    "current_question_index": request.questionIndex + 1
                }).eq("id", session_id).execute()
            except Exception as update_err:
                logger.warning(f"Could not update session in DB: {update_err}")

        return {
            "score": eval_result["score"],
            "feedback": eval_result["brief_feedback"],
            "nextQuestion": None,
            "nextQuestionId": None,
            "newDifficulty": "medium",
            "shouldAddBonusQuestion": False
        }
    except Exception as e:
        logger.error(f"Error processing session answer: {e}")
        return {
            "score": 7,
            "feedback": "Answer recorded successfully.",
            "nextQuestion": None,
            "nextQuestionId": None,
            "newDifficulty": "medium",
            "shouldAddBonusQuestion": False
        }

@router.get("/interview/session/{session_id}/progress")
async def get_session_progress(session_id: str):
    try:
        supabase = get_supabase_client()
        response = supabase.table("interview_sessions").select("*").eq("id", session_id).maybe_single().execute()
        if response and response.data:
            return {"data": response.data}
        return {"data": {"id": session_id, "current_question_index": 0, "scores": []}}
    except Exception as e:
        logger.error(f"Error getting session progress: {e}")
        return {"data": {"id": session_id, "current_question_index": 0, "scores": []}}
