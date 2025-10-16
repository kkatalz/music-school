import streamlit as st
import sys
import os
import datetime

#sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../../')))
# -----------------------------------------
import api_client as api


def get_current_semester():
    current_month = datetime.date.today().month
    if 9 <= current_month <= 12:
        return 1
    elif 1 <= current_month <= 5:
        return 2
    else:
        # holiday months
        return 0


def show():
    #st.title("📚 Мої поточні предмети")
    student_id = st.session_state["user"]["id"]
    student_study_year = api.get_student_study_years(student_id)

    # get current month in order to get current semester
    semester = get_current_semester()
    if semester == 0:
        st.info('Наразі канікули, тому Ви ще не записані на предмети.')
        return None

    subjects_data = api.get_student_subjects(student_id, student_study_year + 1, semester)
    if subjects_data:
        st.table(subjects_data)
    else:
        st.info('Предметів не було знайдено.')

    return None


