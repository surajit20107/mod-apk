import { Suspense } from "react";
import { redirect } from "next/navigation";
import { verifySuperAdminAuth } from "@/lib/auth";
import ManageUsers from "@/components/ManageUsers";

export default async function ManageUsersPage() {
  const authResult = await verifySuperAdminAuth();

  if (!authResult.authorized) {
    redirect("/admin/dashboard");
  }

  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-linear-to-br from-gray-900 via-gray-800 to-gray-900" />
      }
    >
      <ManageUsers />
    </Suspense>
  );
}
