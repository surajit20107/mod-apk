import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { userSchema } from "@/lib/validation";
import User from "@/models/user";

export async function POST(req: NextRequest) {
  try {
    const { username, email, password } = await req.json();

    const validation = userSchema.safeParse({ username, email, password });

    if (!validation.success) {
      return NextResponse.json(
        { message: validation.error.issues[0].message || "Invalid data" },
        { status: 400 },
      );
    }

    await connectToDatabase();

    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "User with this email or username already exists" },
        { status: 409 },
      );
    }

    const newUser = new User({
      username,
      email,
      password,
      role: "admin",
    });

    await newUser.save();

    const token = await newUser.generateToken();

    const response = NextResponse.json(
      { message: "Admin account created successfully", userId: newUser._id },
      { status: 201 },
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
    console.error("Admin register error:", error);
    return NextResponse.json(
      { message: "An error occurred while creating the account" },
      { status: 500 },
    );
  }
}
