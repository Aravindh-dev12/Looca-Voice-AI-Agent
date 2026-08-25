from __future__ import annotations

import asyncio
import importlib.util
import logging
import os
import shutil
import subprocess
import time
from pathlib import Path
from typing import Optional

import httpx
from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile
from pydantic import BaseModel, Field
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth import get_current_user
from app.config import get_settings
from app.database import get_db
from app.models import AudioRecord, User

logger = logging.getLogger(__name__)
settings = get_settings()
router = APIRouter()
UPLOAD_DIR = Path(os.getenv("UPLOAD_DIR", "uploads"))
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

_whisper = None
_whisper_lock = asyncio.Lock()
_mms_model = None
_mms_processor = None
_mms_lang = None
_mms_lock = asyncio.Lock()

ISO2_TO_MMS = {
    "en": "eng", "ta": "tam", "hi": "hin", "te": "tel", "kn": "kan",
    "ml": "mal", "mr": "mar", "bn": "ben", "or": "ori", "pa": "pan",
    "gu": "guj", "ur": "urd", "ar": "ara", "fr": "fra", "de": "deu",
    "es": "spa", "pt": "por", "it": "ita", "ru": "rus", "ja": "jpn",
    "ko": "kor", "zh": "cmn", "id": "ind", "vi": "vie", "th": "tha",
}

VOICE_VARIANTS = {
    "roger": "+m3", "rachel": "+f3", "emma": "+f2", "james": "+m2",
    "lily": "+f4", "clyde": "+m4", "alloy": "+m1",
}


def env(name: str, default: str = "") -> str:
    return os.getenv(name, default).strip()


def env_bool(name: str, default: bool = False) -> bool:
    return env(name, "true" if default else "false").lower() in {"1", "true", "yes", "on"}


def normalize_language(language: Optional[str]) -> Optional[str]:
    if not language:
        return None
    value = language.lower().replace("_", "-").strip()
    if value in {"", "auto", "detect"}:
        return None
    return value.split("-")[0]


def strict_offline() -> bool:
    return env_bool("OFFLINE_STRICT") or env("VOICE_MODE", "auto").lower() == "offline"


def module_available(name: str) -> bool:
    return importlib.util.find_spec(name) is not None


class TTSSettings(BaseModel):
    speed: float = Field(1.0, ge=0.5, le=2.5)
    stability: float = 0.5
    similarity: float = 0.75
    styleExaggeration: float = 0.0
    speakerBoost: bool = True
    outputFormat: str = "WAV 44.1 kHz"


class TTSRequest(BaseModel):
    text: str = Field(min_length=1, max_length=12000)
    voice: str = "roger"
    model: str = ""
    language: str = "auto"
    settings: TTSSettings = Field(default_factory=TTSSettings)


class ChatRequest(BaseModel):
    text: str = Field(min_length=1, max_length=12000)
    language: str = "auto"


async def get_whisper():
    global _whisper
    if _whisper is not None:
        return _whisper
    if not module_available("faster_whisper"):
        raise RuntimeError("faster-whisper is not installed")
    async with _whisper_lock:
        if _whisper is None:
            from faster_whisper import WhisperModel
            model = env("OFFLINE_WHISPER_MODEL", "base")
            device = env("OFFLINE_WHISPER_DEVICE", "cpu")
            compute = env("OFFLINE_WHISPER_COMPUTE_TYPE", "int8")
            threads = max(1, int(env("OFFLINE_CPU_THREADS", "4")))
            _whisper = await asyncio.to_thread(
                WhisperModel,
                model,
                device=device,
                compute_type=compute,
                download_root=env("OFFLINE_MODEL_DIR") or None,
                local_files_only=strict_offline(),
                cpu_threads=threads,
            )
    return _whisper


async def transcribe_whisper(path: str, language: Optional[str]) -> dict:
    model = await get_whisper()
    lang = normalize_language(language)

    def run():
        segments, info = model.transcribe(
            path,
            language=lang,
            beam_size=1,
            best_of=1,
            vad_filter=True,
            condition_on_previous_text=False,
            word_timestamps=False,
        )
        text = " ".join(s.text.strip() for s in segments if s.text.strip()).strip()
        return {
            "text": text,
            "language": getattr(info, "language", None) or lang or "auto",
            "provider": "faster-whisper",
            "model": env("OFFLINE_WHISPER_MODEL", "base"),
        }

    return await asyncio.to_thread(run)


