// import { metadata } from "@/app/layout";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

export const ourFileRouter ={
    pdfUploader: f({pdf:{maxFileSize:'32MB'}}).middleware(async({req})=>{
        // get user info 
        // const user = await currntUser(); // this  will be actuall user but i will make this static for now 
        const user = "123e4567-e89b-12d3-a456-426614174000";
        if(!user) throw new UploadThingError ('Unauthorized')

            return {userId : user}
    }).onUploadComplete(async({metadata, file})=>{
        console.log("upload completed for userID ", metadata.userId);
        console.log("File URL", file.url)
        return {userId:metadata.userId,file}
    })
}satisfies FileRouter

export type ourFileRouter = typeof ourFileRouter