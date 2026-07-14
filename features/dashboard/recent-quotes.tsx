import Link from "next/link";
import { FileText } from "lucide-react";
import { StatusPill } from "@/components/status-pill";
import { EmptyState } from "@/components/empty-state";
import type { toQuoteListItem } from "@/features/quotes/quote-view";

export function RecentQuotes({
  quotes,
}: {
  quotes: ReturnType<typeof toQuoteListItem>[];
}) {
  return (
    <div>
      <div className="mb-3.5 flex items-center justify-between">
        <h2 className="font-heading text-[17px] font-bold">Recent quotes</h2>
        <Link
          href="/quotes"
          className="text-sm font-semibold text-primary"
        >
          View all →
        </Link>
      </div>

      {quotes.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No quotes yet"
          description="Create your first quote to see it show up here."
          action={
            <Link
              href="/quotes/new"
              className="text-sm font-semibold text-primary"
            >
              Create a quote →
            </Link>
          }
        />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          {quotes.map((quote) => (
            <Link
              key={quote.id}
              href={`/quotes/${quote.id}`}
              className="flex items-center gap-4 border-b border-border px-[22px] py-4 last:border-b-0 hover:bg-muted"
            >
              <div className="flex size-[38px] shrink-0 items-center justify-center rounded-[10px] bg-terracotta font-heading text-[12.5px] font-bold text-terracotta-foreground">
                {quote.initials}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[14.5px] font-semibold">{quote.customerName}</div>
                <div className="text-[13px] text-muted-foreground">
                  {quote.displayNumber} · {quote.dateLabel}
                </div>
              </div>
              <div className="text-[14.5px] font-bold">{quote.totalLabel}</div>
              <StatusPill status={quote.status} />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
