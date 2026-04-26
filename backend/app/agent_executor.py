"""
Looca Agentic Executor — VAPI + OpenAI + Gemini + Qdrant + Browser Pipeline

Architecture:
  User speaks → VAPI transcribes → Intent parsed by OpenAI/Gemini
  → Action executed (browser automation, API calls, Qdrant lookup)
  → Result formatted → VAPI speaks back to user

Flow for "Book a bus to Chennai tomorrow":
  1. VAPI: Receives voice, transcribes to text
  2. OpenAI/Gemini: Parses intent → {action: "search_buses", from: "Bangalore", to: "Chennai", date: "tomorrow"}
  3. Browser: Opens RedBus/MakeMyTrip, searches buses, extracts results
  4. OpenAI/Gemini: Formats results into natural voice response
  5. VAPI: Speaks "3 buses available. 6:30 AM KPN Travels... which one?"
  6. User picks → OpenAI/Gemini: Executes booking via browser
  7. VAPI: Asks "Confirm booking for 6:30 AM KPN? Say yes to confirm."
  8. User confirms → Browser completes booking → VAPI confirms
"""
import json
import time
import logging
from typing import Optional, Dict, Any, List
from app.qdrant_service import search, upsert_point, search_with_recency
from app.browser_service import get_browser_service
from app.config import get_settings

logger = logging.getLogger(__name__)
settings = get_settings()


# ===== INTENT PARSING =====

INTENT_SYSTEM_PROMPT = """You are Looca's intent parser. Given a user's voice message, extract:
1. The primary action the user wants
2. All relevant parameters
3. Whether user confirmation is needed before execution

Return ONLY a JSON object with this structure:
{
  "intent": "search_buses" | "book_bus" | "book_appointment" | "send_whatsapp" | "find_hospital" | "set_reminder" | "check_medicine" | "make_call" | "general_query",
  "params": { ... relevant key-value pairs ... },
  "needs_confirmation": true/false,
  "confirmation_message": "what to ask the user if confirmation needed",
  "language": "detected language code"
}

Intent mapping:
- "book bus", "bus ticket", "travel by bus" → search_buses / book_bus
- "book train", "railway ticket" → search_trains / book_train
- "hospital", "doctor appointment" → book_appointment
- "send message", "whatsapp" → send_whatsapp
- "nearest hospital", "pharmacy near" → find_hospital
- "remind me", "medicine time" → set_reminder
- "this medicine", "pill check" → check_medicine
- "call my son", "phone call" → make_call
- anything else → general_query

For search intents: needs_confirmation = false (just show results)
For booking/payment intents: needs_confirmation = true (must ask before executing)
"""


async def parse_intent(user_message: str, conversation_history: List[Dict] = None) -> Dict[str, Any]:
    """Step 1: Parse user intent using OpenAI or Gemini."""
    messages = [
        {"role": "system", "content": INTENT_SYSTEM_PROMPT},
    ]
    if conversation_history:
        messages.extend(conversation_history[-6:])
    messages.append({"role": "user", "content": user_message})

    # Try Gemini first (faster, cheaper)
    if settings.GEMINI_API_KEY:
        try:
            import google.generativeai as genai
            genai.configure(api_key=settings.GEMINI_API_KEY)
            model = genai.GenerativeModel('gemini-2.0-flash-001')
            response = model.generate_content(
                json.dumps(messages[-2:]),  # Last 2 messages for speed
                generation_config={"response_mime_type": "application/json"}
            )
            return json.loads(response.text)
        except Exception as e:
            logger.warning(f"Gemini intent parse failed: {e}, trying OpenAI...")

    # Try OpenAI
    if settings.OPENAI_API_KEY:
        try:
            import httpx
            headers = {
                "Authorization": f"Bearer {settings.OPENAI_API_KEY}",
                "Content-Type": "application/json",
            }
            payload = {
                "model": "gpt-4o-mini",
                "messages": messages,
                "response_format": {"type": "json_object"},
                "max_tokens": 300,
                "temperature": 0.1,
            }
            async with httpx.AsyncClient(timeout=15.0) as client:
                response = await client.post(
                    "https://api.openai.com/v1/chat/completions",
                    headers=headers,
                    json=payload,
                )
            if response.status_code == 200:
                data = response.json()
                return json.loads(data["choices"][0]["message"]["content"])
        except Exception as e:
            logger.warning(f"OpenAI intent parse failed: {e}")

    # Fallback: simple keyword matching
    return _fallback_intent_parse(user_message)


