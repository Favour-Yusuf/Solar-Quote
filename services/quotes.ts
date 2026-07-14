import { prisma } from "@/lib/prisma";

export function quoteTotalCents(quote: { items: { priceCents: number; qty: number }[] }) {
  return quote.items.reduce((sum, item) => sum + item.priceCents * item.qty, 0);
}

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
