import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Download } from "lucide-react";
import { CompanyLogo } from "@/components/company-logo";
import { Button } from "@/components/ui/button";
import { getQuoteByShareToken } from "@/services/quotes";
import { QuoteDocumentCard } from "@/features/quotes/quote-document-card";
import { brandThemeVars } from "@/lib/branding";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ token: string }>;
}): Promise<Metadata> {
  const { token } = await params;
  const quote = await getQuoteByShareToken(token);
  return { title: quote ? `Quote from ${quote.company.name}` : "Quote not found" };
}

export default async function PublicQuotePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const quote = await getQuoteByShareToken(token);

  if (!quote) {
    notFound();
  }

  return (
    // Customer-facing: this page carries the installer's brand only.
    <div
      className="min-h-screen bg-background px-6 py-10 sm:px-10"
      style={brandThemeVars(quote.company.brandColor)}
    >
      <div className="mx-auto max-w-225">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2.5">
            <CompanyLogo
              logoUrl={quote.company.logoUrl}
              name={quote.company.name}
              brandColor={quote.company.brandColor}
              size={34}
            />
            <span className="truncate font-heading text-[17px] font-extrabold tracking-tight">
              {quote.company.name}
            </span>
          </div>
          <Button
            variant="outline"
            render={
              <a href={`/api/q/${token}/pdf`} target="_blank" rel="noopener noreferrer" />
            }
            className="h-auto gap-2 rounded-[11px] px-4 py-2.5 text-sm font-bold"
          >
            <Download className="size-[15px]" strokeWidth={2} />
            Download PDF
          </Button>
        </div>

        <QuoteDocumentCard quote={quote} company={quote.company} status={quote.status} />

        <p className="mt-8 text-center text-[11.5px] text-muted-foreground/70">
          Questions about this quotation? Contact {quote.company.name}
          {quote.company.phone ? ` on ${quote.company.phone}` : ""}.
        </p>
      </div>
    </div>
  );
}
