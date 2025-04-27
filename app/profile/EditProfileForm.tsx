"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { User } from "@/lib/models";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { api } from "@/lib/axios";
import Image from "next/image";

export default function EditProfileForm({
  user,
  onCancel,
}: {
  user: User;
  onCancel: () => void;
}) {
  const router = useRouter();
  const nameRef = useRef<HTMLInputElement>(null);
  const addressRef = useRef<HTMLTextAreaElement>(null);
  const profilePicRef = useRef<HTMLInputElement>(null);

  const [preview, setPreview] = useState<string | null>(
    user.profilePic || null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleImageChange = () => {
    const file = profilePicRef.current?.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);

    const name = nameRef.current?.value.trim() || "";
    const address = addressRef.current?.value.trim() || "";
    const profilePicFile = profilePicRef.current?.files?.[0];

    const formData = new FormData();
    formData.append("name", name);
    formData.append("address", address);
    if (profilePicFile) {
      formData.append("profilePic", profilePicFile);
    }

    try {
      await api.put("/api/user/update", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSuccess(true);
      setTimeout(() => router.refresh(), 1000);
    } catch (err: any) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 w-full animate-fade-in">
      <div className="relative w-32 h-32 mx-auto">
        <Image
          src={preview || "/default-profile.png"}
          alt="Profile Preview"
          fill
          className="object-cover rounded-full border-4 border-red-600"
        />
      </div>

      <Input
        ref={nameRef}
        defaultValue={user.name}
        type="text"
        placeholder="Name"
        required
      />
      <textarea
        ref={addressRef}
        defaultValue={user.address || ""}
        placeholder="Address"
        rows={3}
        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 transition"
      ></textarea>

      <Input
        ref={profilePicRef}
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="w-full p-3 border border-gray-300 rounded-md"
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
        <Button type="submit" loading={loading} variant="primary">
          {loading ? "Saving..." : "Save Changes"}
        </Button>

        <Button variant="secondary" type="button" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
