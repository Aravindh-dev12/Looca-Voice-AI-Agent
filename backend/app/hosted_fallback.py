"""Hosted-only fallbacks for platforms where eSpeak NG is not installed."""

import os
from pathlib import Path


def install_edge_tts_fallback(hybrid_voice) -> None:
    original = hybrid_voice.synthesize

    async def synthesize_with_hosted_fallback(text, destination, language, voice, model, speed):
        try:
            return await original(text, destination, language, voice, model, speed)
        except Exception:
            mode = os.getenv("VOICE_MODE", "auto").lower()
            if mode == "offline" or os.getenv("OFFLINE_STRICT", "false").lower() in {"1", "true", "yes", "on"}:
                raise

            import edge_tts

            lang = hybrid_voice.normalize_language(language) or "en"
            voice_map = {
                "en": "en-US-JennyNeural",
                "hi": "hi-IN-SwaraNeural",
                "ta": "ta-IN-PallaviNeural",
                "te": "te-IN-ShrutiNeural",
                "kn": "kn-IN-SapnaNeural",
                "ml": "ml-IN-SobhanaNeural",
                "bn": "bn-IN-TanishaaNeural",
                "mr": "mr-IN-AarohiNeural",
                "gu": "gu-IN-DhwaniNeural",
                "fr": "fr-FR-DeniseNeural",
                "de": "de-DE-KatjaNeural",
                "es": "es-ES-ElviraNeural",
            }
            target_voice = voice_map.get(lang, "en-US-JennyNeural")
            rate_value = int((float(speed) - 1.0) * 100)
            rate = f"+{rate_value}%" if rate_value >= 0 else f"{rate_value}%"
            actual = Path(destination).with_suffix(".mp3")
            await edge_tts.Communicate(text=text, voice=target_voice, rate=rate).save(str(actual))
            return {"provider": "edge-tts", "model": target_voice, "path": str(actual)}

    hybrid_voice.synthesize = synthesize_with_hosted_fallback
