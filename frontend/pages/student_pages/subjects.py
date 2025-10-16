import streamlit as st
import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../../')))
# -----------------------------------------
import api_client as api

# TODO: implement

def show():
    st.title("📚 Мої Предмети")
    #st.info("Ця сторінка знаходиться в розробці.")
    user_id = st.session_state["user"]["id"]

    # filters
    year = st.selectbox("Навчальний рік", [1, 2, 3, 4, 5, 6, 7, 8, 9])
    semester = st.selectbox("Семестр", [1, 2])

    if st.button("Показати предмети"):
        pass


