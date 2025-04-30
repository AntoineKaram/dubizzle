import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  if (!user || user.role !== "MODERATOR") {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }
  
  const { id: adId } = await params;
  const { status } = await req.json();

  if (!["APPROVED", "REJECTED"].includes(status)) {
    return NextResponse.json({ message: "Invalid status" }, { status: 400 });
  }

  const ad = await prisma.ad.findUnique({ where: { id: adId } });
  if (!ad) {
    return NextResponse.json({ message: "Ad not found" }, { status: 404 });
  }

  const updated = await prisma.ad.update({
    where: { id: adId },
    data: {
      status,
      modifiedAt: new Date(),
      modifiedBy: user.id,
    },
  });

  return NextResponse.json(updated);
}