async def transcribe_mms(path: str, language: Optional[str]) -> dict:
    global _mms_model, _mms_processor, _mms_lang
    if not module_available("transformers") or not module_available("torch"):
        raise RuntimeError("Install requirements-offline.txt for Meta MMS")
    lang = normalize_language(language)
    if not lang:
        raise HTTPException(status_code=400, detail="MMS mode needs an explicit language code")
    target = ISO2_TO_MMS.get(lang, lang)

    async with _mms_lock:
        import librosa
        import torch
        from transformers import AutoProcessor, Wav2Vec2ForCTC

        model_id = env("MMS_MODEL_ID", "facebook/mms-1b-all")
        local_only = strict_offline()

        def run():
            global _mms_model, _mms_processor, _mms_lang
            if _mms_model is None:
                _mms_processor = AutoProcessor.from_pretrained(
                    model_id, target_lang=target, local_files_only=local_only
                )
                _mms_model = Wav2Vec2ForCTC.from_pretrained(
                    model_id,
                    target_lang=target,
                    ignore_mismatched_sizes=True,
                    local_files_only=local_only,
                )
                _mms_model.eval()
                _mms_lang = target
            elif _mms_lang != target:
                _mms_processor.tokenizer.set_target_lang(target)
                _mms_model.load_adapter(target, local_files_only=local_only)
                _mms_lang = target
            audio, _ = librosa.load(path, sr=16000, mono=True)
            inputs = _mms_processor(audio, sampling_rate=16000, return_tensors="pt")
            with torch.no_grad():
                logits = _mms_model(**inputs).logits
            ids = torch.argmax(logits, dim=-1)[0]
            return {
                "text": _mms_processor.decode(ids).strip(),
                "language": target,
                "provider": "meta-mms",
                "model": model_id,
            }

        return await asyncio.to_thread(run)


async def transcribe_openai(path: str, model: str, language: Optional[str]) -> dict:
    if not settings.OPENAI_API_KEY:
        raise RuntimeError("OPENAI_API_KEY is not configured")
    data = {
        "model": model or settings.OPENAI_STT_MODEL or "gpt-4o-mini-transcribe",
        "response_format": "json",
    }
    lang = normalize_language(language)
    if lang:
        data["language"] = lang
    with open(path, "rb") as fh:
        files = {"file": (Path(path).name, fh, "application/octet-stream")}
        async with httpx.AsyncClient(timeout=120) as client:
            response = await client.post(
                "https://api.openai.com/v1/audio/transcriptions",
                headers={"Authorization": f"Bearer {settings.OPENAI_API_KEY}"},
                data=data,
                files=files,
            )
    if response.status_code != 200:
        raise RuntimeError(response.text)
    result = response.json()
    return {
        "text": result.get("text", "").strip(),
        "language": result.get("language") or lang or "auto",
        "provider": "openai",
        "model": data["model"],
    }


async def transcribe(path: str, language: Optional[str] = None, model: str = "") -> dict:
    mode = env("VOICE_MODE", "auto").lower()
    engine = env("OFFLINE_STT_ENGINE", "faster-whisper").lower()
    if mode == "cloud" and settings.OPENAI_API_KEY:
        return await transcribe_openai(path, model, language)
    try:
        if engine in {"mms", "meta-mms", "extended"}:
            return await transcribe_mms(path, language)
        return await transcribe_whisper(path, language)
    except Exception:
        logger.exception("Local STT failed")
        if mode != "offline" and settings.OPENAI_API_KEY:
            return await transcribe_openai(path, model, language)
        raise


async def tts_espeak(text: str, destination: Path, language: Optional[str], voice: str, speed: float) -> dict:
    if not shutil.which("espeak-ng"):
        raise RuntimeError("espeak-ng is not installed")
    lang = normalize_language(language) or "en"
    variant = VOICE_VARIANTS.get(voice.lower(), "")
    voice_spec = f"{lang}{variant}"
    wpm = max(80, min(450, int(175 * speed)))
    wav = destination if destination.suffix == ".wav" else destination.with_suffix(".wav")

    def run():
        subprocess.run(
            ["espeak-ng", "-v", voice_spec, "-s", str(wpm), "-w", str(wav), text],
            check=True,
            capture_output=True,
            text=True,
        )
        if destination.suffix == ".mp3" and shutil.which("ffmpeg"):
            subprocess.run(
                ["ffmpeg", "-y", "-loglevel", "error", "-i", str(wav), "-b:a", "128k", str(destination)],
                check=True,
            )
            wav.unlink(missing_ok=True)
            return destination
        return wav

    actual = await asyncio.to_thread(run)
    return {"provider": "espeak-ng", "model": "espeak-ng", "path": str(actual)}


