import os
import re
from datetime import datetime, timezone
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from bs4 import BeautifulSoup
from dotenv import load_dotenv
from sqlalchemy.orm import Session

import canvas_api
import sync
import rag
from database import SessionLocal, Course, Assignment, Announcement, SyncMeta, init_db

load_dotenv()

# Startup sync logic
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create tables if they don't exist
    init_db()
    # Trigger an initial sync in the background
    try:
        sync.sync_all()
    except Exception as e:
        print(f"⚠️  Canvas sync failed on startup: {e}")
        print("   The app will serve whatever is already cached.")
    yield

app = FastAPI(lifespan=lifespan)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def clean_html(html_content: str) -> str:
    if not html_content:
        return ""
    soup = BeautifulSoup(html_content, "html.parser")
    return soup.get_text(separator="\n").strip()

@app.get("/api/courses")
def get_courses(db: Session = Depends(get_db)):
    try:
        courses = db.query(Course).all()
        results = []
        for c in courses:
            # Get next upcoming assignment for this course from DB
            now = datetime.utcnow()
            next_asgn_obj = db.query(Assignment).filter(
                Assignment.course_id == c.id,
                Assignment.due_at > now
            ).order_by(Assignment.due_at.asc()).first()

            next_asgn = None
            if next_asgn_obj:
                next_asgn = {
                    "name": next_asgn_obj.name,
                    "due_at": next_asgn_obj.due_at.isoformat() if next_asgn_obj.due_at else None,
                    "points": next_asgn_obj.points_possible
                }

            results.append({
                "id": c.id,
                "name": c.name,
                "code": c.code,
                "grade": c.grade,
                "term": c.term,
                "next_assignment": next_asgn,
            })
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/announcements")
def get_announcements(db: Session = Depends(get_db)):
    try:
        announcements = db.query(Announcement).order_by(Announcement.posted_at.desc()).all()
        formatted = []
        for a in announcements:
            formatted.append({
                "id": a.id,
                "course": f"Course_{a.course_id}",
                "title": a.title,
                "date": a.posted_at.isoformat() if a.posted_at else None,
                "content": clean_html(a.message)
            })
        return formatted
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

class SummarizeRequest(BaseModel):
    content: str

@app.post("/api/announcements/summarize")
def summarize_announcement(req: SummarizeRequest):
    # Note: We still use Gemini live for summarization as it's a dynamic AI task
    from langchain_google_genai import ChatGoogleGenerativeAI
    from langchain_core.prompts import PromptTemplate
    
    api_key = os.getenv("GEMINI_API_KEY")
    llm = ChatGoogleGenerativeAI(model="gemini-2.5-flash", google_api_key=api_key, temperature=0.2)
    
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
def optimize_workflow(req: OptimizeRequest, db: Session = Depends(get_db)):
    # Optimizer now uses cached assignments from DB
    from langchain_google_genai import ChatGoogleGenerativeAI
    from langchain_core.prompts import PromptTemplate
    
    api_key = os.getenv("GEMINI_API_KEY")
    llm = ChatGoogleGenerativeAI(model="gemini-2.5-flash", google_api_key=api_key, temperature=0.2)

    try:
        now = datetime.utcnow()
        assignments = db.query(Assignment).filter(Assignment.due_at > now).all()
        
        all_assignments = []
        for a in assignments:
            all_assignments.append({
                "name": a.name,
                "course_id": a.course_id,
                "points": a.points_possible,
                "due_at": a.due_at.isoformat() if a.due_at else None
            })
                
        if not all_assignments:
            return {"schedule": "No upcoming assignments found in the cache."}
            
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

@app.post("/api/sync")
def trigger_sync():
    """Manually trigger a data refresh from Canvas."""
    try:
        sync.sync_all()
        return {"status": "success", "message": "Database sync completed."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/sync/status")
def get_sync_status(db: Session = Depends(get_db)):
    """Check when the last successful sync occurred."""
    meta = db.query(SyncMeta).all()
    return {m.key: m.last_sync.isoformat() for m in meta}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
