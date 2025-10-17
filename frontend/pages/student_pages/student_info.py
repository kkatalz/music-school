import streamlit as st
import datetime
import api_client as api


def show():
    student_id = st.session_state["user"]["id"]
    student_data = api.get_student_info(student_id)
    student_study_years = api.get_student_study_years(student_id)

    if student_data:
        first_name = student_data.get('firstName', '')
        last_name = student_data.get('lastName', '')

        st.header(f'{first_name} {last_name}')
        st.divider()

        with st.container(border=True):
            st.subheader("Контактна інформація")

            st.markdown("<h4>📧 Email</h4>", unsafe_allow_html=True)
            st.write(student_data.get('email', '-'))

            st.markdown("<h4>📞 Телефон</h4>", unsafe_allow_html=True)
            st.write(student_data.get('phone', '-'))

            st.markdown("<h4>👨‍👩‍👧 Телефон батьків</h4>", unsafe_allow_html=True)
            st.write(student_data.get('parentPhone', '-'))

            st.markdown("<h4>🏠 Адреса</h4>", unsafe_allow_html=True)
            st.write(student_data.get('address', '-'))

            st.divider()

            st.subheader("Навчальна інформація")
            start_date_str = student_data.get('startStudyDate')

            if start_date_str:
                st.markdown("<h4>🎓 Рік навчання</h4>", unsafe_allow_html=True)
                st.write(f"{student_study_years + 1}-й рік")

                start_date_obj = datetime.datetime.fromisoformat(start_date_str.replace('Z', '+00:00'))
                st.markdown("<h4>🗓️ Дата початку навчання</h4>", unsafe_allow_html=True)
                st.write(start_date_obj.strftime('%d.%m.%Y'))
            else:
                st.info("Навчальна інформація не вказана.")


        with st.expander("🔑 Змінити пароль"):
            with st.form("change_password_form", clear_on_submit=True):
                st.write("Введіть новий пароль та підтвердіть його.")
                new_password = st.text_input("Новий пароль", type="password")
                confirm_password = st.text_input("Підтвердіть пароль", type="password")

                submitted = st.form_submit_button("Зберегти новий пароль")
                if submitted:
                    if not new_password:
                        st.warning("Пароль не може бути порожнім.")
                    elif new_password != confirm_password:
                        st.error("Паролі не співпадають!")
                    else:
                        success = api.update_student_password(student_id, new_password)
                        if success:
                            st.success("Пароль успішно оновлено!")
                        else:
                            st.error("Не вдалося оновити пароль.")




    else:
        st.error("Не вдалося завантажити інформацію про профіль.")

