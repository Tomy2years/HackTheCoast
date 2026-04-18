import os
from datetime import datetime
import canvas_api
from database import SessionLocal, Course, Assignment, Announcement, SyncMeta

def _clean_course_code(raw_code: str) -> str:
    """Turn '202630_MATH4A_31264' into 'MATH 4A'."""
    import re
    m = re.match(r"^\d+_([A-Z]+)(\d+\w*)_\d+$", raw_code or "")
    if m:
        dept, num = m.group(1), m.group(2)
        return f"{dept} {num}"
    return raw_code or ""

def _clean_course_name(name: str) -> str:
    """Remove trailing IDs like ' - 31288'."""
    import re
    return re.sub(r"\s*-\s*\d{5}$", "", name or "")

def sync_courses():
    db = SessionLocal()
    try:
        raw_courses = canvas_api.fetch_courses_rich()
        for rc in raw_courses:
            course_id = rc.get("id")
            if not course_id:
                continue
                
            # Fetch syllabus explicitly
            syllabus_body = None
            try:
                syllabus_data = canvas_api.fetch_syllabus(course_id)
                syllabus_body = syllabus_data.get("syllabus_body")
            except Exception as e:
                print(f"Failed to fetch syllabus for course {course_id}: {e}")

            course = db.query(Course).filter(Course.id == course_id).first()
            if not course:
                course = Course(id=course_id)
                db.add(course)
            
            course.name = _clean_course_name(rc.get("name"))
            course.code = _clean_course_code(rc.get("course_code"))
            course.raw_code = rc.get("original_name")
            
            # Better grade extraction
            grade = None
            enrollments = rc.get("enrollments", [])
            if enrollments:
                e = enrollments[0]
                grade = e.get("computed_current_score")
                if grade is None:
                    grade = e.get("grades", {}).get("current_score")
            
            course.grade = grade
            course.term = rc.get("term", {}).get("name")
            course.syllabus = syllabus_body
            course.updated_at = datetime.utcnow()
            
        db.commit()
        
        # Update sync meta
        meta = db.query(SyncMeta).filter(SyncMeta.key == "courses").first()
        if not meta:
            meta = SyncMeta(key="courses")
            db.add(meta)
        meta.last_sync = datetime.utcnow()
        db.commit()
        print(f"Synced {len(raw_courses)} courses.")
    finally:
        db.close()

def sync_assignments():
    db = SessionLocal()
    try:
        courses = db.query(Course).all()
        for course in courses:
            raw_assignments = canvas_api.fetch_assignments(course.id)
            for ra in raw_assignments:
                assignment_id = ra.get("id")
                assignment = db.query(Assignment).filter(Assignment.id == assignment_id).first()
                if not assignment:
                    assignment = Assignment(id=assignment_id, course_id=course.id)
                    db.add(assignment)
                
                assignment.name = ra.get("name")
                due_str = ra.get("due_at")
                if due_str:
                    assignment.due_at = datetime.fromisoformat(due_str.replace("Z", "+00:00"))
                assignment.points_possible = ra.get("points_possible")
                assignment.submission_types = ",".join(ra.get("submission_types", []))
                assignment.updated_at = datetime.utcnow()
            
        db.commit()
        print(f"Synced assignments for {len(courses)} courses.")
    finally:
        db.close()

def sync_announcements():
    db = SessionLocal()
    try:
        courses = db.query(Course).all()
        course_ids = [c.id for c in courses]
        if not course_ids:
            return
            
        raw_announcements = canvas_api.fetch_announcements(course_ids)
        for ra in raw_announcements:
            ann_id = ra.get("id")
            ann = db.query(Announcement).filter(Announcement.id == ann_id).first()
            if not ann:
                ann = Announcement(id=ann_id)
                db.add(ann)
            
            ann.course_id = int(ra.get("context_code").split("_")[-1])
            ann.title = ra.get("title")
            ann.message = ra.get("message")
            posted_str = ra.get("posted_at")
            if posted_str:
                ann.posted_at = datetime.fromisoformat(posted_str.replace("Z", "+00:00"))
            ann.author_name = ra.get("author", {}).get("display_name")
            ann.updated_at = datetime.utcnow()
            
        db.commit()
        print(f"Synced {len(raw_announcements)} announcements.")
    finally:
        db.close()

def sync_all():
    print("⏳ Syncing Canvas data to local database...")
    try:
        sync_courses()
        sync_assignments()
        sync_announcements()
        print("✅ Canvas sync complete.")
    except Exception as e:
        print(f"⚠️  Canvas sync failed: {e}")
