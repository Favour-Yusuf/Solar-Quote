import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Download } from "lucide-react";
import { LogoMark } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { getQuoteByShareToken } from "@/services/quotes";
import { QuoteDocumentCard } from "@/features/quotes/quote-document-card";

export const metadata: Metadata = { title: "Your quote — SolarQuote" };

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
    <div className="min-h-screen bg-background px-6 py-10 sm:px-10">
      <div className="mx-auto max-w-225">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <LogoMark />
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

        <p className="mt-8 text-center text-[13px] text-muted-foreground">
          Quoted with{" "}
          <Link href="/" className="font-semibold text-primary">
            SolarQuote
          </Link>{" "}
          — branded quotes for solar installers.
        </p>
      </div>
    </div>
  );
}
