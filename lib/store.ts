
import redis from './redis';

export interface DocumentChunk {
  text: string;
  embedding: number[];
}

const REDIS_KEY = 'documentChunks';

// Save chunks to Redis
export const addChunks = async (chunks: DocumentChunk[]) => {
  console.log(`Adding ${chunks.length} chunks to Redis store.`);
  const json = JSON.stringify(chunks);
  await redis.set(REDIS_KEY, json);
};

// Retrieve chunks from Redis
export const getChunks = async (): Promise<DocumentChunk[]> => {
  const json = await redis.get(REDIS_KEY);
  if (!json) return [];
  return JSON.parse(json);
};

// Clear the Redis store
export const clearStore = async () => {
  console.log('Clearing Redis document store.');
  await redis.del(REDIS_KEY);
};
