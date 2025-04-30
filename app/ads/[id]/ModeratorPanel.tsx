"use client";

import { useState } from "react";
import { api } from "@/lib/axios";
import { AdStatus } from "@/lib/models";

import Button from "@/components/ui/Button";

interface Props {
  adId: string;
  currentStatus: AdStatus;
}

export default function ModeratorPanel({ adId, currentStatus }: Props) {
  const [status, setStatus] = useState<AdStatus>(currentStatus);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleReview = async (newStatus: AdStatus) => {
    setLoading(true);
    setError("");

    try {
      const { data } = await api.patch(`/api/ads/review/${adId}`, { status: newStatus });
      setStatus(data.status);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update status");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border border-gray-200 rounded-lg shadow-sm bg-white">
      <h3 className="text-lg font-semibold mb-2">Moderator Review</h3>
      <p className="text-sm text-gray-600 mb-4">Current status: <strong>{status}</strong></p>

      {status === "PENDING" ? (
        <div className="flex gap-4">
          <Button
            variant="primary"
            onClick={() => handleReview("APPROVED")}
            loading={loading}
          >
            Approve
          </Button>
          <Button
            variant="secondary"
            onClick={() => handleReview("REJECTED")}
            loading={loading}
          >
            Reject
          </Button>
        </div>
      ) : (
        <p className="text-sm text-green-600">
          This ad has been {status?.toLowerCase()}.
        </p>
      )}

      {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
    </div>
  );
}
