"use client";

import React from "react";
import Link from "next/link";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { FaArrowDown, FaArrowUp } from "react-icons/fa";

interface Column<T> {
  key: keyof T | "actions";
  label: string;
  sortable?: boolean;
  render?: (row: T) => React.ReactNode;
}

interface Props<T> {
  data: T[];
  columns: Column<T>[];
  total: number;
  page: number;
  limit: number;
  sort: string;
  direction: "asc" | "desc";
  rowKey: keyof T;
  onSortChange: (newSort: string, newDirection: "asc" | "desc") => void;
  onPageChange: (newPage: number) => void;
}

export default function PaginatedSortableTable<T>({
  data,
  columns,
  total,
  page,
  limit,
  sort,
  direction,
  rowKey,
  onSortChange,
  onPageChange,
}: Props<T>) {
  const totalPages = Math.ceil(total / limit);

  return (
    <div className="overflow-x-auto border rounded-lg shadow-sm">
      <table className="w-full text-sm text-left">
        <thead className="bg-gray-100 text-gray-700 border-b">
          <tr>
            {columns.map((col) => (
              <th
                key={String(col.key)}
                className="py-3 px-4 select-none"
              >
                {col.sortable ? (
                  <button
                    onClick={() =>
                      onSortChange(
                        String(col.key),
                        sort === col.key && direction === "asc" ? "desc" : "asc"
                      )
                    }
                    className="flex items-center gap-1 cursor-pointer"
                  >
                    {col.label}
                    {sort === col.key && (
                      <>
                        {direction === "asc" ? (
                          <FaArrowUp className="w-4 h-4" />
                        ) : (
                          <FaArrowDown className="w-4 h-4" />
                        )}
                      </>
                    )}
                  </button>
                ) : (
                  col.label
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={String(row[rowKey])} className="border-b hover:bg-gray-50">
              {columns.map((col) => (
                <td key={String(col.key)} className="py-3 px-4">
                  {col.render
                    ? col.render(row)
                    : col.key == "actions"
                    ? ""
                    : String(row[col.key])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {totalPages > 1 && (
        <div className="flex justify-end gap-2 p-4 text-sm text-gray-600">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => onPageChange(i + 1)}
              className={`px-3 py-1 rounded-full cursor-pointer ${
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
