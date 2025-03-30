"use server";

import generateSummaryFromGemini from "@/lib/geminiAI";
import { fetchAndExtractPdfText } from "@/lib/langchain";
// import { generateSummaryFromOpenAI } from "@/lib/openAi";

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
    return {
      sucess: true,
      message: "Summery generated",
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
