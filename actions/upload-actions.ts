"use server";

import generateSummaryFromGemini from "@/lib/geminiAI";
import { fetchAndExtractPdfText } from "@/lib/langchain";
import { formatFileNameAsTitle } from "@/utils/format-utils";
// import { generateSummaryFromOpenAI } from "@/lib/openAi"
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
    return {
      success: false,
      message: "File upload Failed",
      data: null,
    };
  }

  const {
    serverData: {
      userId,
      file: { url: pdfUrl, name: PdfName },
    },
  } = uploadResponse[0];

  if (!pdfUrl) {
    return {
      success: false,
      message: "File upload Failed",
      data: null,
    };
  }

  try {
    const pdfText = await fetchAndExtractPdfText(pdfUrl);
    console.log(pdfText);
    let summary;
    try {
      summary = await generateSummaryFromGemini(pdfText);
      console.log(summary);
    } catch (error) {
      console.log(error);
      // we'll call gemini code if there is any error

      // if (error instanceof Error && error.message === "RATE_LIMIT_EXCEEDED") {
      //   try {
      //       summary = await generateSummaryFromGemini(pdfText)
      //   } catch (geminiError) {
      //     console.error(
      //       "Gemini API Failed After OpenAI Quota exceeded",
      //       geminiError
      //     );
      //     throw new Error(
      //       "Failed to generate summary  with available AI Providers"
      //     );
      //   }
      // }
    }

    if (!summary) {
      return {
        success: false,
        message: "Failed to generate summmary",
        data: null,
      };
    }

    const formatedFileName  = formatFileNameAsTitle(__filename);
    return {
      sucess: true,
      message: "Summary generated",
      data: {
        summary,
      },
    };
  } catch (error) {
    return {
      success: false,
      message: "File upload Failed",
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
    return response;
  } catch (error) {
    console.error("Error while saving PDF summary", error);
    throw error;
  }
}

export async function storePdfSummaryAction({
  original_file_url,
  summary_text,
  title,
  file_name,
}: PdfSummaryType) {
  // user logged in

  // save the pdf summary
  let savedSummary;
  try {
    const userId = "123e4567-e89b-12d3-a456-426614174000";
    if (!userId) {
      return {
        success: false,
        message: "User not found",
      };
    }
    savedSummary = await savePdfSummary({
      userId,
      original_file_url,
      summary_text,
      title,
      file_name,
    });

    if(!savedSummary){
      return {
        success: false,
        message: "Failed to save pdf summary, please try again ",
      };
    }
    return { success: true, data: savedSummary };
   
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Error saving pdf",
    };
  }

  // revalidate cache
  revalidatePath(`/summaries/${savedSummary.id}`)
  return {
    success: true,
    message: " pdf summary saved ",
  };
}
