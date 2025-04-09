
import { GoogleGenerativeAI } from '@google/generative-ai';
import { addChunks, clearStore, DocumentChunk } from '@/lib/store';
import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio";

const API_KEY = process.env.GOOGLE_API_KEY!;
const EMBEDDING_MODEL_NAME = 'models/text-embedding-004';

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: EMBEDDING_MODEL_NAME });

// --- Helper Functions ---

function splitText(text: string, chunkSize = 500, overlap = 50): string[] {
  if (!text) return [];
  const chunks: string[] = [];
  let start = 0;
  while (start < text.length) {
    const end = start + chunkSize;
    chunks.push(text.slice(start, end));
    start += chunkSize - overlap;
    if (start + overlap >= text.length) {
      if (end < text.length) {
        chunks.push(text.slice(end));
      }
      break;
    }
  }
  return chunks.filter(
    chunk => chunk.trim().length > overlap / 2 || chunk.trim().length === text.trim().length
  );
}

async function embedChunks(chunks: string[]): Promise<DocumentChunk[]> {
  const maxBatchSize = 100;
  const embeddedChunks: DocumentChunk[] = [];

  for (let i = 0; i < chunks.length; i += maxBatchSize) {
    const chunkBatch = chunks.slice(i, i + maxBatchSize);

    const result = await model.batchEmbedContents({
      requests: chunkBatch.map(chunk => ({
        content: { parts: [{ text: chunk }] },
      })),
    });

    const embeddings = result.embeddings;

    if (embeddings.length !== chunkBatch.length) {
      throw new Error('Mismatch between chunks and embeddings in batch');
    }

    const processedBatch = chunkBatch.map((chunk, index) => ({
      text: chunk,
      embedding: embeddings[index].values,
    }));

    embeddedChunks.push(...processedBatch);
  }

  return embeddedChunks;
}


// --- API Route Handler ---

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const type = formData.get("type");
    const title = formData.get("title");
    const content = formData.get("content");
    const file = formData.get("file");

    console.log("✅ Received from frontend:");
    console.log("Type:", type);
    console.log("Title:", title);
    console.log("Content:", typeof content === "string" ? content.slice(0, 100) : null);
    console.log("File:", file instanceof File ? `Name: ${file.name}, Size: ${file.size}` : "No file");

    return Response.json({
      message: "✅ Successfully received data from frontend.",
      received: {
        type,
        title,
        content: typeof content === "string" ? content.slice(0, 100) : null,
        file: file instanceof File ? { name: file.name, size: file.size } : null
      }
    });
  } catch (error: any) {
    console.error("❌ Error reading form data:", error);
    return Response.json(
      { message: "Failed to read data from frontend.", error: error.message || "Unknown error" },
      { status: 500 }
    );
  }
}


