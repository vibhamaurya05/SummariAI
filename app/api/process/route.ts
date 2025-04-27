  import { GoogleGenerativeAI } from "@google/generative-ai";
  import { addChunks, clearStore, DocumentChunk } from "@/lib/store";
  import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio";

  const API_KEY = process.env.GEMINI_API_KEY!;
  const EMBEDDING_MODEL_NAME = "models/text-embedding-004";
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
      (chunk) =>
        chunk.trim().length > overlap / 2 ||
        chunk.trim().length === text.trim().length
    );
  }

  async function embedChunks(chunks: string[]): Promise<DocumentChunk[]> {
    const maxBatchSize = 100;
    const embeddedChunks: DocumentChunk[] = [];

    for (let i = 0; i < chunks.length; i += maxBatchSize) {
      const chunkBatch = chunks.slice(i, i + maxBatchSize);

      const result = await model.batchEmbedContents({
        requests: chunkBatch.map((chunk) => ({
          content: { parts: [{ text: chunk }] },
        })),
      });

      const embeddings = result.embeddings;

      if (embeddings.length !== chunkBatch.length) {
        throw new Error("Mismatch between chunks and embeddings in batch");
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
      let text = "";
      let webUrl = "";
      let pdf = "";

      const contentType = req.headers.get("content-type") || "";

      if (contentType.includes("application/json")) {
        const body = await req.json();
        text = body.text || "";
        webUrl = body.url || "";
        pdf = body.pdf || "";
      } else if (contentType.includes("multipart/form-data")) {
        const formData = await req.formData();
        const type = formData.get("type");
        const content = formData.get("content")?.toString() || "";

        if (type === "Note") {
          text = content;
        } else if (type === "webpage") {
          webUrl = content;
        } else if (type === "pdf") {
          pdf = content;
        }
      }

      // ✅ Fix: At least one input type must be present
      if (!text && !webUrl && !pdf) {
        return Response.json(
          { message: "Text, PDF, or webpage URL is required." },
          { status: 400 }
        );
      }

      // 🧠 If PDF was submitted, treat it like a text source
      if (pdf) {
        text = pdf;
      }

      // Load from webpage URL if provided
      if (webUrl) {
        try {
          console.log("Fetching webpage text from:", webUrl);
          const loaderWithSelector = new CheerioWebBaseLoader(webUrl, {
            selector: "p",
          });
          const docsWithSelector = await loaderWithSelector.load();
          text = docsWithSelector.map((doc) => doc.pageContent).join("\n");

          if (!text.trim()) {
            return Response.json(
              { message: "Failed to extract any text from the webpage." },
              { status: 400 }
            );
          }

          console.log("Successfully fetched webpage text.");
        } catch (fetchErr: unknown) {
          const error = fetchErr as Error;
          console.error("Failed to load webpage:", error.message);
          return Response.json(
            {
              message: "Failed to load or parse webpage.",
              error: error.message,
            },
            { status: 400 }
          );
        }
        
      }

      // Split and Embed
      await clearStore();

      const chunks = splitText(text);
      if (chunks.length === 0) {
        return Response.json(
          { message: "Could not split text into chunks." },
          { status: 400 }
        );
      }

      const embeddedChunks = await embedChunks(chunks);
      await addChunks(embeddedChunks);

      return Response.json({
        message: `Successfully processed and stored ${embeddedChunks.length} chunks.`,
      });
    } catch (error: unknown) {
      const err = error as Error;
      console.error("Error in process route:", err);
      return Response.json(
        {
          message: "Failed to process content.",
          error: err.message || "Unknown error",
        },
        { status: 500 }
      );
    }
    
  }
