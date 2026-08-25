import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { searchKnowledge } from '@/lib/qdrant';
import { LOOCA_SYSTEM_PROMPT } from '@/lib/skills_prompt';

export async function POST(req: Request) {
  try {
    const { message, userId, conversationId } = await req.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const memories = await searchKnowledge(message, 3);
    const retrievedContext = memories.length > 0
      ? `ADAPTIVE MEMORY:\n${memories.map((m) => `- ${m.content}`).join('\n')}`
      : 'No previous relevant memories.';

    let conversation;
    if (conversationId) {
      conversation = await prisma.conversation.findUnique({
        where: { id: conversationId },
        include: { transcript: { orderBy: { createdAt: 'asc' }, take: 10 } },
      });
    }

    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          userId: userId || null,
          status: 'active',
          channel: 'voice',
        },
        include: { transcript: true },
      });
    }

    await prisma.message.create({
      data: {
        role: 'user',
        content: message,
        conversationId: conversation.id,
      },
    });

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.0-flash-001',
        messages: [
          {
            role: 'system',
            content: `${LOOCA_SYSTEM_PROMPT}\n\nADAPTIVE CONTEXT:\n${retrievedContext}`,
          },
          ...((conversation?.transcript || []).map((m: any) => ({ role: m.role, content: m.content }))),
          { role: 'user', content: message },
        ],
      }),
    });

    const data = await response.json();
    const rawAiMessage = data.choices?.[0]?.message?.content || 'Thinking...';

    let aiMessage = rawAiMessage;
    let metadata = null;

    if (rawAiMessage.includes('---METADATA---')) {
      const parts = rawAiMessage.split('---METADATA---');
      aiMessage = parts[0].trim();
      try {
        metadata = JSON.parse(parts[1].trim());
      } catch (e) {
        console.error('Failed to parse metadata:', e);
        metadata = {
          detected_skill: 'general',
          confidence_level: 50,
          emotional_load: 'low',
          next_action: 'None',
        };
      }
    }

    const savedMessage = await prisma.message.create({
      data: {
        role: 'assistant',
        content: aiMessage,
        conversationId: conversation.id,
      },
    });

    if (metadata?.next_action && metadata.next_action !== 'None') {
      await prisma.appAction.create({
        data: {
          appName: metadata.detected_skill || 'General',
          actionType: 'skills_intelligence',
          messageId: savedMessage.id,
          metadata,
        },
      });
    }

    return NextResponse.json({
      reply: aiMessage,
      conversationId: conversation.id,
      metadata,
    });
  } catch (error: any) {
    console.error('Skills Intelligence Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
