import { prisma } from '@/lib/prisma';
import { buildWebhookSummary } from '@/lib/vapi';
import { ensureCollection, upsertKnowledgePoint } from '@/lib/qdrant';
import { embedText } from '@/lib/embeddings';

export async function POST(req: Request) {
  const payload = await req.json();
  const summary = buildWebhookSummary(payload);

  const assistantId = payload?.assistant?.id || payload?.assistantId || null;
  const callId = summary.callId !== 'n/a' ? summary.callId : null;
  const transcript = summary.transcript || 'Voice event received';

  const session = await prisma.voiceSession.create({
    data: {
      provider: 'vapi',
      assistantId,
      callId,
      status: payload?.type || payload?.event || 'received',
      notes: transcript,
    },
  });

  const conversation = await prisma.conversation.create({
    data: {
      channel: 'voice',
      language: payload?.language || 'en',
      userName: payload?.customer?.name || payload?.user?.name || 'Voice user',
      issueType: payload?.topic || payload?.metadata?.issueType || 'general',
      summary: transcript.slice(0, 200),
      transcript: {
        create: [
          { role: 'assistant', content: transcript },
        ],
      },
    },
  });

  try {
    await ensureCollection();
    await upsertKnowledgePoint({
      id: conversation.id,
      title: `Conversation note: ${conversation.userName ?? 'voice user'}`,
      category: conversation.issueType || 'voice',
      content: transcript,
      language: conversation.language,
      source: `vapi:${session.id}`,
      tags: ['voice', 'memory', 'conversation'],
    });
  } catch {
    // Keep the webhook resilient even if Qdrant is unreachable.
  }

  return Response.json({
    ok: true,
    sessionId: session.id,
    conversationId: conversation.id,
    savedVectorPreview: embedText(transcript).slice(0, 5),
  });
}
