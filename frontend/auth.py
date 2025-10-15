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
                # Зберігаємо дані користувача та токен у стані сесії
                st.session_state['authenticated'] = True
                st.session_state['token'] = response['token']
                st.session_state['user'] = response['user']
                st.session_state['role'] = response['user']['role'] # Припускаємо, що роль є у відповіді
                st.success("Logged in successfully!")
                st.rerun() # Перезапускаємо додаток, щоб показати головний інтерфейс
            else:
                st.error("Invalid email or password")

def add_logout_button():
    """Adds a logout button to the sidebar."""
    if st.sidebar.button("Logout"):
        # Очищуємо стан сесії
        for key in list(st.session_state.keys()):
            del st.session_state[key]
        st.rerun() # Перезапускаємо додаток, щоб повернутися на сторінку входу

