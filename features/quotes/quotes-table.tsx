import Link from "next/link";
import { FileText } from "lucide-react";
import { StatusPill } from "@/components/status-pill";
import { EmptyState } from "@/components/empty-state";
import type { toQuoteListItem } from "@/features/quotes/quote-view";

export function QuotesTable({
  quotes,
}: {
  quotes: ReturnType<typeof toQuoteListItem>[];
}) {
  if (quotes.length === 0) {
    return (
      <EmptyState
        icon={FileText}
        title="No quotes yet"
        description="Create your first quote and it'll show up here."
        action={
          <Link href="/quotes/new" className="text-sm font-semibold text-primary">
            Create a quote →
          </Link>
        }
      />
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card">
      <div className="overflow-x-auto">
        <div className="min-w-[640px]">
          <div className="flex border-b border-border px-[22px] py-3.5 text-[12.5px] font-bold uppercase tracking-wide text-muted-foreground">
            <div className="flex-1">Customer</div>
            <div className="w-28">Quote #</div>
            <div className="w-28">Date</div>
            <div className="w-28 text-right">Total</div>
            <div className="w-24 text-center">Status</div>
          </div>
          {quotes.map((quote) => (
            <Link
              key={quote.id}
              href={`/quotes/${quote.id}`}
              className="flex items-center border-b border-border px-[22px] py-4 last:border-b-0 hover:bg-muted"
            >
              <div className="flex flex-1 items-center gap-3">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-[9px] bg-terracotta font-heading text-[11.5px] font-bold text-terracotta-foreground">
                  {quote.initials}
                </div>
                <div className="text-[14.5px] font-semibold">{quote.customerName}</div>
              </div>
              <div className="w-28 text-[13.5px] text-muted-foreground">
                {quote.displayNumber}
              </div>
              <div className="w-28 text-[13.5px] text-muted-foreground">
                {quote.dateLabel}
              </div>
              <div className="w-28 text-right text-[14.5px] font-bold">
                {quote.totalLabel}
              </div>
              <div className="w-24 text-center">
                <StatusPill status={quote.status} />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
