"use server";

import { createClient } from "@/lib/client";
import generateSummaryFromGemini from "@/lib/geminiAI";
import { fetchAndExtractPdfText } from "@/lib/langchain";
import { formatFileNameAsTitle } from "@/utils/format-utils";
import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

interface PdfSummaryType {
  userId: string;
  original_file_url: string;
  summary_text: string;
  title: string;
  file_name: string;
}

export async function generatePdfSummary(
  uploadResponse: [
    {
      serverData: {
        userId: string;
        file: {
          url: string;
          name: string;
        };
      };
    }
  ]
) {
  if (!uploadResponse) {
    console.error(" No upload response received");
    return {
      success: false,
      message: "File upload Failed",
      data: null,
    };
  }

  const {
    serverData: {
      userId,
      file: { url: pdfUrl, name: pdfName },
    },
  } = uploadResponse[0];

  if (!pdfUrl) {
    console.error(" PDF URL not found");
    return {
      success: false,
      message: "File upload Failed",
      data: null,
    };
  }

  try {
    const pdfText = await fetchAndExtractPdfText(pdfUrl);

    let summary;
    try {
      summary = await generateSummaryFromGemini(pdfText);
    } catch (error) {
      console.error("summarization failed", error);
    }

    if (!summary) {
      return {
        success: false,
        message: "Failed to generate summary",
        data: null,
      };
    }

    const title = formatFileNameAsTitle(pdfName);

    return {
      success: true,
      message: "Summary generated",
      data: {
        summary,
        original_file_url: pdfUrl,
        title,
        file_name: pdfName,
        userId,
      },
    };
  } catch (error) {
    console.error(" Error during summary generation", error);
    return {
      success: false,
      message: "Summary generation failed",
      data: null,
    };
  }
}

async function savePdfSummary({
  userId,
  original_file_url,
  summary_text,
  title,
  file_name,
}: PdfSummaryType) {
  try {
    const response = await prisma.pdf_summary.create({
      data: {
        userId,
        original_file_url,
        summary_text,
        title,
        file_name,
      },
    });
    console.log("✅ Saved summary:", response.id);
    return response;
  } catch (error) {
    console.error("❌ Error while saving PDF summary", error);
    throw error;
  }
}

export async function storePdfSummaryAction({
  userId,
  original_file_url,
  summary_text,
  title,
  file_name,
}: PdfSummaryType) {
  try {
    if (!userId) {
      console.warn("⚠️ User ID not provided from client");
      return {
        success: false,
        message: "User not found",
      };
    }

    const savedSummary = await savePdfSummary({
      userId,
      original_file_url,
      summary_text,
      title,
      file_name,
    });

    revalidatePath(`/summaries/${savedSummary.id}`);

    return {
      success: true,
      data: savedSummary,
    };
  } catch (error) {
    console.error("❌ Failed to store PDF summary:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

