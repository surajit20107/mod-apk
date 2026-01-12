import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Apk from "@/models/apk";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search");

    if (!search) {
      return NextResponse.json(
        {
          message: "Search query is required",
        },
        { status: 200 },
      );
    }

    await connectToDatabase();

    // Normalize the search query by removing spaces
    const normalizedSearch = search.replace(/\s+/g, "");

    // Use aggregation to normalize the name field and match
    const apks = await Apk.aggregate([
      {
        $addFields: {
          normalizedName: {
            $replaceAll: { input: "$name", find: " ", replacement: "" },
          },
        },
      },
      {
        $match: {
          normalizedName: { $regex: normalizedSearch, $options: "i" },
        },
      },
    ]);

    return NextResponse.json({ apks }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error, try again later" },
      { status: 500 },
    );
  }
}
