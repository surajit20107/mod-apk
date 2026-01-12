import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Apk from "@/models/apk";


export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search");

    const normalizedSearch = search?.toLowerCase().replace(/\s+/g, "");

    if (!search && !normalizedSearch) {
      return NextResponse.json({
        message: "Search query is required",
      }, { status: 400 });
    }
    
    await connectToDatabase();
    
    const apks = await Apk.find({ normalizedName: { $regex: normalizedSearch, $options: "i" }})

    return NextResponse.json(
      { apks },
      { status: 200 });

  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Internal server error, try again later" },
      { status: 500 }
    )
  }
}
