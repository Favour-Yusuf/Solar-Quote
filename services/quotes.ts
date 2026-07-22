import { addDays } from "date-fns";
import { prisma } from "@/lib/prisma";
import type { QuoteStatus } from "@prisma/client";
import { quoteTotalCents } from "@/utils/quote-math";

export async function getDashboardStats(companyId: string) {
  const quotes = await prisma.quote.findMany({
    where: { companyId },
    include: { items: true },
  });

  const paidQuotes = quotes.filter((q) => q.status === "PAID");
  const revenueCents = paidQuotes.reduce((sum, q) => sum + quoteTotalCents(q), 0);

  return {
    totalQuotes: quotes.length,
    sentQuotes: quotes.filter((q) => q.status === "SENT" || q.status === "PAID").length,
    paidQuotes: paidQuotes.length,
    revenueCents,
  };
}

export function getRecentQuotes(companyId: string, limit = 5) {
  return prisma.quote.findMany({
    where: { companyId },
    include: { items: true, customer: true },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

export function getAllQuotes(companyId: string) {
  return prisma.quote.findMany({
    where: { companyId },
    include: { items: true, customer: true },
    orderBy: { createdAt: "desc" },
  });
}

export function getQuoteById(id: string, companyId: string) {
  return prisma.quote.findFirst({
    where: { id, companyId },
    include: { items: true, customer: true, company: true },
  });
}

export function getQuoteByShareToken(shareToken: string) {
  return prisma.quote.findUnique({
    where: { shareToken },
    include: { items: true, customer: true, company: true },
  });
}

export async function createQuote(input: {
  companyId: string;
  customerId: string;
  depositPercent: number;
  currency?: string;
  validUntil?: Date;
  notes?: string;
  sourcePackageId?: string;
  items: { productId: string; qty: number; priceCentsOverride?: number }[];
}) {
  return prisma.$transaction(async (tx) => {
    // Atomic per-company counter: increment returns the post-increment
    // value, so the number assigned to this quote is one less.
    const company = await tx.company.update({
      where: { id: input.companyId },
      data: { quoteSequence: { increment: 1 } },
    });
    const number = company.quoteSequence - 1;

    // Fall back to the company defaults when the builder didn't send them, so
    // the quote is always denominated and dated even for older clients.
    const currency = input.currency ?? company.defaultCurrency;
    const validUntil = input.validUntil ?? addDays(new Date(), company.defaultValidityDays);

    // Never trust client-supplied prices — snapshot from the authoritative
    // product row at creation time.
    const products = await tx.product.findMany({
      where: {
        companyId: input.companyId,
        id: { in: input.items.map((item) => item.productId) },
      },
    });
    const productById = new Map(products.map((p) => [p.id, p]));

    const items = input.items.flatMap((item) => {
      const product = productById.get(item.productId);
      if (!product) return [];
      return [
        {
          productId: product.id,
          name: product.name,
          unit: product.unit,
          priceCents: item.priceCentsOverride ?? product.priceCents,
          qty: item.qty,
        },
      ];
    });

    return tx.quote.create({
      data: {
        companyId: input.companyId,
        customerId: input.customerId,
        number,
        depositPercent: input.depositPercent,
        currency,
        validUntil,
        notes: input.notes || null,
        sourcePackageId: input.sourcePackageId || null,
        items: { create: items },
      },
      include: { items: true, customer: true },
    });
  });
}

export async function updateQuoteStatus(
  id: string,
  companyId: string,
  status: QuoteStatus
) {
  const { count } = await prisma.quote.updateMany({
    where: { id, companyId },
    data: { status },
  });
  return count > 0;
}
