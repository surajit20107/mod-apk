import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import User from "@/models/user";

export async function POST(req: NextRequest) {
  try {
    const { emailAndUser, password } = await req.json();

    const fields = [emailAndUser, password];

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
      $or: [{ email: emailAndUser }, { username: emailAndUser }]
    }).select("+password");

    if (!user) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 },
      );
    }

    const isCorrectPassword = await user.comparePassword(password);

    if (!isCorrectPassword) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 },
      );
    }

    const token = user.generateToken();

    const response = NextResponse.json(
      { message: "Sign in successfully" },
      { status: 200 },
    );

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { message: "An error occurred while signing in" },
      { status: 500 },
    );
  }
}
