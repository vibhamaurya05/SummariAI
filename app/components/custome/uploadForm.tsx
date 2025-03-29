'use client'

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface FormInput {
    onSubmit:(e:React.FormEvent<HTMLFormElement>)=>void;
}
export default function UploadPdfFrom ({onSubmit}:FormInput){
    return (
       
         <form onSubmit={onSubmit}>
            <label htmlFor="">Upload you pdf</label>
            <div className="flex mt-2 gap-2">
            <Input type="file"  
            id="file"
            name="file"
            accept="application/pdf"
            placeholder="upload you pdf here"
            className=""
            />
            <Button className="">Upload</Button>
            </div>
         </form>
       
      );
}