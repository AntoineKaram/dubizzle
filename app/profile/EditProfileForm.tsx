/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { User } from "@/lib/models";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { api } from "@/lib/axios";
import { UploadButton } from "@/components/uploadthing";

export default function EditProfileForm({
  user,
  onComplete,
}: {
  user: User;
  onComplete: (user: User) => void;
}) {
  const [profilePicUrl, setProfilePicUrl] = useState<string | null>(
    user.profilePic || null
  );
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    const name = (e.target as any).name.value.trim();
    const address = (e.target as any).address.value.trim();

    if (!name) {
      setError("Name is required.");
      return;
    }
    if (name.length < 2) {
      setError("Name must be at least 2 characters.");
      return;
    }
    if (name.length > 50) {
      setError("Name must be less than 50 characters.");
      return;
    }
    if (address.length > 200) {
      setError("Address must be less than 200 characters.");
      return;
    }

    setLoading(true);

    const updatedUser = user;
    updatedUser.name = name;
    updatedUser.address = address;
    updatedUser.profilePic = profilePicUrl ?? undefined;

    try {
      const body = {
        name,
        address,
        profilePic: profilePicUrl,
      };
      await api.put("/api/user/update", body);

      setSuccess(true);
      onComplete(updatedUser);
    } catch (err: any) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 w-full animate-fade-in">
      <div className="relative w-32 h-32">
        <img
          src={profilePicUrl || "/default-profile.png"}
          alt="Profile Picture"
          className="object-cover rounded-full border-4 border-red-600 w-full h-full"
        />

        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 opacity-0 hover:opacity-100 transition rounded-full">
          <UploadButton
            endpoint="profileImage"
            onClientUploadComplete={(res) => {
              if (res && res.length > 0) {
                setProfilePicUrl(res[0].ufsUrl);
              }
              setUploading(false);
            }}
            onUploadBegin={() => setUploading(true)}
            onUploadError={(error) => {
              setError(error.message);
            }}
            className="
            ut-button:bg-transparent 
            ut-button:text-transparent 
            ut-button:border-none 
            ut-label:hidden 
            ut-allowed-content:hidden 
            ut-uploading:hidden 
            cursor-pointer 
            absolute inset-0
          "
          />
        </div>
      </div>
      <Input
        name="name"
        defaultValue={user.name}
        type="text"
        placeholder="Name"
        required
      />
      <textarea
        name="address"
        defaultValue={user.address || ""}
        placeholder="Address"
        rows={3}
        className="w-full p-3 border border-gray-300 rounded-md transition"
      />
      {error && (
        <p className="text-sm text-center text-red-500 animate-fade-in">
          {error}
        </p>
      )}
      {success && (
        <p className="text-sm text-center text-green-500 animate-fade-in">
          Profile updated successfully!
        </p>
      )}
      <div className="flex gap-2 mt-4">
        <Button type="submit" loading={loading || uploading} variant="primary">
          {loading ? "Saving..." : uploading ? "Uploading..." : "Save Changes"}
        </Button>

        <Button
          variant="secondary"
          type="button"
          onClick={() => onComplete(user)}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
