"use client";

import { useCallback, useEffect, useState } from "react";
import dayjs from "dayjs";
import Link from "next/link";
import { api } from "@/lib/axios";
import { DetailedAd } from "@/lib/models";
import PaginatedSortableTable from "@/components/ui/PaginatedSortableTable";

const ModeratorPage: React.FC<{ userId: string }> = ({ userId }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const limit = 10;
  const [data, setData] = useState<{ ads: DetailedAd[]; total: number }>({
    ads: [],
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
      setData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [page, limit, sortField, sortDirection]);

  useEffect(() => {
    fetchAds();
  }, [fetchAds]);

  return (
    <div className="bg-white rounded-xl shadow-2xl border border-gray-200 p-8 w-full max-w-4xl space-y-8 min-h-200">
      <h1 className="text-2xl font-bold mb-6">Pending Ads for Review</h1>
      {isLoading ? (
        <p className="text-gray-500">Loading...</p>
      ) : data.ads.length === 0 ? (
        <p className="text-gray-500">No pending ads 🎉</p>
      ) : (
        <PaginatedSortableTable
          data={data.ads}
          total={data.total}
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
              render: (ad) => `${ad.subcategory.category.name} > ${ad.subcategory.name}`,
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
      )}
    </div>
  );
};

export default ModeratorPage;
