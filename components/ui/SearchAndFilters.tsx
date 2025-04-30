"use client";

import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { FaFilter } from "react-icons/fa";
import { useDebounce } from "@/hooks/debounce";

interface Props {
  filters: any;
  setFilters: (filters: any) => void;
  onFilter: () => void;
}

export default function SearchAndFilters({
  filters,
  setFilters,
  onFilter,
}: Props) {
  const categories = useSelector(
    (state: RootState) => state.settings.categories
  );
  const [showFilters, setShowFilters] = useState(false);

  const [search, setSearch] = useState(filters.q || "");
  const debouncedValue = useDebounce(search, 500);

  const selectedCategory = filters.categoryId;
  const currentSubcategories =
    categories.find((c) => c.id === selectedCategory)?.subcategories || [];

  useEffect(() => {
    setFilters((f: any) => ({ ...f, q: search }));
    onFilter();
  }, [debouncedValue]);

  return (
    <div className="flex items-center justify-between relative mb-8">
      <div className="flex-grow">
        <Input
          type="text"
          placeholder="Search by title or location"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full"
        />
      </div>

      <div className="relative ml-1">
        <button
          type="button"
          onClick={() => setShowFilters(!showFilters)}
          className="p-3.5 rounded-md border border-gray-300 focus:outline-none hover:bg-gray-100 transition cursor-pointer"
        >
          <FaFilter className="w-5 h-5 text-gray-600" />
        </button>

        {showFilters && (
          <div className="absolute right-0 mt-2 bg-white border rounded-lg shadow-lg w-64 p-4 z-50">
            <div className="flex flex-col gap-4">
              <div>
                <label className="font-semibold">Category</label>
                <select
                  className="mt-1 w-full border border-gray-300 focus:outline-none p-2 rounded-md"
                  value={filters.categoryId}
                  onChange={(e) =>
                    setFilters((f: any) => ({
                      ...f,
                      categoryId: e.target.value,
                      subcategoryId: "",
                    }))
                  }
                >
                  <option value="">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="font-semibold">Subcategory</label>
                <select
                  className="mt-1 w-full border border-gray-300 focus:outline-none p-2 rounded-md"
                  value={filters.subcategoryId}
                  onChange={(e) =>
                    setFilters((f: any) => ({
                      ...f,
                      subcategoryId: e.target.value,
                    }))
                  }
                  disabled={!selectedCategory}
                >
                  <option value="">All Subcategories</option>
                  {currentSubcategories.map((sub) => (
                    <option key={sub.id} value={sub.id}>
                      {sub.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="Min Price"
                  value={filters.minPrice}
                  onChange={(e) =>
                    setFilters((f: any) => ({ ...f, minPrice: e.target.value }))
                  }
                  className="w-1/2"
                />
                <Input
                  type="number"
                  placeholder="Max Price"
                  value={filters.maxPrice}
                  onChange={(e) =>
                    setFilters((f: any) => ({ ...f, maxPrice: e.target.value }))
                  }
                  className="w-1/2"
                />
              </div>
              <Button
                type="button"
                onClick={() => {
                  onFilter();
                  setShowFilters(false);
                }}
                className="mt-2 w-full"
              >
                Apply Filters
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
