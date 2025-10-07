import streamlit as st
import os
import requests
import json

# Retrieve the API host from the environment variable set in docker-compose.yml
API_HOST = os.getenv('API_HOST', 'http://localhost:3000')

st.set_page_config(
    page_title="Music School Frontend",
    layout="centered",
    initial_sidebar_state="expanded"
)

st.title('🎶 Music School Frontend')
st.markdown('### Streamlit and NestJS API Integration Test')
st.info(f"NestJS API Target: **{API_HOST}** (Internal Docker Network)")


def fetch_api_status():
    """Attempts to fetch data from the backend API."""
    endpoint = f"{API_HOST}/"
    st.markdown("---")
    st.subheader("API Connection Status:")
    st.code(f"Attempting GET request to: {endpoint}", language='text')

    try:
        # The Streamlit container uses the 'api' hostname to reach the NestJS container
        response = requests.get(endpoint, timeout=5)

        if response.status_code == 200:
            st.success("✅ API Connection Successful!")
            st.json({
                "Status Code": response.status_code,
                "Response Text": response.text,
            })
            # Check if the content is JSON or simple text
            try:
                data = response.json()
                st.write("Parsed JSON Response:")
                st.write(data)
            except json.JSONDecodeError:
                st.write("Raw Text Response:")
                st.code(response.text, language='text')

        else:
            st.warning(f"⚠️ API responded with status code: {response.status_code}")
            st.code(response.text)

    except requests.exceptions.ConnectionError:
        st.error("❌ Connection Error: The API service is unreachable or not ready.")
        st.write("Ensure the `api` service is running and accessible inside the Docker network.")
    except Exception as e:
        st.exception(e)

if st.button('Test API Connection'):
    fetch_api_status()

# Run the initial test immediately on load
if 'initial_test_done' not in st.session_state:
    fetch_api_status()
    st.session_state['initial_test_done'] = True
