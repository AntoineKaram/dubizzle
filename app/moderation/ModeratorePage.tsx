"use client";

import { useCallback, useEffect, useState } from "react";
import dayjs from "dayjs";
import Link from "next/link";
import { FaArrowDown, FaArrowUp } from "react-icons/fa";

import { api } from "@/lib/axios";
import { DetailedAd } from "@/lib/models";

const ModeratorPage: React.FC<{ userId: string }> = ({ userId }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const limit = 10;
  const offset = (page - 1) * limit;

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
      offset: offset.toString(),
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
  }, [page, limit, sortField, sortDirection, offset]);

  useEffect(() => {
    fetchAds();
  }, [fetchAds]);
  
  return (
    <div className="bg-white rounded-xl bg-white rounded-xl shadow-2xl border border-gray-200 p-8 w-full max-w-4xl p-8 space-y-8 min-h-200">
      <h1 className="text-2xl font-bold mb-6">Pending Ads for Review</h1>
      {isLoading ? (
        <p className="text-gray-500">Loading...</p>
      ) : data.ads.length === 0 ? (
        <p className="text-gray-500">No pending ads 🎉</p>
      ) : (
        <div className="overflow-x-auto border rounded-lg shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-100 text-gray-700 border-b">
              <tr>
                <th className="px-4 py-3">
                  <Link
                    onClick={() => {
                      setSortField("title");
                      setSortDirection((prev) =>
                        prev === "asc" ? "desc" : "asc"
                      );
                    }}
                    href={""}
                  >
                    Title
                    {sortField === "title" ? (
                      sortDirection === "asc" ? (
                        <FaArrowUp className="inline w-4 h-4" />
                      ) : (
                        <FaArrowDown className="inline w-4 h-4" />
                      )
                    ) : (
                      <></>
                    )}
                  </Link>
                </th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Posted By</th>
                <th className="px-4 py-3">
                  <Link
                    onClick={() => {
                      setSortField("createdAt");
                      setSortDirection((prev) =>
                        prev === "asc" ? "desc" : "asc"
                      );
                    }}
                    href={""}
                  >
                    Date
                    {sortField === "createdAt" ? (
                      sortDirection === "asc" ? (
                        <FaArrowUp className="inline w-4 h-4" />
                      ) : (
                        <FaArrowDown className="inline w-4 h-4" />
                      )
                    ) : (
                      <></>
                    )}
                  </Link>
                </th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.ads.map((ad) => (
                <tr key={ad.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3">{ad.title}</td>
                  <td className="px-4 py-3">
                    {ad.subcategory.category.name} {">"} {ad.subcategory.name}
                  </td>
                  <td className="px-4 py-3">{ad.user?.name || "Unknown"}</td>
                  <td className="px-4 py-3">
                    {dayjs(ad.createdAt).format("DD MMM YYYY")}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Link
                      href={`/ads/${ad.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      Review
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-end gap-2 mt-6">
            {Array.from({ length: Math.ceil(data.total / limit) }).map(
              (_, i) => (
                <Link
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`px-3 py-1 rounded-md ${
                    page === i + 1
                      ? "bg-red-600 text-white"
                      : "hover:bg-gray-100"
                  }`}
                  href={""}
                >
                  {i + 1}
                </Link>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
};
export default ModeratorPage;
