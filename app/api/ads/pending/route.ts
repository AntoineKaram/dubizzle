
import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getPendingAds } from "@/lib/helper";

export async function GET(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user || user.role !== "MODERATOR") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
  }

  const { searchParams } = req.nextUrl;
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const sort = searchParams.get("sort") || "createdAt";
  const direction = searchParams.get("direction") === "asc" ? "asc" : "desc";
  const offset = (page - 1) * limit;

  try {
    const { ads, total } = await getPendingAds(
      user.id,
      sort,
      direction,
      offset,
      limit
    );

    return NextResponse.json({ ads, total });
  } catch (e) {
    console.error("Failed to fetch moderation ads:", e);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
