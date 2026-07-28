import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireOnboardedCompany } from "@/lib/session";
import { getQuoteById } from "@/services/quotes";
import { QuotePreview } from "@/features/quotes/quote-preview";

export const metadata: Metadata = { title: "Quote" };

export default async function QuoteDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { company } = await requireOnboardedCompany();
  const quote = await getQuoteById(id, company.id);

  if (!quote) {
    notFound();
  }

  return <QuotePreview quote={quote} company={quote.company} />;
}
