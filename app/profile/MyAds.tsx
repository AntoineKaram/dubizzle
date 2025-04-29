"use client";

import React, { useMemo, useState } from "react";
import { Ad } from "@/lib/models";
import dayjs from "dayjs";
import Link from "next/link";
import { FaArrowDown, FaArrowUp, FaEye } from "react-icons/fa";

interface MyAdsProps {
  ads: Ad[];
}

const PAGE_SIZE = 5;
const statuses = ["ALL", "PENDING", "APPROVED", "REJECTED"] as const;

export default function MyAds({ ads }: MyAdsProps) {
  const [statusFilter, setStatusFilter] =
    useState<(typeof statuses)[number]>("ALL");
  const [sortBy, setSortBy] = useState<"createdAt" | "price">("createdAt");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);

  const filteredAds = useMemo(() => {
    let result = [...ads];
    if (statusFilter !== "ALL") {
      result = result.filter((ad) => ad.status === statusFilter);
    }
    result.sort((a, b) => {
      const aVal =
        sortBy === "price" ? a.price : new Date(a.createdAt).getTime();
      const bVal =
        sortBy === "price" ? b.price : new Date(b.createdAt).getTime();
      return sortDir === "asc" ? aVal - bVal : bVal - aVal;
    });
    return result;
  }, [ads, statusFilter, sortBy, sortDir]);

  const paginatedAds = filteredAds.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );
  const totalPages = Math.ceil(filteredAds.length / PAGE_SIZE);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);

  const toggleSort = (column: typeof sortBy) => {
    if (sortBy === column) {
      setSortDir((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(column);
      setSortDir("asc");
    }
  };

  return (
    <div className="w-full md:w-2/3 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-gray-900">My Ads</h2>
        <div className="flex gap-2 flex-wrap">
          {statuses.map((s) => (
            <button
              key={s}
              onClick={() => {
                setStatusFilter(s);
                setPage(1);
              }}
              className={`px-3 py-1 rounded-full text-sm border cursor-pointer ${
                statusFilter === s
                  ? "bg-red-600 text-white border-red-600"
                  : "text-gray-600 border-gray-300 hover:border-red-400"
              } transition`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto border rounded-lg shadow-sm">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-700 border-b">
            <tr>
              <th className="py-3 px-4">Title</th>
              <th
                className="py-3 px-4 cursor-pointer select-none"
                onClick={() => toggleSort("price")}
              >
                Price{" "}
                {sortBy === "price" &&
                  (sortDir === "asc" ? (
                    <FaArrowUp className="inline w-4 h-4" />
                  ) : (
                    <FaArrowDown className="inline w-4 h-4" />
                  ))}
              </th>
              <th className="py-3 px-4">Status</th>
              <th
                className="py-3 px-4 cursor-pointer select-none"
                onClick={() => toggleSort("createdAt")}
              >
                Posted{" "}
                {sortBy === "createdAt" &&
                  (sortDir === "asc" ? (
                    <FaArrowUp className="inline w-4 h-4" />
                  ) : (
                    <FaArrowDown className="inline w-4 h-4" />
                  ))}
              </th>
              <th className="py-3 px-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedAds.map((ad) => (
              <tr key={ad.id} className="border-b hover:bg-gray-50 transition">
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    {ad.image ? (
                      <img
                        src={ad.image}
                        alt={ad.title}
                        className="w-10 h-10 object-cover rounded border"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-gray-200 rounded" />
                    )}
                    <span className="font-medium">{ad.title}</span>
                  </div>
                </td>
                <td className="py-3 px-4">{formatPrice(ad.price)}</td>
                <td className="py-3 px-4">
                  <span
                    className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
                      ad.status === "APPROVED"
                        ? "bg-green-100 text-green-700"
                        : ad.status === "PENDING"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {ad.status}
                  </span>
                </td>
                <td className="py-3 px-4">
                  {dayjs(ad.createdAt).format("DD MMM YYYY")}
                </td>
                <td className="py-3 px-4 text-center">
                  <Link
                    href={`/ads/${ad.id}`}
                    className="text-blue-600 hover:text-blue-800 inline-flex items-center gap-1"
                  >
                    <FaEye className="w-4 h-4" />
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-end items-center gap-2 text-sm text-gray-600">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`w-8 h-8 rounded-full text-sm font-medium cursor-pointer ${
                page === i + 1 ? "bg-red-600 text-white" : "hover:bg-gray-200"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
