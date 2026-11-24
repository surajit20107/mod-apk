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

    if (user.role !== "admin" && user.role !== "superadmin") {
      return { authorized: false, error: "Admin access required" };
    }

    if (user.isBanned) {
      return { authorized: false, error: "Account banned" };
    }

    if (user.loginDisabled) {
      return { authorized: false, error: "Login access disabled" };
    }

    return { authorized: true, user };
  } catch (error) {
    return { authorized: false, error: "Authentication failed" };
  }
}

/**
 * Stricter variant of verifyAdminAuth: only accounts with the "superadmin"
 * role may pass. Used for user management, which regular admins must not see.
 */
export async function verifySuperAdminAuth() {
  const authResult = await verifyAdminAuth();

  if (!authResult.authorized || !("user" in authResult)) {
    return {
      authorized: false as const,
      forbidden: false,
      error: authResult.error,
    };
  }

  if (authResult.user.role !== "superadmin") {
    return {
      authorized: false as const,
      forbidden: true,
      error: "Superadmin access required",
    };
  }

  return { authorized: true as const, user: authResult.user };
}
