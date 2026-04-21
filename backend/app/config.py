from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    # Database
    DATABASE_URL: str = "postgresql://looca:looca@localhost:5432/looca"

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

    # Redis
    REDIS_URL: str = "redis://localhost:6379/0"

    # CORS
    FRONTEND_URL: str = "http://localhost:3000"

    model_config = {"env_file": ".env", "env_file_encoding": "utf-8"}


@lru_cache()
def get_settings() -> Settings:
    return Settings()
