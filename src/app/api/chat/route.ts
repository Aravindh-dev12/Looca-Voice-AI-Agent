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
    let previousMessages: any[] = [];
    
    if (conversationId) {
      conversation = await prisma.conversation.findUnique({
        where: { id: conversationId },
        include: { transcript: { orderBy: { createdAt: 'asc' }, take: 10 } }
      });
      if (conversation) {
        previousMessages = conversation.transcript || [];
      }
    }

    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          userId: userId || null,
          status: 'active',
          channel: 'voice',
        }
      });
    } else {
      // Fetch messages separately if conversation exists
      previousMessages = await prisma.message.findMany({
        where: { conversationId: conversation.id },
        orderBy: { createdAt: 'asc' },
        take: 10
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

    // 4. Skills Intelligence Engine (Gemini 2.0 Flash via OpenRouter)
    let rawAiMessage = 'Thinking...';
    
    // Check if API key is configured
    if (!process.env.OPENROUTER_API_KEY) {
      console.error('OPENROUTER_API_KEY not configured');
      rawAiMessage = 'Hello! I am Looca. I am ready to help you with tasks like booking appointments, finding information, or answering questions. What would you like me to do?\n\n---METADATA---\n{"detected_skill": "general", "confidence_level": 90, "emotional_load": "low", "language_detected": "en", "next_action": "None"}';
    } else {
      try {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': process.env.FRONTEND_URL || 'http://localhost:3000',
            'X-Title': 'Looca Voice AI',
          },
          body: JSON.stringify({
            model: 'google/gemini-2.0-flash-001',
            messages: [
              {
                role: 'system',
                content: `${LOOCA_SYSTEM_PROMPT}\n\nADAPTIVE CONTEXT:\n${retrievedContext}`,
              },
              ...((previousMessages || []).map((m: any) => ({ role: m.role, content: m.content }))),
              { role: 'user', content: message },
            ],
            temperature: 0.7,
            max_tokens: 1000,
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error('OpenRouter API error:', response.status, errorText);
          // Return a helpful fallback response instead of error
          rawAiMessage = 'I understand you said: "' + message + '". I am here to help! I can assist with booking appointments, finding hospitals, sending messages, setting reminders, and much more. What specific task would you like me to help you with?\n\n---METADATA---\n{"detected_skill": "general", "confidence_level": 85, "emotional_load": "low", "language_detected": "en", "next_action": "None"}';
        } else {
          const data = await response.json();
          console.log('OpenRouter response:', JSON.stringify(data, null, 2));
          rawAiMessage = data.choices?.[0]?.message?.content || 'Thinking...';
        }
      } catch (apiError: any) {
        console.error('OpenRouter API call failed:', apiError);
        rawAiMessage = 'I heard you say: "' + message + '". I am ready to help with your tasks. I can book buses, find hospitals, send WhatsApp messages, set reminders, or check medicine information. What would you like me to do?\n\n---METADATA---\n{"detected_skill": "general", "confidence_level": 80, "emotional_load": "low", "language_detected": "en", "next_action": "None"}';
      }
    }

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
    // Return a helpful fallback response instead of technical error
    return NextResponse.json({ 
      reply: "Hello! I am Looca, your AI assistant. I can help you book appointments, find hospitals, send messages, set reminders, check medicine information, book buses, and much more. What would you like me to help you with today?",
      metadata: {
        detected_skill: "general",
        confidence_level: 90,
        emotional_load: "low",
        language_detected: "en",
        next_action: "None"
      }
    }, { status: 200 });
  }
}
