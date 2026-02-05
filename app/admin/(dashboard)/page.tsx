import { getUser, getShop, getOnboardingStatus } from "@/lib/actions/auth";
import { getShopStats } from "@/lib/actions/shops";
import { redirect } from "next/navigation";
import { DashboardContent } from "@/components/admin/dashboard-content";

export default async function AdminDashboardPage() {
  const user = await getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const status = await getOnboardingStatus();

  if (!status.isOnboarded) {
    redirect("/admin/onboarding");
  }

  const shop = await getShop();
  const stats = await getShopStats();

  return (
    <DashboardContent
      shop={shop}
      stats={stats}
      userEmail={user.email || ""}
      userName={user.user_metadata?.full_name || ""}
    />
  );
}
