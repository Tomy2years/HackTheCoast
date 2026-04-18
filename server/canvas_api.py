import os
import requests
from dotenv import load_dotenv

load_dotenv()

CANVAS_DOMAIN = os.getenv('CANVAS_DOMAIN')
CANVAS_API_KEY = os.getenv('CANVAS_API_KEY')

def get_headers():
    if not CANVAS_API_KEY:
        raise ValueError("CANVAS_API_KEY not found in .env")
    return {
        "Authorization": f"Bearer {CANVAS_API_KEY}",
        "Accept": "application/json"
    }

def get_base_url():
    if not CANVAS_DOMAIN:
        raise ValueError("CANVAS_DOMAIN not found in .env")
    domain = CANVAS_DOMAIN if CANVAS_DOMAIN.startswith('http') else f"https://{CANVAS_DOMAIN}"
    return f"{domain}/api/v1"

def fetch_courses():
    url = f"{get_base_url()}/courses"
    params = {"enrollment_state": "active", "per_page": 100}
    response = requests.get(url, headers=get_headers(), params=params)
    response.raise_for_status()
    return response.json()

def fetch_courses_rich():
    """Fetch courses with grade and term information included."""
    url = f"{get_base_url()}/courses"
    params = {
        "enrollment_state": "active",
        "per_page": 100,
        "include[]": ["total_scores", "term"],
    }
    response = requests.get(url, headers=get_headers(), params=params)
    response.raise_for_status()
    return response.json()

def fetch_announcements(course_ids):
    url = f"{get_base_url()}/announcements"
    params = [("per_page", 20)]
    for cid in course_ids:
        params.append(("context_codes[]", f"course_{cid}"))
    response = requests.get(url, headers=get_headers(), params=params)
    response.raise_for_status()
    return response.json()

def fetch_syllabus(course_id):
    url = f"{get_base_url()}/courses/{course_id}"
    params = {"include[]": "syllabus_body"}
    response = requests.get(url, headers=get_headers(), params=params)
    response.raise_for_status()
    return response.json()

def fetch_assignments(course_id):
    url = f"{get_base_url()}/courses/{course_id}/assignments"
    params = {"per_page": 100}
    response = requests.get(url, headers=get_headers(), params=params)
    response.raise_for_status()
    return response.json()
