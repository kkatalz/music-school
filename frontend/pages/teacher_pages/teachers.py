import streamlit as st
import sys
import os

# -- Блок для виправлення імпорту --
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../')))
# ---------------------------------
import api_client as api


def show():
    """Відображає сторінку управління вчителями з можливістю редагування."""
    st.title("👨‍🏫 Управління Вчителями")

    tab1, tab2 = st.tabs(["Перегляд Вчителів", "Додати Нового Вчителя"])

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
    """Відображає список вчителів у вигляді карток з кнопками дій."""
    st.header("Список Вчителів")

    if st.button("🔄 Оновити список"):
        # Очищуємо кеш, щоб отримати свіжі дані (якщо ви використовуєте кешування)
        st.cache_data.clear()

    all_teachers_data = api.get_all_teachers()

    if all_teachers_data:
        st.info(f"Знайдено {len(all_teachers_data)} вчителів.")
        st.divider()

        for teacher in all_teachers_data:
            teacher_id = teacher.get('id')
            with st.container(border=True):
                col1, col2 = st.columns([1, 4])
                with col1:
                    st.markdown("<h2 style='text-align: center; padding-top: 10px;'>👨‍🏫</h2>", unsafe_allow_html=True)

                with col2:
                    st.subheader(f"{teacher.get('firstName', '')} {teacher.get('lastName', '')}")
                    st.markdown(f"📧 **Email:** `{teacher.get('email', 'N/A')}`")
                    st.markdown(f"📞 **Телефон:** {teacher.get('phone', 'N/A')}")

                st.divider()

                action_col1, action_col2 = st.columns(2)

                if action_col1.button(f"✏️ Редагувати {teacher_id}", key=f"edit_{teacher_id}", use_container_width=True):
                    st.session_state.teacher_id_to_edit = teacher_id
                    st.rerun()

                if action_col2.button(f"🗑️ Видалити {teacher_id}", key=f"delete_{teacher_id}", use_container_width=True):
                    success = api.delete_teacher(teacher_id)
                    if success:
                        st.success(f"Вчителя {teacher.get('firstName')} видалено.")
                        st.rerun()
                    else:
                        st.error("Не вдалося видалити вчителя.")
    else:
        st.info('Вчителів не було знайдено.')


def display_edit_form(teacher_id: int):
    """Відображає форму для редагування конкретного вчителя."""
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
    """Відображає форму для додавання нового вчителя."""
    st.header("Форма для додавання нового вчителя")

    # ВИПРАВЛЕНО: Додано clear_on_submit=True для автоматичного очищення форми
    with st.form("add_teacher_form", clear_on_submit=True):
        st.write("Введіть дані нового вчителя:")

        col1, col2 = st.columns(2)
        with col1:
            first_name = st.text_input("Ім'я*")
            last_name = st.text_input("Прізвище*")
            phone = st.text_input("Телефон*")

        with col2:
            education = st.text_input("Освіта*")
            email = st.text_input("Email*")
            password = st.text_input("Пароль*", type="password")

        submitted = st.form_submit_button("Додати Вчителя")
        if submitted:
            teacher_data = {
                "firstName": first_name,
                "lastName": last_name,
                "phone": int(phone) if phone.isdigit() else 0,
                "education": education,
                "email": email,
                "password": password,
            }

            success = api.add_teacher(teacher_data)
            if success:
                st.success("Вчителя успішно додано!")
            else:
                st.error("Не вдалося додати вчителя. Перевірте повідомлення про помилку вище.")

