"use client";

import { Ad } from "@/lib/models";
import dayjs from "dayjs";

interface MyAdsProps {
  ads: Ad[];
}

export default function MyAds({ ads }: MyAdsProps) {
  return (
    <div className="w-full md:w-2/3">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center md:text-left">
        My Ads
      </h2>

      {ads.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-40 text-gray-400 border-2 border-dashed rounded-lg">
          <p className="text-lg">You haven't posted any ads yet.</p>
          <p className="text-sm mt-2">Start by creating your first ad!</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-gray-700 border-b">
                <th className="py-2 px-4 font-semibold">Title</th>
                <th className="py-2 px-4 font-semibold">Price</th>
                <th className="py-2 px-4 font-semibold">Status</th>
                <th className="py-2 px-4 font-semibold">Posted At</th>
              </tr>
            </thead>
            <tbody>
              {ads.map((ad) => (
                <tr key={ad.id} className="border-b">
                  <td className="py-2 px-4">{ad.title}</td>
                  <td className="py-2 px-4">${ad.price.toFixed(2)}</td>
                  <td className="py-2 px-4">
                    <span
                      className={`inline-block px-3 py-1 text-sm rounded-full ${
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
                  <td className="py-2 px-4">
                    {dayjs(ad.createdAt).format("DD MMM YYYY")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
