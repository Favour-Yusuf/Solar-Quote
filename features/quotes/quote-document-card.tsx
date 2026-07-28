import type { Company, Customer, Quote, QuoteItem, QuoteStatus } from "@prisma/client";
import { StatusPill } from "@/components/status-pill";
import { CompanyLogo } from "@/components/company-logo";
import { formatCurrency, formatShortDate, formatLongDate } from "@/utils/format";
import { quoteTotalCents, depositCentsFor } from "@/utils/quote-math";
import { resolveBrandColor, tint, shade, withAlpha } from "@/lib/branding";

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
  const balanceCents = subtotalCents - depositCents;
  const accent = resolveBrandColor(company.brandColor);
  const currency = quote.currency;
  const contactLine = [company.email, company.phone, company.website]
    .filter(Boolean)
    .join(" · ");

  return (
    <div className="overflow-hidden rounded-[22px] border border-border bg-white text-[oklch(21%_0.02_90)] shadow-[0_1px_2px_oklch(20%_0.02_90_/_0.04),0_20px_50px_oklch(20%_0.02_90_/_0.06)]">
      {/* Brand band across the top of the document. */}
      <div className="h-2" style={{ backgroundColor: accent }} />

      <div className="p-8 sm:p-12">
        <div
          className="mb-9 flex flex-wrap items-start justify-between gap-4 border-b pb-6"
          style={{ borderColor: withAlpha(accent, 0.25) }}
        >
          <div className="flex min-w-0 items-start gap-3">
            <CompanyLogo
              logoUrl={company.logoUrl}
              name={company.name}
              brandColor={company.brandColor}
              size={44}
            />
            <div className="min-w-0">
              <div className="font-heading text-lg font-extrabold">{company.name}</div>
              {contactLine ? (
                <div className="text-[12.5px] text-muted-foreground">{contactLine}</div>
              ) : null}
              {company.address ? (
                <div className="text-[12.5px] text-muted-foreground">{company.address}</div>
              ) : null}
            </div>
          </div>
          <div className="text-right">
            <div className="font-heading text-[22px] font-extrabold" style={{ color: accent }}>
              QUOTE
            </div>
            <div className="mt-0.5">
              <StatusPill status={status} />
            </div>
          </div>
        </div>

        <div className="mb-8 flex flex-wrap justify-between gap-6">
          <div>
            <div
              className="mb-1.5 text-xs font-semibold uppercase tracking-wide"
              style={{ color: shade(accent, 0.1) }}
            >
              Bill To
            </div>
            <div className="text-[15.5px] font-bold">{quote.customer.name}</div>
            {quote.customer.businessName ? (
              <div className="text-[13.5px] text-muted-foreground">
                {quote.customer.businessName}
              </div>
            ) : null}
            {quote.customer.phone ? (
              <div className="text-[13.5px] text-muted-foreground">{quote.customer.phone}</div>
            ) : null}
            {quote.customer.email ? (
              <div className="text-[13.5px] text-muted-foreground">{quote.customer.email}</div>
            ) : null}
            {quote.customer.address ? (
              <div className="text-[13.5px] text-muted-foreground">{quote.customer.address}</div>
            ) : null}
          </div>
          <div className="text-right text-[13px]">
            <div className="flex justify-between gap-6">
              <span className="text-muted-foreground">Quote No.</span>
              <span className="font-semibold">Q-{quote.number}</span>
            </div>
            <div className="mt-1 flex justify-between gap-6">
              <span className="text-muted-foreground">Issue Date</span>
              <span className="font-semibold">{formatShortDate(quote.createdAt)}</span>
            </div>
            {quote.validUntil ? (
              <div className="mt-1 flex justify-between gap-6">
                <span className="text-muted-foreground">Valid Until</span>
                <span className="font-semibold">{formatLongDate(quote.validUntil)}</span>
              </div>
            ) : null}
          </div>
        </div>

        <div
          className="mb-7 overflow-hidden rounded-[14px] border"
          style={{ borderColor: withAlpha(accent, 0.25) }}
        >
          <div
            className="flex px-4.5 py-3 text-xs font-bold uppercase tracking-wide"
            style={{ backgroundColor: tint(accent, 0.9), color: shade(accent, 0.2) }}
          >
            <div className="flex-1">Item</div>
            <div className="w-15 text-center">Qty</div>
            <div className="w-25 text-right">Price</div>
            <div className="w-25 text-right">Total</div>
          </div>
          {quote.items.map((item) => (
            <div
              key={item.id}
              className="flex border-t px-4.5 py-3.5 text-sm"
              style={{ borderColor: withAlpha(accent, 0.18) }}
            >
              <div className="flex-1 font-semibold">{item.name}</div>
              <div className="w-15 text-center">{item.qty}</div>
              <div className="w-25 text-right text-muted-foreground">
                {formatCurrency(item.priceCents, currency)}
              </div>
              <div className="w-25 text-right font-bold">
                {formatCurrency(item.priceCents * item.qty, currency)}
              </div>
            </div>
          ))}
        </div>

        <div className="mb-7 flex justify-end">
          <div className="w-65">
            <div className="flex justify-between py-1.5 text-sm text-muted-foreground">
              <span>Subtotal</span>
              <span>{formatCurrency(subtotalCents, currency)}</span>
            </div>
            <div
              className="mt-1.5 flex justify-between border-t py-2.5 font-heading text-[19px] font-extrabold"
              style={{ borderColor: withAlpha(accent, 0.3) }}
            >
              <span>Total</span>
              <span>{formatCurrency(subtotalCents, currency)}</span>
            </div>
            <div
              className="flex justify-between py-1.5 text-[13.5px] font-semibold"
              style={{ color: accent }}
            >
              <span>Deposit due ({quote.depositPercent}%)</span>
              <span>{formatCurrency(depositCents, currency)}</span>
            </div>
            <div className="flex justify-between py-1.5 text-[13.5px] text-muted-foreground">
              <span>Balance</span>
              <span>{formatCurrency(balanceCents, currency)}</span>
            </div>
          </div>
        </div>

        {quote.notes ? (
          <div className="mb-6 rounded-xl bg-muted px-4.5 py-4 text-[13.5px] text-muted-foreground">
            {quote.notes}
          </div>
        ) : null}

        {company.bankName || company.accountName || company.accountNumber ? (
          <div
            className="mb-6 rounded-xl border px-4.5 py-4"
            style={{
              borderColor: withAlpha(accent, 0.25),
              backgroundColor: tint(accent, 0.96),
            }}
          >
            <div
              className="mb-2.5 text-xs font-bold uppercase tracking-wide"
              style={{ color: shade(accent, 0.1) }}
            >
              Payment Details
            </div>
            <div className="grid grid-cols-1 gap-x-6 gap-y-1.5 text-[13.5px] sm:grid-cols-3">
              {company.accountName ? (
                <div>
                  <div className="text-muted-foreground">Account Name</div>
                  <div className="font-semibold">{company.accountName}</div>
                </div>
              ) : null}
              {company.bankName ? (
                <div>
                  <div className="text-muted-foreground">Bank</div>
                  <div className="font-semibold">{company.bankName}</div>
                </div>
              ) : null}
              {company.accountNumber ? (
                <div>
                  <div className="text-muted-foreground">Account Number</div>
                  <div className="font-semibold">{company.accountNumber}</div>
                </div>
              ) : null}
            </div>
          </div>
        ) : null}

        <div
          className="flex flex-wrap items-center justify-between gap-2 border-t pt-5 text-[12.5px] text-muted-foreground"
          style={{ borderColor: withAlpha(accent, 0.25) }}
        >
          <span>
            {quote.validUntil
              ? `This quotation is valid until ${formatLongDate(quote.validUntil)}.`
              : "Thank you for your business."}
          </span>
          <span>Prepared by {company.name}</span>
        </div>
      </div>
    </div>
  );
}
