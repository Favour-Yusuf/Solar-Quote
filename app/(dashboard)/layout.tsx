import type { ReactNode } from "react";
import { requireOnboardedCompany } from "@/lib/session";
import { AppSidebar } from "@/components/app-sidebar";
import { BottomNav } from "@/components/bottom-nav";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { dbUser, company } = await requireOnboardedCompany();

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar
        userName={dbUser?.fullName ?? "Solar Installer"}
        companyName={company.name}
      />
      <main className="min-w-0 flex-1 px-5 pb-28 pt-8 sm:px-10 min-[901px]:pb-14">
        <div className="mx-auto max-w-350">{children}</div>
      </main>
      <BottomNav />
    </div>
  );
}
