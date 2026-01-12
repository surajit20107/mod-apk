import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Apk from "@/models/apk";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");

    if (!category) {
      return NextResponse.json(
        {
          message: "Category is required",
        },
        { status: 400 },
      );
    }

    await connectToDatabase();

    const apps = await Apk.find({
      category: { $regex: category, $options: "i" },
    })
      .limit(20)
      .sort({ createdAt: -1 })
      .select(
        "-imagePublicId -packageName -publisher -platform -price -downloadUrl -requirements -modInfo -tags -screenshots -screenshotsPublicIds -createdAt -updatedAt",
      );

    return NextResponse.json(
      {
        apps,
      },
      { status: 200 },
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        message: "Internal server error, try again later",
      },
      { status: 500 },
    );
  }
}
