import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Apk from "@/models/apk";
import redis from "@/lib/redis";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const id = url.pathname.split("/").pop();
    const cachedData = await redis.get(String(id));
    
    if (cachedData) {
      return NextResponse.json(cachedData);
    }

    await connectToDatabase();

    const apk = await Apk.findById(id);

    if (!apk) {
      return NextResponse.json({ error: "APK not found " }, { status: 404 });
    }

    await redis.set(String(id), apk, {
      ex: 60 * 60 * 24, // Cache for 24 hours
    });

    return NextResponse.json(apk);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch APK" }, { status: 500 });
  }
}
