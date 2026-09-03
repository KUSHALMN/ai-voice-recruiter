from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class ResumeParseResponse(BaseModel):
    text: str
    candidateName: str = "Candidate"
    candidateEmail: str = ""
    suggestedJobTitle: str = "Software Engineer"
    suggestedJobDescription: str = ""
    candidateType: str = "Experienced"
    interviewType: str = "Technical"
    continent: str = "North America"
    keySkills: List[str] = Field(default_factory=list)
    experienceYears: int = 3
    summary: str = "Candidate profile extracted successfully from resume."

class CreateInterviewRequest(BaseModel):
    id: Optional[str] = None
    candidate_name: str
    candidate_email: str
    job_title: str
    job_description: Optional[str] = ""
    interview_type: str = "Technical"
    candidate_type: Optional[str] = "mid"
    duration: int = 30
    status: Optional[str] = "scheduled"
    interview_link: Optional[str] = ""
    recruiter_email: Optional[str] = None
    resume_text: Optional[str] = None
    enable_probing: Optional[bool] = False
    enable_strict_proctoring: Optional[bool] = False

class EvaluateAnswerRequest(BaseModel):
    question: str
    answer: str
    jobTitle: Optional[str] = ""
    interviewType: Optional[str] = "Behavioral"
    asrConfidence: Optional[float] = 1.0

class EvaluateAnswerResponse(BaseModel):
    score: int
    brief_feedback: str

class DetectScriptedRequest(BaseModel):
    jobDescription: Optional[str] = ""
    question: Optional[str] = ""
    answer: Optional[str] = ""
    responseDelay: Optional[float] = 0.0
    answerDuration: Optional[float] = 0.0

class DetectScriptedResponse(BaseModel):
    Scripted_Risk_Level: str = "Low"
    Suspicion_Flags: List[str] = Field(default_factory=list)
    Confidence_Score: float = 0.0

class SessionAnswerRequest(BaseModel):
    questionId: str
    answer: str
    questionIndex: int = 0

class GenerateQuestionsRequest(BaseModel):
    jobTitle: str
    jobDescription: str
    interviewType: Optional[str] = "Technical"
    candidateType: Optional[str] = "Experienced"
    duration: Optional[int] = 30
    resumeText: Optional[str] = None

class GenerateJobDescriptionRequest(BaseModel):
    title: str
    department: Optional[str] = "Engineering"
    experience: Optional[str] = "Mid-Senior"
    skills: Optional[List[str]] = Field(default_factory=list)

class SaveInterviewRequest(BaseModel):
    interviewId: str
    questions: Optional[List[str]] = Field(default_factory=list)
    answers: Optional[List[str]] = Field(default_factory=list)
    report: Optional[Dict[str, Any]] = None
    finalScores: Optional[Any] = None
    fullTranscript: Optional[str] = ""