def _fallback_intent_parse(message: str) -> Dict[str, Any]:
    """Simple keyword-based intent parsing when AI is unavailable."""
    msg_lower = message.lower()
    if any(kw in msg_lower for kw in ["bus", "travel", "ticket"]):
        return {"intent": "search_buses", "params": {"query": message}, "needs_confirmation": False, "language": "en"}
    elif any(kw in msg_lower for kw in ["hospital", "doctor", "appointment"]):
        return {"intent": "book_appointment", "params": {"query": message}, "needs_confirmation": True, "confirmation_message": "Should I book this appointment?", "language": "en"}
    elif any(kw in msg_lower for kw in ["whatsapp", "send message", "message"]):
        return {"intent": "send_whatsapp", "params": {"query": message}, "needs_confirmation": True, "confirmation_message": "Should I send this message?", "language": "en"}
    elif any(kw in msg_lower for kw in ["medicine", "pill", "tablet"]):
        return {"intent": "check_medicine", "params": {"query": message}, "needs_confirmation": False, "language": "en"}
    elif any(kw in msg_lower for kw in ["remind", "reminder"]):
        return {"intent": "set_reminder", "params": {"query": message}, "needs_confirmation": False, "language": "en"}
    elif any(kw in msg_lower for kw in ["call", "phone"]):
        return {"intent": "make_call", "params": {"query": message}, "needs_confirmation": True, "confirmation_message": "Should I make this call?", "language": "en"}
    return {"intent": "general_query", "params": {"query": message}, "needs_confirmation": False, "language": "en"}


# ===== ACTION EXECUTORS =====

async def execute_search_buses(params: Dict[str, Any]) -> Dict[str, Any]:
    """Search for buses on RedBus/MakeMyTrip using browser automation."""
    from_location = params.get("from", params.get("source", ""))
    to_location = params.get("to", params.get("destination", ""))
    date = params.get("date", params.get("when", "tomorrow"))

    # Step 1: Use Gemini/OpenAI to construct the search URL and extract info
    search_url = await _ai_construct_url("bus", from_location, to_location, date)

    # Step 2: Browser automation to search
    try:
        browser = await get_browser_service()
        result = await browser.search_and_extract(
            url=search_url,
            selectors={
                "bus_list": ".bus-item, .bus-card, [data-testid='bus-item']",
                "bus_name": ".bus-name, .travels-name, [data-testid='travels-name']",
                "departure": ".dep-time, .departure-time",
                "arrival": ".arr-time, .arrival-time",
                "price": ".fare, .price, .bus-fare",
                "seats": ".seat-count, .available-seats",
            }
        )

        if result.get("status") == "success" and result.get("data"):
            # Step 3: Use AI to format results for voice
            formatted = await _ai_format_results("bus", result["data"], params)
            return {
                "status": "found",
                "results": formatted,
                "voice_response": formatted.get("voice_response", "I found some buses. Let me tell you about them."),
                "action_type": "search_buses",
                "needs_user_choice": True,
            }
    except Exception as e:
        logger.error(f"Bus search browser error: {e}")

    # Fallback: AI-generated results based on knowledge
    return await _ai_fallback_search("bus", params)


async def execute_book_bus(params: Dict[str, Any]) -> Dict[str, Any]:
    """Execute bus booking via browser automation after user confirmation."""
    bus_details = params.get("bus_details", {})
    user_info = params.get("user_info", {})

    try:
        browser = await get_browser_service()
        search_url = await _ai_construct_url(
            "bus",
            bus_details.get("from", ""),
            bus_details.get("to", ""),
            bus_details.get("date", "tomorrow")
        )

        # Navigate and select the specific bus
        result = await browser.open_and_fill(
            url=search_url,
            fields={
                "input[from]": bus_details.get("from", ""),
                "input[to]": bus_details.get("to", ""),
            },
        )

        return {
            "status": "booking_initiated",
            "voice_response": f"Booking your bus from {bus_details.get('from')} to {bus_details.get('to')}. I need your confirmation to proceed with payment.",
            "action_type": "book_bus",
            "needs_confirmation": True,
            "confirmation_message": f"Confirm booking for {bus_details.get('name', 'the bus')} at {bus_details.get('departure', 'the selected time')}? Say yes to confirm.",
            "payment_required": True,
        }
    except Exception as e:
        logger.error(f"Bus booking error: {e}")
        return {
            "status": "error",
            "voice_response": "I had trouble booking the bus. Let me try a different way.",
            "action_type": "book_bus",
        }


