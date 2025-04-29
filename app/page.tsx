"use client";

import { useEffect, useState } from "react";
import { Ad } from "@/lib/models";
import { api } from "@/lib/axios";
import PageWrapper from "@/components/ui/PageWrapper";
import Link from "next/link";
import Button from "@/components/ui/Button";
import dayjs from "dayjs";
import SearchAndFilters from "@/components/ui/SearchAndFilters";

export default function HomePage() {
  const [ads, setAds] = useState<Ad[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const [filters, setFilters] = useState({
    q: "",
    categoryId: "",
    subcategoryId: "",
    minPrice: "",
    maxPrice: "",
  });

  const fetchAds = async (pageNumber = 1, append = false) => {
    setLoading(true);

    const params = new URLSearchParams({
      page: pageNumber.toString(),
      limit: "10",
      ...(filters.q && { q: filters.q }),
      ...(filters.categoryId && { categoryId: filters.categoryId }),
      ...(filters.subcategoryId && { subcategoryId: filters.subcategoryId }),
      ...(filters.minPrice && { minPrice: filters.minPrice }),
      ...(filters.maxPrice && { maxPrice: filters.maxPrice }),
    });

    try {
      const { data } = await api.get<Ad[]>(`/api/ads?${params}`);
      if (data.length < 10) setHasMore(false);
      if (append) {
        setAds((prev) => [...prev, ...data]);
      } else {
        setAds(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const onFilter = async () => {
    setPage(1);
    setHasMore(true);
    await fetchAds(1, false);
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchAds(nextPage, true);
  };

  useEffect(() => {
    fetchAds();
  }, []);

  return (
    <PageWrapper>
      <div className="p-8 w-full max-w-6xl p-8 space-y-8 bg-white rounded-lg shadow-md min-h-200">
        <SearchAndFilters
          filters={filters}
          setFilters={setFilters}
          onFilter={onFilter}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {ads.map((ad) => (
            <Link
              href={`/ads/${ad.id}`}
              key={ad.id}
              className="border rounded-lg overflow-hidden bg-white shadow hover:shadow-lg transition"
            >
              <div className="aspect-[4/3] bg-gray-100">
                <img
                  src={ad.image || "/placeholder.png"}
                  alt={ad.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4 space-y-1">
                <h2 className="font-semibold text-lg text-gray-900 truncate">
                  {ad.title}
                </h2>
                <p className="text-red-600 font-bold text-lg">
                  USD {ad.price.toLocaleString()}
                </p>
                <p className="text-sm text-gray-500">
                  Posted on {dayjs(ad.createdAt).format("DD MMM YYYY")}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {hasMore && (
          <div className="flex justify-center mt-8">
            <Button onClick={handleLoadMore} loading={loading}>
              {loading ? "Loading..." : "Load More"}
            </Button>
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
