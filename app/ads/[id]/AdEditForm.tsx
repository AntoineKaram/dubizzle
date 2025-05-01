"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";

import { api } from "@/lib/axios";
import { RootState } from "@/store/store";
import { DetailedAd } from "@/lib/models";
import { zodResolver } from "@hookform/resolvers/zod";
import { editAdFormSchema, EditAdFormValues } from "@/lib/schemas/ad";

import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { UploadGrid } from "@/components/ui/UploadGrid";
import { LocationPicker } from "@/components/ui/LocationPicker";

interface Props {
  ad: DetailedAd;
}

const AdEditForm: React.FC<Props> = ({ ad }) => {
  const router = useRouter();
  const { paymentOptions } = useSelector((s: RootState) => s.settings);
  const [selectedPaymentOption, setSelectedPaymentOption] = useState<string>(
    ad.paymentOption
  );
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<EditAdFormValues>({
    resolver: zodResolver(editAdFormSchema),
  });

  const [error, setError] = useState<string>("");

  const onSubmit = useCallback(async (data: EditAdFormValues) => {
    try {
      if (ad.status === "APPROVED") {
        await api.post(`/api/ads/edit-request/${ad.id}`, data);
      } else {
        await api.put(`/api/ads/update/${ad.id}`, data);
      }
      router.push("/profile");
    } catch (err: any) {
      setError(err.response?.data?.message || "Update failed");
    }
  }, []);

  useEffect(() => {
    setValue("paymentOption", selectedPaymentOption);
  }, [selectedPaymentOption]);

  return (
    <div className="bg-white rounded-xl bg-white rounded-xl shadow-2xl border border-gray-200 p-8 w-full max-w-2xl p-8 space-y-8">
      <h1 className="text-2xl font-bold text-center">Edit Ad</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 w-full">
        <div>
          <h2 className="font-semibold mb-2">Title</h2>
          <Input
            {...register("title")}
            defaultValue={ad.title}
            error={errors.title?.message}
          />
        </div>
        <div>
          <h2 className="font-semibold mb-2">Description</h2>
          <textarea
            {...register("description")}
            rows={4}
            defaultValue={ad.description}
            className={`w-full p-3 border rounded-md focus:outline-none transition ${
              errors.description
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300"
            }`}
          />
          {errors.description && (
            <p className="text-sm text-red-500">{errors.description.message}</p>
          )}
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
              defaultValue={ad.price}
              placeholder="Enter Price"
              className={`w-full p-3 focus:outline-none transition`}
            />
          </div>
          {errors.price && (
            <p className="text-sm text-red-500">{errors.price.message}</p>
          )}
        </div>
        <div>
          <h2 className="font-semibold mb-2">Location</h2>
          <Controller
            name="location"
            control={control}
            defaultValue={ad.location}
            render={({ field }) => (
              <LocationPicker
                value={field.value}
                defaultValue={ad.location} //needed in order to remove the map on intial load (it displays the user location)
                onChange={field.onChange}
                error={errors.location?.message}
              />
            )}
          />
        </div>
        <div>
          <h2 className="font-semibold mb-2">Images</h2>
          <Controller
            name="images"
            control={control}
            defaultValue={ad.images}
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
          {isSubmitting ? "Saving…" : "Save Changes"}
        </Button>
      </form>
    </div>
  );
};
export default AdEditForm;
