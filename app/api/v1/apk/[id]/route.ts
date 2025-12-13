import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Apk from "@/models/apk";

export async function GET(req: Request) {
  try {
    await connectToDatabase();

    const url = new URL(req.url);

    const id = url.pathname.split("/").pop();

    const apk = await Apk.findById(id);

    if (!apk) {
      return NextResponse.json({ error: "APK not found " }, { status: 404 });
    }

    return NextResponse.json(apk);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch APK" }, { status: 500 });
  }
}