async def tts_openai(text: str, destination: Path, voice: str, model: str, speed: float) -> dict:
    if not settings.OPENAI_API_KEY:
        raise RuntimeError("OPENAI_API_KEY is not configured")
    voice_map = {"roger": "onyx", "rachel": "sage", "emma": "coral", "james": "ash", "lily": "ballad", "clyde": "verse"}
    payload = {
        "model": model or settings.OPENAI_TTS_MODEL or "gpt-4o-mini-tts",
        "voice": voice_map.get(voice.lower(), voice.lower() or "alloy"),
        "input": text,
        "response_format": destination.suffix.lstrip(".") or "wav",
        "instructions": f"Speak clearly and naturally at about {speed:.2f}x speed.",
    }
    async with httpx.AsyncClient(timeout=120) as client:
        response = await client.post(
            "https://api.openai.com/v1/audio/speech",
            headers={"Authorization": f"Bearer {settings.OPENAI_API_KEY}", "Content-Type": "application/json"},
            json=payload,
        )
    if response.status_code != 200:
        raise RuntimeError(response.text)
    destination.write_bytes(response.content)
    return {"provider": "openai", "model": payload["model"], "path": str(destination)}


async def synthesize(text: str, destination: Path, language: Optional[str], voice: str, model: str, speed: float) -> dict:
    mode = env("VOICE_MODE", "auto").lower()
    preferred = env("OFFLINE_TTS_ENGINE", "auto").lower()
    if mode == "cloud" and settings.OPENAI_API_KEY:
        return await tts_openai(text, destination, voice, model, speed)
    if preferred in {"openai", "cloud"} and mode != "offline" and settings.OPENAI_API_KEY:
        return await tts_openai(text, destination, voice, model, speed)
    try:
        return await tts_espeak(text, destination, language, voice, speed)
    except Exception:
        logger.exception("Local TTS failed")
        if mode != "offline" and settings.OPENAI_API_KEY:
            return await tts_openai(text, destination, voice, model, speed)
        raise


SYSTEM_PROMPT = """You are Looca, a voice-first accessibility assistant. Reply in the same language as the user. Keep answers concise, practical, and easy to understand aloud. Do not claim a real-world action happened unless a connected tool actually completed it."""


async def reply_ollama(text: str) -> dict:
    model = env("OLLAMA_MODEL", "qwen3:4b")
    url = env("OLLAMA_BASE_URL", "http://127.0.0.1:11434").rstrip("/")
    async with httpx.AsyncClient(timeout=180) as client:
        response = await client.post(
            f"{url}/api/chat",
            json={
                "model": model,
                "stream": False,
                "messages": [
                    {"role": "system", "content": SYSTEM_PROMPT},
                    {"role": "user", "content": text},
                ],
                "options": {"temperature": 0.3},
            },
        )
    if response.status_code != 200:
        raise RuntimeError(response.text)
    return {"text": response.json().get("message", {}).get("content", "").strip(), "provider": "ollama", "model": model}


async def reply_cloud(text: str, provider: str) -> dict:
    if provider == "openai":
        key = settings.OPENAI_API_KEY
        url = "https://api.openai.com/v1/chat/completions"
        model = env("OPENAI_CHAT_MODEL", "gpt-4.1-mini")
        headers = {"Authorization": f"Bearer {key}", "Content-Type": "application/json"}
    else:
        key = settings.OPENROUTER_API_KEY
        url = "https://openrouter.ai/api/v1/chat/completions"
        model = env("OPENROUTER_CHAT_MODEL", "qwen/qwen3-30b-a3b")
        headers = {"Authorization": f"Bearer {key}", "Content-Type": "application/json", "X-Title": "Looca Voice AI"}
    if not key:
        raise RuntimeError(f"{provider} key is not configured")
    async with httpx.AsyncClient(timeout=120) as client:
        response = await client.post(
            url,
            headers=headers,
            json={"model": model, "temperature": 0.3, "messages": [{"role": "system", "content": SYSTEM_PROMPT}, {"role": "user", "content": text}]},
        )
    if response.status_code != 200:
        raise RuntimeError(response.text)
    return {"text": response.json()["choices"][0]["message"]["content"].strip(), "provider": provider, "model": model}


