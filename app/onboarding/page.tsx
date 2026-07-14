import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCompanyByOwnerId } from "@/services/companies";
import { OnboardingWizard } from "@/features/onboarding/onboarding-wizard";

export const metadata: Metadata = { title: "Set up your account — SolarQuote" };

export default async function OnboardingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const company = await getCompanyByOwnerId(user.id);
  if (company?.onboardedAt) {
    redirect("/dashboard");
  }

  return (
    <OnboardingWizard
      userId={user.id}
      initialCompanyName={company?.name ?? ""}
    />
  );
}
