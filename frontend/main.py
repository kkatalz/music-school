import streamlit as st
import auth

from pages.student_pages import grades as student_grades, subjects as student_subjects, student_info
from pages.teacher_pages import dashboard as teacher_dashboard, students as teacher_students

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
    "Моя інформація": student_info,
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
st.session_state['user'] = {"firstName": "Student", "role": "head_teacher", "id": 1}
st.session_state['role'] = "student"

st.session_state['token'] = "YOUR_VALID_JWT_TOKEN_HERE"
st.sidebar.title(f"Вітаю, {st.session_state['user'].get('firstName')}!")
auth.add_logout_button()
#teacher_students.show()
show_student_dashboard()


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
