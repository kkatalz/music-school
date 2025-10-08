# /frontend/main.py

import streamlit as st
import requests
import os

# Get API_HOST from environment variables (set in docker-compose.yml)
API_HOST = os.environ.get("API_HOST", "http://api:3000/api")

def fetch_api_data(endpoint):
    """Attempts to fetch data from the NestJS API."""
    try:
        # Use a specific path or the base path with the global prefix
        url = f"{endpoint}/"
        st.write(f"Attempting GET request to: **{url}**")
        
        # Use a short timeout for connection test
        response = requests.get(url, timeout=5)
        
        # Check if the response was successful
        if response.status_code == 200:
            st.success("✅ API Connection Status: **SUCCESS** (Status 200)")
            st.write("---")
            st.subheader("Data Received from Backend:")
            st.code(response.text)
        else:
            st.warning(f"⚠️ API Connection Status: **FAILURE** (Status {response.status_code})")
            st.text(f"Response: {response.text[:100]}...") # Show a snippet of the response
            
    except requests.exceptions.Timeout:
        st.error("❌ API Connection Status: **TIMEOUT**")
        st.caption("The request took too long. Check if the backend is slow or port mapping is wrong.")
    except requests.exceptions.ConnectionError:
        st.error("❌ API Connection Status: **CONNECTION REFUSED**")
        st.caption("Check if the backend service 'api' is running.")
    except Exception as e:
        st.exception(e)


# --- Streamlit App ---
st.title("🎶 Music School Frontend")
st.subheader("Streamlit and NestJS API Integration Test")

st.info(f"NestJS API Target: **{API_HOST}** (Internal Docker Network)")

st.write("## API Connection Status:")
fetch_api_data(API_HOST)

st.write("---")
st.caption("If successful, the backend is accessible to the frontend via the Docker network.")