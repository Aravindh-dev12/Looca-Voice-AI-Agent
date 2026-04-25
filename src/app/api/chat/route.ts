import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { searchKnowledge, upsertKnowledgePoint } from '@/lib/qdrant';
import { LOOCA_SYSTEM_PROMPT } from '@/lib/skills_prompt';

export async function POST(req: Request) {
  try {
    const { message, userId, conversationId } = await req.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // 1. Qdrant Memory Retrieval (Adaptive Context)
    const memories = await searchKnowledge(message, 3);
    const retrievedContext = memories.length > 0 
      ? `ADAPTIVE MEMORY:\n${memories.map(m => `- ${m.content}`).join('\n')}`
      : 'No previous relevant memories.';

    // 2. Find or create conversation
    let conversation;
    if (conversationId) {
      conversation = await prisma.conversation.findUnique({
        where: { id: conversationId },
        include: { messages: { orderBy: { createdAt: 'asc' }, take: 10 } }
      });
    }

    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          userId: userId || null,
          status: 'active',
          channel: 'voice',
        },
        include: { messages: true }
      });
    }

    // 3. Save user message
    await prisma.message.create({
      data: {
        role: 'user',
        content: message,
        conversationId: conversation.id,
      },
    });

    // 4. Skills Intelligence Engine (Gemini 2.0 Flash)
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.0-flash-001',
        messages: [
          {
            role: 'system',
            content: `${LOOCA_SYSTEM_PROMPT}\n\nADAPTIVE CONTEXT:\n${retrievedContext}`,
          },
          ...((conversation?.messages || []).map((m: any) => ({ role: m.role, content: m.content }))),
          { role: 'user', content: message },
        ],
      }),
    });

    const data = await response.json();
    const rawAiMessage = data.choices?.[0]?.message?.content || 'Thinking...';

    // 5. Parse Metadata and Clean Response
    let aiMessage = rawAiMessage;
    let metadata = null;

    if (rawAiMessage.includes('---METADATA---')) {
      const parts = rawAiMessage.split('---METADATA---');
      aiMessage = parts[0].trim();
      try {
        const metadataStr = parts[1].trim();
        metadata = JSON.parse(metadataStr);
      } catch (e) {
        console.error('Failed to parse metadata:', e);
        // Fallback for malformed JSON
        metadata = {
            detected_skill: "general",
            confidence_level: 50,
            emotional_load: "low",
            next_action: "None"
        };
      }
    }

    // 6. Save AI response
    const savedMessage = await prisma.message.create({
      data: {
        role: 'assistant',
        content: aiMessage,
        conversationId: conversation.id,
      },
    });

    // Detect Agentic Actions for DB if metadata suggests it
    if (metadata?.next_action && metadata.next_action !== "None") {
      await prisma.appAction.create({
        data: {
          appName: metadata.detected_skill || 'General',
          actionType: 'skills_intelligence',
          messageId: savedMessage.id,
          metadata: metadata,
        }
      });
    }

    return NextResponse.json({
      reply: aiMessage,
      conversationId: conversation.id,
      metadata: metadata
    });
  } catch (error: any) {
    console.error('Skills Intelligence Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
