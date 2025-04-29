import { z } from "zod";

export const adFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  price: z.number().positive("Price must be > 0"),
  categoryId: z.string().uuid("Select a category"),
  subcategoryId: z.string().uuid("Select a subcategory"),
  paymentOption: z.string().min(1, "Select a payment option"),
  location: z.string().min(1, "Location is required"),
  images: z
    .array(z.string().url())
    .min(1, "Upload at least one image")
    .max(5, "Max 5 images"),
});

export const editAdFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  price: z.number().positive("Price must be > 0"),
  paymentOption: z.string().min(1, "Select a payment option"),
  location: z.string().min(1, "Location is required"),
  images: z
    .array(z.string().url())
    .min(1, "Upload at least one image")
    .max(5, "Max 5 images"),
});

export type AdFormValues = z.infer<typeof adFormSchema>;

export type EditAdFormValues = z.infer<typeof editAdFormSchema>;