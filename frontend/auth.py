import streamlit as st
import api_client as api

def show_login_page():
    """Displays the login form."""
    st.title("🎶 Вхід до системи Музичної Школи")

    with st.form("login_form"):
        email = st.text_input("Email")
        password = st.text_input("Password", type="password")
        submitted = st.form_submit_button("Login")

        if submitted:
            response = api.login(email, password)
            if response and "token" in response:
                st.session_state['authenticated'] = True
                st.session_state['token'] = response.get('token')
                st.session_state['role'] = response.get('role')
                st.session_state['user'] = response

                st.success("Logged in successfully!")
                st.rerun()
            else:
                st.error("Invalid email or password")


def add_logout_button():
    """Adds a logout button to the sidebar."""
    if st.sidebar.button("Logout", key="logout_button"):
        for key in list(st.session_state.keys()):
            del st.session_state[key]
        st.rerun()

