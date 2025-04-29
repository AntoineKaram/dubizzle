"use client";

import React, { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { api } from "@/lib/axios";
import { RootState } from "@/store/store";
import { adFormSchema, AdFormValues } from "@/lib/schemas/ad";

import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import PageWrapper from "@/components/ui/PageWrapper";
import { UploadGrid } from "@/components/ui/UploadGrid";
import { LocationPicker } from "@/components/ui/LocationPicker";

export default function NewAdPage() {
  const router = useRouter();
  const { categories, paymentOptions } = useSelector(
    (s: RootState) => s.settings
  );

  const [error, setError] = useState<string>("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [selectedSubcategoryId, setSelectedSubcategoryId] =
    useState<string>("");
  const [selectedPaymentOption, setSelectedPaymentOption] =
    useState<string>("");
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<AdFormValues>({
    resolver: zodResolver(adFormSchema),
  });

  const onSubmit = useCallback(async (data: AdFormValues) => {
    try {
      await api.post("/api/ads/create", data);
      router.push("/profile");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      setError(e.response?.data?.message || "Failed to post ad");
    }
  }, []);

  return (
    <PageWrapper>
      <div className="bg-white rounded-xl bg-white rounded-xl shadow-2xl border border-gray-200 p-8 w-full max-w-2xl p-8 space-y-8">
        <h1 className="text-2xl font-bold text-center">Post New Ad</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <h2 className="font-semibold mb-2">Title</h2>
            <Input {...register("title")} error={errors.title?.message} />
          </div>

          <div>
            <h2 className="font-semibold mb-2">Description</h2>
            <textarea
              {...register("description")}
              rows={4}
              className={`w-full p-3 border rounded-md focus:outline-none transition ${
                errors.description
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300"
              }`}
            />
            {errors.description && (
              <p className="text-sm text-red-500">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h2 className="font-semibold mb-2">Category</h2>
              <select
                {...register("categoryId")}
                onChange={(e) => {
                  setSelectedCategoryId(e.target.value);
                  setSelectedSubcategoryId("");
                }}
                defaultValue={""}
                className={`w-full p-3 border rounded-md focus:outline-none transition cursor-pointer ${
                  errors.categoryId
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300"
                }`}
              >
                <option value="" disabled>
                  Select Category
                </option>
                {categories.map((cat) => (
                  <option
                    key={cat.id}
                    className="cursor-pointer"
                    value={cat.id}
                  >
                    {cat.name}
                  </option>
                ))}
              </select>
              {errors.categoryId && (
                <p className="text-sm text-red-500">
                  {errors.categoryId.message}
                </p>
              )}
            </div>

            <div>
              <h2 className="font-semibold mb-2">Subcategory</h2>
              <select
                {...register("subcategoryId")}
                defaultValue={""}
                value={selectedSubcategoryId}
                onChange={(e) => setSelectedSubcategoryId(e.target.value)}
                className={`w-full p-3 border rounded-md focus:outline-none transition  transition-colors duration-300 cursor-pointer ${
                  errors.subcategoryId
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300"
                }
                ${
                  !selectedCategoryId
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : ""
                }`}
                disabled={!selectedCategoryId}
              >
                <option value="" disabled>
                  Select Subcategory
                </option>
                {categories
                  .find((cat) => cat.id === selectedCategoryId)
                  ?.subcategories.map((sub) => (
                    <option
                      key={sub.id}
                      className="cursor-pointer"
                      value={sub.id}
                    >
                      {sub.name}
                    </option>
                  ))}
              </select>
              {errors.subcategoryId && (
                <p className="text-sm text-red-500">
                  {errors.subcategoryId.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="font-semibold mb-2">Payment Options</h2>
            <div className="flex gap-2 flex-wrap">
              {paymentOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  className={`px-4 py-2 rounded-full cursor-pointer border ${
                    selectedPaymentOption === option
                      ? "bg-red-600 text-white"
                      : "border-gray-300 text-gray-700"
                  } hover:bg-red-500 hover:text-white transition`}
                  onClick={() => {
                    setSelectedPaymentOption(option);
                    setValue("paymentOption", option);
                  }}
                >
                  {option}
                </button>
              ))}
            </div>
            {errors.paymentOption && (
              <p className="text-sm text-red-500">
                {errors.paymentOption.message}
              </p>
            )}
          </div>

          <div>
            <h2 className="font-semibold mb-2">Location</h2>
            <Controller
              name="location"
              control={control}
              render={({ field }) => (
                <LocationPicker
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.location?.message}
                />
              )}
            />
          </div>

          <div>
            <h2 className="font-semibold mb-2">Price</h2>
            <div
              className={`flex items-center border border-gray-300 rounded-md overflow-hidden  ${
                errors.price
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300"
              }`}
            >
              <span className="bg-gray-100 px-4 py-3 font-semibold text-gray-700">
                USD
              </span>
              <input
                {...register("price", { valueAsNumber: true })}
                type="number"
                placeholder="Enter Price"
                className={`w-full p-3 focus:outline-none transition`}
              />
            </div>
            {errors.price && (
              <p className="text-sm text-red-500">{errors.price.message}</p>
            )}
          </div>

          <div>
            <h2 className="font-semibold mb-2">Images</h2>
            <Controller
              name="images"
              control={control}
              defaultValue={[]}
              render={({ field: { value, onChange } }) => (
                <UploadGrid value={value} onChange={onChange} />
              )}
            />
            {errors.images && (
              <p className="text-sm text-red-500">{errors.images.message}</p>
            )}
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <Button type="submit" loading={isSubmitting} className="w-full">
            {isSubmitting ? "Posting…" : "Post Ad"}
          </Button>
        </form>
      </div>
    </PageWrapper>
  );
}
