import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { verifySuperAdminAuth } from "@/lib/auth";
import Apk from "@/models/apk";

/**
 * Full app records for the superadmin-only app details view. Regular admins
 * must never be able to reach this endpoint.
 */
export async function GET(req: NextRequest) {
  try {
    const authResult = await verifySuperAdminAuth();

    if (!authResult.authorized) {
      return NextResponse.json(
        { message: authResult.error },
        { status: authResult.forbidden ? 403 : 401 },
      );
    }

    await connectToDatabase();

    const { searchParams } = new URL(req.url);
    const page = Math.max(parseInt(searchParams.get("page") || "1"), 1);
    const limit = Math.min(
      Math.max(parseInt(searchParams.get("limit") || "10"), 1),
      100,
    );
    const search = searchParams.get("search")?.trim() || "";

    const skip = (page - 1) * limit;

    const query: Record<string, unknown> = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { packageName: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
        { createdby: { $regex: search, $options: "i" } },
        { updatedby: { $regex: search, $options: "i" } },
      ];
    }

    const [apps, total] = await Promise.all([
      Apk.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Apk.countDocuments(query),
    ]);

    return NextResponse.json({
      apps,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching app details" },
      { status: 500 },
    );
  }
}