async def execute_book_appointment(params: Dict[str, Any]) -> Dict[str, Any]:
    """Book a hospital/doctor appointment."""
    hospital = params.get("hospital", "")
    department = params.get("department", params.get("speciality", ""))
    date = params.get("date", "tomorrow")

    # Search Qdrant for hospital info
    hospital_info = await search("services", f"hospital {hospital} {department}", limit=3)

    if hospital_info:
        info = hospital_info[0]["payload"]
        return {
            "status": "found",
            "hospital_info": info,
            "voice_response": f"I found {info.get('title', hospital)}. {info.get('content', '')[:200]}. Should I book an appointment for {date}?",
            "action_type": "book_appointment",
            "needs_confirmation": True,
            "confirmation_message": f"Book appointment at {info.get('title', hospital)} for {department} on {date}? Say yes to confirm.",
        }

    # Fallback: AI-generated guidance
    return await _ai_fallback_search("appointment", params)


async def execute_send_whatsapp(params: Dict[str, Any]) -> Dict[str, Any]:
    """Send a WhatsApp message."""
    contact = params.get("contact", params.get("to", params.get("name", "")))
    message = params.get("message", params.get("text", ""))

    return {
        "status": "ready",
        "voice_response": f"I'll send a WhatsApp message to {contact} saying: {message}. Should I send it?",
        "action_type": "send_whatsapp",
        "needs_confirmation": True,
        "confirmation_message": f"Send WhatsApp to {contact}: '{message}'? Say yes to send.",
        "whatsapp_url": f"https://wa.me/?text={message}",
    }


async def execute_find_hospital(params: Dict[str, Any]) -> Dict[str, Any]:
    """Find nearest hospital/pharmacy."""
    service_type = params.get("service_type", params.get("type", "hospital"))
    location = params.get("location", "")

    results = await search("services", f"{service_type} near {location}", limit=5)

    if results:
        formatted = [r["payload"] for r in results[:3]]
        voice_text = ". ".join([
            f"{r.get('title', 'Option')}: {r.get('content', '')[:100]}"
            for r in formatted
        ])
        return {
            "status": "found",
            "results": formatted,
            "voice_response": f"I found {len(formatted)} {service_type}s near you. {voice_text}",
            "action_type": "find_hospital",
        }

    return await _ai_fallback_search("hospital", params)


async def execute_set_reminder(params: Dict[str, Any]) -> Dict[str, Any]:
    """Set a medication/reminder."""
    reminder_text = params.get("text", params.get("reminder", params.get("medicine", "")))
    time_str = params.get("time", params.get("when", ""))

    # Store in Qdrant for future retrieval
    await upsert_point(
        "episodes",
        point_id=f"reminder_{int(time.time())}",
        text=f"Reminder: {reminder_text} at {time_str}",
        metadata={
            "type": "reminder",
            "text": reminder_text,
            "time": time_str,
            "timestamp": time.time(),
        }
    )

    return {
        "status": "set",
        "voice_response": f"Okay, I've set a reminder: {reminder_text} at {time_str}. I'll remind you when it's time.",
        "action_type": "set_reminder",
    }


async def execute_check_medicine(params: Dict[str, Any]) -> Dict[str, Any]:
    """Check medicine information and interactions."""
    medicine = params.get("medicine", params.get("name", params.get("pill", "")))

    # Search Qdrant for medicine info
    results = await search("services", f"medicine {medicine} interaction dosage", limit=3)

    if results:
        info = results[0]["payload"]
        return {
            "status": "found",
            "voice_response": f"About {medicine}: {info.get('content', '')[:300]}",
            "action_type": "check_medicine",
        }

    return await _ai_fallback_search("medicine", params)


