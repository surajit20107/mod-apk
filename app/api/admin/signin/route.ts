import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import User from "@/models/user";
import redis from "@/lib/redis";

export async function POST(req: NextRequest) {
  try {
    const { emailAndUsername, password } = await req.json();

    const fields = [emailAndUsername, password];

    const invalidFields = fields.some(
      (field) => typeof field !== "string" || field.trim() === "",
    );

    if (invalidFields) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 },
      );
    }

    if (!process.env.JWT_SECRET) {
      console.error("Admin signin failed: JWT_SECRET is not set");
      return NextResponse.json(
        {
          message:
            "Server is misconfigured: JWT_SECRET is missing, so a session cannot be created.",
        },
        { status: 500 },
      );
    }

    const identifier = emailAndUsername.trim();
    const cachedKey = `admin:user:${identifier}`;
    let user;

    // The cache is only an optimisation: if Redis is unreachable we must still
    // be able to fall back to the database instead of failing the whole login.
    let cachedUser = null;
    try {
      cachedUser = await redis.get(cachedKey);
    } catch (cacheError) {
      console.error("Admin signin: failed to read Redis cache", cacheError);
    }

    if (cachedUser) {
      user = new User(cachedUser);
    } else {
      await connectToDatabase();

      user = await User.findOne({
        $or: [{ email: identifier }, { username: identifier }],
      }).select("+password");

      if (!user) {
        return NextResponse.json(
          {
            message: `No account found for "${identifier}". Check the email or username.`,
          },
          { status: 401 },
        );
      }

      if (user.role !== "admin" && user.role !== "superadmin") {
        return NextResponse.json(
          { message: "Access denied. Admin privileges required." },
          { status: 403 },
        );
      }

      try {
        await redis.set(cachedKey, user.toObject(), {
          ex: 60 * 60 * 24, // Cache for 1 day
        });
      } catch (cacheError) {
        console.error("Admin signin: failed to write Redis cache", cacheError);
      }
    }

    if (user.isBanned) {
      return NextResponse.json(
        {
          message: user.banReason
            ? `Your account has been banned: ${user.banReason}`
            : "Your account has been banned.",
        },
        { status: 403 },
      );
    }

    if (user.loginDisabled) {
      return NextResponse.json(
        { message: "Your login access has been disabled by an administrator." },
        { status: 403 },
      );
    }

    if (user.role !== "admin" && user.role !== "superadmin") {
      return NextResponse.json(
        { message: "Access denied. Admin privileges required." },
        { status: 403 },
      );
    }

    if (!user.password) {
      return NextResponse.json(
        {
          message:
            "This account has no password set. Reset the password or recreate the account.",
        },
        { status: 401 },
      );
    }

    const isCorrectPassword = await user.comparePassword(password);

    if (!isCorrectPassword) {
      return NextResponse.json(
        { message: "Incorrect password. Please try again." },
        { status: 401 },
      );
    }

    const token = await user.generateToken();

    const response = NextResponse.json(
      { message: "Sign in successfully", userId: user._id },
      { status: 200 },
    );

    response.cookies.set("adminToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.error("Admin signin error:", error);

    const detail =
      error instanceof Error && error.message
        ? error.message
        : "Unknown server error";

    return NextResponse.json(
      { message: `Sign in failed: ${detail}` },
      { status: 500 },
    );
  }
}
