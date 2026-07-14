import { NextResponse } from "next/server";
import { getQuoteByShareToken } from "@/services/quotes";
import { renderQuotePdf } from "@/lib/pdf/quote-document";

/** Public, no-auth route — the PDF link a customer gets via WhatsApp/email. */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;
  const quote = await getQuoteByShareToken(token);
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
