import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Apk from "@/models/apk";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const category = url.searchParams.get("category");
    const tags = category?.split(",");
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = 24;
    const skip = (page - 1) * limit;

    await connectToDatabase();

    const apps = await Apk.find({
      tags: { $in: tags },
    })
      .skip(skip)
      .limit(limit)
      .select(
        "-imagePublicId -packageName -publisher -platform -price -downloadUrl -requirements -modInfo -tags -screenshots -screenshotsPublicIds -createdAt -updatedAt",
      );

    return NextResponse.json(
      { apps },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Error fetching apps" },
      { status: 500 },
    );
  }
}