async def generate_reply(text: str) -> dict:
    mode = env("VOICE_MODE", "auto").lower()
    provider = env("LLM_PROVIDER", "auto").lower()
    if provider in {"ollama", "local"} or mode == "offline":
        try:
            return await reply_ollama(text)
        except Exception:
            logger.warning("Ollama unavailable")
            if mode == "offline" or provider in {"ollama", "local"}:
                return {"text": f"I heard: {text}. The local speech engine is working, but Ollama is not running.", "provider": "offline-fallback", "model": "none"}
    if mode != "offline":
        if provider in {"auto", "openai"} and settings.OPENAI_API_KEY:
            try:
                return await reply_cloud(text, "openai")
            except Exception:
                logger.warning("OpenAI unavailable")
        if provider in {"auto", "openrouter"} and settings.OPENROUTER_API_KEY:
            try:
                return await reply_cloud(text, "openrouter")
            except Exception:
                logger.warning("OpenRouter unavailable")
        if provider == "auto":
            try:
                return await reply_ollama(text)
            except Exception:
                pass
    return {"text": f"I heard: {text}. Configure Ollama for offline reasoning or a cloud model for hosted reasoning.", "provider": "safe-fallback", "model": "none"}


async def save_record(db: AsyncSession, user: User, filename: str, original: Optional[str], tool: str, insight: str, original_url: Optional[str] = None) -> AudioRecord:
    url = f"/uploads/{filename}"
    record = AudioRecord(
        user_id=user.id,
        organization_id=user.organization_id,
        filename=filename,
        original_filename=original,
        file_url=url,
        original_url=original_url or url,
        cleared_url=url,
        tool_type=tool,
        status="completed",
        ai_insight=insight,
    )
    db.add(record)
    await db.commit()
    await db.refresh(record)
    return record


@router.get("/api/offline/status")
async def offline_status():
    return {
        "mode": env("VOICE_MODE", "auto"),
        "offline_strict": strict_offline(),
        "stt": {
            "engine": env("OFFLINE_STT_ENGINE", "faster-whisper"),
            "faster_whisper_installed": module_available("faster_whisper"),
            "mms_installed": module_available("transformers") and module_available("torch"),
        },
        "tts": {"engine": env("OFFLINE_TTS_ENGINE", "auto"), "espeak_installed": bool(shutil.which("espeak-ng"))},
        "llm": {"provider": env("LLM_PROVIDER", "auto"), "model": env("OLLAMA_MODEL", "qwen3:4b")},
    }


@router.post("/api/offline/chat")
async def offline_chat(req: ChatRequest):
    reply = await generate_reply(req.text)
    return {"reply": reply["text"], "provider": reply["provider"], "model": reply["model"], "language": normalize_language(req.language) or "auto"}


@router.post("/api/offline/transcribe")
async def offline_transcribe(file: UploadFile = File(...), language: str = Form("auto")):
    suffix = Path(file.filename or "audio.webm").suffix or ".webm"
    path = UPLOAD_DIR / f"offline_stt_{time.time_ns()}{suffix}"
    path.write_bytes(await file.read())
    try:
        return await transcribe(str(path), language)
    finally:
        if env_bool("DELETE_TEMP_AUDIO", True):
            path.unlink(missing_ok=True)


