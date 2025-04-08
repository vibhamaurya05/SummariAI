"use client"

import { Button } from "@/components/ui/button";
import { TrashIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState, useTransition } from "react";
import { deleteSummary } from "@/lib/deleteSummary";
import { toast } from "sonner";



export default function DeleteButton({ summaryId }: { summaryId: string }) {

    const [open, setOpen] = useState(false)
    const [isPending, startTransition] = useTransition()


    const handleDelete = async ()=>{
        startTransition(async ()=>{

            const result = await deleteSummary({ summaryId })
    
            if(result ){
                toast('summary deleted')
    
            }

            setOpen(false)
        })
    }
  return (
    <div>
     
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
        <Button
        variant={"ghost"}
        size={"icon"}
        className="text-gray-400 bg-gray-50 border border-gray-200 hover:text-rose-600 hover:bg-rose-50"
      >
        <TrashIcon />
      </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Summary</DialogTitle>
            <DialogDescription>
            Are you sure you want to delete the summary? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
          <Button
        variant="ghost"
        // size="icon"
        onClick={() => setOpen(false)}
        className="text-gray-400 bg-gray-50 border border-gray-200 hover:text-gray-600 hover:bg-gray-100"
      >
       Cancle
      </Button>
      <Button
        variant="destructive"
        // size="icon"
        onClick={handleDelete}
        className="text-white bg-gray-900 border border-gray-200  hover:bg-gray-600"
      >
      {isPending ? 'Deleting...':'Delete'}
      </Button>
      
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
