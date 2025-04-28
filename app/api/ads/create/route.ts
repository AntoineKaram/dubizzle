import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { z } from "zod";

const adCreateSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  price: z.number().positive("Price must be greater than 0"),
  location: z.string().min(1, "Location is required"),
  categoryId: z.string().uuid("Invalid category id"),
  subcategoryId: z.string().uuid("Invalid subcategory id"),
  paymentOption: z.string().min(1, "Payment option is required"),
  images: z
    .array(z.string().url("Invalid image URL"))
    .min(1, "At least one image is required")
    .max(5, "A maximum of 5 images is allowed"),
});

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let input: z.infer<typeof adCreateSchema>;
  try {
    const json = await request.json();
    input = adCreateSchema.parse(json);
  } catch (err) {
    if (err instanceof z.ZodError) {
      const fieldErrors = err.errors.map((e) => ({
        field: e.path.join("."),
        message: e.message,
      }));
      return NextResponse.json({ errors: fieldErrors }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }

  const subcat = await prisma.subcategory.findUnique({
    where: { id: input.subcategoryId },
  });
  if (!subcat || subcat.categoryId !== input.categoryId) {
    return NextResponse.json(
      { error: "Subcategory does not belong to selected category" },
      { status: 400 }
    );
  }

  try {
    const ad = await prisma.ad.create({
      data: {
        title: input.title,
        description: input.description,
        price: input.price,
        location: input.location,
        paymentOption: input.paymentOption,
        images: input.images,
        status: "PENDING",
        user: { connect: { id: user.id } },
        subcategory: { connect: { id: input.subcategoryId } },
      },
    });

    return NextResponse.json(ad, { status: 201 });
  } catch (e) {
    console.error("prisma.ad.create error:", e);
    return NextResponse.json(
      { error: "Failed to create ad, please try again" },
      { status: 500 }
    );
  }
}
