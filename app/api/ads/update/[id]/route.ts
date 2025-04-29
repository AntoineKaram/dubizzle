import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { z } from "zod";

const updateAdSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  price: z.number().positive(),
  location: z.string().min(1),
  paymentOption: z.string().min(1),
  images: z.array(z.string().url()).min(1).max(5),
});

interface Params {
  params: { id: string };
}

export async function PUT(request: Request, { params }: Params) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const adId = params.id;

  try {
    const existingAd = await prisma.ad.findUnique({
      where: { id: adId },
    });

    if (!existingAd) {
      return NextResponse.json({ message: "Ad not found" }, { status: 404 });
    }

    if (existingAd.createdBy !== user.id) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();

    const parsed = updateAdSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { message: "Invalid input", errors: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const updated = await prisma.ad.update({
      where: { id: adId },
      data: {
        title: parsed.data.title,
        description: parsed.data.description,
        price: parsed.data.price,
        location: parsed.data.location,
        paymentOption: parsed.data.paymentOption,
        images: parsed.data.images,
        modifiedAt: new Date(),
        status: "PENDING",
        modifiedBy: user.id,
      },
    });

    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error("Failed to update ad:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
