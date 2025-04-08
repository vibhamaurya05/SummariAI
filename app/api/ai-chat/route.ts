import { GeminiChat } from "@/lib/geminiAI";
import { NextRequest, NextResponse } from "next/server";
 // your server-side Gemini function

export async function POST(req: NextRequest) {
  try {
    const { query } = await req.json();

    if (!query) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    const response = await GeminiChat(query);

    return NextResponse.json({ response });
  } catch (error) {
    console.error("Gemini API Error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}