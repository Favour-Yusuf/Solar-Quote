"use client";

import { useState } from "react";
import Link from "next/link";
import type { Company, Customer, Quote, QuoteItem, QuoteStatus } from "@prisma/client";
import { ArrowLeft, Check, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { markQuotePaidAction, markQuoteSentAction } from "@/actions/quotes";
import { QuoteDocumentCard } from "@/features/quotes/quote-document-card";

type QuoteWithRelations = Quote & {
  items: QuoteItem[];
  customer: Customer;
};

export function QuotePreview({
  quote,
  company,
}: {
  quote: QuoteWithRelations;
  company: Company;
}) {
  const [status, setStatus] = useState<QuoteStatus>(quote.status);
  const [markingPaid, setMarkingPaid] = useState(false);

  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/q/${quote.shareToken}`
      : "";
  const whatsappText = encodeURIComponent(
    `Hi ${quote.customer.name}, here's your solar quote from ${company.name} (Q-${quote.number}): ${shareUrl}`
  );

  function markSentIfDraft() {
    if (status === "DRAFT") {
      setStatus("SENT");
      void markQuoteSentAction(quote.id);
    }
  }

  async function markPaid() {
    setMarkingPaid(true);
    const result = await markQuotePaidAction(quote.id);
    if (!result || !("error" in result)) {
      setStatus("PAID");
    }
    setMarkingPaid(false);
  }

  return (
    <div className="mx-auto max-w-225 animate-sq-fade-up">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/quotes"
          className="flex items-center gap-1.5 text-[13.5px] font-semibold text-muted-foreground"
        >
          <ArrowLeft className="size-3.5" strokeWidth={2.2} />
          Back to quotes
        </Link>
        <div className="flex flex-wrap gap-2.5">
          {status === "SENT" ? (
            <Button
              variant="outline"
              onClick={markPaid}
              disabled={markingPaid}
              className="h-auto gap-2 rounded-[11px] px-4 py-2.5 text-sm font-bold"
            >
              <Check className="size-[15px]" strokeWidth={2.4} />
              Mark as paid
            </Button>
          ) : null}
          <Button
            variant="outline"
            render={
              <a
                href={`/api/quotes/${quote.id}/pdf`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={markSentIfDraft}
              />
            }
            className="h-auto gap-2 rounded-[11px] px-4 py-2.5 text-sm font-bold"
          >
            <Download className="size-[15px]" strokeWidth={2} />
            Download PDF
          </Button>
          <Button
            render={
              <a
                href={`https://wa.me/?text=${whatsappText}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={markSentIfDraft}
              />
            }
            className="h-auto gap-2 rounded-[11px] bg-[oklch(60%_0.15_145)] px-4 py-2.5 text-sm font-bold text-white hover:bg-[oklch(55%_0.15_145)]"
          >
            Share on WhatsApp
          </Button>
        </div>
      </div>

      <QuoteDocumentCard quote={quote} company={company} status={status} />
    </div>
  );
}
