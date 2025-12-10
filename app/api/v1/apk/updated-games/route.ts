import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Apk from "@/models/apk";

export async function GET() {
  try {
    await connectToDatabase();

    const updatedGames = await Apk.find({ tags: { $in: ["games"] } }).limit(12);

    return NextResponse.json(
      {
        updatedGames,
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