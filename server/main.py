import os
import re
from datetime import datetime, timezone
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from bs4 import BeautifulSoup
from dotenv import load_dotenv

import canvas_api

# LangChain imports
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import PromptTemplate

load_dotenv()

app = FastAPI()

# Enable CORS for the frontend (Vite dev server usually runs on 5173)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Gemini LLM
gemini_api_key = os.getenv("GEMINI_API_KEY")
if not gemini_api_key:
    print("Warning: GEMINI_API_KEY not found in .env. AI features will fail.")

llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash",
    google_api_key=gemini_api_key,
    temperature=0.2
)

def clean_html(html_content: str) -> str:
    if not html_content:
        return ""
    soup = BeautifulSoup(html_content, "html.parser")
    return soup.get_text(separator="\n").strip()

def _clean_course_code(raw_code: str) -> str:
    """Turn '202630_MATH4A_31264' into 'MATH 4A' or return as-is for non-standard codes."""
    m = re.match(r"^\d+_([A-Z]+)(\d+\w*)_\d+$", raw_code or "")
    if m:
        dept, num = m.group(1), m.group(2)
        return f"{dept} {num}"
    return raw_code or ""


def _next_assignment(course_id):
    """Get the next upcoming assignment for a course."""
    try:
        assignments = canvas_api.fetch_assignments(course_id)
        now = datetime.now(timezone.utc)
        upcoming = []
        for a in assignments:
            due = a.get("due_at")
            if due:
                try:
                    dt = datetime.fromisoformat(due.replace("Z", "+00:00"))
                    if dt > now:
                        upcoming.append((dt, a))
                except ValueError:
                    pass
        if upcoming:
            upcoming.sort(key=lambda x: x[0])
            dt, a = upcoming[0]
            return {"name": a.get("name", ""), "due_at": a.get("due_at"), "points": a.get("points_possible")}
    except Exception:
        pass
    return None


@app.get("/api/courses")
def get_courses():
    try:
        courses = canvas_api.fetch_courses_rich()
        results = []
        for c in courses:
            if "id" not in c:
                continue
            # Extract grade from enrollments
            enrollments = c.get("enrollments", [])
            grade = None
            if enrollments:
                grade = enrollments[0].get("computed_current_score")
                if grade is None:
                    grades_obj = enrollments[0].get("grades", {})
                    if grades_obj:
                        grade = grades_obj.get("current_score")
            
            code = _clean_course_code(c.get("course_code", ""))
            term = c.get("term", {})
            term_name = term.get("name", "") if term else ""

            # Get next upcoming assignment
            next_asgn = _next_assignment(c["id"])

            results.append({
                "id": c["id"],
                "name": c.get("name", "Unnamed Course"),
                "code": code,
                "grade": grade,
                "term": term_name,
                "next_assignment": next_asgn,
            })
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/announcements")
def get_announcements():
    try:
        courses = canvas_api.fetch_courses()
        course_ids = [c["id"] for c in courses if "id" in c]
        if not course_ids:
            return []
        
        raw_announcements = canvas_api.fetch_announcements(course_ids)
        formatted = []
        for a in raw_announcements:
            formatted.append({
                "id": a["id"],
                "course": a.get("context_code", ""),
                "title": a.get("title", ""),
                "date": a.get("posted_at", ""),
                "content": clean_html(a.get("message", ""))
            })
        return formatted
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

class SummarizeRequest(BaseModel):
    content: str

@app.post("/api/announcements/summarize")
def summarize_announcement(req: SummarizeRequest):
    if not llm:
        raise HTTPException(status_code=500, detail="Gemini LLM not initialized")
    
    prompt = PromptTemplate.from_template(
        "Summarize the following class announcement into 2-3 concise bullet points. "
        "Ignore greetings and sign-offs. Output ONLY the bullet points, starting each with a hyphen.\n\n"
        "Announcement:\n{content}"
    )
    
    chain = prompt | llm
    
    try:
        response = chain.invoke({"content": req.content})
        points = [line.lstrip('-').strip() for line in response.content.split('\n') if line.strip()]
        return {"summary": points}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

import rag

class ChatRequest(BaseModel):
    message: str

@app.post("/api/chat")
def chat_with_syllabus(req: ChatRequest):
    try:
        answer = rag.ask_question(req.message)
        return {"response": answer}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

class OptimizeRequest(BaseModel):
    major_courses: List[str]

@app.post("/api/optimizer")
def optimize_workflow(req: OptimizeRequest):
    try:
        courses = canvas_api.fetch_courses()
        course_ids = [c["id"] for c in courses if "id" in c]
        
        all_assignments = []
        for cid in course_ids:
            try:
                assignments = canvas_api.fetch_assignments(cid)
                for a in assignments:
                    if "due_at" in a and a["due_at"]:
                        all_assignments.append({
                            "name": a.get("name"),
                            "course_id": cid,
                            "points": a.get("points_possible"),
                            "due_at": a.get("due_at")
                        })
            except:
                pass
                
        if not all_assignments:
            return {"schedule": "No upcoming assignments found."}
            
        prompt = PromptTemplate.from_template(
            "You are a student workflow optimizer. Given the following assignments, "
            "prioritize them based on their point value, due dates, and give higher priority "
            "to courses related to this major/focus: {major_courses}. "
            "Suggest exactly when to start each assignment. Output a concise prioritized list.\n\n"
            "Assignments:\n{assignments}"
        )
        chain = prompt | llm
        
        response = chain.invoke({
            "major_courses": ", ".join(req.major_courses),
            "assignments": str(all_assignments)
        })
        
        return {"schedule": response.content}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
