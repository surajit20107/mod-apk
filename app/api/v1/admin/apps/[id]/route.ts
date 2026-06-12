import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
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
        normalizedName: updateData.name.toLowerCase().replace(/\s+/g, ""),
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
    let response; // in case of cloudinary delete error, we will use this to send a response to the client
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
              // send the error to the client
              response = NextResponse.json(
                { error: `Error deleting image from Cloudinary: ${err}` },
                { status: 500 },
              )
            }),
          ),
        );
      }
    } catch (cloudinaryError) {
      // create a NextResponse and and attached it with the success message after app deleted from db to let user know image delete failed
      response = NextResponse.json(
        {
          message:
            "App deleted successfully but failed to delete images from Cloudinary",
        },
        { status: 200 },
      );

      // Continue with database deletion even if Cloudinary delete fails
    }

    // delete app from database
    await Apk.findByIdAndDelete(id);

    // if cloudinary delete failed, return the response with the message
    if (response) return response;

    // if cloudinary delete success, return the response with the success message
    return NextResponse.json(
      { message: "App deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: `Error deleting app: ${error}` },
      { status: 500 },
    );
  }
}
