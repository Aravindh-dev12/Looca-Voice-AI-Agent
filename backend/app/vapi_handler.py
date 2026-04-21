import json
import time
import logging
from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.models import VoiceSession, Conversation, Message, User
from app.qdrant_service import upsert_point, search, search_with_recency
from app.config import get_settings

logger = logging.getLogger(__name__)
settings = get_settings()


async def handle_call_started(webhook_data: dict, db: AsyncSession) -> dict:
    """VAPI call.started webhook — fires BEFORE user speaks.
    Idea 03: Predictive intent pre-loader.
    """
    call_id = webhook_data.get("call", {}).get("id", "unknown")
    phone = webhook_data.get("call", {}).get("customer", {}).get("number", "")
    user_id = None

    # Find user by phone
    if phone:
        result = await db.execute(select(User).where(User.id == phone).limit(1))
        user = result.scalar_one_or_none()
        if user:
            user_id = user.id

    # Create voice session
    session = VoiceSession(
        call_id=call_id,
        provider="vapi",
        status="active",
        notes=json.dumps({"phone": phone, "user_id": user_id}),
    )
    db.add(session)
    await db.commit()

    # Pre-load: predict 3 likely call reasons from episodic memory
    preloaded_context = []
    if user_id:
        try:
            episodes = await search_with_recency(
                "episodes",
                f"user {user_id} recent calls",
                limit=3,
                user_id=user_id,
            )
            preloaded_context = [e["payload"] for e in episodes]
        except Exception as e:
            logger.warning(f"Pre-load failed: {e}")

    return {
        "action": "preloaded",
        "call_id": call_id,
        "user_id": user_id,
        "preloaded_topics": preloaded_context,
    }


async def handle_call_ended(webhook_data: dict, db: AsyncSession) -> dict:
    """VAPI call.ended webhook — store episodic memory.
    Idea 02: Episodic Qdrant memory with temporal decay.
    """
    call_id = webhook_data.get("call", {}).get("id", "unknown")
    transcript = webhook_data.get("call", {}).get("transcript", [])
    summary = webhook_data.get("call", {}).get("summary", "")
    phone = webhook_data.get("call", {}).get("customer", {}).get("number", "")

    # Update voice session
    result = await db.execute(select(VoiceSession).where(VoiceSession.call_id == call_id))
    session = result.scalar_one_or_none()
    if session:
        session.status = "completed"
        session.notes = json.dumps({"summary": summary, "phone": phone})

    # Create conversation record
    conversation = Conversation(
        channel="voice",
        summary=summary,
        status="completed",
    )
    db.add(conversation)
    await db.commit()
    await db.refresh(conversation)

    # Store messages
    for msg in transcript:
        message = Message(
            role=msg.get("role", "user"),
            content=msg.get("content", ""),
            conversation_id=conversation.id,
        )
        db.add(message)

    # Store as episodic memory in Qdrant
    episode_text = summary or " ".join(m.get("content", "") for m in transcript[:5])
    if episode_text:
        try:
            await upsert_point(
                "episodes",
                point_id=conversation.id,
                text=episode_text,
                metadata={
                    "user_id": session.notes and json.loads(session.notes).get("user_id"),
                    "conversation_id": conversation.id,
                    "timestamp": time.time(),
                    "summary": summary,
                    "channel": "voice",
                },
            )
        except Exception as e:
            logger.warning(f"Episodic memory write failed: {e}")

    await db.commit()
    return {"action": "stored", "conversation_id": conversation.id}


async def handle_call_media(webhook_data: dict) -> dict:
    """VAPI call.media webhook — raw audio in parallel with STT.
    Idea 01: Psychoacoustic pre-verbal emotion engine.
    """
    # In production, this would run librosa analysis on the audio stream
    # For demo, we return a simulated emotion vector
    return {
        "action": "emotion_analysis",
        "emotion_vector": {
            "fear": 0.1,
            "confusion": 0.3,
            "urgency": 0.2,
            "calm": 0.7,
        },
        "cognitive_load_level": 3,
    }
