import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { connectToDatabase } from "@/lib/db";
import User from "@/models/user";

interface JWTPayload {
  id: string;
  username: string;
  email: string;
}

export async function verifyAdminAuth() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("adminToken")?.value;

    if (!token) {
      return { authorized: false, error: "No authentication token" };
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JWTPayload;

    if (!decoded.id) {
      return { authorized: false, error: "Invalid token" };
    }

    await connectToDatabase();
    const user = await User.findById(decoded.id);

    if (!user) {
      return { authorized: false, error: "User not found" };
    }

    if (user.role !== "admin") {
      return { authorized: false, error: "Admin access required" };
    }

    return { authorized: true, user };
  } catch (error) {
    console.error("Auth verification error:", error);
    return { authorized: false, error: "Authentication failed" };
  }
}
