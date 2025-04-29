"use client";
import React from "react";
import { FaCloudUploadAlt, FaCamera } from "react-icons/fa";
import { UploadDropzone } from "@/components/uploadthing";
import { ClientUploadedFileData } from "uploadthing/types";

interface UploadGridProps {
  value: string[];
  onChange: (newUrls: string[]) => void;
  max?: number;
}
export const UploadGrid: React.FC<UploadGridProps> = ({
  value,
  onChange,
  max = 5,
}) => {
  const handleUpload = (files: ClientUploadedFileData<null>[]) => {
    const incoming = files.map((f) => f.ufsUrl);
    const merged = [...value, ...incoming].slice(0, max);
    onChange(merged);
  };

  return (
    <div className="grid grid-cols-3 gap-4 mt-4">
      {Array.from({ length: max }).map((_, i) => (
        <div key={i}>
          {value[i] ? (
            <div className="relative w-full h-32 rounded-md border border-gray-300 rounded-md border border-gray-300 flex items-center justify-center bg-gray-100 overflow-hidden mt-2">
              <img src={value[i]} className="object-cover w-full h-full" />
            </div>
          ) : i === value.length ? (
            <UploadDropzone
              endpoint="adImages"
              onClientUploadComplete={handleUpload}
              disabled={value.length >= max}
              className="ut-uploading:bg-white relative w-full h-32 cursor-pointer rounded-md border border-gray-300 bg-gray-100 overflow-hidden"
              content={{
                uploadIcon: () => (
                  <FaCloudUploadAlt className="w-8 h-8 text-gray-400 mt-8" />
                ),
                allowedContent({ ready, isUploading }) {
                  if (!ready) return "loading...";
                  if (isUploading) return "uploading..";
                  return "";
                },
                button: <></>,
                label: <></>,
              }}
              config={{ mode: "auto" }}
            />
          ) : (
            <div className="relative w-full h-32 rounded-md border border-gray-300 rounded-md border border-gray-300 flex items-center justify-center bg-gray-100 overflow-hidden mt-2">
              <FaCamera className="w-8 h-8 text-gray-400" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
