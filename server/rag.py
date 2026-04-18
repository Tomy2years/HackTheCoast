import os
from langchain_google_genai import ChatGoogleGenerativeAI
from bs4 import BeautifulSoup
from database import SessionLocal, Course

def get_llm():
    api_key = os.getenv("GEMINI_API_KEY")
    return ChatGoogleGenerativeAI(model="gemini-2.5-flash", google_api_key=api_key, temperature=0.2)

def clean_html(html_content: str) -> str:
    if not html_content:
        return ""
    soup = BeautifulSoup(html_content, "html.parser")
    return soup.get_text(separator="\n").strip()

def get_all_syllabi_context():
    """Fetch all syllabi from the DB and format them into a single context string."""
    db = SessionLocal()
    try:
        courses = db.query(Course).all()
        context_parts = []
        
        for c in courses:
            if c.syllabus:
                text = clean_html(c.syllabus)
                context_parts.append(f"COURSE: {c.code} - {c.name}\nSYLLABUS CONTENT:\n{text}\n---")
        
        return "\n\n".join(context_parts)
    finally:
        db.close()

def ask_question(question: str) -> str:
    """Answer questions using the full context of all course syllabi."""
    context = get_all_syllabi_context()
    
    if not context:
        return "I haven't synced any syllabus data yet. Please make sure your Canvas courses have syllabi uploaded."
        
    llm = get_llm()
    
    prompt_text = (
        "You are 'Portrait AI', a premium student assistant. "
        "Below is the context of all the student's current course syllabi. "
        "Use this information to answer their question accurately. "
        "If the answer isn't in the provided syllabi, tell them honestly but try to be helpful based on general knowledge if appropriate (clearly stating it's general advice).\n\n"
        f"SYLLABI CONTEXT:\n{context}\n\n"
        f"STUDENT QUESTION: {question}"
    )
    
    try:
        response = llm.invoke(prompt_text)
        return response.content
    except Exception as e:
        return f"Error communicating with Gemini: {str(e)}"
