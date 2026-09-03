import re
import json
import logging
import random
from typing import Dict, Any, List, Optional
from groq import Groq
from backend.config import settings

logger = logging.getLogger(__name__)

COMMON_SKILLS = [
    'React', 'Next.js', 'Node.js', 'TypeScript', 'JavaScript', 'Python', 'Java', 'C++', 'C#',
    'AWS', 'Docker', 'Kubernetes', 'SQL', 'PostgreSQL', 'MongoDB', 'GraphQL', 'Tailwind',
    'Machine Learning', 'AI', 'DevOps', 'Go', 'Rust', 'Product Management', 'Figma'
]

VALID_CONTINENTS = [
    'North America', 'South America', 'Europe', 'Asia', 'Africa', 'Australia / Oceania', 'Antarctica'
]

class GroqService:
    def __init__(self):
        self.api_key = settings.GROQ_API_KEY
        self.preferred_models = ['llama-3.3-70b-versatile', 'qwen/qwen3.6-27b', 'openai/gpt-oss-120b']
        self.client = Groq(api_key=self.api_key) if self.api_key else None

    def _create_completion(self, messages, temperature=0.2, json_mode=True):
        if not self.client:
            raise ValueError("Groq client not configured")
        
        last_err = None
        for model in self.preferred_models:
            try:
                kwargs = {
                    "model": model,
                    "messages": messages,
                    "temperature": temperature
                }
                if json_mode:
                    kwargs["response_format"] = {"type": "json_object"}
                return self.client.chat.completions.create(**kwargs)
            except Exception as e:
                last_err = e
                logger.warning(f"Groq model {model} attempt failed: {e}. Trying next fallback...")
                continue
        raise last_err or Exception("All Groq models failed")

    def fallback_heuristic_parser(self, text: str) -> Dict[str, Any]:
        """Heuristic fallback parser when Groq is unreachable or rate limited."""
        email_match = re.search(r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}', text)
        candidate_email = email_match.group(0) if email_match else ''

        lines = [line.strip() for line in text.split('\n') if line.strip()]
        candidate_name = ''
        for line in lines[:5]:
            if 2 < len(line) < 35 and '@' not in line and 'http' not in line and not re.search(r'\d', line):
                candidate_name = line
                break

        detected_skills = []
        for skill in COMMON_SKILLS:
            escaped = re.escape(skill)
            pattern = rf'(?:^|[^a-zA-Z0-9#+]){escaped}(?:$|[^a-zA-Z0-9#+])'
            if re.search(pattern, text, re.IGNORECASE):
                detected_skills.append(skill)

        lower = text.lower()
        candidate_type = 'Experienced'
        if any(w in lower for w in ['lead', 'manager', 'director', 'head of']):
            candidate_type = 'Managerial'
        elif any(w in lower for w in ['intern', 'student', 'graduate', 'fresher']):
            candidate_type = 'Fresher'

        continent = 'North America'
        if any(w in lower for w in ['india', 'singapore', 'japan', 'china', 'asia']):
            continent = 'Asia'
        elif any(w in lower for w in ['uk', 'germany', 'france', 'europe', 'london', 'berlin']):
            continent = 'Europe'
        elif any(w in lower for w in ['brazil', 'argentina', 'colombia']):
            continent = 'South America'
        elif any(w in lower for w in ['nigeria', 'kenya', 'south africa', 'egypt']):
            continent = 'Africa'
        elif any(w in lower for w in ['australia', 'sydney', 'melbourne', 'new zealand']):
            continent = 'Australia / Oceania'
        elif any(w in lower for w in ['antarctica', 'mcmurdo']):
            continent = 'Antarctica'

        job_title = f"Senior {' / '.join(detected_skills[:2])} Engineer" if detected_skills else "Full Stack Software Engineer"

        job_description = f"""Role Overview:
We are seeking an exceptional professional to join our fast-paced engineering team. The ideal candidate demonstrates strong capability in modern software architecture, robust engineering principles, and scalable system design.

Key Responsibilities:
- Design, build, and maintain efficient, reusable, and reliable systems.
- Collaborate with cross-functional teams to define, design, and ship new features.
- Ensure optimal performance, quality, and responsiveness of applications.
- Identify bottlenecks and devise solutions to technical problems.

Required Qualifications & Skills:
- Hands-on experience with: {', '.join(detected_skills) if detected_skills else 'modern software stacks and tools'}.
- Strong problem-solving, communication, and teamwork skills."""

        return {
            "candidateName": candidate_name or "Candidate",
            "candidateEmail": candidate_email,
            "suggestedJobTitle": job_title,
            "suggestedJobDescription": job_description,
            "candidateType": candidate_type,
            "interviewType": "Technical",
            "continent": continent,
            "keySkills": detected_skills,
            "experienceYears": 1 if candidate_type == 'Fresher' else 8 if candidate_type == 'Managerial' else 4,
            "summary": "Candidate profile extracted successfully from resume."
        }

    async def parse_resume(self, clean_text: str) -> Dict[str, Any]:
        """Parses resume text using Groq with heuristic fallback."""
        if not self.client:
            return self.fallback_heuristic_parser(clean_text)

        prompt = f"""You are an elite AI Recruiter and Resume Parser.
Analyze the following candidate resume text and extract key structured hiring details, plus generate a comprehensive, tailored Job Description matching this candidate's background.

Resume Text (first 4000 characters):
\"\"\"
{clean_text[:4000]}
\"\"\"

Respond ONLY with a valid JSON object matching the following structure:
{{
  "candidateName": "<Candidate's Full Name or null>",
  "candidateEmail": "<Candidate's Email or null>",
  "suggestedJobTitle": "<Ideal Job Title for this candidate e.g. Senior Full-Stack Engineer, Lead Product Designer, Data Scientist>",
  "suggestedJobDescription": "<A well-formatted 3-4 paragraph professional job description with Role Overview, Key Responsibilities, and Technical Requirements customized to this candidate's profile>",
  "candidateType": "<Fresher | Experienced | Managerial>",
  "interviewType": "<Technical | Behavioral | Problem Solving | Leadership | Experience-based>",
  "continent": "<North America | South America | Europe | Asia | Africa | Australia / Oceania | Antarctica>",
  "keySkills": ["Skill 1", "Skill 2", "Skill 3", "Skill 4", "Skill 5"],
  "experienceYears": 4,
  "summary": "<2-sentence executive summary of the candidate's core strength and background>"
}}"""

        try:
            completion = self._create_completion(
                messages=[{"role": "user", "content": prompt}],
                temperature=0.2,
                json_mode=True
            )
            raw = completion.choices[0].message.content or "{}"
            parsed = json.loads(raw)
            continent = parsed.get("continent", "North America")
            if continent not in VALID_CONTINENTS:
                continent = "North America"

            return {
                "candidateName": parsed.get("candidateName") or "Candidate",
                "candidateEmail": parsed.get("candidateEmail") or "",
                "suggestedJobTitle": parsed.get("suggestedJobTitle") or "Software Engineer",
                "suggestedJobDescription": parsed.get("suggestedJobDescription") or "",
                "candidateType": parsed.get("candidateType") if parsed.get("candidateType") in ["Fresher", "Experienced", "Managerial"] else "Experienced",
                "interviewType": parsed.get("interviewType") if parsed.get("interviewType") in ["Technical", "Behavioral", "Problem Solving", "Leadership", "Experience-based"] else "Technical",
                "continent": continent,
                "keySkills": parsed.get("keySkills", []) if isinstance(parsed.get("keySkills"), list) else [],
                "experienceYears": int(parsed.get("experienceYears", 3)) if str(parsed.get("experienceYears", "")).isdigit() else 3,
                "summary": parsed.get("summary") or "Resume analyzed successfully."
            }
        except Exception as e:
            logger.error(f"Groq parse_resume failed, falling back to heuristic: {e}")
            return self.fallback_heuristic_parser(clean_text)

    async def evaluate_answer(self, question: str, answer: str, job_title: str) -> Dict[str, Any]:
        """Evaluates a candidate answer strictly between 1 and 10 with brief feedback."""
        if not answer or not answer.strip():
            return {
                "score": 1,
                "brief_feedback": "No answer was provided or captured."
            }

        if not self.client:
            return {
                "score": 5,
                "brief_feedback": "Answer recorded successfully (AI evaluation fallback)."
            }

        prompt = f"""You are a professional technical interviewer. Evaluate the candidate's answer to the given question for a {job_title} role.
Score the answer strictly between 1 and 10, where:
- 1-3: Poor, incorrect, or extremely shallow response.
- 4-6: Average, contains some correct details but misses important context, or has key gaps.
- 7-8: Good, covers the key points accurately and clearly.
- 9-10: Excellent, provides thorough, expert-level detail with outstanding explanation.

Provide brief constructive feedback (maximum 2 sentences).

Question: "{question}"
Candidate Answer: "{answer}"

Return ONLY a valid JSON object matching the requested schema. Do not include markdown code block backticks, no preamble, and no explanation.

JSON Schema:
{{
  "score": 8,
  "brief_feedback": "<brief feedback string>"
}}"""

        try:
            completion = self._create_completion(
                messages=[{"role": "user", "content": prompt}],
                temperature=0.1,
                json_mode=True
            )
            raw = completion.choices[0].message.content or "{}"
            result = json.loads(raw)
            score = int(result.get("score", 5))
            score = max(1, min(10, score))
            return {
                "score": score,
                "brief_feedback": result.get("brief_feedback", "Answer evaluated.")
            }
        except Exception as e:
            logger.error(f"Groq evaluate_answer error: {e}")
            return {
                "score": 5,
                "brief_feedback": "Failed to evaluate answer. Default score applied."
            }

    async def detect_scripted(self, job_description: str, question: str, answer: str, response_delay: float, answer_duration: float) -> Dict[str, Any]:
        """Detects if candidate is reciting a pre-scripted LLM answer."""
        if not self.client or not answer or len(answer.strip()) < 10:
            return {
                "Scripted_Risk_Level": "Low",
                "Suspicion_Flags": [],
                "Confidence_Score": 0.1
            }

        prompt = f"""Analyze this candidate interview response for signs of being pre-scripted, read directly from an LLM prompt, or artificially generated rather than spoken naturally.

Question: {question}
Answer: {answer}
Delay before speaking: {response_delay} seconds
Duration of response: {answer_duration} seconds

Respond ONLY with JSON:
{{
  "Scripted_Risk_Level": "<Low | Medium | High>",
  "Suspicion_Flags": ["<flag 1 if any>", "<flag 2 if any>"],
  "Confidence_Score": <0.0 to 1.0>
}}"""

        try:
            completion = self._create_completion(
                messages=[{"role": "user", "content": prompt}],
                temperature=0.1,
                json_mode=True
            )
            raw = completion.choices[0].message.content or "{}"
            return json.loads(raw)
        except Exception as e:
            logger.error(f"Groq detect_scripted error: {e}")
            return {
                "Scripted_Risk_Level": "Low",
                "Suspicion_Flags": [],
                "Confidence_Score": 0.0
            }

    async def generate_questions(self, job_title: str, job_description: str, interview_type: str, candidate_type: str, duration: int, resume_text: Optional[str] = None) -> List[str]:
        """Generates tailored interview questions based on duration, candidate level, and resume."""
        min_q = max(3, int(duration * 1.5))
        max_q = max(min_q + 1, int(duration * 2.5))
        q_count = random.randint(min_q, max_q)

        focus = "coding problems, algorithmic challenges, and data structure implementation" if interview_type.lower() == "technical" else "relevant domain skills and practical problem solving"

        prompt = f"""Generate exactly {q_count} interview questions for a {candidate_type} {job_title} position.

Job Description: {job_description}
Interview Type: {interview_type}
Candidate Level: {candidate_type}
Focus Area: {focus}
{f'Candidate Resume Snippet:\n{resume_text[:2500]}' if resume_text else ''}

Respond ONLY with a valid JSON object:
{{
  "questions": ["Question 1...", "Question 2...", ...]
}}"""

        try:
            completion = self._create_completion(
                messages=[{"role": "user", "content": prompt}],
                temperature=0.7,
                json_mode=True
            )
            raw = completion.choices[0].message.content or "{}"
            data = json.loads(raw)
            return data.get("questions", [])
        except Exception as e:
            logger.error(f"Error generating questions: {e}")
            return [
                f"Can you walk me through your technical background and key achievements as a {job_title}?",
                "Describe a complex system design or engineering challenge you encountered and how you resolved it.",
                "How do you ensure code quality, test coverage, and reliability in a high-velocity production environment?",
                "Tell me about a time you had to make an architectural trade-off between performance and delivery speed."
            ]

groq_service = GroqService()
