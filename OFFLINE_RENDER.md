# Looca Offline + Multilingual + Render

Looca now has a hybrid voice runtime. The frontend can continue using Vapi when configured, but it can fall back to the FastAPI voice stack when Vapi is unavailable. The same backend also supports a strict offline profile for local machines.

## Local architecture

- **Speech-to-text (fast):** Faster-Whisper, CPU INT8, automatic language detection.
- **Speech-to-text (extended):** optional Meta MMS (`facebook/mms-1b-all`) for 1,100+ ASR languages. MMS requires an explicit language code.
- **Reasoning:** Ollama + `qwen3:4b`. Qwen3 supports 119 languages and dialects.
- **Text-to-speech:** eSpeak NG in strict offline mode.
- **Hosted TTS fallback:** Edge TTS when running online on a platform without eSpeak NG.

The fast profile is the default because it has much lower memory and startup cost. The MMS profile is for broad language coverage and needs substantially more RAM and disk.

## Fast offline setup

Requirements:

- Python 3.11+
- eSpeak NG on `PATH`
- Ollama for full local reasoning

From `backend/`:

```bash
python -m venv venv
# Windows: venv\Scripts\activate
# macOS/Linux: source venv/bin/activate

pip install -r requirements.txt
python scripts/download_offline_models.py --fast --whisper-model base
```

Install Ollama, then cache the local reasoning model:

```bash
ollama pull qwen3:4b
ollama serve
```

Copy `.env.example` to `.env` and use:

```env
VOICE_MODE=offline
OFFLINE_STRICT=true
OFFLINE_STT_ENGINE=faster-whisper
OFFLINE_WHISPER_MODEL=base
OFFLINE_WHISPER_COMPUTE_TYPE=int8
LLM_PROVIDER=ollama
OLLAMA_BASE_URL=http://127.0.0.1:11434
OLLAMA_MODEL=qwen3:4b
```

Start the backend:

```bash
uvicorn app.hybrid_main:app --host 0.0.0.0 --port 8000
```

Then run the frontend from the repository root:

```bash
npm install
npm run dev
```

Open `http://localhost:3000/agent`. The Next.js app proxies `/backend/*` to the FastAPI process.

## Extended 1,100+ language speech input

Install the optional large-model dependencies:

```bash
cd backend
pip install -r requirements.txt -r requirements-offline.txt
python scripts/download_offline_models.py --extended --mms-language eng
```

Then set:

```env
VOICE_MODE=offline
OFFLINE_STRICT=true
OFFLINE_STT_ENGINE=mms
MMS_MODEL_ID=facebook/mms-1b-all
```

MMS requests need an explicit language code. Example:

```bash
curl -X POST http://localhost:8000/api/offline/transcribe \
  -F "file=@sample.wav" \
  -F "language=tam"
```

The backend maps common two-letter codes such as `ta`, `hi`, `te`, `kn`, `ml`, `bn`, `mr`, `fr`, `de`, and `es` to MMS language adapters.

## Speed tuning

For low-resource CPU machines:

```env
OFFLINE_WHISPER_MODEL=tiny
OFFLINE_WHISPER_COMPUTE_TYPE=int8
OFFLINE_CPU_THREADS=4
```

The implementation uses beam size 1, VAD filtering, and disables previous-text conditioning to reduce conversational latency. Use `tiny` for lowest latency and `base` for a better quality/speed balance.

## Local Docker mode

The backend Docker image includes eSpeak NG and FFmpeg and pre-caches a Faster-Whisper model:

```bash
cd backend
docker build -t looca-api .
docker run --rm -p 8000:8000 \
  -e VOICE_MODE=offline \
  -e OFFLINE_STRICT=true \
  -e OFFLINE_WHISPER_MODEL=tiny \
  -e LLM_PROVIDER=ollama \
  -e OLLAMA_BASE_URL=http://host.docker.internal:11434 \
  looca-api
```

## Render deployment

`render.yaml` defines three resources:

- `looca-api`: Python/FastAPI service using Faster-Whisper for hosted STT.
- `looca-web`: Next.js service. It proxies browser `/backend/*` requests to the API over Render private networking.
- `looca-db`: Render Postgres shared by the existing data layers.

The Blueprint uses free plans by default. Free instances are suitable for testing but can cold-start and have limited CPU/RAM, so they are not ideal for low-latency production voice workloads.

On Render, eSpeak NG might not exist in the native Python runtime. In that case Looca uses Edge TTS as an online hosted fallback. Strict local/offline deployments do not use that fallback.

For hosted reasoning, either add an OpenAI/OpenRouter key in Render or run an Ollama endpoint with enough memory. Without a reasoning provider, Looca still transcribes and returns a safe fallback response.

Optional Render environment variables:

```env
OPENAI_API_KEY=...
OPENROUTER_API_KEY=...
NEXT_PUBLIC_VAPI_PUBLIC_KEY=...
NEXT_PUBLIC_VAPI_ASSISTANT_ID=...
```

## Runtime checks

```bash
curl http://localhost:8000/api/health
curl http://localhost:8000/api/offline/status
```

The status endpoint reports the selected speech engine, installed local backends, voice mode, and local reasoning model.
