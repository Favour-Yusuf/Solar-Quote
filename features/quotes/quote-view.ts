import type { QuoteStatus } from "@prisma/client";
import { quoteTotalCents } from "@/services/quotes";
import { formatCurrency, formatShortDate, getInitials } from "@/utils/format";

type QuoteWithRelations = {
  id: string;
  number: number;
  status: QuoteStatus;
  createdAt: Date;
  items: { priceCents: number; qty: number }[];
  customer: { name: string; businessName: string | null };
};

export function toQuoteListItem(quote: QuoteWithRelations) {
  return {
    id: quote.id,
    displayNumber: `Q-${quote.number}`,
    customerName: quote.customer.name,
    customerSubtitle: quote.customer.businessName ?? "",
    initials: getInitials(quote.customer.name),
    dateLabel: formatShortDate(quote.createdAt),
    totalLabel: formatCurrency(quoteTotalCents(quote)),
    status: quote.status,
  };
}
