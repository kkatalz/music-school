import streamlit as st
import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../')))
# ---------------------------------
import api_client as api



def show():
    tab1, tab2 = st.tabs(["Перегляд та Редагування", "Додати Нового Вчителя"])

    with tab1:
        if 'teacher_id_to_edit' not in st.session_state:
            st.session_state.teacher_id_to_edit = None

        if st.session_state.teacher_id_to_edit is None:
            display_teacher_list()
        else:
            display_edit_form(st.session_state.teacher_id_to_edit)

    with tab2:
        display_add_teacher_form()


def display_teacher_list():
    st.header("Список Вчителів")

    all_teachers_data = api.get_all_teachers()

    if all_teachers_data:
        # Створюємо словник, де ключ - це зрозумілий текст для користувача,
        # а значення - це ID вчителя.
        teacher_options = {
            f"{t.get('firstName', '')} {t.get('lastName', '')} (ID: {t.get('id')})": t.get('id')
            for t in all_teachers_data
        }
        selected_teacher_display = st.selectbox(
            "Виберіть вчителя для редагування",
            options=teacher_options.keys()
        )

        if st.button("✏️ Редагувати обраного вчителя"):
            # Зберігаємо ID обраного вчителя у стан сесії
            st.session_state.teacher_id_to_edit = teacher_options[selected_teacher_display]
            st.rerun()

        st.divider()

        for teacher in all_teachers_data:
            with st.container(border=True):
                col1, col2 = st.columns([1, 4])
                with col1:
                    st.markdown("<h2 style='text-align: center; padding-top: 10px;'>👨‍🏫</h2>", unsafe_allow_html=True)

                with col2:
                    st.subheader(f"{teacher.get('firstName', '')} {teacher.get('lastName', '')}")
                    st.markdown(f"📧 **Email:** `{teacher.get('email', 'N/A')}`")
                    st.markdown(f"📞 **Телефон:** {teacher.get('phone', 'N/A')}")
    else:
        st.info('Вчителів не було знайдено.')



def display_edit_form(teacher_id: int):
    st.header(f"Редагування вчителя (ID: {teacher_id})")

    teacher_data = api.get_teacher(teacher_id)

    if not teacher_data:
        st.error("Не вдалося завантажити дані вчителя.")
        if st.button("Повернутися до списку"):
            st.session_state.teacher_id_to_edit = None
            st.rerun()
        return

    with st.form("edit_teacher_form"):
        st.write("Оновіть дані вчителя:")

        first_name = st.text_input("Ім'я", value=teacher_data.get('firstName', ''))
        last_name = st.text_input("Прізвище", value=teacher_data.get('lastName', ''))
        email = st.text_input("Email", value=teacher_data.get('email', ''))
        phone = st.text_input("Телефон", value=str(teacher_data.get('phone', '')))
        education = st.text_input("Освіта", value=teacher_data.get('education', ''))

        submitted = st.form_submit_button("Зберегти зміни")
        if submitted:
            updated_data = {
                "firstName": first_name,
                "lastName": last_name,
                "email": email,
                "phone": phone,
                "education": education
            }

            success = api.update_teacher(teacher_id, updated_data)
            if success:
                st.success("Дані вчителя успішно оновлено!")
                st.session_state.teacher_id_to_edit = None
                st.rerun()
            else:
                st.error("Не вдалося оновити дані.")

    if st.button("Скасувати і повернутися до списку"):
        st.session_state.teacher_id_to_edit = None
        st.rerun()


def display_add_teacher_form():
    st.header("Форма для додавання нового вчителя")
    with st.form("add_teacher_form"):
        st.write("Введіть дані нового вчителя:")

        col1, col2 = st.columns(2)
        with col1:
            first_name = st.text_input("Ім'я*", key="teacher_first_name")
            last_name = st.text_input("Прізвище*", key="teacher_last_name")
            phone = st.text_input("Телефон*", key="teacher_phone")

        with col2:
            education = st.text_input("Освіта*", key="teacher_education")
            email = st.text_input("Email*", key="teacher_email")
            password = st.text_input("Пароль*", type="password", key="teacher_password")

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
            else:
                st.error("Не вдалося додати вчителя. Перевірте повідомлення про помилку вище.")
