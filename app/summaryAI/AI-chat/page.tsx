"use client";
import ChatBox from "@/app/components/custome/chat-box";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUploadThing } from "@/utils/uploadthings";
import { Pencil, Save } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useTheme } from "next-themes";

export default function AIChat() {
  const [contentType, setContentType] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState<string | File>("");
  const [loading, setLoading] = useState(false);
  const [isTrainedDataEnabled, setIsTrainedDataEnabled] = useState(false);
  const { theme } = useTheme()

  const { startUpload } = useUploadThing("pdfUploader", {
    onClientUploadComplete: () => {
      // alert("uploaded successfully");
    },
    onUploadError: () => {
      // alert("error occured while uploading");
      toast("Error occurred while uploading: don't know what the error is");
    },
    onUploadBegin: () => {
      console.log("Upload begun for ", File);
    },
  });

  const handleSubmit = async () => {
    if (!title || !contentType || !content) {
      toast("Please fill all required fields.");
      return;
    }
  
    setLoading(true);
  
    try {
      let extractedData = "";
  
      // Handle PDF upload and extraction
      if (contentType === "pdf" && content instanceof File) {
        toast("Uploading your PDF! Hang tight...");
  
        const uploadResp = await startUpload([content]);
        if (!uploadResp || !uploadResp[0]?.url) {
          toast("Failed to upload PDF.");
          setLoading(false);
          return;
        }
  
        toast("Parsing the PDF using LangChain...");
  
        const res = await fetch("/api/extractPdfText", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: uploadResp[0].url }),
        });
  
        const data = await res.json();
  
        if (!res.ok || !data.text) {
          toast("Failed to extract text from PDF.");
          setLoading(false);
          return;
        }
  
        extractedData = data.text;
      }
  
      // Prepare formData for processing
      const formData = new FormData();
      formData.append("title", title);
      formData.append("type", contentType);
  
      if (contentType === "pdf") {
        formData.append("content", extractedData);
      } else {
        formData.append("content", content as string);
      }
  
      // Send data to the /api/process endpoint
      const res = await fetch("/api/process", {
        method: "POST",
        body: formData,
      });
  
      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.message || "Error occurred during processing");
      }
  
      toast("Data embedded and stored successfully!");
      setTitle("");
      setContent("");
      setContentType("");
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error("Submission Error:", err.message);
        toast("Something went wrong!");
      } else {
        console.error("An unknown error occurred");
        toast("Something went wrong!");
      }
    }
    finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="min-h-screen flex flex-col items-center px-4">
      {/* Dialog to Upload Content */}
      <div className="w-full flex justify-end">
        <Dialog>
          <DialogTrigger>
            <Button className="flex items-center">
              <Pencil className="w-4 sm:w-6 h-4 sm:h-6" />
              Add Content
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex flex-col gap-0.5">
                <h1 className="text-2xl font-bold">Add Your Data!</h1>
                <p className="text-gray-400 text-lg">
                  Give me anything, I will Remember
                </p>
              </DialogTitle>
              <DialogDescription className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                <Label className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
                Title *</Label>
                  <Input
                    placeholder="Enter your title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div className="flex flex-col gap-2">
                <Label className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-black'}`}>

                    Select Content type *
                  </Label>
                  <Select
                    onValueChange={(value) => {
                      setContentType(value);
                      setContent("");
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select content type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Note">It&apos;s a Note</SelectItem>
                      <SelectItem value="webpage">It&apos;s a Webpage</SelectItem>
                      <SelectItem value="pdf">It&apos;s a PDF</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col gap-2">
                <Label className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
                Your Content *</Label>
                  {contentType === "pdf" ? (
                    <Input
                      type="file"
                      accept=".pdf"
                      onChange={(e) => setContent(e.target.files?.[0] || "")}
                    />
                  ) : (
                    <Input
                      placeholder={
                        contentType === "webpage"
                          ? "Enter a URL (e.g. https://...)"
                          : "Enter your note content"
                      }
                      value={typeof content === "string" ? content : ""}
                      onChange={(e) => setContent(e.target.value)}
                    />
                  )}
                </div>

                <div className="w-full flex justify-end">
                  <Button onClick={handleSubmit} disabled={loading}>
                    <Save className="mr-2" />
                    {loading ? "Saving..." : "Save"}
                  </Button>
                </div>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>

      {/* Page Heading */}
      <div className="max-w-3xl w-full mt-4 sm:mt-12 text-center">
        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight">
          Chat with AI Without Giving Any Data for Training
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mb-12 sm:my-4 ">
          <span className="font-bold">NOTE:</span> Without providing data, it
          may give inaccurate results.
        </p>
      </div>
      <div className="max-w-3xl mx-auto w-full mt-4 sm:mt-12 flex items-center justify-end gap-2 mb-2 px-4">
        <p className="text-sm font-medium">Chat with Trained Data</p>
        <label className="inline-flex items-center cursor-pointer relative">
  <input
    type="checkbox"
    className="sr-only peer"
    checked={isTrainedDataEnabled}
    onChange={() => setIsTrainedDataEnabled(!isTrainedDataEnabled)}
  />
  <div
    className="
      w-11 h-6 rounded-full
      bg-gray-500 peer-checked:bg-blue-600
      transition-colors duration-300
    "
  ></div>
  <div
    className="
      absolute left-0.5 top-0.5
      h-5 w-5 rounded-full bg-white
      border border-gray-300
      peer-checked:translate-x-full
      transition-transform duration-300
    "
  ></div>
</label>

      </div>

      {/* ChatBox */}
      <ChatBox isTrainedDataEnabled={isTrainedDataEnabled} />
    </div>
  );
}
