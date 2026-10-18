FROM python:3.11-slim

WORKDIR /app

# Install dependencies
RUN pip install --no-cache-dir fastapi uvicorn pydantic httpx pytest

# Copy codebase
COPY . /app

EXPOSE 8100

CMD ["uvicorn", "services.bank.main:app", "--host", "0.0.0.0", "--port", "8100"]
