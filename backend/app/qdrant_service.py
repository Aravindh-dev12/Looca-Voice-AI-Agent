from typing import Optional
from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams, PointStruct, Filter, FieldCondition, MatchValue
from app.config import get_settings

import logging
logger = logging.getLogger(__name__)

settings = get_settings()

client = QdrantClient(
    url=settings.QDRANT_URL, 
    api_key=settings.QDRANT_API_KEY or None,
    check_compatibility=False
)

COLLECTIONS = {
    "services": settings.QDRANT_COLLECTION_SERVICES,
    "episodes": settings.QDRANT_COLLECTION_EPISODES,
    "health_timeline": settings.QDRANT_COLLECTION_HEALTH_TIMELINE,
    "offline_cache": settings.QDRANT_COLLECTION_OFFLINE_CACHE,
}

VECTOR_SIZE = 1024  # voyage-3-large dimension


def ensure_collections():
    for name, col_name in COLLECTIONS.items():
        try:
            client.get_collection(col_name)
        except Exception:
            try:
                client.create_collection(
                    collection_name=col_name,
                    vectors_config=VectorParams(size=VECTOR_SIZE, distance=Distance.COSINE),
                )
            except Exception as e:
                logger.warning(f"Could not create Qdrant collection {col_name}: {e}")


async def embed_text(text: str) -> list[float]:
    """Embed text using Voyage AI or deterministic fallback."""
    if settings.VOYAGE_API_KEY:
        import voyageai
        vo = voyageai.Client(api_key=settings.VOYAGE_API_KEY)
        result = vo.embed([text], model="voyage-3-large")
        return result.embeddings[0]
    else:
        return _deterministic_embed(text)


def _deterministic_embed(text: str) -> list[float]:
    """Deterministic fallback embedding for demo/development."""
    import hashlib
    import numpy as np
    h = hashlib.sha256(text.encode()).digest()
    vec = np.frombuffer(h * (VECTOR_SIZE // 32 + 1), dtype=np.float32)[:VECTOR_SIZE]
    norm = np.linalg.norm(vec)
    if norm > 0:
        vec = vec / norm
    return vec.tolist()


async def upsert_point(collection: str, point_id: str, text: str, metadata: dict):
    try:
        col_name = COLLECTIONS.get(collection, collection)
        vector = await embed_text(text)
        client.upsert(
            collection_name=col_name,
            points=[PointStruct(id=point_id, vector=vector, payload=metadata)],
        )
    except Exception as e:
        logger.warning(f"Qdrant upsert failed for {collection}: {e}")


async def search(collection: str, query: str, limit: int = 5, user_filter: Optional[dict] = None):
    try:
        col_name = COLLECTIONS.get(collection, collection)
        vector = await embed_text(query)
        qdrant_filter = None
        if user_filter:
            conditions = [FieldCondition(key=k, match=MatchValue(value=v)) for k, v in user_filter.items()]
            qdrant_filter = Filter(must=conditions)

        # Use query_points which is the universal endpoint in recent qdrant-client versions
        results = client.query_points(
            collection_name=col_name,
            query=vector,
            limit=limit,
            query_filter=qdrant_filter,
        )
        return [{"id": str(r.id), "score": r.score, "payload": r.payload} for r in results.points]
    except Exception as e:
        logger.warning(f"Qdrant query_points failed for {collection}: {e}")
        return []


async def search_with_recency(collection: str, query: str, limit: int = 5, user_id: Optional[str] = None):
    """Search with recency boost for episodic memory — recent episodes rank higher."""
    results = await search(collection, query, limit=limit * 2, user_filter={"user_id": user_id} if user_id else None)
    import time
    now = time.time()
    for r in results:
        ts = r["payload"].get("timestamp", 0)
        age_hours = (now - ts) / 3600 if ts else 9999
        recency_boost = max(0, 1 - age_hours / (30 * 24))  # decay over 30 days
        r["adjusted_score"] = r["score"] * 0.7 + recency_boost * 0.3
    results.sort(key=lambda x: x["adjusted_score"], reverse=True)
    return results[:limit]
