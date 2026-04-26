from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    # Database (SQLite for dev, PostgreSQL for prod)
    DATABASE_URL: str = "sqlite:///./looca_v2.db"

    # Auth
    SECRET_KEY: str = "looca-dev-secret-change-in-prod"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours

    # Google OAuth
    GOOGLE_CLIENT_ID: str = ""
    GOOGLE_CLIENT_SECRET: str = ""

    # VAPI
    VAPI_PRIVATE_KEY: str = ""
    VAPI_ASSISTANT_ID: str = ""

    # Qdrant
    QDRANT_URL: str = "http://localhost:6333"
    QDRANT_API_KEY: str = ""
    QDRANT_COLLECTION_SERVICES: str = "looca_services"
    QDRANT_COLLECTION_EPISODES: str = "looca_episodes"
    QDRANT_COLLECTION_HEALTH_TIMELINE: str = "looca_health_timeline"
    QDRANT_COLLECTION_OFFLINE_CACHE: str = "looca_offline_cache"

    # Voyage AI
    VOYAGE_API_KEY: str = ""

    # OpenAI
    OPENAI_API_KEY: str = ""
    OPENAI_TTS_MODEL: str = "gpt-4o-mini-tts"
    OPENAI_STT_MODEL: str = "gpt-4o-mini-transcribe"

    # Redis
    REDIS_URL: str = "redis://localhost:6379/0"

    # CORS
    FRONTEND_URL: str = "http://localhost:3000"

    # AI Models & Providers
    OPENAI_API_KEY: str = ""
    GEMINI_API_KEY: str = ""
    OPENROUTER_API_KEY: str = ""
    MODEL_LYRIA_PRO: str = "google/lyria-3-pro-preview"
    MODEL_LYRIA_CLIP: str = "google/lyria-3-clip-preview"
    MODEL_GPT_AUDIO: str = "openai/gpt-audio"

    model_config = {"env_file": ".env", "env_file_encoding": "utf-8", "extra": "ignore"}


@lru_cache()
def get_settings() -> Settings:
    return Settings()
