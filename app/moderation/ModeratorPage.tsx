"use client";

import { useCallback, useEffect, useState } from "react";
import dayjs from "dayjs";
import Link from "next/link";
import { api } from "@/lib/axios";
import { DetailedAd, AdEditRequest } from "@/lib/models";
import PaginatedSortableTable from "@/components/ui/PaginatedSortableTable";

const ModeratorPage: React.FC<{ userId: string }> = ({ userId }) => {
  const [activeTab, setActiveTab] = useState<"ads" | "edits">("ads");

  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const limit = 10;

  const [adsData, setAdsData] = useState<{ ads: DetailedAd[]; total: number }>({
    ads: [],
    total: 0,
  });
  const [editData, setEditData] = useState<{
    edits: AdEditRequest[];
    total: number;
  }>({
    edits: [],
    total: 0,
  });

  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [sortField, setSortField] = useState<"createdAt" | "title">(
    "createdAt"
  );

  const fetchAds = useCallback(async () => {
    setIsLoading(true);
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      sort: sortField,
      direction: sortDirection,
    });

    try {
      const { data } = await api.get<{ ads: DetailedAd[]; total: number }>(
        `/api/ads/pending?${params}`
      );
      setAdsData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [page, limit, sortField, sortDirection]);

  const fetchEditRequests = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data } = await api.get<{ edits: AdEditRequest[]; total: number }>(
        `/api/ads/edit-request`
      );
      setEditData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === "ads") {
      fetchAds();
    } else {
      fetchEditRequests();
    }
  }, [fetchAds, fetchEditRequests, activeTab]);

  return (
    <div className="bg-white rounded-xl shadow-2xl border border-gray-200 p-8 w-full max-w-4xl space-y-8 min-h-200">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Moderator Dashboard</h1>
        <div className="flex gap-2">
          <button
            className={`px-3 py-1 rounded-full text-sm border transition cursor-pointer ${
              activeTab === "ads"
                ? "bg-red-600 text-white border-red-600"
                : "text-gray-600 border-gray-300 hover:border-red-400"
            }`}
            onClick={() => setActiveTab("ads")}
          >
            Pending Ads
          </button>
          <button
            className={`px-3 py-1 rounded-full text-sm border transition cursor-pointer ${
              activeTab === "edits"
                ? "bg-red-600 text-white border-red-600"
                : "text-gray-600 border-gray-300 hover:border-red-400"
            }`}
            onClick={() => setActiveTab("edits")}
          >
            Edit Requests
          </button>
        </div>
      </div>

      {isLoading ? (
        <p className="text-gray-500">Loading...</p>
      ) : activeTab === "ads" ? (
        adsData.ads.length === 0 ? (
          <p className="text-gray-500">No pending ads 🎉</p>
        ) : (
          <PaginatedSortableTable
            data={adsData.ads}
            total={adsData.total}
            page={page}
            limit={limit}
            sort={sortField}
            direction={sortDirection}
            rowKey="id"
            onSortChange={(field, direction) => {
              setSortField(field as typeof sortField);
              setSortDirection(direction as typeof sortDirection);
            }}
            onPageChange={(newPage) => setPage(newPage)}
            columns={[
              {
                key: "title",
                label: "Title",
                sortable: true,
                render: (ad) => ad.title,
              },
              {
                key: "subcategory",
                label: "Category",
                render: (ad) =>
                  `${ad.subcategory.category.name} > ${ad.subcategory.name}`,
              },
              {
                key: "user",
                label: "Posted By",
                render: (ad) => ad.user?.name || "Unknown",
              },
              {
                key: "createdAt",
                label: "Date",
                sortable: true,
                render: (ad) => dayjs(ad.createdAt).format("DD MMM YYYY"),
              },
              {
                key: "actions",
                label: "Actions",
                render: (ad) => (
                  <Link
                    href={`/ads/${ad.id}`}
                    className="text-blue-600 hover:underline"
                  >
                    Review
                  </Link>
                ),
              },
            ]}
          />
        )
      ) : editData.edits.length === 0 ? (
        <p className="text-gray-500">No edit requests 🎉</p>
      ) : (
        <PaginatedSortableTable
          data={editData.edits}
          total={editData.total}
          page={1}
          limit={limit}
          sort={"createdAt"}
          direction={"desc"}
          rowKey="id"
          onSortChange={() => {}}
          onPageChange={() => {}}
          columns={[
            {
              key: "title",
              label: "Title",
              render: (edit) => edit.title,
            },
            {
              key: "status",
              label: "Status",
              render: (edit) => (
                <span className="text-yellow-600 font-medium">
                  {edit.status}
                </span>
              ),
            },
            {
              key: "createdAt",
              label: "Submitted",
              render: (edit) => dayjs(edit.createdAt).format("DD MMM YYYY"),
            },
            {
              key: "actions",
              label: "Actions",
              render: (edit) => (
                <Link
                  href={`/ads/${edit.originalAd.id}`}
                  className="text-blue-600 hover:underline"
                >
                  Review
                </Link>
              ),
            },
          ]}
        />
      )}
    </div>
  );
};

export default ModeratorPage;
