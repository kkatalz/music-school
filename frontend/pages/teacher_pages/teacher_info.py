from multiprocessing.dummy import current_process

import streamlit as st
import sys
import os
import api_client as api
import datetime


def show():
    teacher_id = st.session_state["user"]["id"]
    curr_teacher_data = api.get_teacher(teacher_id)

    if curr_teacher_data:
        first_name = curr_teacher_data.get('firstName', '')
        last_name = curr_teacher_data.get('lastName', '')

        with st.container(border=True):
            st.subheader("Personal info")
            st.markdown("<h4> Name</h4>", unsafe_allow_html=True)
            st.write(f'{first_name} {last_name}', unsafe_allow_html=True)

            st.markdown("<h4>📧 Email</h4>", unsafe_allow_html=True)
            st.write(curr_teacher_data.get('email', '-'))

            st.markdown("<h4>📞 Телефон</h4>", unsafe_allow_html=True)
            st.write(curr_teacher_data.get('phone', '-'))

            st.markdown("<h4> Education</h4>", unsafe_allow_html=True)
            st.write(curr_teacher_data.get('education', '-'))


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
                        success = api.update_teacher_password(teacher_id, new_password)
                        if success:
                            st.success("Пароль успішно оновлено!")
                        else:
                            st.error("Не вдалося оновити пароль.")

    else:
        st.error("Не вдалося завантажити інформацію про профіль.")

