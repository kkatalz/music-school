import streamlit as st
import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../../')))
# -----------------------------------------
import api_client as api

# student can do:
# see their grades from subjects;
# see study_years;
# see info about them;
# see their subjects

# TODO: implement

def show():
    #st.title("📖 Мої Оцінки")
    st.info("Ця сторінка знаходиться в розробці.")

    student_id = st.session_state["user"]["id"]
    #student_grades = api.get_student_grades(student_id, )


