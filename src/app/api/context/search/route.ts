import { semanticResponse } from '@/lib/qdrant';
import { z } from 'zod';

const schema = z.object({
  query: z.string().min(1),
});

export async function POST(req: Request) {
  const body = await req.json();
  const input = schema.parse(body);
  const response = await semanticResponse(input.query);
  return Response.json(response);
}
