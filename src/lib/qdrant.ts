import { embedText, EMBEDDING_DIMENSION } from './embeddings';

type QdrantPoint = {
  id: string;
  title: string;
  category: string;
  content: string;
  language?: string;
  source?: string | null;
  tags?: string[];
  vector: number[];
};

type QdrantSearchResult = {
  id: string;
  score: number;
  title: string;
  category: string;
  content: string;
  source?: string | null;
  tags: string[];
};

const collection = process.env.QDRANT_COLLECTION || 'looca_knowledge';
const baseUrl = process.env.QDRANT_URL || 'http://localhost:6333';
const apiKey = process.env.QDRANT_API_KEY || '';

function headers() {
  return {
    'Content-Type': 'application/json',
    ...(apiKey ? { 'api-key': apiKey } : {}),
  };
}

async function request(path: string, init?: RequestInit) {
  const response = await fetch(`${baseUrl}${path}`, {
    ...init,
    headers: {
      ...headers(),
      ...(init?.headers || {}),
    },
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Qdrant request failed (${response.status}): ${text}`);
  }

  return response.json();
}

export async function ensureCollection() {
  try {
    await request(`/collections/${collection}`);
    return { created: false };
  } catch {
    await request(`/collections/${collection}`, {
      method: 'PUT',
      body: JSON.stringify({
        vectors: {
          size: EMBEDDING_DIMENSION,
          distance: 'Cosine',
        },
      }),
    });
    return { created: true };
  }
}

export async function upsertKnowledgePoint(point: Omit<QdrantPoint, 'vector'>) {
  try {
    const vector = embedText(`${point.title}\n${point.category}\n${point.content}\n${(point.tags || []).join(' ')}`);
    await request(`/collections/${collection}/points?wait=true`, {
      method: 'PUT',
      body: JSON.stringify({
        points: [
          {
            id: point.id,
            vector,
            payload: {
              title: point.title,
              category: point.category,
              content: point.content,
              language: point.language ?? 'en',
              source: point.source ?? null,
              tags: point.tags ?? [],
            },
          },
        ],
      }),
    });
    return true;
  } catch {
    return false;
  }
}

export async function searchKnowledge(query: string, limit = 5): Promise<QdrantSearchResult[]> {
  try {
    const vector = embedText(query);
    const payload = await request(`/collections/${collection}/points/search`, {
      method: 'POST',
      body: JSON.stringify({
        vector,
        limit,
        with_payload: true,
      }),
    });

    const matches = Array.isArray(payload?.result) ? payload.result : [];
    return matches.map((item: any) => ({
      id: String(item.id),
      score: Number(item.score ?? 0),
      title: String(item.payload?.title ?? 'Untitled'),
      category: String(item.payload?.category ?? 'general'),
      content: String(item.payload?.content ?? ''),
      source: item.payload?.source ?? null,
      tags: Array.isArray(item.payload?.tags) ? item.payload.tags : [],
    }));
  } catch {
    return [];
  }
}

export async function semanticResponse(query: string) {
  const results = await searchKnowledge(query, 3);
  const joined = results
    .map((item, index) => `${index + 1}. ${item.title} — ${item.content}`)
    .join('\n');

  return {
    results,
    summary: results.length
      ? `I found ${results.length} relevant knowledge item(s).`
      : 'No close knowledge matches yet.',
    guidance: joined,
  };
}

export function buildAssistantPrompt() {
  return [
    'You are Looca Voice AI, an inclusive voice-first assistant for accessibility and societal impact.',
    'Speak simply, clearly, and calmly.',
    'Use short sentences, avoid jargon, and support multilingual or low-literacy users.',
    'When the user is unsure, guide them step by step and confirm important details.',
    'When appropriate, call the knowledge lookup tool to retrieve relevant context before answering.',
    'Help users access healthcare, education, public services, and everyday support.',
    'When safety is involved, encourage speaking to a qualified human professional or official service.',
  ].join(' ');
}

export function buildAssistantTools() {
  return [
    {
      type: 'function',
      function: {
        name: 'lookup_context',
        description: 'Search the Looca knowledge base for relevant context.',
        parameters: {
          type: 'object',
          properties: {
            query: { type: 'string', description: 'User question or intent.' },
          },
          required: ['query'],
        },
      },
    },
  ];
}

export function mockToolPlan(query: string) {
  return {
    query,
    shouldLookup: Boolean(query.trim()),
  };
}

export async function qdrantReady() {
  try {
    await ensureCollection();
    return true;
  } catch {
    return false;
  }
}
