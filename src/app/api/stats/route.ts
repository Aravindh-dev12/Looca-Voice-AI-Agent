import { prisma } from '@/lib/prisma';

export async function GET() {
  const [conversations, docs, sessions, openCases] = await Promise.all([
    prisma.conversation.count(),
    prisma.knowledgeDoc.count(),
    prisma.voiceSession.count(),
    prisma.conversation.count({ where: { status: 'open' } }),
  ]);

  return Response.json({
    conversations,
    docs,
    sessions,
    openCases,
  });
}
