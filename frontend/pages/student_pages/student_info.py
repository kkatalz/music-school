import streamlit as st
import sys
import os
import datetime

#sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../../')))
# -----------------------------------------
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

    else:
        st.error("Не вдалося завантажити інформацію про профіль.")

