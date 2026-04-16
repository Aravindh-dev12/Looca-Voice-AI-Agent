# Looca Voice AI

A full-stack voice-first accessibility assistant built with Next.js, Prisma, SQLite, Qdrant, and Vapi.

## What it does

- Voice-first UI for users with low literacy, language barriers, or limited device comfort
- Accessible assistant for healthcare / public-service navigation
- Context memory backed by Qdrant
- Conversation logging with Prisma + SQLite
- Vapi-ready assistant/webhook integration
- Clean dashboard for operations and analytics

## Stack

- Next.js App Router
- TypeScript
- Prisma + SQLite
- Qdrant vector database
- Vapi web voice SDK
- Deterministic local embedding fallback for demos

## Run locally

1. Copy `.env.example` to `.env`
2. Install dependencies:
   ```bash
   npm install
   ```
3. Generate Prisma client:
   ```bash
   npm run prisma:generate
   ```
4. Create the SQLite database:
   ```bash
   npx prisma migrate dev --name init
   ```
5. Seed the sample knowledge base:
   ```bash
   npm run seed
   ```
6. Start the app:
   ```bash
   npm run dev
   ```

## Qdrant setup

The app will try to use the Qdrant collection configured in `QDRANT_COLLECTION`.

The code expects a collection with a 384-dimensional vector named by default in the environment.  
Qdrant's docs recommend creating a collection first, then upserting points and querying them later. The API also exposes search/query endpoints for finding closest points. citeturn582599view3turn950178search1

## Vapi setup

The frontend voice widget uses the Vapi Web SDK pattern from the docs:

```ts
const vapi = new Vapi('YOUR_PUBLIC_API_KEY');
vapi.start('YOUR_ASSISTANT_ID');
```

Vapi also supports custom tools/webhooks for actions beyond conversation. citeturn582599view0turn582599view1

## Files worth opening first

- `src/app/page.tsx`
- `src/app/agent/page.tsx`
- `src/app/api/vapi/webhook/route.ts`
- `src/lib/qdrant.ts`
- `src/components/VoiceWidget.tsx`

## Notes

- This is a production-shaped starter, not a deployed app.
- To connect live Vapi assistant creation, fill in the Vapi env vars and adapt the assistant payload in `src/app/api/vapi/assistant/route.ts`.
- If you want the app to persist knowledge in Qdrant Cloud, set `QDRANT_URL` and `QDRANT_API_KEY`.
