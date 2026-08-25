"""Hybrid/offline entrypoint for Looca."""

from app.main import app
from app import hybrid_voice
from app.hosted_fallback import install_edge_tts_fallback

OVERRIDDEN = {
    ("POST", "/api/vios/tts"),
    ("POST", "/api/vios/stt"),
    ("POST", "/api/vios/voice-changer"),
}


def keep_route(route):
    path = getattr(route, "path", None)
    methods = getattr(route, "methods", set()) or set()
    return not any(path == p and method in methods for method, p in OVERRIDDEN)


install_edge_tts_fallback(hybrid_voice)
app.router.routes = [route for route in app.router.routes if keep_route(route)]
app.include_router(hybrid_voice.router)
