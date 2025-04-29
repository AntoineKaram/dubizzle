import { NextResponse } from "next/server";
import { getAdById } from "@/lib/helper";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const ad = await getAdById(id);

    if (!ad) {
      return NextResponse.json({ message: "Ad not found" }, { status: 404 });
    }
    return NextResponse.json(ad, { status: 200 });
  } catch (error) {
    console.error("Error fetching ad:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
