import type { Company, Customer, Quote, QuoteItem, QuoteStatus } from "@prisma/client";
import { StatusPill } from "@/components/status-pill";
import { formatCurrency, formatShortDate } from "@/utils/format";
import { quoteTotalCents, depositCentsFor } from "@/utils/quote-math";

type QuoteWithRelations = Quote & {
  items: QuoteItem[];
  customer: Customer;
};

export function QuoteDocumentCard({
  quote,
  company,
  status,
}: {
  quote: QuoteWithRelations;
  company: Company;
  status: QuoteStatus;
}) {
  const subtotalCents = quoteTotalCents(quote);
  const depositCents = depositCentsFor(subtotalCents, quote.depositPercent);

  return (
    <div className="rounded-[22px] border border-border bg-white p-8 text-[oklch(21%_0.02_90)] shadow-[0_1px_2px_oklch(20%_0.02_90_/_0.04),0_20px_50px_oklch(20%_0.02_90_/_0.06)] sm:p-12">
      <div className="mb-9 flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="flex size-[38px] shrink-0 items-center justify-center rounded-[11px] bg-primary">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M12 3v4M12 17v4M4.2 4.2l2.8 2.8M17 17l2.8 2.8M3 12h4M17 12h4M4.2 19.8l2.8-2.8M17 7l2.8-2.8"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <circle cx="12" cy="12" r="3.5" fill="white" />
            </svg>
          </div>
          <div>
            <div className="font-heading text-lg font-extrabold">{company.name}</div>
            <div className="text-[12.5px] text-muted-foreground">
              {[company.email, company.phone].filter(Boolean).join(" · ")}
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="font-heading text-[22px] font-extrabold text-primary">QUOTE</div>
          <div className="text-[13px] text-muted-foreground">
            Q-{quote.number} · {formatShortDate(quote.createdAt)}
          </div>
        </div>
      </div>

      <div className="mb-8 flex flex-wrap justify-between gap-6">
        <div>
          <div className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground/80">
            Prepared for
          </div>
          <div className="text-[15.5px] font-bold">{quote.customer.name}</div>
          {quote.customer.businessName ? (
            <div className="text-[13.5px] text-muted-foreground">{quote.customer.businessName}</div>
          ) : null}
          {quote.customer.address ? (
            <div className="text-[13.5px] text-muted-foreground">{quote.customer.address}</div>
          ) : null}
        </div>
        <div className="h-fit">
          <StatusPill status={status} />
        </div>
      </div>

      <div className="mb-7 overflow-hidden rounded-[14px] border border-border">
        <div className="flex bg-muted px-4.5 py-3 text-xs font-bold uppercase tracking-wide text-muted-foreground">
          <div className="flex-1">Item</div>
          <div className="w-15 text-center">Qty</div>
          <div className="w-25 text-right">Price</div>
          <div className="w-25 text-right">Total</div>
        </div>
        {quote.items.map((item) => (
          <div key={item.id} className="flex border-t border-border px-4.5 py-3.5 text-sm">
            <div className="flex-1 font-semibold">{item.name}</div>
            <div className="w-15 text-center">{item.qty}</div>
            <div className="w-25 text-right text-muted-foreground">
              {formatCurrency(item.priceCents)}
            </div>
            <div className="w-25 text-right font-bold">
              {formatCurrency(item.priceCents * item.qty)}
            </div>
          </div>
        ))}
      </div>

      <div className="mb-7 flex justify-end">
        <div className="w-65">
          <div className="flex justify-between py-1.5 text-sm text-muted-foreground">
            <span>Subtotal</span>
            <span>{formatCurrency(subtotalCents)}</span>
          </div>
          <div className="mt-1.5 flex justify-between border-t border-border py-2.5 font-heading text-[19px] font-extrabold">
            <span>Total</span>
            <span>{formatCurrency(subtotalCents)}</span>
          </div>
          <div className="flex justify-between py-1.5 text-[13.5px] font-semibold text-terracotta-foreground">
            <span>Deposit due ({quote.depositPercent}%)</span>
            <span>{formatCurrency(depositCents)}</span>
          </div>
        </div>
      </div>

      {quote.notes ? (
        <div className="mb-6 rounded-xl bg-muted px-4.5 py-4 text-[13.5px] text-muted-foreground">
          {quote.notes}
        </div>
      ) : null}

      <div className="border-t border-border pt-5 text-[12.5px] text-muted-foreground">
        {company.bankName || company.accountNumber
          ? `Payment to: ${company.name}${company.bankName ? ` · ${company.bankName}` : ""}${
              company.accountNumber ? ` · Account ending ${company.accountNumber.slice(-4)}` : ""
            } — this quote is valid for 30 days.`
          : "This quote is valid for 30 days."}
      </div>
    </div>
  );
}
