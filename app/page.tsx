"use client";

import { z } from "zod";
import UploadPdfFrom from "./components/custome/uploadForm";
import { useUploadThing } from "@/utils/uploadthings";
import { toast } from "sonner";
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

    console.log("submitted");

    const formData = new FormData(e.currentTarget);
    const file = formData.get("file") as File;

    // now validate the file
    // schma validation using zod
    const validatedFiled = schema.safeParse({ file });

    if (!validatedFiled.success) {
      console.log(
        validatedFiled.error.flatten().fieldErrors.file?.[0] ?? "Invalid file"
      );
      toast('validatiaon failed')
      return;
    }
    console.log(validatedFiled);

    toast('pdf has been uploading! hang tight our AI is looking in you pdf')

    // upload the pdf to uploadthing

    const resp = await startUpload([file]);
    if (!resp) {
      toast("something went wrong ")
      return;
    }
    toast('pdf has been Processing! hang tight our AI is looking in you pdf')


    // parse the pdf using lann chain
    // now get summmary of the pdf using ai
    // save the summary into database
    // redirect to the [id] page
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
        <UploadPdfFrom onSubmit={handleSubmit} />
      </div>
    </div>
  );
}
