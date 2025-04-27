

import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();
export const ourFileRouter ={
    pdfUploader: f({pdf:{maxFileSize:'32MB'}}).middleware(async({})=>{
        const user = '3d0c22db-0dfa-41ab-88c6-52ad504f938e';
        if(!user) throw new UploadThingError ('Unauthorized')

            return {userId : user}
    }).onUploadComplete(async({metadata, file})=>{
        console.log("upload completed for userID ", metadata.userId);
        console.log("File URL", file.url)
        return {userId:metadata.userId,file}
    })
}satisfies FileRouter

export type ourFileRouter = typeof ourFileRouter