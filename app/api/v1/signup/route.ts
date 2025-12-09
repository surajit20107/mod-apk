import { NextRequest, NextResponse } from "next/server";
import User from "@/models/user";
import { userSchema } from "@/lib/validation";
import { connectToDatabase } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    const { name, username, email, phone, password, image } = await req.json();

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return NextResponse.json(
        {
          message: "User already exists",
        },
        { status: 400 },
      );
    }

    const validationResult = userSchema.safeParse({
      username,
      name,
      email,
      phone,
      password,
    });

    if (!validationResult.success) {
      console.log(validationResult)
      return NextResponse.json(
        {
          message: "Validation failed",
          errors: validationResult.error.issues[0].message || "Invalid data",
        },
        { status: 400 },
      );
    }

    const newUser = new User({
      username,
      name,
      email,
      phone,
      password,
      // image,
      role: "user",
    });

    await newUser.save();

    if (!newUser) {
      return NextResponse.json(
        {
          message: "User not created",
        },
        { status: 500 },
      );
    }

    const token = await newUser.generateToken();

    const response = NextResponse.json(
      {
        message: "User created successfully",
        user: {
          username: newUser.username,
          email: newUser.email,
          role: newUser.role,
        },
      },
      { status: 201 },
    );

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: (error as Error).message || "Internal serevr error" },
      { status: 500 },
    );
  }
}