async def execute_make_call(params: Dict[str, Any]) -> Dict[str, Any]:
    """Make a phone call to a contact."""
    contact = params.get("contact", params.get("name", params.get("who", "")))
    phone = params.get("phone", params.get("number", ""))

    return {
        "status": "ready",
        "voice_response": f"I'll call {contact} at {phone}. Should I dial now?",
        "action_type": "make_call",
        "needs_confirmation": True,
        "confirmation_message": f"Call {contact}? Say yes to dial.",
        "tel_url": f"tel:{phone}",
    }


async def execute_general_query(params: Dict[str, Any], user_message: str) -> Dict[str, Any]:
    """Handle general queries with OpenAI/Gemini + Qdrant context."""
    # Search Qdrant for relevant context
    qdrant_results = await search("services", user_message, limit=3)
    context = ""
    if qdrant_results:
        context = "\n\nRelevant knowledge:\n" + "\n".join([
            f"- {r['payload'].get('title', '')}: {r['payload'].get('content', '')[:200]}"
            for r in qdrant_results
        ])

    # Try Gemini
    if settings.GEMINI_API_KEY:
        try:
            import google.generativeai as genai
            genai.configure(api_key=settings.GEMINI_API_KEY)
            model = genai.GenerativeModel('gemini-2.0-flash-001')
            prompt = (
                f"You are Looca, a voice-first AI assistant for elderly and non-literate users. "
                f"Respond in short, simple sentences. No markdown. No bullet points. "
                f"Speak naturally as if on a phone call. Use the user's language."
                f"{context}\n\nUser: {user_message}"
            )
            response = model.generate_content(prompt)
            return {
                "status": "answered",
                "voice_response": response.text,
                "action_type": "general_query",
            }
        except Exception as e:
            logger.warning(f"Gemini general query failed: {e}")

    # Try OpenAI
    if settings.OPENAI_API_KEY:
        try:
            import httpx
            headers = {
                "Authorization": f"Bearer {settings.OPENAI_API_KEY}",
                "Content-Type": "application/json",
            }
            payload = {
                "model": "gpt-4o-mini",
                "messages": [
                    {"role": "system", "content": f"You are Looca, a voice-first AI assistant. Respond in short, simple sentences for elderly users. No markdown. Speak naturally.{context}"},
                    {"role": "user", "content": user_message},
                ],
                "max_tokens": 300,
                "temperature": 0.7,
            }
            async with httpx.AsyncClient(timeout=15.0) as client:
                response = await client.post(
                    "https://api.openai.com/v1/chat/completions",
                    headers=headers,
                    json=payload,
                )
            if response.status_code == 200:
                data = response.json()
                return {
                    "status": "answered",
                    "voice_response": data["choices"][0]["message"]["content"],
                    "action_type": "general_query",
                }
        except Exception as e:
            logger.warning(f"OpenAI general query failed: {e}")

    return {
        "status": "answered",
        "voice_response": "I'm not sure about that. Can you tell me more about what you need?",
        "action_type": "general_query",
    }


# ===== AI HELPERS =====

async def _ai_construct_url(service_type: str, from_loc: str, to_loc: str, date: str) -> str:
    """Use AI to construct the correct search URL for a service."""
    url_map = {
        "bus": f"https://www.redbus.in/bus-tickets/{from_loc.replace(' ', '-')}-to-{to_loc.replace(' ', '-')}",
        "train": f"https://www.makemytrip.com/railways/{from_loc.replace(' ' , '-')}-{to_loc.replace(' ', '-')}",
        "flight": f"https://www.makemytrip.com/flights/{from_loc.replace(' ', '-')}-{to_loc.replace(' ', '-')}",
    }
    return url_map.get(service_type, f"https://www.google.com/search?q={from_loc}+to+{to_loc}+{service_type}")


async def _ai_format_results(service_type: str, raw_data: Dict, params: Dict) -> Dict[str, Any]:
    """Use AI to format raw browser results into voice-friendly text."""
    if settings.GEMINI_API_KEY:
        try:
            import google.generativeai as genai
            genai.configure(api_key=settings.GEMINI_API_KEY)
            model = genai.GenerativeModel('gemini-2.0-flash-001')
            prompt = (
                f"Format these {service_type} search results into a short voice message for an elderly person. "
                f"Speak in simple sentences. Include: bus/travel name, departure time, arrival time, price, boarding point. "
                f"No markdown. Short and clear. In the user's language if possible.\n\n"
                f"Results: {json.dumps(raw_data)}\nParams: {json.dumps(params)}"
            )
            response = model.generate_content(prompt)
            return {"voice_response": response.text, "raw": raw_data}
        except Exception as e:
            logger.warning(f"Gemini format failed: {e}")

    return {"voice_response": f"I found some {service_type} options. Let me read them out for you.", "raw": raw_data}


