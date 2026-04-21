import time
import logging
from datetime import timedelta
from typing import Optional

from fastapi import FastAPI, Depends, HTTPException, status, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, EmailStr
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import get_settings
from app.database import get_db, init_db
from app.models import User, Conversation, Message, KnowledgeDoc, VoiceSession
from app.auth import (
    verify_password,
    get_password_hash,
    create_access_token,
    get_current_user,
)
from app.qdrant_service import ensure_collections, search, upsert_point
from app.vapi_handler import handle_call_started, handle_call_ended, handle_call_media
from app.seventh_sense import (
    analyze_emotion,
    get_episodic_memory,
    predictive_preload,
    execute_tool_call,
    causal_reasoning,
    track_health_trajectory,
    auto_ingest_service,
)

logger = logging.getLogger(__name__)
settings = get_settings()

app = FastAPI(
    title="Looca AGI Voice API",
    description="Backend API for Looca — AGI/ASI Voice Architecture. VAPI + Qdrant + OpenAI.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL, "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup():
    await init_db()
    try:
        ensure_collections()
    except Exception as e:
        logger.warning(f"Qdrant collections init skipped: {e}")


# ===== SCHEMAS =====

class SignupRequest(BaseModel):
    name: str
    email: EmailStr
    password: str

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: dict

class ConversationCreate(BaseModel):
    channel: str = "voice"
    language: str = "en"
    user_name: Optional[str] = None
    user_phone: Optional[str] = None
    issue_type: Optional[str] = None

class MessageCreate(BaseModel):
    role: str
    content: str

class KnowledgeSearchRequest(BaseModel):
    query: str
    collection: str = "services"
    limit: int = 5

class EmotionRequest(BaseModel):
    response_latency_ms: float = 500
    repetition_count: int = 0
    hesitation_markers: int = 0
    speech_rate: float = 1.0
    interruptions: int = 0
    tremor_score: float = 0.0

class ToolCallRequest(BaseModel):
    tool_name: str
    params: dict

class HealthTrackRequest(BaseModel):
    symptom: str

class AutoIngestRequest(BaseModel):
    source_url: str
    title: str
    content: str


# ===== AUTH ROUTES =====

@app.post("/api/auth/signup", response_model=TokenResponse)
async def signup(req: SignupRequest, db: AsyncSession = Depends(get_db)):
    existing = await db.execute(select(User).where(User.email == req.email))
    if existing.scalar_one_or_none():
        raise HTTPException(status_code=409, detail="Email already registered")

    user = User(
        name=req.name,
        email=req.email,
        password=get_password_hash(req.password),
    )
    db.add(user)
    await db.commit()
    await db.refresh(user)

    token = create_access_token({"sub": user.id, "role": user.role})
    return TokenResponse(
        access_token=token,
        user={"id": user.id, "name": user.name, "email": user.email, "role": user.role},
    )


@app.post("/api/auth/login", response_model=TokenResponse)
async def login(req: LoginRequest, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.email == req.email))
    user = result.scalar_one_or_none()

    if not user or not user.password or not verify_password(req.password, user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token({"sub": user.id, "role": user.role})
    return TokenResponse(
        access_token=token,
        user={"id": user.id, "name": user.name, "email": user.email, "role": user.role},
    )


@app.get("/api/auth/me")
async def get_me(current_user: User = Depends(get_current_user)):
    return {"id": current_user.id, "name": current_user.name, "email": current_user.email, "role": current_user.role}


# ===== VAPI WEBHOOK ROUTES =====

@app.post("/api/vapi/webhook")
async def vapi_webhook(webhook_data: dict, db: AsyncSession = Depends(get_db)):
    """Handle all VAPI webhooks: call.started, call.ended, call.media"""
    event_type = webhook_data.get("type", webhook_data.get("message", {}).get("type", ""))

    if "started" in event_type:
        return await handle_call_started(webhook_data, db)
    elif "ended" in event_type:
        return await handle_call_ended(webhook_data, db)
    elif "media" in event_type:
        return await handle_call_media(webhook_data)
    else:
        return {"action": "unhandled", "type": event_type}


@app.post("/api/vapi/assistant")
async def create_assistant():
    """Create a VAPI assistant configuration for Looca."""
    return {
        "name": "Looca AGI Agent",
        "model": {
            "provider": "anthropic",
            "model": "claude-haiku-4-20250514",
            "system_prompt": """You are Looca, an AGI-level voice assistant built for societal impact.
You help users navigate healthcare, government services, education, and financial systems.
You adapt your language complexity based on the user's cognitive load level.
You remember past conversations and proactively offer help.
Always respond in the user's preferred language/dialect.
Be concise, empathetic, and action-oriented.""",
            "tools": [
                {
                    "type": "function",
                    "function": {
                        "name": "book_appointment",
                        "description": "Book an appointment at a hospital",
                        "parameters": {
                            "type": "object",
                            "properties": {
                                "hospital": {"type": "string"},
                                "department": {"type": "string"},
                                "date": {"type": "string"},
                            },
                            "required": ["hospital", "department"],
                        },
                    },
                },
                {
                    "type": "function",
                    "function": {
                        "name": "find_nearest_hospital",
                        "description": "Find nearest hospital with available beds",
                        "parameters": {
                            "type": "object",
                            "properties": {
                                "service_type": {"type": "string"},
                                "location": {"type": "string"},
                            },
                            "required": ["service_type"],
                        },
                    },
                },
            ],
        },
        "voice": {
            "provider": "azure",
            "voice_id": "en-IN-NeerjaNeural",
        },
        "first_message": "Hello! I'm Looca, your voice assistant. How can I help you today?",
    }


# ===== KNOWLEDGE / RAG ROUTES =====

@app.post("/api/knowledge/search")
async def knowledge_search(req: KnowledgeSearchRequest, current_user: User = Depends(get_current_user)):
    results = await search(req.collection, req.query, limit=req.limit)
    return {"results": results}


@app.get("/api/knowledge/docs")
async def list_knowledge_docs(
    category: Optional[str] = None,
    limit: int = 20,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    query = select(KnowledgeDoc).order_by(KnowledgeDoc.created_at.desc()).limit(limit)
    if category:
        query = query.where(KnowledgeDoc.category == category)
    result = await db.execute(query)
    docs = result.scalars().all()
    return [{"id": d.id, "title": d.title, "category": d.category, "language": d.language, "content": d.content[:200]} for d in docs]


# ===== CONVERSATION ROUTES =====

@app.get("/api/conversations")
async def list_conversations(
    limit: int = 20,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(
        select(Conversation)
        .where(Conversation.user_id == current_user.id)
        .order_by(Conversation.created_at.desc())
        .limit(limit)
    )
    convos = result.scalars().all()
    return [{"id": c.id, "summary": c.summary, "status": c.status, "channel": c.channel, "created_at": str(c.created_at)} for c in convos]


@app.post("/api/conversations")
async def create_conversation(
    req: ConversationCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    convo = Conversation(user_id=current_user.id, channel=req.channel, language=req.language, user_name=req.user_name, user_phone=req.user_phone, issue_type=req.issue_type)
    db.add(convo)
    await db.commit()
    await db.refresh(convo)
    return {"id": convo.id, "status": convo.status}


# ===== 7TH SENSE ROUTES =====

@app.post("/api/seventh/emotion")
async def seventh_emotion(req: EmotionRequest):
    """Idea 01: Psychoacoustic pre-verbal emotion engine."""
    return await analyze_emotion(req.model_dump())


@app.get("/api/seventh/episodic-memory")
async def seventh_episodic_memory(
    query: str = Query(...),
    limit: int = 5,
    current_user: User = Depends(get_current_user),
):
    """Idea 02: Episodic Qdrant memory with temporal decay."""
    results = await get_episodic_memory(current_user.id, query, limit=limit)
    return {"episodes": results}


@app.get("/api/seventh/preload")
async def seventh_preload(current_user: User = Depends(get_current_user)):
    """Idea 03: Predictive intent pre-loader."""
    return await predictive_preload(current_user.id)


@app.post("/api/seventh/tool-call")
async def seventh_tool_call(req: ToolCallRequest, current_user: User = Depends(get_current_user)):
    """Idea 04: VAPI action agent — Claude tool_use does real bookings."""
    return await execute_tool_call(req.tool_name, req.params)


@app.post("/api/seventh/causal-reasoning")
async def seventh_causal_reasoning(req: KnowledgeSearchRequest, current_user: User = Depends(get_current_user)):
    """Idea 05: Causal knowledge graph — Qdrant + FalkorDB."""
    return await causal_reasoning(req.query)


@app.post("/api/seventh/health-trajectory")
async def seventh_health_trajectory(req: HealthTrackRequest, current_user: User = Depends(get_current_user)):
    """Idea 06: Longitudinal health trajectory."""
    return await track_health_trajectory(current_user.id, req.symptom)


@app.post("/api/seventh/auto-ingest")
async def seventh_auto_ingest(req: AutoIngestRequest, current_user: User = Depends(get_current_user)):
    """Idea 07: Zero-shot service auto-ingestion pipeline."""
    return await auto_ingest_service(req.source_url, req.title, req.content)


# ===== HEALTH CHECK =====

@app.get("/api/health")
async def health():
    return {"status": "ok", "service": "Looca AGI Voice API", "version": "1.0.0"}
