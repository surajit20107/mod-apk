import { redirect } from "next/navigation";
import { verifySuperAdminAuth } from "@/lib/auth";
import AppDetails from "@/components/AppDetails";

export default async function AppDetailsPage() {
  const authResult = await verifySuperAdminAuth();

  // Only superadmins may view full app records and the activity log.
  if (!authResult.authorized) {
    redirect("/admin/dashboard");
  }

  return <AppDetails />;
}
