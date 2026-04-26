
import { prisma } from '@/lib/prisma';
import { ensureCollection, upsertKnowledgePoint } from '@/lib/qdrant';
import { safeJsonParse } from '@/lib/utils';

export async function POST() {
  await ensureCollection();

  const docs = await prisma.knowledgeDoc.findMany();
  let synced = 0;

  for (const doc of docs) {
    const ok = await upsertKnowledgePoint({
      id: doc.id,
      title: doc.title,
      category: doc.category,
      content: doc.content,
      language: doc.language,
      source: doc.source,
      tags: safeJsonParse<string[]>(doc.tagsJson, []),
    });
    if (ok) synced += 1;
  }

  return Response.json({
    ok: true,
    ingested: synced,
    total: docs.length,
  });
}
