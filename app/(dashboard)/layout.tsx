import type { ReactNode } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { requireOnboardedCompany } from "@/lib/session";
import { AppSidebar } from "@/components/app-sidebar";
import { BottomNav } from "@/components/bottom-nav";
import { CompanyLogo } from "@/components/company-logo";
import { UserMenu } from "@/components/user-menu";
import { brandThemeVars } from "@/lib/branding";

/**
 * Titles every authenticated tab "<Page> — <Company>", so even the browser
 * chrome reads as the installer's own software rather than SolarQuote's.
 */
export async function generateMetadata(): Promise<Metadata> {
  const { company } = await requireOnboardedCompany();
  return {
    title: {
      default: company.name,
      template: `%s — ${company.name}`,
    },
  };
}

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { dbUser, company } = await requireOnboardedCompany();

  return (
    // The company's brand colour is injected here as design-system tokens, so
    // every `primary`/`accent`/`ring` utility rendered below re-themes with it.
    <div className="flex min-h-screen bg-background" style={brandThemeVars(company.brandColor)}>
      <AppSidebar
        userName={dbUser?.fullName ?? "Solar Installer"}
        companyName={company.name}
        companyLogoUrl={company.logoUrl}
        brandColor={company.brandColor}
      />
      <div className="min-w-0 flex-1">
        <header className="flex items-center justify-between border-b border-border bg-card px-5 py-3 min-[901px]:hidden">
          <Link href="/dashboard" className="flex items-center gap-2.5 min-w-0">
            <CompanyLogo
              logoUrl={company.logoUrl}
              name={company.name}
              brandColor={company.brandColor}
              size={30}
            />
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
