FROM python:3.11-slim

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    libpq-dev \
    libgomp1 \
    espeak-ng \
    ffmpeg \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY app/ ./app/
COPY scripts/ ./scripts/

ARG OFFLINE_WHISPER_MODEL=tiny
ENV OFFLINE_WHISPER_MODEL=${OFFLINE_WHISPER_MODEL}
RUN python -c "from faster_whisper import WhisperModel; WhisperModel('${OFFLINE_WHISPER_MODEL}', device='cpu', compute_type='int8')"

EXPOSE 8000

CMD ["sh", "-c", "uvicorn app.hybrid_main:app --host 0.0.0.0 --port ${PORT:-8000} --workers ${WEB_CONCURRENCY:-1}"]
