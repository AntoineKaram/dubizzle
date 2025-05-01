"use client";

import React, { useMemo, useState } from "react";
import { Ad } from "@/lib/models";
import dayjs from "dayjs";
import Link from "next/link";
import PaginatedSortableTable from "@/components/ui/PaginatedSortableTable";
import { FaEye } from "react-icons/fa";

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

      <PaginatedSortableTable
        data={paginatedAds}
        total={filteredAds.length}
        page={page}
        limit={PAGE_SIZE}
        sort={sortBy}
        direction={sortDir}
        rowKey="id"
        onSortChange={(newSort, newDirection) => {
          setSortBy(newSort as typeof sortBy);
          setSortDir(newDirection as typeof sortDir);
        }}
        onPageChange={(newPage) => setPage(newPage)}
        columns={[
          {
            key: "title",
            label: "Title",
            render: (ad) => (
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
            ),
          },
          {
            key: "price",
            label: "Price",
            sortable: true,
            render: (ad) =>
              new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(ad.price),
          },
          {
            key: "status",
            label: "Status",
            render: (ad) => (
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
            ),
          },
          {
            key: "createdAt",
            label: "Posted",
            sortable: true,
            render: (ad) => dayjs(ad.createdAt).format("DD MMM YYYY"),
          },
          {
            key: "actions",
            label: "Actions",
            render: (ad) => (
              <Link
                href={`/ads/${ad.id}`}
                className="text-blue-600 hover:text-blue-800 inline-flex items-center gap-1"
              >
                <FaEye className="w-4 h-4" /> View
              </Link>
            ),
          },
        ]}
      />
    </div>
  );
}