async def _ai_fallback_search(service_type: str, params: Dict) -> Dict[str, Any]:
    """AI-generated fallback when browser automation fails."""
    query = params.get("query", f"{service_type} {json.dumps(params)}")

    # Try Qdrant first
    results = await search("services", query, limit=3)
    if results:
        voice = ". ".join([r["payload"].get("content", "")[:150] for r in results[:2]])
        return {
            "status": "found",
            "voice_response": voice,
            "action_type": f"search_{service_type}",
        }

    # AI fallback
    if settings.GEMINI_API_KEY or settings.OPENAI_API_KEY:
        ai_result = await execute_general_query(params, f"Help me with {service_type}: {params.get('query', '')}")
        return {
            "status": "found",
            "voice_response": ai_result.get("voice_response", f"I'll help you with {service_type}. Let me find the best options."),
            "action_type": f"search_{service_type}",
        }

    return {
        "status": "not_found",
        "voice_response": f"I'm looking for {service_type} options. Can you tell me more details?",
        "action_type": f"search_{service_type}",
    }


# ===== MAIN ORCHESTRATOR =====

# Map intents to executor functions
INTENT_EXECUTORS = {
    "search_buses": execute_search_buses,
    "book_bus": execute_book_bus,
    "book_appointment": execute_book_appointment,
    "send_whatsapp": execute_send_whatsapp,
    "find_hospital": execute_find_hospital,
    "set_reminder": execute_set_reminder,
    "check_medicine": execute_check_medicine,
    "make_call": execute_make_call,
}


async def orchestrate(user_message: str, conversation_history: List[Dict] = None, user_id: str = None) -> Dict[str, Any]:
    """
    Main orchestrator — the full VAPI + OpenAI + Gemini + Qdrant pipeline.
    """
    try:
        start_time = time.time()

        # Step 1: Parse intent (Gemini/OpenAI)
        intent_data = await parse_intent(user_message, conversation_history)
        intent = intent_data.get("intent", "general_query")
        params = intent_data.get("params", {})
        language = intent_data.get("language", "en")

        logger.info(f"Orchestrator: intent={intent}, params={params}, lang={language}")

        # Step 2: Execute action
        if intent in INTENT_EXECUTORS:
            executor = INTENT_EXECUTORS[intent]
            result = await executor(params)
        else:
            result = await execute_general_query(params, user_message)

        # Step 3: Store episodic memory in Qdrant
        if user_id:
            try:
                await upsert_point(
                    "episodes",
                    point_id=f"ep_{user_id}_{int(time.time())}",
                    text=f"{intent}: {user_message}",
                    metadata={
                        "user_id": user_id,
                        "intent": intent,
                        "params": params,
                        "result_status": result.get("status", "unknown"),
                        "timestamp": time.time(),
                        "language": language,
                    }
                )
            except Exception as e:
                logger.warning(f"Episodic memory store failed: {e}")

        # Step 4: Format response for VAPI
        elapsed = round((time.time() - start_time) * 1000)
        logger.info(f"Orchestrator completed in {elapsed}ms: intent={intent}, status={result.get('status')}")

        return {
            "voice_response": result.get("voice_response", "I'm processing your request. One moment please."),
            "action_type": result.get("action_type", intent),
            "needs_confirmation": result.get("needs_confirmation", False) or intent_data.get("needs_confirmation", False),
            "confirmation_message": result.get("confirmation_message") or intent_data.get("confirmation_message"),
            "data": result,
            "language_detected": language,
            "processing_time_ms": elapsed,
        }
    except Exception as e:
        logger.error(f"ORCHESTRATION CRITICAL ERROR: {e}", exc_info=True)
        return {
            "voice_response": "I'm sorry, I'm having a bit of trouble connecting to my brain right now. Can we try that again?",
            "action_type": "error",
            "error": str(e)
        }
