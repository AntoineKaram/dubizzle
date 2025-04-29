import { NextRequest, NextResponse } from "next/server";
import { Ad } from "@/lib/models";
import { getAllApprovedAds } from "@/lib/helper";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;

    const q = searchParams.get("q")?.toLowerCase() ?? "";
    const categoryId = searchParams.get("categoryId") ?? undefined;
    const subcategoryId = searchParams.get("subcategoryId") ?? undefined;
    const minPrice = parseFloat(searchParams.get("minPrice") || "0");
    const maxPrice = parseFloat(searchParams.get("maxPrice") || "9999999");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = (page - 1) * limit;
    const ads: Ad[] = await getAllApprovedAds(
      q,
      categoryId,
      subcategoryId,
      minPrice,
      maxPrice,
      offset,
      limit
    );
    return NextResponse.json(ads, { status: 200 });
  } catch (error) {
    console.error("Error fetching ads:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
