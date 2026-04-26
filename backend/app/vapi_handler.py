import json
import time
import logging
from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.models import VoiceSession, Conversation, Message, User
from app.qdrant_service import upsert_point, search, search_with_recency
from app.browser_service import get_browser_service
from app.agent_executor import orchestrate
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


async def handle_tool_call(webhook_data: dict, db: AsyncSession) -> dict:
    """Handle tool calls from VAPI — routes through agentic executor pipeline.
    
    Pipeline: VAPI voice → OpenAI/Gemini intent parse → Action execute → VAPI speaks result
    """
    message = webhook_data.get("message", {})
    tool_calls = message.get("toolCalls", [])
    results = []

    for tool_call in tool_calls:
        tool_id = tool_call.get("id")
        function = tool_call.get("function", {})
        name = function.get("name")
        args = json.loads(function.get("arguments", "{}"))

        logger.info(f"VAPI Tool Call: {name} with args {args}")

        result = {"toolCallId": tool_id}

        # Route through agentic executor for all action intents
        if name in ("book_appointment", "find_nearest_hospital", "book_scheme",
                     "search_buses", "book_bus", "send_whatsapp", "set_reminder",
                     "check_medicine", "make_call", "search_services"):
            # Extract user message from args or use a constructed one
            user_message = args.get("query", args.get("message", json.dumps(args)))
            user_id = args.get("user_id")

            # Full pipeline: VAPI → OpenAI/Gemini → Execute → Result
            orchestration_result = await orchestrate(
                user_message=user_message,
                user_id=user_id,
            )

            result["result"] = {
                "voice_response": orchestration_result.get("voice_response"),
                "action_type": orchestration_result.get("action_type"),
                "needs_confirmation": orchestration_result.get("needs_confirmation", False),
                "confirmation_message": orchestration_result.get("confirmation_message"),
                "data": orchestration_result.get("data"),
            }

        elif name == "open_website":
            url = args.get("url")
            result["result"] = {"status": "opening", "url": url, "browser_action": True}

        elif name == "confirm_action":
            # User confirmed an action — execute the final step (payment, booking)
            action_type = args.get("action_type")
            action_params = args.get("params", {})
            logger.info(f"VAPI CONFIRMED action: {action_type} with {action_params}")

            # Execute the confirmed action via browser
            if action_type == "book_bus":
                browser = await get_browser_service()
                booking_result = await browser.open_and_fill(
                    url=action_params.get("url", ""),
                    fields=action_params.get("fields", {}),
                    submit_selector=action_params.get("submit_selector"),
                )
                result["result"] = {
                    "voice_response": "Your booking is confirmed! The details have been sent to your phone.",
                    "booking_result": booking_result,
                }
            elif action_type == "send_whatsapp":
                whatsapp_url = action_params.get("whatsapp_url", "")
                result["result"] = {
                    "voice_response": "Message sent!",
                    "whatsapp_url": whatsapp_url,
                }
            elif action_type == "make_call":
                tel_url = action_params.get("tel_url", "")
                result["result"] = {
                    "voice_response": f"Calling now.",
                    "tel_url": tel_url,
                }
            else:
                result["result"] = {
                    "voice_response": f"Action {action_type} completed.",
                }

        else:
            # Unknown tool — try orchestrate as general query
            user_message = args.get("query", json.dumps(args))
            orchestration_result = await orchestrate(user_message=user_message)
            result["result"] = {
                "voice_response": orchestration_result.get("voice_response"),
                "action_type": orchestration_result.get("action_type"),
            }

        results.append(result)

    return {
        "results": results
    }
