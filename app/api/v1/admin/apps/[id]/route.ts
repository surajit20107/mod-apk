import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { appSchema } from "@/lib/validation";
import { verifyAdminAuth } from "@/lib/auth";
import Apk from "@/models/apk";
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary with credentials
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const authResult = await verifyAdminAuth();

    if (!authResult.authorized) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    const { id } = await params;
    const app = await Apk.findById(id);

    if (!app) {
      return NextResponse.json({ message: "App not found" }, { status: 404 });
    }

    return NextResponse.json({ app });
  } catch (error) {
    console.error("Error fetching app:", error);
    return NextResponse.json(
      { message: "Error fetching app" },
      { status: 500 },
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const authResult = await verifyAdminAuth();

    if (!authResult.authorized) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    const { id } = await params;
    const existingApp = await Apk.findById(id);

    if (!existingApp) {
      return NextResponse.json({ message: "App not found" }, { status: 404 });
    }

    const updateData = await req.json();

    const validation = appSchema.safeParse({
      name: updateData.name,
      image: updateData.image,
      packageName: updateData.packageName,
      publisher: updateData.publisher,
      category: updateData.category,
      size: updateData.size,
      rating: updateData.rating,
      version: updateData.version,
      platform: updateData.platform,
      price: updateData.price,
      description: updateData.description,
      downloadUrl: updateData.downloadUrl,
      requirements: updateData.requirements,
      modInfo: updateData.modInfo,
      screenshots: updateData.screenshots,
      tags: updateData.tags,
    });

    if (!validation.success) {
      return NextResponse.json(
        { message: validation.error.issues[0].message || "Invalid data" },
        { status: 400 },
      );
    }

    const updatedApp = await Apk.findByIdAndUpdate(
      id,
      {
        name: updateData.name,
        image: updateData.image,
        imagePublicId: updateData.imagePublicId,
        packageName: updateData.packageName,
        publisher: updateData.publisher,
        category: updateData.category,
        size: updateData.size,
        rating: updateData.rating,
        version: updateData.version,
        platform: updateData.platform,
        price: updateData.price,
        description: updateData.description,
        downloadUrl: updateData.downloadUrl,
        requirements: updateData.requirements,
        modInfo: updateData.modInfo,
        tags: updateData.tags,
        screenshots: updateData.screenshots,
        screenshotsPublicIds: updateData.screenshotsPublicIds,
      },
      { new: true },
    );

    return NextResponse.json(
      { message: "App updated successfully", app: updatedApp },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error updating app:", error);
    return NextResponse.json(
      { message: "Error updating app" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const authResult = await verifyAdminAuth();

    if (!authResult.authorized) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    const { id } = await params;
    const existingApp = await Apk.findById(id);

    if (!existingApp) {
      return NextResponse.json({ message: "App not found" }, { status: 404 });
    }

    // delete images from cloudinary
    try {
      if (existingApp.imagePublicId) {
        await cloudinary.uploader.destroy(existingApp.imagePublicId);
      }

      if (
        existingApp.screenshotsPublicIds &&
        existingApp.screenshotsPublicIds.length > 0
      ) {
        await Promise.all(
          existingApp.screenshotsPublicIds.map((publicId: string) =>
            cloudinary.uploader.destroy(publicId).catch((err) => {
              console.warn(`Failed to delete screenshot ${publicId}:`, err);
            }),
          ),
        );
      }
    } catch (cloudinaryError) {
      console.error("Error deleting images from Cloudinary:", cloudinaryError);
      // Continue with database deletion even if Cloudinary delete fails
    }

    // delete app from database
    await Apk.findByIdAndDelete(id);

    return NextResponse.json(
      { message: "App deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error deleting app:", error);
    return NextResponse.json(
      { message: "Error deleting app" },
      { status: 500 },
    );
  }
}
