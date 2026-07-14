import { NextResponse } from "next/server";
import { requireOnboardedCompany } from "@/lib/session";
import { getQuoteById } from "@/services/quotes";
import { renderQuotePdf } from "@/lib/pdf/quote-document";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { company } = await requireOnboardedCompany();

  const quote = await getQuoteById(id, company.id);
  if (!quote) {
    return NextResponse.json({ error: "Quote not found." }, { status: 404 });
  }

  const buffer = await renderQuotePdf(quote, quote.company);
  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="quote-Q-${quote.number}.pdf"`,
    },
  });
}
