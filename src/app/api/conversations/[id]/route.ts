import { prisma } from '@/lib/prisma';

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  const conversation = await prisma.conversation.findUnique({
    where: { id },
    include: { transcript: true },
  });

  if (!conversation) {
    return Response.json({ error: 'Not found' }, { status: 404 });
  }

  return Response.json(conversation);
}
