import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { mapApiAdToAdEditRequest } from "@/lib/mapper";

export async function GET(req: NextRequest) {
  const user = await getCurrentUser();

  if (!user || user.role !== "MODERATOR") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
  }

  try {
    const editRequests = await prisma.adEditRequest.findMany({
      where: { status: "PENDING" },
      orderBy: { createdAt: "desc" },
      include: {
        ad: true,
      },
    });

    const ads = mapApiAdToAdEditRequest(editRequests);
    return NextResponse.json({
      edits: ads,
      total: editRequests.length,
    });
  } catch (err) {
    console.error("Failed to fetch edit requests", err);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
