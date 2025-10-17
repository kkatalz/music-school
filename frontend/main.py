import streamlit as st
from streamlit_option_menu import option_menu
import auth

from pages.student_pages import grades as student_grades, subjects as student_subjects, student_info
from pages.teacher_pages import students as teacher_students, teachers, teacher_info

import api_client as api

def load_css(file_name: str):
    try:
        with open(file_name, 'r') as f:
            st.markdown(f'<style>{f.read()}</style>', unsafe_allow_html=True)
    except FileNotFoundError:
        st.error(f'File with styles {file_name} not found.')
    return None



st.set_page_config(page_title="Music School", layout="wide")
load_css('assets/style.css')

STUDENT_PAGES = {
    "Мої Оцінки": student_grades,
    "Мої Предмети": student_subjects,
    "My information": student_info,
}

TEACHER_PAGES = {
    "My information": teacher_info,
    "Студенти": teacher_students,
}

HEAD_TEACHER_PAGES = {
    "My information": teacher_info,
    "Студенти": teacher_students,
    "Вчителі": teachers,
}




def show_student_dashboard():
    # col1, col2 = st.columns([4, 1])
    # with col1:
    #     st.title(f"Вітаю, {st.session_state['user'].get('firstName', 'Студент')}!")
    # with col2:
    #     st.write("")
    #     if st.button("Logout", key="logout_button", use_container_width=True):
    #         for key in list(st.session_state.keys()):
    #             del st.session_state[key]
    #         st.rerun()

    selection = option_menu(
        menu_title=None,
        options=list(STUDENT_PAGES.keys()),
        icons=['journal-check', 'book-half', 'person-circle'],  # from https://icons.getbootstrap.com/
        orientation="horizontal",
    )

    page = STUDENT_PAGES[selection]
    page.show()


def show_teacher_dashboard():
    """Відображає бічну панель та сторінки для вчителя."""
    #st.sidebar.title(f"Вітаю, {st.session_state['user'].get('firstName', 'Вчитель')}!")
    #auth.add_logout_button()

    selection = option_menu(
        menu_title=None,
        options=list(TEACHER_PAGES.keys()),
        icons=['speedometer2', 'people-fill'],
        orientation="horizontal"
    )

    page = TEACHER_PAGES[selection]
    page.show()


def show_head_teacher_dashboard():
    """Відображає бічну панель та сторінки для вчителя."""
    #st.sidebar.title(f"Вітаю, {st.session_state['user'].get('firstName', 'Вчитель')}!")
    #auth.add_logout_button()

    selection = option_menu(
        menu_title=None,
        options=list(HEAD_TEACHER_PAGES.keys()),
        icons=['speedometer2', 'people-fill'],
        orientation="horizontal"
    )

    page = HEAD_TEACHER_PAGES[selection]
    page.show()




# st.warning("Ви перебуваєте в тестовому режимі. Вхід до системи вимкнено.", icon="⚠️")
# st.session_state['authenticated'] = True
# st.session_state['user'] = {"firstName": "Student", "role": "student", "id": 1}
# st.session_state['role'] = "student"
#
# st.session_state['token'] = "YOUR_VALID_JWT_TOKEN_HERE"
# #auth.add_logout_button()
# #teacher_students.show()
# show_student_dashboard()
#


if not st.session_state.get('authenticated'):
    auth.show_login_page()
else:
    auth.add_logout_button()
    role = st.session_state.get('role')
    st.info(f'Role={role}')
    if role == 'student':
        show_student_dashboard()
    elif role == 'teacher':
        show_teacher_dashboard()
    elif role == 'headTeacher':
        show_head_teacher_dashboard()
    else:
        st.error("Невідома роль користувача. Будь ласка, зверніться до адміністратора.")

