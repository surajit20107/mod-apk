import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Apk from "@/models/apk";
import redis from "@/lib/redis";

const CACHE_KEY = "updated-games";
const CACHE_TTL = 60 * 60 * 24; // Cache for 24 hours

export async function GET() {
  try {
    const cachedData = await redis.get(CACHE_KEY);

    if (cachedData) {
      return NextResponse.json(
        {
          updatedGames: cachedData,
        },
        { status: 200 },
      );
    }

    await connectToDatabase();

    const updatedGames = await Apk.find({ tags: { $in: ["games"] } })
      .limit(12)
      .sort({ createdAt: -1 })
      .select(
        "-imagePublicId -packageName -publisher -platform -price -downloadUrl -requirements -modInfo -tags -screenshots -screenshotsPublicIds -createdAt -updatedAt",
      );

    await redis.set(CACHE_KEY, updatedGames, {
      ex: CACHE_TTL,
    });

    return NextResponse.json(
      {
        updatedGames,
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching apps" },
      { status: 500 },
    );
  }
}
