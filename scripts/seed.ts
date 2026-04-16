import { prisma } from '../src/lib/prisma';
import { ensureCollection, upsertKnowledgePoint } from '../src/lib/qdrant';
import docs from '../data/seed-docs.json' with { type: 'json' };

async function main() {
  await ensureCollection();

  for (const doc of docs) {
    const knowledge = await prisma.knowledgeDoc.create({
      data: {
        title: doc.title,
        category: doc.category,
        language: doc.language,
        source: doc.source,
        content: doc.content,
        tagsJson: JSON.stringify(doc.tags),
      },
    });

    await upsertKnowledgePoint({
      id: knowledge.id,
      title: knowledge.title,
      category: knowledge.category,
      content: knowledge.content,
      language: knowledge.language,
      source: knowledge.source,
      tags: doc.tags,
    });
  }

  console.log('Seed complete (Knowledge points only)');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
