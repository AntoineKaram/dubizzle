import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { z } from "zod";
const reviewSchema = z.object({
  action: z.enum(["APPROVED", "REJECTED"]),
});

const editSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  price: z.number().positive(),
  location: z.string().min(1),
  paymentOption: z.string().min(1),
  images: z.array(z.string().url()).min(1).max(5),
});

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const adId = params.id;
  const ad = await prisma.ad.findUnique({ where: { id: adId } });

  if (!ad || ad.createdBy !== user.id) {
    return NextResponse.json(
      { message: "Forbidden or ad not found" },
      { status: 403 }
    );
  }

  const body = await req.json();
  const parsed = editSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { message: "Invalid input", errors: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const existingRequest = await prisma.adEditRequest.findFirst({
    where: {
      adId,
      createdBy: user.id,
      status: "PENDING",
    },
  });

  if (existingRequest) {
    const updated = await prisma.adEditRequest.update({
      where: { id: existingRequest.id },
      data: parsed.data,
    });

    return NextResponse.json(
      { message: "Edit request updated.", requestId: updated.id },
      { status: 200 }
    );
  }

  const newRequest = await prisma.adEditRequest.create({
    data: {
      adId,
      ...parsed.data,
      createdBy: user.id,
    },
  });

  return NextResponse.json(
    { message: "New edit request created.", requestId: newRequest.id },
    { status: 201 }
  );
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();

  if (!user || user.role !== "MODERATOR") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
  }

  const { id } = await params;
  const body = await req.json();
  const parsed = reviewSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { message: "Invalid input", errors: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const request = await prisma.adEditRequest.findUnique({
    where: { id },
  });

  if (!request || request.status !== "PENDING") {
    return NextResponse.json(
      { message: "Not found or already processed" },
      { status: 404 }
    );
  }

  if (parsed.data.action === "REJECTED") {
    const rejected = await prisma.adEditRequest.update({
      where: { id },
      data: { status: "REJECTED" },
    });

    return NextResponse.json(rejected);
  }

  const updatedAd = await prisma.ad.update({
    where: { id: request.adId },
    data: {
      title: request.title,
      description: request.description,
      price: request.price,
      location: request.location,
      paymentOption: request.paymentOption,
      images: request.images,
      modifiedAt: new Date(),
      modifiedBy: user.id,
    },
  });

  await prisma.adEditRequest.update({
    where: { id },
    data: { status: "APPROVED" },
  });

  return NextResponse.json(updatedAd);
}
