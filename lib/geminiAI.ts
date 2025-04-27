import { SUMMARY_SYSTEM_PROMPT } from "@/utils/prompts";
import { ContentListUnion, GoogleGenAI } from "@google/genai";
import { toast } from "sonner";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export default async function generateSummaryFromGemini(pdfText: string) {
  try {
    const prompts = [
      {
        role: "user",
        parts: [
          { text: SUMMARY_SYSTEM_PROMPT },
          {
            text: `Transform this document into an engaging, easy-to-use summary with contextual relevant emoji and proper markdown formatting:\n\n${pdfText}`,
          },
        ],
      },
    ];

    const modelResponse = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompts as ContentListUnion,
    });

    const summary = modelResponse.candidates?.[0]?.content?.parts?.[0]?.text;

    if (summary) {
      return summary;
    } else {
      console.warn("No summary returned from Gemini API.");
      return ""; // Or handle the case where no summary is available
    }
  }catch (error: unknown) {
    if (error instanceof Error) {
      if (error.message.includes("429")) {
        throw new Error("RATE_LIMIT_EXCEEDED");
      }
      console.error("Gemini API error", error);
      throw error;
    } else {
      console.error("Unknown error occurred:", error);
      throw new Error("Unknown error occurred during Gemini API request");
    }
  }
  
}

export async function GeminiChat(query: string) {
  try {
    const prompts = [
      {
        role: "user",
        parts: [
          {
            text: `You are a helpful and friendly AI assistant. Please answer the following question accurately and clearly.`,
          },
          {
            text: `Use Markdown formatting if necessary, and try to make your response easy to read.`,
          },
          {
            text: `User's question:\n\n${query}`,
          },
        ],
      },
    ];


    const modelResponse = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompts,
    });

    const result = modelResponse.candidates?.[0].content?.parts?.[0].text;
    if (result) {
      return result;
    } else {
      toast("Something went wrong");
      return "Sorry, I couldn't generate a response.";
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.message.includes("429")) {
        throw new Error("RATE_LIMIT_EXCEEDED");
      }
      console.error("Gemini API error", error);
      throw error;
    } else {
      console.error("Unknown error occurred:", error);
      throw new Error("Unknown error occurred during Gemini API request");
    }
  }
  
}