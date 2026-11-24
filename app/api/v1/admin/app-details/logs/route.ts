import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { verifySuperAdminAuth } from "@/lib/auth";
import AuditLog from "@/models/auditlog";

/**
 * Immutable activity history: who created, edited or deleted which app.
 * Superadmin only.
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
      Math.max(parseInt(searchParams.get("limit") || "20"), 1),
      100,
    );
    const action = searchParams.get("action") || "";
    const appId = searchParams.get("appId") || "";
    const actor = searchParams.get("actor")?.trim() || "";
    const search = searchParams.get("search")?.trim() || "";

    const skip = (page - 1) * limit;

    const query: Record<string, unknown> = {};

    if (["create", "update", "delete"].includes(action)) {
      query.action = action;
    }

    if (appId) {
      query.entityId = appId;
    }

    if (actor) {
      query.$or = [
        { actorUsername: { $regex: actor, $options: "i" } },
        { actorEmail: { $regex: actor, $options: "i" } },
      ];
    } else if (search) {
      query.$or = [
        { entityName: { $regex: search, $options: "i" } },
        { actorUsername: { $regex: search, $options: "i" } },
        { actorEmail: { $regex: search, $options: "i" } },
      ];
    }

    const [logs, total] = await Promise.all([
      AuditLog.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      AuditLog.countDocuments(query),
    ]);

    return NextResponse.json({
      logs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching activity log" },
      { status: 500 },
    );
  }
}
