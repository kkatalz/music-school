import streamlit as st
import auth

from pages.student_pages import grades as student_grades, subjects as student_subjects
from pages.teacher_pages import dashboard as teacher_dashboard, students as teacher_students

st.set_page_config(page_title="Music School", layout="wide")

STUDENT_PAGES = {
    "Мої Оцінки": student_grades,
    "Мої Предмети": student_subjects,
}

TEACHER_PAGES = {
    "Панель керування": teacher_dashboard,
    "Студенти": teacher_students,
}

def show_student_dashboard():
    """Відображає бічну панель та сторінки для студента."""
    st.sidebar.title(f"Вітаю, {st.session_state['user'].get('firstName', 'Студент')}!")
    selection = st.sidebar.radio("Перейти до", list(STUDENT_PAGES.keys()))
    page = STUDENT_PAGES[selection]
    page.show()
    auth.add_logout_button()

def show_teacher_dashboard():
    """Відображає бічну панель та сторінки для вчителя."""
    st.sidebar.title(f"Вітаю, {st.session_state['user'].get('firstName', 'Вчитель')}!")
    selection = st.sidebar.radio("Перейти до", list(TEACHER_PAGES.keys()))
    page = TEACHER_PAGES[selection]
    page.show()
    auth.add_logout_button()



st.warning("Ви перебуваєте в тестовому режимі. Вхід до системи вимкнено.", icon="⚠️")
st.session_state['authenticated'] = True
st.session_state['user'] = {"firstName": "Admin", "role": "head_teacher", "id": 1}
st.session_state['role'] = "head_teacher"

st.session_state['token'] = "YOUR_VALID_JWT_TOKEN_HERE"
st.sidebar.title(f"Вітаю, {st.session_state['user'].get('firstName')}!")
auth.add_logout_button()
teacher_students.show()


# if not st.session_state.get('authenticated'):
#     auth.show_login_page()
# else:
#     role = st.session_state.get('role')
#
#     if role == 'student':
#         show_student_dashboard()
#     elif role == 'teacher':
#         show_teacher_dashboard()
#     elif role == 'head_teacher':
#         pass
#         # TODO: show_head_teacher_dashboard()
#     else:
#         st.error("Невідома роль користувача. Будь ласка, зверніться до адміністратора.")
#         auth.add_logout_button()
#
