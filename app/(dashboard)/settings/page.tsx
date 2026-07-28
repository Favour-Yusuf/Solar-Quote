import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { requireOnboardedCompany } from "@/lib/session";
import { SettingsView } from "@/features/settings/settings-view";

export const metadata: Metadata = { title: "Settings" };

export default async function SettingsPage() {
  const { user, dbUser, company } = await requireOnboardedCompany();

  return (
    <div className="animate-sq-fade-up">
      <PageHeader title="Settings" description="Manage your company profile and account." />
      <SettingsView
        company={company}
        userId={user.id}
        fullName={dbUser?.fullName ?? ""}
        email={dbUser?.email ?? user.email ?? ""}
      />
    </div>
  );
}
