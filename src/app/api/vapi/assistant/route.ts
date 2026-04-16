import { buildVapiAssistantConfig } from '@/lib/vapi';

export async function GET() {
  return Response.json(buildVapiAssistantConfig());
}
