
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import { getChunks, DocumentChunk } from '@/lib/store';

const API_KEY = process.env.GOOGLE_API_KEY!;
const EMBEDDING_MODEL_NAME = 'models/text-embedding-004';
const GENERATION_MODEL_NAME = 'models/gemini-1.5-flash';

const genAI = new GoogleGenerativeAI(API_KEY);
// model for embedding
const embeddingModel = genAI.getGenerativeModel({ model: EMBEDDING_MODEL_NAME });
// model for generation
const generationModel = genAI.getGenerativeModel({ model: GENERATION_MODEL_NAME });

function cosineSimilarity(vecA: number[], vecB: number[]): number {
  if (!vecA || !vecB || vecA.length !== vecB.length) return 0;
  let dot = 0, normA = 0, normB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dot += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  const magnitude = Math.sqrt(normA) * Math.sqrt(normB);
  return magnitude === 0 ? 0 : dot / magnitude;
}

async function embedQuery(query: string): Promise<number[]> {
  const result = await embeddingModel.embedContent(query);
  const embedding = result.embedding;
  if (!embedding?.values) throw new Error('Failed to get query embedding.');
  return embedding.values;
}

function findRelevantChunks(queryEmbedding: number[], storedChunks: DocumentChunk[], topK = 3): DocumentChunk[] {
  return storedChunks
    .map(chunk => ({
      chunk,
      score: cosineSimilarity(queryEmbedding, chunk.embedding),
    }))
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)
    .map(item => item.chunk);
}

async function generateAnswer(query: string, relevantChunks: DocumentChunk[]): Promise<string> {
  let prompt = '';

  if (relevantChunks.length === 0) {
    // No context found — let the model answer based on its own knowledge
    prompt = `No context is available. Please answer the following question based on your general knowledge.\n\nQuestion: ${query}\nAnswer:`;
  } else {
    // Provide context to guide the model's response
    const context = relevantChunks.map(chunk => chunk.text).join('\n\n---\n\n');
    prompt = `Context: ---\n${context}\n---\n\nQuestion: ${query}\nAnswer:`;
  }

  try {
    const result = await generationModel.generateContent(prompt);
    return result.response.text();
  } catch (error: any) {
    console.error('Error generating answer:', error);
    if (error.message?.includes('SAFETY')) {
      return 'The response was blocked due to safety settings.';
    }
    return 'Sorry, something went wrong while generating the answer.';
  }
}


// --- API Route Handler ---

export async function POST(req: Request) {
  try {
    const { query } = await req.json();

    if (!query || typeof query !== 'string' || query.trim().length === 0) {
      return Response.json({ message: 'Query is required.' }, { status: 400 });
    }

    const storedChunks = await getChunks();
    if (storedChunks.length === 0) {
      return Response.json({ message: 'No text has been processed yet.' }, { status: 400 });
    }

    const queryEmbedding = await embedQuery(query);
    const relevantChunks = findRelevantChunks(queryEmbedding, storedChunks);
    const answer = await generateAnswer(query, relevantChunks);

    return Response.json({ answer });
  } catch (error: any) {
    console.error('Error in query route:', error);
    return Response.json(
      { message: 'Failed to process query.', error: error.message || 'Unknown error' },
      { status: 500 }
    );
  }
}
