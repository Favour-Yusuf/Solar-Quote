import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CompanyLogo } from "@/components/company-logo";
import { requireOnboardedCompany } from "@/lib/session";
import { getDashboardStats, getRecentQuotes } from "@/services/quotes";
import { toQuoteListItem } from "@/features/quotes/quote-view";
import { getGreeting } from "@/features/dashboard/greeting";
import { StatCard } from "@/features/dashboard/stat-card";
import { RecentQuotes } from "@/features/dashboard/recent-quotes";
import { formatCurrency } from "@/utils/format";

export const metadata: Metadata = { title: "Dashboard — SolarQuote" };

export default async function DashboardPage() {
  const { dbUser, company } = await requireOnboardedCompany();

  const [stats, recentQuotes] = await Promise.all([
    getDashboardStats(company.id),
    getRecentQuotes(company.id),
  ]);

  const firstName = (dbUser?.fullName ?? "there").split(" ")[0];

  return (
    <div className="animate-sq-fade-up">
      <div className="mb-7 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3.5">
          <CompanyLogo logoUrl={company.logoUrl} name={company.name} size={44} />
          <div>
            <h1 className="font-heading text-[26px] font-extrabold tracking-tight sm:text-[28px]">
              {getGreeting(new Date(), firstName)}
            </h1>
            <p className="mt-1 text-[15px] text-muted-foreground">
              Here&apos;s how quoting is going this month.
            </p>
          </div>
        </div>
        <Button
          render={<Link href="/quotes/new" />}
          className="h-auto gap-2 rounded-xl px-4.5 py-3 font-heading text-[14.5px] font-bold shadow-[0_6px_16px_oklch(52%_0.14_152_/_0.22)]"
        >
          <Plus className="size-4" strokeWidth={2.4} />
          New Quote
        </Button>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-4 min-[561px]:grid-cols-2 min-[901px]:grid-cols-4">
        <StatCard label="Quotes created" value={String(stats.totalQuotes)} />
        <StatCard label="Sent to customers" value={String(stats.sentQuotes)} />
        <StatCard label="Paid" value={String(stats.paidQuotes)} emphasis="paid" />
        <StatCard
          label="Revenue collected"
          value={formatCurrency(stats.revenueCents, company.defaultCurrency)}
          emphasis="revenue"
        />
      </div>

      <RecentQuotes quotes={recentQuotes.map(toQuoteListItem)} />
    </div>
  );
}
