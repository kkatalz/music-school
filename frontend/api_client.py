# /frontend/api_client.py

import streamlit as st
import requests
import os

# Get API_HOST from environment variables (set in docker-compose.yml)
API_HOST = os.environ.get("API_HOST", "http://api:3000/api")


def handle_request(method, endpoint, **kwargs):
    """A centralized function to handle all API requests and errors."""
    url = f"{API_HOST}/{endpoint}"
    headers = _get_auth_headers()
    if not headers and not endpoint.startswith("auth/"):
        st.warning("You must be logged in to perform this action.")
        return None

    try:
        response = requests.request(method, url, headers=headers, timeout=10, **kwargs)
        response.raise_for_status()
        return response.json() if response.text else True
    except requests.exceptions.HTTPError as e:
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
        # The endpoint for logging in, e.g., '/auth/login'
        response = requests.post(
            f"{API_HOST}/auth/login",  # TODO: change endpoint to a relevant one
            json={"email": email, "password": password},
            timeout=10
        )
        response.raise_for_status()  # Raise an exception for bad status codes (4xx or 5xx)
        return response.json()
    except requests.exceptions.RequestException as e:
        st.error(f"Login failed: Could not connect to the server.")
        return None

def _get_auth_headers():
    """
    Helper function to get authorization headers.
    It reads the JWT token from the session state if it exists.
    """
    if "token" in st.session_state:
        return {"Authorization": f"Bearer {st.session_state['token']}"}
    return None


# ------ teacher endpoints --------
def get_teachers():
    return handle_request('get', 'teachers')


def set_grade(student_id: int, subject_id: int, value: int):
    """Sets a new grade for a student. Requires teacher role."""
    grade_data = {"studentId": student_id, "subjectId": subject_id, "value": value}
    return handle_request("post", "grades", json=grade_data)


def update_grade(grade_id: int, value: int):
    """Updates the value of an existing grade. Requires teacher role."""
    return handle_request("put", f"grades/{grade_id}", json={"value": value})
