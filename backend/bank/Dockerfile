FROM python:3.11-slim

WORKDIR /app

# Install dependencies
COPY backend/requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy codebase
COPY . /app
ENV PYTHONPATH=/app

EXPOSE 8100

CMD ["uvicorn", "backend.bank.main:app", "--host", "0.0.0.0", "--port", "8100"]
