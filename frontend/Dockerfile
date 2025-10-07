FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
EXPOSE 8501
# The command is defined in docker-compose.yml, but a default can be set here:
# CMD ["streamlit", "run", "main.py", "--server.port", "8501", "--server.address", "0.0.0.0"]