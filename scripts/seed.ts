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

  // Create sample conversations for history display
  const sampleConversations = [
    {
      userName: 'Aravindh',
      issueType: 'Healthcare',
      language: 'en',
      status: 'completed',
      summary: 'Asked about clinic appointment booking process',
      messages: [
        { role: 'user', content: 'How do I book a clinic appointment?' },
        { role: 'assistant', content: 'To book an appointment at the Community Health Center, call 555-0199 between 9 AM and 4 PM.' },
      ],
    },
    {
      userName: 'Priya',
      issueType: 'Education',
      language: 'en',
      status: 'completed',
      summary: 'Inquired about adult literacy program registration',
      messages: [
        { role: 'user', content: 'I want to join reading classes' },
        { role: 'assistant', content: 'We offer free reading classes every Saturday at the Community Center. I can help you sign up.' },
      ],
    },
    {
      userName: 'Visitor',
      issueType: 'Finance',
      language: 'en',
      status: 'open',
      summary: 'Asked about micro-loan eligibility requirements',
      messages: [
        { role: 'user', content: 'Tell me about small business loans' },
      ],
    },
  ];

  for (const convo of sampleConversations) {
    const conversation = await prisma.conversation.create({
      data: {
        userName: convo.userName,
        issueType: convo.issueType,
        language: convo.language,
        status: convo.status,
        summary: convo.summary,
      },
    });

    for (const msg of convo.messages) {
      await prisma.message.create({
        data: {
          role: msg.role,
          content: msg.content,
          conversationId: conversation.id,
        },
      });
    }
  }

  console.log(`Seed complete: ${docs.length} knowledge docs, ${sampleConversations.length} sample conversations`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
