# /frontend/api_client.py

import streamlit as st
import requests
import os

# Get API_HOST from environment variables (set in docker-compose.yml)
API_HOST = os.environ.get("API_HOST", "http://api:3000/api")


def _handle_request(method, endpoint, **kwargs):
    """A centralized function to handle all API requests and errors."""
    url = f"{API_HOST}/{endpoint}"
    headers = _get_auth_headers()
   # if not headers and not endpoint.startswith("auth/"):
   #     st.warning("You must be logged in to perform this action.")
   #     return None

    try:
        response = requests.request(method, url, headers=headers, timeout=10, **kwargs)
        response.raise_for_status()
        return response.json() if response.text else True
    except requests.exceptions.HTTPError as e:
        # TODO: delete in order to see proper messages
        st.error(f"HTTP Error: {e.response.status_code} - Request failed.")
        st.error(f"Backend message: `{e.response.text}`")
    except requests.exceptions.RequestException:
        st.error(f"Connection Error: Could not connect to the API at {url}.")
    return None


# --- AUTHENTICATION ---
def login(email: str, password: str):
    """
    Attempts to log in by sending credentials to the backend.
    Returns user data and a JWT token upon success.
    """
    try:
        response = requests.post(
            f"{API_HOST}/auth/login",
            json={"email": email, "password": password},
            timeout=10
        )
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        st.error(f"Login failed: Could not connect to the server.")
        return None

def _get_auth_headers():
    if "token" in st.session_state:
        return {"Authorization": f"Bearer {st.session_state['token']}"}
    return None

# ====== STUDENT CONTROLLER METHODS =======
def get_total_students(start_date: str, end_date: str):
    """
    Fetches the total number of students within a given date range.

    Args:
        start_date: The start date.
        end_date: The end date.
    """
    params = {"start": start_date, "end": end_date}
    return _handle_request("get", "students/total", params=params)

def get_student_subjects(student_id: int, year: str, semester: str):
    params = {"year": year, "semester": semester}
    return _handle_request("get", f"students/{student_id}/subjects", params=params)

def get_student_teachers(student_id: int, year: str, semester: str):
    params = {"year": year, "semester": semester}
    return _handle_request("get", f"students/{student_id}/teachers", params=params)

def get_students_by_period(start_date: str, end_date: str):
    params = {"start": start_date, "end": end_date}
    return _handle_request("get", "students", params=params)

def get_student_info(student_id: int):
    return _handle_request("get", f"students/{student_id}")

def get_student_study_years(student_id: int):
    return _handle_request("get", f"students/{student_id}/study-years")

def add_student(student_data: dict):
    """
    Created a new student.
    Requires head_teacher role.
    """
    return _handle_request("post", "students", json=student_data)

def update_student(student_id: int, student_data: dict):
    return _handle_request("put", f"students/{student_id}", json=student_data)

def delete_student(student_id: int):
    return _handle_request("delete", f"students/{student_id}")

def get_student_grades(student_id: int, year: int, semester: int):
    # TODO: implement
    pass


# ====== TEACHER CONTROLLER METHODS =======
def get_all_teachers():
    return _handle_request("get", "teachers")

def calculate_teacher_experience(teacher_id: int):
    return _handle_request("get", f"experience/{teacher_id}")

def get_teacher(teacher_id: int):
    return _handle_request("get", f"teachers/{teacher_id}")

def get_teacher_students(teacher_id: int, year: int, semester: int):
    params = {"year": year, "semester": semester}
    return _handle_request("get", f"teachers/{teacher_id}/students/", params=params)

def get_teacher_subjects(teacher_id: int, year: int, semester: int):
    params = {"year": year, "semester": semester}
    return _handle_request("get", f"teachers/{teacher_id}/subjects", params=params)

def add_teacher(teacher_data: dict):
    return _handle_request("post", "teachers", json=teacher_data)

def update_teacher(teacher_id: int, teacher_data: dict):
    return _handle_request("put", f"teachers/{teacher_id}", json=teacher_data)

def delete_teacher(teacher_id: str):
    return _handle_request("delete", f"teachers/{teacher_id}")

# ====== SUBJECT CONTROLLER METHODS =======
def get_all_subjects():
    # TODO: implement
    pass

def get_subjects_info():
    # TODO: implement
    pass

def add_subject(subject_data: dict):
    # TODO: implement
    pass

def add_teacher_to_subject(teacher_id: str, subject_id: str):
    # TODO: implement
    pass

def add_student_to_subject(student_id, subject_od: str):
    # TODO: implement
    pass

# === GRADE CONTROLLER METHODS ===
def get_grades_by_student(student_id: str, year: int, semester: int):
    # TODO: implement
    pass

def get_grades_by_teacher(student_id, year: int, semester: int):
    # TODO: implement
    pass

def set_grade(grade_data: dict):
    """ To add new grade. """
    # TODO: implement
    pass

def update_grade(grade_id: str, value: int):
    # TODO: implement
    pass

def update_student_password(student_id: int, new_password: str):
    # TODO: implement
    pass