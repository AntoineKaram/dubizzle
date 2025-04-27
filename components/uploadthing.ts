import { CustomFileRouter } from "@/lib/upload";
import {
  generateUploadButton,
  generateUploadDropzone,
} from "@uploadthing/react";

export const UploadButton = generateUploadButton<CustomFileRouter>();
export const UploadDropzone = generateUploadDropzone<CustomFileRouter>();
