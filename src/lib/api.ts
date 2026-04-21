const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

type Method = 'GET' | 'POST' | 'PUT' | 'DELETE';

async function apiFetch<T>(path: string, method: Method = 'GET', body?: any): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('looca_token') : null;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(error.detail || `API Error: ${res.status}`);
  }

  return res.json();
}

export const api = {
  // Auth
  signup: (data: { name: string; email: string; password: string }) =>
    apiFetch<{ access_token: string; user: any }>('/api/auth/signup', 'POST', data),

  login: (data: { email: string; password: string }) =>
    apiFetch<{ access_token: string; user: any }>('/api/auth/login', 'POST', data),

  getMe: () => apiFetch<{ id: string; name: string; email: string; role: string }>('/api/auth/me'),

  // Knowledge
  searchKnowledge: (data: { query: string; collection?: string; limit?: number }) =>
    apiFetch<{ results: any[] }>('/api/knowledge/search', 'POST', data),

  listDocs: (category?: string) =>
    apiFetch<any[]>(`/api/knowledge/docs${category ? `?category=${category}` : ''}`),

  // Conversations
  listConversations: () => apiFetch<any[]>('/api/conversations'),

  createConversation: (data: { channel?: string; language?: string }) =>
    apiFetch<{ id: string }>('/api/conversations', 'POST', data),

  // 7th Sense
  analyzeEmotion: (data: {
    response_latency_ms?: number;
    repetition_count?: number;
    hesitation_markers?: number;
  }) => apiFetch<any>('/api/seventh/emotion', 'POST', data),

  getEpisodicMemory: (query: string) =>
    apiFetch<any>(`/api/seventh/episodic-memory?query=${encodeURIComponent(query)}`),

  getPreload: () => apiFetch<any>('/api/seventh/preload'),

  executeToolCall: (data: { tool_name: string; params: any }) =>
    apiFetch<any>('/api/seventh/tool-call', 'POST', data),

  causalReasoning: (data: { query: string }) =>
    apiFetch<any>('/api/seventh/causal-reasoning', 'POST', data),

  trackHealth: (data: { symptom: string }) =>
    apiFetch<any>('/api/seventh/health-trajectory', 'POST', data),

  autoIngest: (data: { source_url: string; title: string; content: string }) =>
    apiFetch<any>('/api/seventh/auto-ingest', 'POST', data),

  // VAPI
  vapiWebhook: (data: any) => apiFetch<any>('/api/vapi/webhook', 'POST', data),

  getAssistant: () => apiFetch<any>('/api/vapi/assistant'),

  // Health
  health: () => apiFetch<{ status: string }>('/api/health'),
};
