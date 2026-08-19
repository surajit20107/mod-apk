import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Apk from "@/models/apk";
import redis from "@/lib/redis";

const cachedKey = "featuredApps";

export async function GET() {
  try {
    const cachedData = await redis.get(cachedKey);

    if (cachedData) {
      return NextResponse.json(
        {
          featuredApps: cachedData,
        },
        { status: 200 },
      );
    }

    await connectToDatabase();

    const featuredApps = await Apk.find({ tags: { $in: ["featured"] } })
      .limit(6)
      .sort({ createdAt: -1 })
      .select(
        "-imagePublicId -packageName -publisher -platform -price -downloadUrl -requirements -modInfo -tags -screenshots -screenshotsPublicIds -createdAt -updatedAt",
      ).lean();

    await redis.set(cachedKey, featuredApps, {
      ex: 60 * 60 * 5, // Cache for 5 hours
    });

    return NextResponse.json(
      {
        featuredApps,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching featured apps:", error);
    return NextResponse.json(
      { message: "Error fetching apps" },
      { status: 500 },
    );
  }
}
