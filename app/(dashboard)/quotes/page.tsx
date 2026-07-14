import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/page-header";
import { requireOnboardedCompany } from "@/lib/session";
import { getAllQuotes } from "@/services/quotes";
import { toQuoteListItem } from "@/features/quotes/quote-view";
import { QuotesTable } from "@/features/quotes/quotes-table";

export const metadata: Metadata = { title: "Quotes — SolarQuote" };

export default async function QuotesPage() {
  const { company } = await requireOnboardedCompany();
  const quotes = await getAllQuotes(company.id);

  return (
    <div className="animate-sq-fade-up">
      <PageHeader
        title="Quotes"
        action={
          <Button
            render={<Link href="/quotes/new" />}
            className="h-auto gap-2 rounded-xl px-4 py-2.5 font-heading text-sm font-bold"
          >
            <Plus className="size-[15px]" strokeWidth={2.4} />
            New Quote
          </Button>
        }
      />
      <QuotesTable quotes={quotes.map(toQuoteListItem)} />
    </div>
  );
}
