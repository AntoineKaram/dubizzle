import { createUploadthing, type FileRouter } from "uploadthing/next";
const f = createUploadthing();

export const fileRouter = {
  profileImage: f({
    image: { maxFileSize: "4MB", maxFileCount: 1 },
  }).onUploadComplete(async ({ file }) => {
    console.log("Upload complete, file URL:", file.ufsUrl);
  }),
  adImages: f({
    image: { maxFileSize: "4MB", maxFileCount: 5 },
  }).onUploadComplete(async ({ file }) => {
    console.log("Upload complete, file URL:", file.ufsUrl);
  }),
} satisfies FileRouter;

export type CustomFileRouter = typeof fileRouter;
