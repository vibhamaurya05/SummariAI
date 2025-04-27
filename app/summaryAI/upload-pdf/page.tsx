"use client";

import { z } from "zod";
import { useUploadThing } from "@/utils/uploadthings";
import { toast } from "sonner";
import {
  generatePdfSummary,
  storePdfSummaryAction,
} from "@/actions/upload-actions";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { formatFileNameAsTitle } from "@/utils/format-utils";
import UploadPdfFrom from "@/app/components/custome/uploadForm";
import { createClient } from "@/lib/client";

// zod schema
const schema = z.object({
  file: z
    .instanceof(File, { message: "Invalid file" })
    .refine((file) => file.size <= 24 * 1024 * 1024, {
      message: "File size must be less than 24MB",
    })
    .refine((file) => file.type.startsWith("application/pdf"), {
      message: "File must be a pdf",
    }),
});

export default function UploadPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [userID, setUserID] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();
  const { startUpload } = useUploadThing("pdfUploader", {
    onClientUploadComplete: () => {
      // alert("uploaded successfully");
    },
    onUploadError: () => {
      toast("Error occurred while uploading: don't know what the error is");
    },
    onUploadBegin: () => {
      console.log("Upload begun for ");
    },
  });

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient();
      const { data } = await supabase.auth.getUser();
      setUserID(data?.user?.id || null);
    };
    fetchUser();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const formData = new FormData(e.currentTarget);
      const file = formData.get("file") as File;

      // Now validate the file
      const validatedFile = schema.safeParse({ file });

      if (!validatedFile.success) {
        toast("Validation failed");
        setIsLoading(false);
        return;
      }

      toast("PDF is being uploaded! Hang tight, our AI is analyzing your PDF...");

      // Upload the PDF to UploadThing
      const resp = await startUpload([file]);
      if (!resp) {
        toast("Something went wrong during upload.");
        setIsLoading(false);
        return;
      }

      toast("PDF is being processed! Hang tight...");

      // Parse the PDF using LangChain
      toast("Parsing the PDF! Hang tight...");

      const result = await generatePdfSummary(resp);
      const { data = null } = result || {};

      if (data) {
        toast("PDF Summary Generated");

        let storeResult: { success: boolean; data?: { id: string } } | null = null;

        if (data.summary) {
          toast("Saving the PDF summary...");

          storeResult = await storePdfSummaryAction({
            userId: userID as string,
            summary_text: data.summary,
            original_file_url: resp[0]?.serverData?.file?.url || "",
            title: formatFileNameAsTitle(data.summary) || "Untitled",
            file_name: file.name,
          });

          if (storeResult?.success) {
            toast("Summary Saved!");
            setIsLoading(false);
          } else {
            toast("Failed to save summary.");
          }
        } else {
          toast("No summary generated.");
        }

        if (storeResult?.data?.id) {
          router.push(`/summaries/${storeResult.data.id}`);
        } else {
          console.log("No storeResult id", storeResult); // Debugging
        }
      }
    } catch (error) {
      console.error("Error occurred", error);
      toast("An error occurred during the upload or processing.");
      formRef.current?.reset();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto my-12 flex flex-col items-center justify-center px-4">
      <h1 className="text-3xl mb-12 font-bold flex items-center gap-2">
        Upload your PDF and see its{" "}
        <span className="border border-rose-500 rounded-full px-3 capitalize bg-rose-200 hover:rotate-5 transform transition-all duration-300 py-1">
          insights
        </span>
      </h1>
      <div className="w-full">
        <UploadPdfFrom ref={formRef} isLoading={isLoading} onSubmit={handleSubmit} />
      </div>
    </div>
  );
}
