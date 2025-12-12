import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import User from "@/models/user";

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

    await connectToDatabase();

    const user = await User.findOne({
      $or: [{ email: emailAndUsername }, { username: emailAndUsername }],
    }).select("+password");

    if (!user) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 },
      );
    }

    if (user.role !== "admin") {
      return NextResponse.json(
        { message: "Access denied. Admin privileges required." },
        { status: 403 },
      );
    }

    const isCorrectPassword = await user.comparePassword(password);

    if (!isCorrectPassword) {
      return NextResponse.json(
        { message: "Invalid credentials" },
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
    return NextResponse.json(
      { message: "An error occurred while signing in" },
      { status: 500 },
    );
  }
}
