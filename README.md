# Looca — AI Voice Agent Architecture


## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND (React)                      │
│  Next.js 15 + TypeScript + TailwindCSS + NextAuth       │
│  Pages: Overview, Voice Agent, Architecture, Enterprise │
│  Port: 3000                                             │
└──────────────────────┬──────────────────────────────────┘
                       │ API calls
┌──────────────────────▼──────────────────────────────────┐
│                  BACKEND (Python)                        │
│  FastAPI + SQLAlchemy + asyncpg                         │
│  Auth, VAPI Webhooks, Qdrant RAG, 7th Sense APIs       │
│  Port: 8000                                             │
└──────┬───────────────┬────────────────┬────────────────┘
       │               │                │
┌──────▼──────┐ ┌──────▼──────┐ ┌───────▼───────┐
│ PostgreSQL  │ │   Qdrant    │ │    Redis      │
│ Auth + Data │ │ 4 Colls:    │ │ Pre-load      │
│ Port: 5432  │ │ services    │ │ cache         │
└─────────────┘ │ episodes    │ │ Port: 6379    │
                │ health_tl   │ └───────────────┘
                │ offline     │
                │ Port: 6333  │
                └─────────────┘
```

## 4-Tier AGI Architecture

- **Tier 1 — Connectivity Fabric**: Cognitive Mesh Radio, USSD-Voice Hybrid, Phantom Signal
- **Tier 2 — Distributed Intelligence**: Federated Dialect Engine, Voice Biometric Identity, Anticipatory Pre-cache
- **Tier 3 — Cognitive AGI Layer**: Proactive Guardian, Swarm Intelligence, Predictive Bureaucracy Navigator, Cognitive Load Adaptive Interface
- **Tier 4 — ASI Vision**: Temporal Context, Multi-Modal Ambient, Neuromorphic Edge Chips, Cognitive Time Banking

## 7th Sense — AGI Ideas on VAPI + Qdrant + Claude

1. Psychoacoustic Pre-verbal Emotion Engine
2. Episodic Qdrant Memory with Temporal Decay
3. Predictive Intent Pre-loader
4. VAPI Action Agent — Claude tool_use
5. Causal Knowledge Graph — Qdrant + FalkorDB
6. Longitudinal Health Trajectory
7. Zero-Shot Service Auto-Ingestion

## Quick Start

### Prerequisites

- Node.js 18+
- Python 3.11+
- PostgreSQL 15+
- Redis 7+ (optional, for pre-loading)
- Qdrant (optional, for RAG)

### 1. Frontend Setup

```bash
# Copy env
cp .env.example .env

# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Start dev server
npm run dev
```

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows

# Install dependencies
pip install -r requirements.txt

# Copy env
cp .env.example .env

# Start FastAPI server
uvicorn app.main:app --reload --port 8000
```

### 3. Database Setup (PostgreSQL)

```bash
# Create database
createdb looca

# Run Prisma migrations (from project root)
npx prisma migrate dev
```

### 4. Seed Knowledge Base

```bash
npm run seed
```

## Environment Variables

### Frontend (.env)

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `NEXTAUTH_SECRET` | JWT secret for NextAuth |
| `NEXTAUTH_URL` | Frontend URL |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth secret |
| `NEXT_PUBLIC_VAPI_PUBLIC_KEY` | Vapi public key |
| `NEXT_PUBLIC_VAPI_ASSISTANT_ID` | Vapi assistant ID |
| `NEXT_PUBLIC_API_URL` | Python backend URL (default: http://localhost:8000) |

### Backend (backend/.env)

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `SECRET_KEY` | JWT secret for Python auth |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth secret |
| `VAPI_PRIVATE_KEY` | Vapi private key |
| `QDRANT_URL` | Qdrant instance URL |
| `QDRANT_API_KEY` | Qdrant API key |
| `VOYAGE_API_KEY` | Voyage AI embeddings key |
| `ANTHROPIC_API_KEY` | Claude API key |
| `REDIS_URL` | Redis connection URL |

## API Endpoints

### Auth
- `POST /api/auth/signup` — Create account
- `POST /api/auth/login` — Login (returns JWT)
- `GET /api/auth/me` — Get current user

### VAPI
- `POST /api/vapi/webhook` — Handle VAPI webhooks (call.started, call.ended, call.media)
- `POST /api/vapi/assistant` — Create assistant config

### Knowledge
- `POST /api/knowledge/search` — Semantic search across Qdrant collections
- `GET /api/knowledge/docs` — List knowledge documents

### 7th Sense
- `POST /api/seventh/emotion` — Psychoacoustic emotion analysis
- `GET /api/seventh/episodic-memory` — Episodic memory with temporal decay
- `GET /api/seventh/preload` — Predictive intent pre-loader
- `POST /api/seventh/tool-call` — Claude tool_use execution
- `POST /api/seventh/causal-reasoning` — Causal knowledge graph
- `POST /api/seventh/health-trajectory` — Longitudinal health tracking
- `POST /api/seventh/auto-ingest` — Zero-shot service ingestion

## Key Files

### Frontend
- `src/app/page.tsx` — Landing page with Tier 1
- `src/app/architecture/page.tsx` — 4 Tiers + Call Flow + 7th Sense
- `src/app/enterprise/page.tsx` — Personal + Enterprise perspectives
- `src/app/agent/page.tsx` — Voice agent interface
- `src/components/AuthModal.tsx` — Login/signup modal
- `src/components/VoiceWidget.tsx` — VAPI voice widget
- `src/lib/api.ts` — Python backend API client

### Backend
- `backend/app/main.py` — FastAPI app with all routes
- `backend/app/auth.py` — JWT auth + password hashing
- `backend/app/models.py` — SQLAlchemy models
- `backend/app/qdrant_service.py` — Qdrant RAG + 4 collections
- `backend/app/vapi_handler.py` — VAPI webhook handlers
- `backend/app/seventh_sense.py` — 7 AGI idea implementations
- `backend/app/config.py` — Settings from env vars

## Notes

- Built for GeeBlr Hack 2026
- Vapi handles voice orchestration (STT/TTS/telephony)
- Qdrant runs 4 collections: services, episodes, health_timeline, offline_cache
- Claude Haiku for <500ms turns, Sonnet for complex tool_use
- Deterministic embedding fallback works without Voyage AI key
