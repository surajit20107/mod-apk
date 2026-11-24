import { redirect } from "next/navigation";
import { verifySuperAdminAuth } from "@/lib/auth";
import ManageUsers from "@/components/ManageUsers";

export default async function ManageUsersPage() {
  const authResult = await verifySuperAdminAuth();

  if (!authResult.authorized) {
    redirect("/admin/dashboard");
  }

  return <ManageUsers />;
}
