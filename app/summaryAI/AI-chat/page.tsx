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
import { Pencil, Save } from "lucide-react";
import { useState } from "react";

export default function AIChat() {
  const [contentType, setContentType] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState<string | File>("");
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState<string>("");
  const handleSubmit = async () => {
    if (!title || !contentType || !content) {
      alert("Please fill all required fields.");
      return;
    }

    setLoading(true);
    console.log("Submitting data:", { title, contentType, content });

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("type", contentType);

      if (contentType === "pdf" && content instanceof File) {
        console.log("PDF file selected:", content.name);
        formData.append("file", content);
      } else {
        console.log("Text/URL content:", content);
        formData.append("content", content as string);
      }

      const res = await fetch("/api/process", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        console.error("API Error:", data.message);
        throw new Error(data.message || "Unknown error occurred");
      }

      console.log("Success:", data.message);
      alert("Content embedded and stored successfully!");

      // Clear input fields
      setTitle("");
      setContent("");
      setContentType("");
    } catch (err: any) {
      console.error("Submission error:", err.message);
      alert("Failed to process content.");
    } finally {
      setLoading(false);
    }
  };
  const handlequery = async() => {
    if (!query.trim()) {
     console.log("please add a query first !")
      return;
    }

    setLoading(true)
    try {
      const response = await fetch("/api/query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Check if the error is because no text was processed
        if (
          response.status === 400 &&
          data.message?.includes("No text has been processed")
        ) {
        console.log(
            "Error: You need to process some text first before asking a question."
          );
        } else {
          throw new Error(
            data.message || `HTTP error! status: ${response.status}`
          );
        }
      } else {
        console.log(data.answer);
        console.log("Answer received.");
      }
    } catch (error: any) {
      console.error("Query error:", error);
      // Avoid setting error message if it was handled specifically above
      if (!error.Message) {
        console.log(`Query failed: ${error.message}`);
      }
      // setStatusMessage("");
    } finally {
      setLoading(false);
    }
  }

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
                  <Label className="font-bold text-black">Title *</Label>
                  <Input
                    placeholder="Enter your title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label className="font-bold text-black">
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
                      <SelectItem value="Note">It's a Note</SelectItem>
                      <SelectItem value="webpage">It's a Webpage</SelectItem>
                      <SelectItem value="pdf">It's a PDF</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col gap-2">
                  <Label className="font-bold text-black">Your Content *</Label>
                  {contentType === "pdf" ? (
                    <Input
                      type="file"
                      accept=".pdf"
                      onChange={(e) =>
                        setContent(e.target.files?.[0] || "")
                      }
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

      {/* ChatBox */}
      <ChatBox />
    </div>
  );
}
