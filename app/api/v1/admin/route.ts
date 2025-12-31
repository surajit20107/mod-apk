import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { appSchema } from "@/lib/validation";
import { verifyAdminAuth } from "@/lib/auth";
import Apk from "@/models/apk";

export async function GET(req: NextRequest) {
  try {
    const authResult = await verifyAdminAuth();

    if (!authResult.authorized) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";

    const skip = (page - 1) * limit;

    let query = {};
    if (search) {
      query = {
        $or: [
          { name: { $regex: search, $options: "i" } },
          { packageName: { $regex: search, $options: "i" } },
          { category: { $regex: search, $options: "i" } },
        ],
      };
    }

    const [apps, total] = await Promise.all([
      Apk.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Apk.countDocuments(query),
    ]);

    return NextResponse.json({
      apps,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching apps:", error);
    return NextResponse.json(
      { message: "Error fetching apps" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const authResult = await verifyAdminAuth();

    if (!authResult.authorized) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

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

    if (!publisher) {
      const publisherUrl = `https://play.google.com/store/apps/details?id=${packageName}`;
      newApk.publisher = publisherUrl;
    }

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
    console.error("Error creating app:", error);
    return NextResponse.json(
      { message: "Error uploading app" },
      { status: 500 },
    );
  }
}
