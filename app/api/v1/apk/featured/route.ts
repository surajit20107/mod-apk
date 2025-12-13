import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Apk from "@/models/apk";

export async function GET() {
  try {
    await connectToDatabase();

    const featuredApps = await Apk.find({ tags: { $in: ["featured"] } })
      .limit(6)
      .sort({ createdAt: -1 })
      .select(
        "-imagePublicId -packageName -publisher -category -platform -price -downloadUrl -requirements -modInfo -tags -screenshots -screenshotsPublicIds -createdAt -updatedAt",
      );

    return NextResponse.json(
      {
        featuredApps,
      },
      { status: 200 },
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Error fetching apps" },
      { status: 500 },
    );
  }
}
