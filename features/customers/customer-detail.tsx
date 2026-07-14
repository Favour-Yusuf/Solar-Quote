import Link from "next/link";
import type { Customer } from "@prisma/client";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusPill } from "@/components/status-pill";
import { getInitials } from "@/utils/format";
import { toQuoteListItem } from "@/features/quotes/quote-view";

type QuoteForHistory = Parameters<typeof toQuoteListItem>[0];

export function CustomerDetail({
  customer,
  quotes,
}: {
  customer: Customer;
  quotes: QuoteForHistory[];
}) {
  const quoteItems = quotes.map(toQuoteListItem);

  return (
    <div className="max-w-190 animate-sq-fade-up">
      <Link
        href="/customers"
        className="mb-4.5 flex items-center gap-1.5 text-[13.5px] font-semibold text-muted-foreground"
      >
        <ArrowLeft className="size-3.5" strokeWidth={2.2} />
        Back to customers
      </Link>

      <div className="mb-6.5 flex flex-wrap items-center gap-4">
        <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-accent font-heading text-lg font-bold text-accent-foreground">
          {getInitials(customer.name)}
        </div>
        <div>
          <div className="font-heading text-[22px] font-extrabold">{customer.name}</div>
          {customer.businessName ? (
            <div className="text-[14.5px] text-muted-foreground">{customer.businessName}</div>
          ) : null}
        </div>
        <Button
          render={<Link href={`/quotes/new?customerId=${customer.id}`} />}
          className="ml-auto h-auto gap-2 rounded-xl px-4 py-2.5 font-heading text-sm font-bold"
        >
          New Quote
        </Button>
      </div>

      <div className="mb-7 grid grid-cols-1 gap-3 min-[561px]:grid-cols-3">
        <InfoCard label="Phone" value={customer.phone} />
        <InfoCard label="Email" value={customer.email} />
        <InfoCard label="Address" value={customer.address} />
      </div>

      <h2 className="mb-3 font-heading text-base font-bold">Quote history</h2>
      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        {quoteItems.length === 0 ? (
          <div className="px-5 py-7 text-center text-sm text-muted-foreground">
            No quotes yet for this customer.
          </div>
        ) : (
          quoteItems.map((quote) => (
            <Link
              key={quote.id}
              href={`/quotes/${quote.id}`}
              className="flex items-center gap-3.5 border-b border-border px-5 py-3.5 last:border-b-0 hover:bg-muted"
            >
              <div className="flex-1 text-sm font-semibold">
                {quote.displayNumber} · {quote.dateLabel}
              </div>
              <div className="text-sm font-bold">{quote.totalLabel}</div>
              <StatusPill status={quote.status} />
            </Link>
          ))
        )}
      </div>
    </div>
  );
}

function InfoCard({ label, value }: { label: string; value: string | null }) {
  return (
    <div className="rounded-[14px] border border-border bg-card p-4">
      <div className="mb-1.5 text-[12.5px] text-muted-foreground">{label}</div>
      <div className="text-sm font-semibold">{value || "—"}</div>
    </div>
  );
}
