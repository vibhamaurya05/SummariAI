"use client"
import { Button } from "@/components/ui/button";
import { ArrowDown } from "lucide-react";

export function DownloadSummaryButton({
    file_name,
  title,
  summary_text,
  createdAt,
}: {
  file_name: string;
  title: string;
  summary_text: string;
  createdAt: Date;
}){

    const handleDownload = ()=>{
        const summaryContent = ` # ${title} 
    Generated Summary 
    Genereted on: ${new Date(createdAt).toLocaleDateString()}
    ${summary_text}
    Original File: ${file_name}
    Genereated By pdf_summary`;

        const blob = new Blob([summaryContent], {type:'text/plain'});

        const url = URL.createObjectURL(blob)
        const link = document.createElement('a');
        link.href = url;
        link.download = `Summary-${title.replace(/[^a-z0-9]/gi,'_')}.txt`;
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
    }
    return(
       <Button className="" onClick={handleDownload}><ArrowDown/> Download Summary</Button>
    )
}