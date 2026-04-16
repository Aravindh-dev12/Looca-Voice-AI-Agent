import { prisma } from '@/lib/prisma';
import { qdrantReady } from '@/lib/qdrant';

export async function GET() {
  const [qdrant, conversations, docs] = await Promise.all([
    qdrantReady(),
    prisma.conversation.count(),
    prisma.knowledgeDoc.count(),
  ]);

  return Response.json({
    ok: true,
    database: 'sqlite',
    qdrant,
    conversations,
    knowledgeDocs: docs,
  });
}
