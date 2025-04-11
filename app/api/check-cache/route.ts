import { getChunks } from "@/lib/store"; // assumes getChunks fetches from Redis

export async function GET() {
  const chunks = await getChunks();
  return Response.json({ cached: chunks.length > 0 });
}
