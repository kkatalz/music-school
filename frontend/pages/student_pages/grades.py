import streamlit as st
import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../../')))
# -----------------------------------------
#import api_client as api

def show():
    st.title("📖 Мої Оцінки")
    st.info("Ця сторінка знаходиться в розробці.")
