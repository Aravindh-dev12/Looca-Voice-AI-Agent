import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { searchKnowledge, upsertKnowledgePoint } from '@/lib/qdrant';
import { v4 as uuidv4 } from 'uuid';

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

    // 4. BROWSER AGENT PROMPT (The "Operator" Mindset)
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
            content: `You are Looca, an Agentic AI Operating System. 
            
            YOUR EXECUTION MODEL:
            You do NOT rely on simple APIs. You act like a human operator in a browser.
            When a task is requested (e.g. "Book a doctor"), your internal process is:
            1. Open Browser: Navigate to Google or specific service sites.
            2. UI Understanding: Analyze the DOM/UI to find search bars, buttons, and forms.
            3. Action: Click, Type, and Scroll autonomously.
            4. Completion: Close the loop by confirming via WhatsApp Web.
            
            YOUR ADAPTIVE CONTEXT:
            ${retrievedContext}
            
            MANDATORY LOGGING:
            Your responses MUST include descriptions of these browser actions: 
            "Launching Browser Instance", "Analyzing UI Selectors", "Simulating Click on [Button]", "Filling Form with [Data]".`,
          },
          ...((conversation?.messages || []).map((m: any) => ({ role: m.role, content: m.content }))),
          { role: 'user', content: message },
        ],
      }),
    });

    const data = await response.json();
    const aiMessage = data.choices?.[0]?.message?.content || 'Initializing browser agent...';

    // 5. Save AI response
    const savedMessage = await prisma.message.create({
      data: {
        role: 'assistant',
        content: aiMessage,
        conversationId: conversation.id,
      },
    });

    // Detect Agentic Actions for DB
    const lowerMessage = aiMessage.toLowerCase();
    if (lowerMessage.includes('browser') || lowerMessage.includes('launching')) {
      await prisma.appAction.create({
        data: {
          appName: 'BrowserAgent',
          actionType: 'web_automation',
          messageId: savedMessage.id,
          metadata: { query: message, engine: 'Playwright-Simulated' },
        }
      });
    }

    return NextResponse.json({
      reply: aiMessage,
      conversationId: conversation.id,
    });
  } catch (error: any) {
    console.error('Agentic Chat Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
