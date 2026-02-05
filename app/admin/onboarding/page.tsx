import { redirect } from "next/navigation";
import { getUser, getOnboardingStatus } from "@/lib/actions/auth";
import { OnboardingWizard } from "@/components/admin/onboarding-wizard";

export default async function OnboardingPage() {
  const user = await getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const status = await getOnboardingStatus();

  // If already onboarded, redirect to dashboard
  if (status.isOnboarded) {
    redirect("/admin");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/50">
      <OnboardingWizard
        hasShop={status.hasShop}
        userEmail={user.email || ""}
        userName={user.user_metadata?.full_name || ""}
      />
    </div>
  );
}
