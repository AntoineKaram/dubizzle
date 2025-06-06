import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        subcategories: true,
      },
    });

    return NextResponse.json({ categories });
  } catch (error) {
    console.error("Failed to fetch settings", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
