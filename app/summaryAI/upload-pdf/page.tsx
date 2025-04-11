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
  const [userID, setUserID] = useState<string| null>('')
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();
  const { startUpload, routeConfig } = useUploadThing("pdfUploader", {
    onClientUploadComplete: () => {
      // alert("uploaded successfully");
    },
    onUploadError: () => {
      // alert("error occured while uploading");
      toast("Error occurred while uploading: don't know what the error is");
    },
    onUploadBegin: ({ file }:any) => {
      console.log("Upload begun for ", file);
    },
  });

  useEffect(()=>{
    const fetchUser = async()=>{

      const supabase  = createClient()
      const {data} = await supabase.auth.getUser() 

      setUserID(data.user?.id || null);
    }
    fetchUser()
  },[])
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const formData = new FormData(e.currentTarget);
      const file = formData.get("file") as File;

      // now validate the file
      // schma validation using zod
      const validatedFiled = schema.safeParse({ file });

      if (!validatedFiled.success) {
        toast("validatiaon failed");
        setIsLoading(false);
        return;
      }
      console.log(validatedFiled);

      toast("pdf has been uploading! hang tight our AI is looking in you pdf");

      // upload the pdf to uploadthing

      const resp = await startUpload([file]);
      if (!resp) {
        toast("something went wrong ");
        setIsLoading(false);
        return;
      }
      toast("pdf has been Processing! hang tight our AI is looking in you pdf");

      // parse the pdf using lann chain
      toast("parsing the pdf! hang tight ");

      const result = await generatePdfSummary(resp);
      // alert(result)
      const { data = null, message = null } = result || {};
      // alert(data)
      if(data){
        toast('Pdf Summmary Generated')
      }
      let storeResult: any = null; 
      if (data) {
        toast("Hang Tight, we are saving the PDF!");

        if (data.summary) {
          storeResult = await storePdfSummaryAction({
            userId: userID as string, 
            summary_text: data.summary,
            original_file_url: resp[0]?.serverData?.file?.url || "",
            title: formatFileNameAsTitle(data.summary)||"Untitled", 
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
      }
      formRef.current?.reset();
      //TODO: redirect the user to homepage
      if (storeResult?.data?.id) {
        router.push(`/summaries/${storeResult.data.id}`);
      } else {
        console.log("No storeResult id", storeResult); // Debugging
      }

    } catch (error) {
      console.error("error occure");
      formRef.current?.reset();
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className=" max-w-4xl mx-auto my-12 flex flex-col items-center justify-center px-4">
      <h1 className="text-3xl mb-12 font-bold flex items-center gap-2 ">
        Upload your pdf and see it's{" "}
        <span className="border border-rose-500 rounded-full px-3 capitalize  bg-rose-200 hover:rotate-5 transform transition-all duration-300 py-1 ">
          insights
        </span>
      </h1>
      <div className="w-full">
        <UploadPdfFrom
          ref={formRef}
          isLoading={isLoading}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}
