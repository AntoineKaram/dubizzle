import { NextResponse } from "next/server";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { writeFile } from "fs/promises";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function PUT(req: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const formData = await req.formData();
    const name = formData.get("name") as string;
    const address = formData.get("address") as string;
    const profilePic = formData.get("profilePic") as File | null;

    let profilePicUrl: string | undefined;

    if (profilePic && profilePic.size > 0) {
      const buffer = Buffer.from(await profilePic.arrayBuffer());
      const extension = path.extname(profilePic.name); 
      const filename = `${uuidv4()}${extension}`;

      const filePath = path.join(process.cwd(), "public/uploads", filename);

      await writeFile(filePath, buffer);

      profilePicUrl = `/uploads/${filename}`;
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        name,
        address,
        profilePic: profilePicUrl || undefined,
        modifiedBy: user.id,
      },
    });

    return NextResponse.json({ message: "Profile updated successfully" });
  } catch (error) {
    console.error("[PROFILE_UPDATE_ERROR]", error);
    return new NextResponse("Something went wrong", { status: 500 });
  }
}
