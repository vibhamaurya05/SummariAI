"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { forwardRef } from "react";
import { Loader2 } from 'lucide-react'

interface FormInput {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean
}

const UploadPdfFrom = forwardRef<HTMLFormElement, FormInput>(
  ({ onSubmit ,isLoading }, ref) => {
    return (
      <form ref={ref} onSubmit={onSubmit}>
        <label htmlFor="">Upload you pdf</label>
        <div className="flex mt-2 gap-2">
          <Input
            type="file"
            id="file"
            name="file"
            accept="application/pdf"
            disabled={isLoading}
            placeholder="upload you pdf here"
            className={cn(isLoading &&  'opacity-50 cursor-not-allowed')}
          />
          <Button disabled={isLoading} className="">{isLoading? <><Loader2 className="mr-2  h-4 w-4 animate-spin"/>Processing...</>:'Upload your pdf'}</Button>
        </div>
      </form>
    );
  }
);

UploadPdfFrom.displayName = "UploadPdfFrom";

export default UploadPdfFrom;
