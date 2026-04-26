import { buildAssistantPrompt, buildAssistantTools } from './qdrant';

export function buildVapiAssistantConfig() {
  const assistantId = process.env.VAPI_ASSISTANT_ID || 'looca-voice-ai-assistant';
  return {
    id: assistantId,
    name: 'Looca Voice AI',
    model: {
      provider: 'openai',
      model: 'gpt-4.1-mini',
      temperature: 0.3,
      messages: [
        {
          role: 'system',
          content: buildAssistantPrompt(),
        },
      ],
    },
    voice: {
      provider: '11labs',
      voiceId: 'rachel',
    },
    firstMessage:
      'Hi, this is Looca Voice AI. I can help with simple guidance, reminders, and service navigation.',
    tools: buildVapiAssistantConfigTools(),
    serverUrl: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/vapi/webhook`,
  };
}

function buildVapiAssistantConfigTools() {
  return buildAssistantTools();
}

export function buildWebhookSummary(event: any) {
  const type = event?.type || event?.event || 'unknown';
  const callId = event?.call?.id || event?.callId || 'n/a';
  const transcript = event?.message?.content || event?.transcript || event?.content || '';
  return { type, callId, transcript };
}
