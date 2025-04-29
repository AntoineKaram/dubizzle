"use client";
import React from "react";
import dayjs from "dayjs";
import { FaMapPin } from "react-icons/fa";
import { DetailedAd } from "@/lib/models";
import { categoryIcons } from "@/lib/constants/categoryIcons";
import ImageCarousel from "@/components/ui/ImageCarousel";

interface Props {
  ad: DetailedAd;
}

export default function AdDetailView({ ad }: Props) {
  return (
    <div className="bg-white rounded-xl bg-white rounded-xl shadow-2xl border border-gray-200 p-8 w-full max-w-5xl p-8 space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
        <div className="md:col-span-2 space-y-6">
          <ImageCarousel images={ad.images} />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{ad.title}</h1>
            <div className="flex items-center gap-2 text-sm text-gray-500 mt-2">
              {categoryIcons[ad.subcategory.category.name] || null}
              <span className="font-medium">
                {ad.subcategory.category.name}
              </span>
              <span>&gt;</span>
              <span>{ad.subcategory.name}</span>
            </div>
            <p className="text-red-600 text-3xl font-extrabold mt-2">
              USD {ad.price.toLocaleString()}
            </p>

            <div className="flex items-center gap-2 text-gray-500 mt-2">
              <FaMapPin className="w-4 h-4" />
              <span>{ad.location}</span>
            </div>

            <div className="text-sm text-gray-400 mt-1">
              Posted on {dayjs(ad.createdAt).format("DD MMM YYYY")}
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold mt-6 mb-2">Description</h2>
            <p className="text-gray-700 whitespace-pre-wrap">
              {ad.description}
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="border rounded-lg shadow p-6 bg-white">
            <h2 className="text-lg font-semibold mb-4">
              Listed by private user
            </h2>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-xl">
                {ad.user?.name?.[0] || "U"}
              </div>
              <div className="flex flex-col">
                <span className="font-semibold">{ad.user?.name}</span>
                <span className="text-sm text-gray-500">
                  Placeholder text, details
                </span>
              </div>
            </div>

            <hr className="my-4" />

            <button className="w-full bg-red-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-red-700 transition">
              Show phone number
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
