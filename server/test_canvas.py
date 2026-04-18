import canvas_api
try:
    courses = canvas_api.fetch_courses()
    if courses:
        print(courses[0].keys())
        print(courses[0].get('course_code'))
except Exception as e:
    print("Error:", e)
