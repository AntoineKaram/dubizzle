"use client";

import { useState } from "react";
import { AdEditRequest } from "@/lib/models";
import Button from "@/components/ui/Button";
import { api } from "@/lib/axios";
import { RedirectType } from "next/navigation";
import { useRouter } from "next/navigation";
interface Props {
  edit: AdEditRequest;
  callbackUrl: string;
}

export default function EditRequestPanel({ edit, callbackUrl }: Props) {
  const router = useRouter();

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAction = async (action: "APPROVED" | "REJECTED") => {
    setLoading(true);
    setError("");
    try {
      await api.patch(`/api/ads/edit-request/${edit.id}`, { action });
      router.push(callbackUrl);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to process request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 mt-8 border rounded-lg shadow-sm bg-white">
      <h3 className="text-lg font-semibold mb-2">Edit Request Review</h3>
      <div className="text-sm text-gray-700 space-y-1">
        <p>
          <strong>Title:</strong> {edit.title}
        </p>
        <p>
          <strong>Description:</strong> {edit.description}
        </p>
        <p>
          <strong>Price:</strong> ${edit.price.toFixed(2)}
        </p>
        <p>
          <strong>Location:</strong> {edit.location}
        </p>
        <p>
          <strong>Payment:</strong> {edit.paymentOption}
        </p>
        <p>
          <strong>Images:</strong> {edit.images.length} uploaded
        </p>
      </div>

      {error && <p className="text-sm text-red-500 mt-2">{error}</p>}

      <div className="flex gap-4 mt-4">
        <Button
          variant="primary"
          loading={loading}
          onClick={() => handleAction("APPROVED")}
        >
          Approve Changes
        </Button>
        <Button
          variant="secondary"
          loading={loading}
          onClick={() => handleAction("REJECTED")}
        >
          Reject Changes
        </Button>
      </div>
    </div>
  );
}
