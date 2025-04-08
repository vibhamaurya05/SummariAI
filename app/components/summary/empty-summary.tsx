import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import Link from "next/link";


export default function EmptySummary(){
    return <div className="text-center py-12">
        <div className="flex flex-col items-center gap-4">
            <FileText className="text-gray-400 w-16 h-16"  />
            <h3 className="text-3xl font-semibold text-gray-400">No summaries yet</h3>
            <p className="text-gray-600 text-sm">Upload your first PDF to get started with AI-powerd summaries.</p>
            <Link href={'/uploads'}>
            <Button>Create you first summary</Button>
            </Link>
        </div>
        </div>
}