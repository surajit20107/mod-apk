import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { verifyAdminAuth } from "@/lib/auth";
import User from "@/models/user";

export async function GET(req: NextRequest) {
  try {
    const authResult = await verifyAdminAuth();

    if (!authResult.authorized) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    const { searchParams } = new URL(req.url);
    const page = Math.max(parseInt(searchParams.get("page") || "1"), 1);
    const limit = Math.min(
      Math.max(parseInt(searchParams.get("limit") || "10"), 1),
      100,
    );
    const search = searchParams.get("search") || "";
    const role = searchParams.get("role") || "";
    const status = searchParams.get("status") || "";

    const skip = (page - 1) * limit;

    // Superadmin accounts are never exposed or manageable here
    const query: Record<string, unknown> = { role: { $ne: "superadmin" } };

    if (search) {
      query.$or = [
        { username: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    if (role === "user" || role === "admin") {
      query.role = role;
    }

    if (status === "banned") {
      query.isBanned = true;
    } else if (status === "blocked") {
      query.loginDisabled = true;
    } else if (status === "active") {
      query.isBanned = { $ne: true };
      query.loginDisabled = { $ne: true };
    }

    const notSuperadmin = { role: { $ne: "superadmin" } };

    const [users, total, totalUsers, admins, banned, blocked] =
      await Promise.all([
        User.find(query)
          .select("-password")
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),
        User.countDocuments(query),
        User.countDocuments(notSuperadmin),
        User.countDocuments({ role: "admin" }),
        User.countDocuments({ ...notSuperadmin, isBanned: true }),
        User.countDocuments({ ...notSuperadmin, loginDisabled: true }),
      ]);

    return NextResponse.json({
      users,
      stats: { total: totalUsers, admins, banned, blocked },
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching users" },
      { status: 500 },
    );
  }
}
