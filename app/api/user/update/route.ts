import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function PUT(req: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const formData = await req.json();
    const name = formData.name;
    const address = formData.address;
    const profilePic = formData.profilePic;

    await prisma.user.update({
      where: { id: user.id },
      data: {
        name,
        address,
        profilePic: profilePic,
        modifiedBy: user.id,
      },
    });

    return NextResponse.json({ message: "Profile updated successfully" });
  } catch (error) {
    console.error("[PROFILE_UPDATE_ERROR]", error);
    return new NextResponse("Something went wrong", { status: 500 });
  }
}
