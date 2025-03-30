"use client";

import { z } from "zod";
import UploadPdfFrom from "./components/custome/uploadForm";
import { useUploadThing } from "@/utils/uploadthings";
import { toast } from "sonner";
import { generatePdfSummary } from "@/actions/upload-actions";
import { useRef, useState } from "react";
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

export default function Home() {
  const [isLoading, setIsLoading] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)
  const { startUpload, routeConfig } = useUploadThing("pdfUploader", {
    onClientUploadComplete: () => {
      // alert("uploaded successfully");
    },
    onUploadError: () => {
      // alert("error occured while uploading");
      toast("Error occurred while uploading: don't know what the error is");
    },
    onUploadBegin: ({ file }) => {
      console.log("Upload begun for ", file);
    },
  });
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
        // console.log(
        //   validatedFiled.error.flatten().fieldErrors.file?.[0] ?? "Invalid file"
        // );
        toast('validatiaon failed')
        setIsLoading(false)
        return;
      }
      console.log(validatedFiled);
  
      toast('pdf has been uploading! hang tight our AI is looking in you pdf')
  
      // upload the pdf to uploadthing
  
      const resp = await startUpload([file]);
      if (!resp) {
        toast("something went wrong ")
        setIsLoading(false)
        return;
      }
      toast('pdf has been Processing! hang tight our AI is looking in you pdf')
  
  
      // parse the pdf using lann chain
  
      const result = await generatePdfSummary(resp)
      const { data = null, message = null} = result || {};
      if(data){
        toast('Hang Tight we are savning pdf!');
  
        formRef.current?.reset();
      }
  
      console.log({result})
      // now get summmary of the pdf using ai
      // save the summary into database
      // redirect to the [id] page
    } catch (error) {
      console.error("error occure")
      formRef.current?.reset();
      setIsLoading(false)
      
    }
   
  };
  return (
    <div className=" w-full my-12 flex flex-col items-center justify-center">
      <h1 className="text-3xl mb-12 ">
        Upload your pdf and see it's{" "}
        <span className="border border-rose-500 rounded-full px-3 capitalize  ">
          insights
        </span>
      </h1>
      <div className="w-full">
        <UploadPdfFrom ref = {formRef} isLoading={isLoading} onSubmit={handleSubmit} />
      </div>
    </div>
  );
}
