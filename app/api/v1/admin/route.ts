import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { appSchema } from "@/lib/validation";
import User from "@/models/user";
import Apk from "@/models/apk";

export async function POST(req: Request) {
  try {
    await connectToDatabase();

    const userId = req.headers.get("userId");

    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (user.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const {
      name,
      image,
      imagePublicId,
      packageName,
      publisher,
      category,
      size,
      rating,
      version,
      platform,
      price,
      description,
      downloadUrl,
      requirements,
      modInfo,
      screenshots,
      screenshotsPublicIds,
      tags,
    } = await req.json();

    const newApk = new Apk({
      name,
      image,
      imagePublicId,
      packageName,
      publisher,
      category,
      size,
      rating,
      version,
      platform,
      price,
      description,
      downloadUrl,
      requirements,
      modInfo,
      tags,
      screenshots,
      screenshotsPublicIds,
    });

    const validation = appSchema.safeParse(newApk);

    if (!validation.success) {
      return NextResponse.json(
        { message: validation.error.issues[0].message || "Invalid data" },
        { status: 400 },
      );
    }

    await newApk.save();

    return NextResponse.json(
      { message: "App uploaded successfully" },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Error uploading app" },
      { status: 500 },
    );
  }
}
