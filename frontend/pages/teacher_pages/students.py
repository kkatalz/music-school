import streamlit as st
import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../../')))
# -----------------------------------------
import api_client as api

def show():
    st.title("🎓 Керування студентами")
    """Відображає сторінку управління студентами для вчителя/завуча."""

    tab1, tab2, tab3 = st.tabs(["Перегляд студентів", "Додати нового студента", "Додати нового вчителя"])

    with tab1:
        display_all_students_by_teacher()
    with tab2:
        display_add_student_form()
    with tab3:
        display_add_teacher_form()



def display_all_students_by_teacher():
    st.header("Список Моїх Студентів")
    teacher_id = st.session_state["user"]["id"]

    # filters
    col1, col2 = st.columns(2)
    with col1:
        year_options = ["всі"] + list(range(1, 9))
        year = st.selectbox("Навчальний рік", year_options, key="students_year")
    with col2:
        semester_options = ["всі", 1, 2]
        semester = st.selectbox("Семестр", semester_options, key="students_semester")

    if st.button("🔎 Показати студентів"):
        params_to_set = {}
        if year != "всі":
            params_to_set["year"] = year
        else:
            # Якщо вибрано "всі", видаляємо параметр з URL, якщо він там був
            if "year" in st.query_params:
                del st.query_params["year"]

        if semester != "всі":
            params_to_set["semester"] = semester
        else:
            if "semester" in st.query_params:
                del st.query_params["semester"]

        st.query_params.update(params_to_set)

        year_param = year if year != "всі" else None
        semester_param = semester if semester != "всі" else None
        students_data = api.get_teacher_students(teacher_id, year_param, semester_param)

        if students_data:
            st.table(students_data)
        else:
            st.info("Студентів за вибраний період не знайдено.")

def display_add_student_form():
    """

    """
    st.header("Форма для додавання студента")

    with st.form("add_student_form"):
        st.write("Введіть дані нового студента:")

        col1, col2 = st.columns(2)
        with col1:
            first_name = st.text_input("Ім'я*", key="first_name")
            last_name = st.text_input("Прізвище*", key="last_name")
            phone = st.text_input("Телефон*", key="phone")
            parent_phone = st.text_input("Телефон батьків*", key="parent_phone")

        with col2:
            address = st.text_input("Адреса*", key="address")
            start_study_date = st.date_input("Дата початку навчання*", key="start_date")
            email = st.text_input("Email*", key="email")
            password = st.text_input("Пароль*", type="password", key="password")

        # submit button
        submitted = st.form_submit_button("Додати Студента")

        if submitted:
            student_data = {
                "firstName": first_name,
                "lastName": last_name,
                "phone": phone,
                "parentPhone": parent_phone,
                "address": address,
                "startStudyDate": start_study_date.isoformat(),
                "email": email,
                "password": password,
            }

            # call the method from api
            success = api.add_student(student_data)

            if success:
                st.success("Студента успішно додано!")
                # TODO: here may be logic for clearing the form etc.
            else:
                st.error("Не вдалося додати студента. Перевірте повідомлення про помилку вище.")



def display_add_teacher_form():
    st.header("Форма для додавання нового вчителя")

    with st.form("add_teacher_form"):
        st.write("Введіть дані нового вчителя:")

        col1, col2 = st.columns(2)
        with col1:
            first_name = st.text_input("Ім'я*", key="first_name")
            last_name = st.text_input("Прізвище*", key="last_name")
            phone = st.text_input("Телефон*", key="phone")

        with col2:
            education = st.text_input("Освіта*", key="education")
            email = st.text_input("Email*", key="email")
            password = st.text_input("Пароль*", type="password", key="password")

        # submit button
        submitted = st.form_submit_button("Додати Вчителя")

        if submitted:
            teacher_data = {
                "firstName": first_name,
                "lastName": last_name,
                "phone": phone,
                "education": education,
                "email": email,
                "password": password,
            }

            # call the method from api
            success = api.add_teacher(teacher_data)

            if success:
                st.success("Вчителя успішно додано!")
                # TODO: here may be logic for clearing the form etc.
            else:
                st.error("Не вдалося додати вчителя. Перевірте повідомлення про помилку вище.")
