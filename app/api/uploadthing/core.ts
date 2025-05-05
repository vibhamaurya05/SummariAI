import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

// Initialize the uploadthing instance
const f = createUploadthing();

// Define your file router
export const ourFileRouter = {
  pdfUploader: f({
    pdf: { maxFileSize: '32MB' },
  })
    .middleware(async ({}) => {
      // Simulating user retrieval (can replace with actual logic)
      const user = '3d0c22db-0dfa-41ab-88c6-52ad504f938e';
      
      if (!user) throw new UploadThingError('Unauthorized');

      // Return metadata with userId
      return { userId: user };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // Log userId and file URL on upload completion
      console.log("Upload completed for userID ", metadata.userId);
      console.log("File URL", file.url);
      
      // Ensure the returned object matches the expected type for onUploadComplete
      return { userId: metadata.userId, fileUrl: file.url };
    })
} satisfies FileRouter; // Type assertion to ensure it's a valid FileRouter

// Export the type of the file router
export type ourFileRouter = typeof ourFileRouter;
