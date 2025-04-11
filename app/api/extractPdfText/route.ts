
import { fetchAndExtractPdfText } from "@/lib/langchain";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();

    if (!url) {
      return NextResponse.json({ success: false, message: "PDF URL missing" }, { status: 400 });
    }

    const text = await fetchAndExtractPdfText(url);

    return NextResponse.json({ success: true, text });
  } catch (error) {
    console.error("Error extracting PDF:", error);
    return NextResponse.json({ success: false, message: "Failed to extract PDF text" }, { status: 500 });
  }
}
