import logging
from fastapi import APIRouter, HTTPException
from backend.schemas import (
    EvaluateAnswerRequest, EvaluateAnswerResponse,
    DetectScriptedRequest, DetectScriptedResponse,
    GenerateQuestionsRequest, GenerateJobDescriptionRequest
)
from backend.services.groq_service import groq_service

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api", tags=["Evaluation & AI"])

@router.post("/evaluate-answer", response_model=EvaluateAnswerResponse)
async def evaluate_answer_route(request: EvaluateAnswerRequest):
    try:
        result = await groq_service.evaluate_answer(
            question=request.question,
            answer=request.answer,
            job_title=request.jobTitle or "Software Engineer"
        )
        return result
    except Exception as e:
        logger.error(f"Error in evaluate-answer: {e}")
        return {
            "score": 5,
            "brief_feedback": "Answer recorded. Standard score applied."
        }

@router.post("/detect-scripted", response_model=DetectScriptedResponse)
async def detect_scripted_route(request: DetectScriptedRequest):
    try:
        result = await groq_service.detect_scripted(
            job_description=request.jobDescription or "",
            question=request.question or "",
            answer=request.answer or "",
            response_delay=request.responseDelay or 0.0,
            answer_duration=request.answerDuration or 0.0
        )
        return result
    except Exception as e:
        logger.error(f"Error in detect-scripted: {e}")
        return {
            "Scripted_Risk_Level": "Low",
            "Suspicion_Flags": [],
            "Confidence_Score": 0.0
        }

@router.post("/generate-questions")
async def generate_questions_route(request: GenerateQuestionsRequest):
    try:
        questions = await groq_service.generate_questions(
            job_title=request.jobTitle,
            job_description=request.jobDescription,
            interview_type=request.interviewType or "Technical",
            candidate_type=request.candidateType or "Experienced",
            duration=request.duration or 30,
            resume_text=request.resumeText
        )
        return {"questions": questions}
    except Exception as e:
        logger.error(f"Error generating questions: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/generate-job-description")
async def generate_job_description_route(request: GenerateJobDescriptionRequest):
    try:
        skills_str = ", ".join(request.skills) if request.skills else "modern technologies"
        jd = f"""Role Overview:
We are seeking an experienced {request.title} to join our {request.department} team. The ideal candidate will be responsible for designing and deploying high-impact software solutions.

Key Responsibilities:
- Architect and develop scalable systems using {skills_str}.
- Collaborate with engineering and product leaders to ship high-quality features.
- Participate in code reviews and advocate for engineering best practices.

Requirements:
- Proven professional experience ({request.experience}) in relevant domains.
- Demonstrated hands-on expertise with {skills_str}.
- Strong communication, analytical, and teamwork capabilities."""
        return {"jobDescription": jd}
    except Exception as e:
        logger.error(f"Error generating JD: {e}")
        raise HTTPException(status_code=500, detail=str(e))
