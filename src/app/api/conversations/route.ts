import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const createSchema = z.object({
  userName: z.string().optional(),
  userPhone: z.string().optional(),
  issueType: z.string().optional(),
  language: z.string().default('en'),
  channel: z.string().default('voice'),
  summary: z.string().optional(),
  messages: z
    .array(
      z.object({
        role: z.string(),
        content: z.string(),
      }),
    )
    .optional(),
});

export async function GET() {
  const conversations = await prisma.conversation.findMany({
    orderBy: { createdAt: 'desc' },
    include: { transcript: true },
  });
  return Response.json(conversations);
}

export async function POST(req: Request) {
  const body = await req.json();
  const input = createSchema.parse(body);

  const created = await prisma.conversation.create({
    data: {
      userName: input.userName,
      userPhone: input.userPhone,
      issueType: input.issueType,
      language: input.language,
      channel: input.channel,
      summary: input.summary,
      transcript: input.messages?.length
        ? {
            create: input.messages,
          }
        : undefined,
    },
    include: { transcript: true },
  });

  return Response.json(created, { status: 201 });
}
