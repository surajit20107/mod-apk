import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { verifySuperAdminAuth } from "@/lib/auth";
import User from "@/models/user";
import redis from "@/lib/redis";

async function invalidateUserCache(user: { email?: string; username?: string }) {
  try {
    const keys = [user.email, user.username]
      .filter(Boolean)
      .map((identifier) => `admin:user:${identifier}`);

    if (keys.length > 0) {
      await redis.del(...keys);
    }
  } catch (error) {
    // Cache invalidation is best-effort; the database is the source of truth
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const authResult = await verifySuperAdminAuth();

    if (!authResult.authorized) {
      return NextResponse.json(
        { message: authResult.error },
        { status: authResult.forbidden ? 403 : 401 },
      );
    }

    await connectToDatabase();

    const { id } = await params;
    const user = await User.findById(id);

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    if (user.role === "superadmin") {
      return NextResponse.json(
        { message: "Superadmin accounts cannot be modified" },
        { status: 403 },
      );
    }

    const body = await req.json();
    const updates: Record<string, unknown> = {};
    const currentUserId = authResult.user._id.toString();

    if (body.role !== undefined) {
      if (!["user", "admin"].includes(body.role)) {
        return NextResponse.json({ message: "Invalid role" }, { status: 400 });
      }
      if (user._id.toString() === currentUserId) {
        return NextResponse.json(
          { message: "You cannot change your own role" },
          { status: 400 },
        );
      }
      updates.role = body.role;
    }

    if (body.isBanned !== undefined) {
      if (typeof body.isBanned !== "boolean") {
        return NextResponse.json(
          { message: "Invalid ban value" },
          { status: 400 },
        );
      }
      if (user._id.toString() === currentUserId) {
        return NextResponse.json(
          { message: "You cannot ban your own account" },
          { status: 400 },
        );
      }
      updates.isBanned = body.isBanned;
      updates.banReason =
        body.isBanned && typeof body.banReason === "string"
          ? body.banReason.trim()
          : "";
    } else if (body.banReason !== undefined && user.isBanned) {
      updates.banReason =
        typeof body.banReason === "string" ? body.banReason.trim() : "";
    }

    if (body.loginDisabled !== undefined) {
      if (typeof body.loginDisabled !== "boolean") {
        return NextResponse.json(
          { message: "Invalid login access value" },
          { status: 400 },
        );
      }
      if (user._id.toString() === currentUserId) {
        return NextResponse.json(
          { message: "You cannot block your own login access" },
          { status: 400 },
        );
      }
      updates.loginDisabled = body.loginDisabled;
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { message: "No valid fields to update" },
        { status: 400 },
      );
    }

    const updatedUser = await User.findByIdAndUpdate(id, updates, {
      new: true,
    }).select("-password");

    await invalidateUserCache(updatedUser!);

    return NextResponse.json(
      { message: "User updated successfully", user: updatedUser },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Error updating user" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const authResult = await verifySuperAdminAuth();

    if (!authResult.authorized) {
      return NextResponse.json(
        { message: authResult.error },
        { status: authResult.forbidden ? 403 : 401 },
      );
    }

    await connectToDatabase();

    const { id } = await params;
    const user = await User.findById(id);

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    if (user.role === "superadmin") {
      return NextResponse.json(
        { message: "Superadmin accounts cannot be deleted" },
        { status: 403 },
      );
    }

    const currentUserId = authResult.user._id.toString();

    if (user._id.toString() === currentUserId) {
      return NextResponse.json(
        { message: "You cannot delete your own account" },
        { status: 400 },
      );
    }

    await User.findByIdAndDelete(id);
    await invalidateUserCache(user);

    return NextResponse.json(
      { message: "User deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Error deleting user" },
      { status: 500 },
    );
  }
}
