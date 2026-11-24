import { NextResponse } from "next/server";
import { verifyAdminAuth } from "@/lib/auth";

export async function GET() {
  const authResult = await verifyAdminAuth();

  if (!authResult.authorized || !("user" in authResult)) {
    return NextResponse.json(
      { message: authResult.error },
      { status: 401 },
    );
  }

  const { user } = authResult;

  return NextResponse.json({
    id: user._id.toString(),
    username: user.username,
    email: user.email,
    role: user.role,
  });
}
