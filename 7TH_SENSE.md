# 7th Sense — AGI Ideas Reference

## Overview
The 7th Sense is a collection of 7 advanced AI capabilities built specifically on the VAPI + Qdrant + Claude stack. These ideas differentiate Looca from standard voice chatbots.

---

## 01. Psychoacoustic Pre-verbal Emotion Engine
**Stack**: VAPI + Claude

**What it does**: Reads fear, confusion, urgency from voice prosody BEFORE words are processed. Claude adapts its entire response strategy in the first 50ms.

**Technical implementation**:
- VAPI's `call.media` webhook provides raw audio in parallel with STT via Deepgram
- Run librosa spectral analysis on audio stream
- Extract: pitch variance, tremor, speech rate, hesitation markers
- Pass emotion vector (`fear: 0.8, confusion: 0.6, urgency: 0.3`) to Claude alongside transcript
- Claude adapts: tone, pace, complexity, calm mode activation

**API Endpoint**: `POST /api/seventh/emotion`

---

## 02. Episodic Qdrant Memory with Temporal Decay
**Stack**: Qdrant + Claude

**What it does**: Every call is stored as a semantic episode. Next call, Claude already knows 3 months of your history. Memory fades naturally like human memory.

**Technical implementation**:
- 4 Qdrant collections with different strategies:
  - `services` — sparse+dense hybrid RAG for service knowledge
  - `episodes` — temporal memory with recency boost
  - `health_timeline` — time-series symptom tracking
  - `offline_cache` — edge-deployable subset
- Voyage-3 embeddings (1024-dim) on every call
- Recency boost formula: `adjusted_score = cosine_score * 0.7 + recency_boost * 0.3`
- Decay over 30 days: old memories rank lower naturally

**API Endpoint**: `GET /api/seventh/episodic-memory?query={search}`

---

## 03. Predictive Intent Pre-loader
**Stack**: VAPI + Qdrant + Redis

**What it does**: Before the user speaks a word, Looca predicts 3 likely call reasons and pre-fetches all Qdrant chunks into Redis. First response in under 200ms.

**Technical implementation**:
- VAPI `call.started` webhook fires BEFORE user speaks (key insight competitors miss)
- Query user's top 3 recent topics from `episodes` collection
- Pre-fetch relevant chunks from `services` into Redis cache
- When STT completes, Claude already has context — zero retrieval latency
- Judges will feel the speed difference

**API Endpoint**: `GET /api/seventh/preload`

---

## 04. VAPI Action Agent — Claude tool_use Does Real Bookings
**Stack**: VAPI + Claude Sonnet + APIs

**What it does**: Looca doesn't answer "how to book" — it books. VAPI routes to Claude Sonnet with real tool_use. One voice command → actual appointment confirmed.

**Technical implementation**:
- Claude Sonnet with `tool_use` capability
- Tools defined:
  - `book_appointment(hospital, department, date)`
  - `check_bed_availability(hospital)`
  - `find_nearest_ngo(service_type, location)`
- VAPI `function_calling` routes these to real hospital/NGO APIs
- User says "book me at AIIMS" → gets confirmation number, not instructions

**API Endpoint**: `POST /api/seventh/tool-call`

---

## 05. Causal Knowledge Graph — Qdrant + FalkorDB
**Stack**: Qdrant + FalkorDB + Claude

**What it does**: Qdrant finds WHAT is relevant. FalkorDB tracks WHY things happen and what fixes them. Together they give Claude reasoning that RAG alone cannot.

**Technical implementation**:
- Qdrant: semantic similarity search (WHAT documents match)
- FalkorDB: causal chain queries (WHY was this form rejected)
- Example causal chain:
  - Form rejected → missing address proof → fix: get ration card copy
- Claude receives both retrieval + reasoning
- Difference: "here's a document" vs "here's why this happened and exactly what to do"

**API Endpoint**: `POST /api/seventh/causal-reasoning`

---

## 06. Longitudinal Health Trajectory via Time-Series Qdrant
**Stack**: Qdrant + Claude + Celery

**What it does**: Symptom mentions across months of calls are tracked as vectors. When patterns escalate, Looca makes a proactive outbound VAPI call — before the user knows they need help.

**Technical implementation**:
- Every health mention embedded and stored in `health_timeline` collection
- Metadata: user_id, symptom, timestamp, severity
- Celery background job runs trend analysis daily
- Escalation detection: 3+ mentions of same symptom in 30 days
- Trigger outbound VAPI call: "I noticed you've mentioned chest discomfort 3 times this month. Shall I connect you to a doctor?"

**API Endpoint**: `POST /api/seventh/health-trajectory`

---

## 07. Zero-Shot Service Auto-Ingestion Pipeline
**Stack**: Qdrant + Claude + Playwright

**What it does**: New scheme announced at 9am. By 9:15am every Looca user can ask about it in their language. Zero human intervention, zero retraining — pure automated RAG.

**Technical implementation**:
- Playwright scrapes government scheme pages on schedule (every 15 min)
- Claude auto-generates structured knowledge docs from raw HTML
- Voyage-3 embeds text → upsert to Qdrant `services` collection
- From announcement to queryable in <15 minutes
- No retraining, no annotation, no human in the loop

**API Endpoint**: `POST /api/seventh/auto-ingest`

---

## The Pitch That Wins

> "Every other voice AI waits for you to ask. Looca knew you were coming — it read your emotional state before you spoke, pre-loaded your context while the phone was still ringing, and already had your appointment half-booked by the time you finished your sentence."

## Immediate Demo Priorities

1. **Wire VAPI call.started → Redis pre-load** — most visible latency win, judges will feel it
2. **Add Claude tool_use for one real action** (find nearest hospital) — shows it's an agent, not a chatbot  
3. **Show episodic memory callback live** — have a "returning user" scenario where Looca says "Last time you called about X..."

## Critical Technical Insight

The key insight competitors miss:
- **VAPI `call.started`** fires BEFORE the user speaks → use for pre-loading
- **VAPI `call.media`** gives raw audio in parallel with STT → use for emotion sensing

No one else is using these events for pre-loading and emotion sensing.

## Qdrant Architecture That Judges Notice

You're running 4 separate collections with different retrieval strategies:
- `services` — service RAG with sparse+dense hybrid
- `episodes` — temporal memory with recency boost  
- `health_timeline` — time-series scrolling
- `offline_cache` — edge subset

That's not a knowledge base — that's a **multi-modal memory system**.
