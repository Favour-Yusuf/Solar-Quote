import type { ReactNode } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { requireOnboardedCompany } from "@/lib/session";
import { AppSidebar } from "@/components/app-sidebar";
import { BottomNav } from "@/components/bottom-nav";
import { CompanyLogo } from "@/components/company-logo";
import { UserMenu } from "@/components/user-menu";

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
      <div className="min-w-0 flex-1">
        <header className="flex items-center justify-between border-b border-border bg-card px-5 py-3 min-[901px]:hidden">
          <Link href="/dashboard" className="flex items-center gap-2.5 min-w-0">
            <CompanyLogo logoUrl={company.logoUrl} name={company.name} size={30} />
            <span className="truncate font-heading text-[14.5px] font-bold">{company.name}</span>
          </Link>
          <UserMenu side="bottom" align="end">
            <span className="flex items-center gap-1 rounded-lg p-1.5 text-muted-foreground hover:bg-muted">
              <ChevronDown className="size-4.5" strokeWidth={2.2} />
            </span>
          </UserMenu>
        </header>
        <main className="min-w-0 px-5 pb-28 pt-8 sm:px-10 min-[901px]:pb-14">
          <div className="mx-auto max-w-350">{children}</div>
        </main>
      </div>
      <BottomNav />
    </div>
  );
}
