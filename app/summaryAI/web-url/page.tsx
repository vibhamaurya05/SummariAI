"use client"

import { useState } from "react";

export default function WebUrl(){
    const [webUrl, setWebUrl] = useState<string>("");
    const [isLoadingProcessing, setIsLoadingProcessing] =
    useState<boolean>(false);

    const handleProcessWebpage = async () => {
        if (!webUrl.trim()) {
        //   setErrorMessage("Please enter a valid URL.");
          return;
        }
    
        setIsLoadingProcessing(true);
        // setErrorMessage("");
        // setStatusMessage("Fetching and processing webpage...");
        // setAnswer("");
    
        try {
          const response = await fetch("/api/process", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ url: webUrl }), // send URL instead of raw text
          });
    
          const data = await response.json();
    
          if (!response.ok) {
            throw new Error(
              data.message || `HTTP error! status: ${response.status}`
            );
          }
    
        //   setStatusMessage(data.message || "Webpage processed successfully!");
          setWebUrl("");
        } catch (error: unknown) {
          if (error instanceof Error) {
            console.error("Webpage processing error:", error);
            // Optionally set error message or status message here
            // setErrorMessage(`Webpage processing failed: ${error.message}`);
            // setStatusMessage("");
          } else {
            console.error("Unknown error occurred during webpage processing:", error);
          }
        } finally {
          setIsLoadingProcessing(false);
        }
      };
    return (
        <div className="max-w-4xl mx-auto mt-4 sm:mt-12 px-4">
           <h1 className="text-3xl sm:text-5xl font-bold tracking-tight">Past Your webpage URL and See the magic</h1>
           <section className="my-8 px-6">
          <input
            type="text"
            placeholder="Paste a webpage URL to process..."
            className="w-full border border-gray-300 rounded-md p-3 mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={webUrl}
            onChange={(e) => setWebUrl(e.target.value)}
            disabled={isLoadingProcessing}
          />
          <button
            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 disabled:bg-purple-500"
            onClick={handleProcessWebpage}
            disabled={isLoadingProcessing || !webUrl.trim()}
          >
            {isLoadingProcessing ? "Fetching..." : "Fetch & Process Webpage"}
          </button>
        </section>
        </div>
    )
}