@router.post("/api/offline/voice")
async def offline_voice(file: UploadFile = File(...), language: str = Form("auto"), voice: str = Form("rachel"), speed: float = Form(1.0)):
    token = time.time_ns()
    suffix = Path(file.filename or "voice.webm").suffix or ".webm"
    source = UPLOAD_DIR / f"voice_{token}_input{suffix}"
    output = UPLOAD_DIR / f"voice_{token}_reply.wav"
    source.write_bytes(await file.read())
    try:
        stt = await transcribe(str(source), language)
        transcript = stt.get("text", "").strip()
        if not transcript:
            raise HTTPException(status_code=400, detail="No speech was detected")
        reply = await generate_reply(transcript)
        tts = await synthesize(reply["text"], output, stt.get("language") or language, voice, "", speed)
        actual = Path(tts.get("path", str(output)))
        return {
            "transcript": transcript,
            "reply": reply["text"],
            "language": stt.get("language") or language,
            "audio_url": f"/uploads/{actual.name}",
            "providers": {"stt": stt["provider"], "llm": reply["provider"], "tts": tts["provider"]},
            "models": {"stt": stt.get("model"), "llm": reply.get("model"), "tts": tts.get("model")},
        }
    finally:
        if env_bool("DELETE_TEMP_AUDIO", True):
            source.unlink(missing_ok=True)


@router.post("/api/vios/tts")
async def hybrid_tts(req: TTSRequest, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    ext = "mp3" if "MP3" in req.settings.outputFormat.upper() else "wav"
    destination = UPLOAD_DIR / f"tts_{time.time_ns()}.{ext}"
    try:
        meta = await synthesize(req.text, destination, req.language, req.voice, req.model, req.settings.speed)
        actual = Path(meta.get("path", str(destination)))
        insight = f"Generated with {meta['provider']} in {env('VOICE_MODE', 'auto')} mode."
        record = await save_record(db, current_user, actual.name, "tts_studio_gen.txt", "tts", insight)
        return {"id": record.id, "audio_url": f"/uploads/{actual.name}", "ai_insight": insight, "provider": meta["provider"]}
    except HTTPException:
        raise
    except Exception as error:
        logger.exception("Hybrid TTS failed")
        raise HTTPException(status_code=500, detail=str(error)) from error


@router.post("/api/vios/stt")
async def hybrid_stt(file: UploadFile = File(...), model: str = Form(""), language: str = Form("auto"), db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    suffix = Path(file.filename or "audio.webm").suffix or ".webm"
    filename = f"stt_{time.time_ns()}{suffix}"
    path = UPLOAD_DIR / filename
    path.write_bytes(await file.read())
    try:
        result = await transcribe(str(path), language, model)
        insight = f"Transcribed with {result['provider']} ({result.get('model', 'local')})."
        record = await save_record(db, current_user, filename, file.filename, "stt", insight)
        return {"id": record.id, "audio_url": f"/uploads/{filename}", "transcript": result["text"], "language": result.get("language") or language, "ai_insight": insight, "provider": result["provider"]}
    except HTTPException:
        raise
    except Exception as error:
        logger.exception("Hybrid STT failed")
        raise HTTPException(status_code=500, detail=str(error)) from error


@router.post("/api/vios/voice-changer")
async def hybrid_voice_changer(file: UploadFile = File(...), voice: str = Form("alloy"), model: str = Form(""), transcribe_model: str = Form(""), language: str = Form("auto"), db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    token = time.time_ns()
    suffix = Path(file.filename or "audio.webm").suffix or ".webm"
    source_name = f"voice_{token}_input{suffix}"
    output_name = f"voice_{token}_changed.wav"
    source = UPLOAD_DIR / source_name
    output = UPLOAD_DIR / output_name
    source.write_bytes(await file.read())
    try:
        stt = await transcribe(str(source), language, transcribe_model)
        transcript = stt.get("text", "").strip()
        if not transcript:
            raise HTTPException(status_code=400, detail="Unable to recover speech content")
        tts = await synthesize(transcript, output, stt.get("language") or language, voice, model, 1.0)
        actual = Path(tts.get("path", str(output)))
        insight = f"Voice changed with STT={stt['provider']} and TTS={tts['provider']}."
        record = await save_record(db, current_user, actual.name, file.filename, "voice-changer", insight, f"/uploads/{source_name}")
        return {"id": record.id, "original_url": f"/uploads/{source_name}", "cleared_url": f"/uploads/{actual.name}", "audio_url": f"/uploads/{actual.name}", "transcript": transcript, "language": stt.get("language") or language, "ai_insight": insight}
    except HTTPException:
        raise
    except Exception as error:
        logger.exception("Hybrid voice changer failed")
        raise HTTPException(status_code=500, detail=str(error)) from error
