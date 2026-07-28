import { Document, Page, View, Text, Image, StyleSheet, renderToBuffer } from "@react-pdf/renderer";
import { quoteTotalCents, depositCentsFor } from "@/utils/quote-math";
import { formatCurrency, formatShortDate, formatLongDate } from "@/utils/format";
import { resolveBrandColor, tint, shade } from "@/lib/branding";
import { isSvgUrl } from "@/lib/supabase/storage";

const PAGE_PADDING = 40;

const styles = StyleSheet.create({
  // Horizontal padding lives on `body` instead of the page so the brand band
  // at the top can run full-bleed.
  page: { paddingBottom: PAGE_PADDING, fontSize: 10, fontFamily: "Helvetica", color: "#212121" },
  brandBar: { height: 10 },
  body: { paddingHorizontal: PAGE_PADDING, paddingTop: 28 },
  headerRow: { flexDirection: "row", justifyContent: "space-between", paddingBottom: 16 },
  headerLeft: { flexDirection: "row", alignItems: "flex-start", gap: 10, maxWidth: 340 },
  logo: { width: 44, height: 44, objectFit: "contain" },
  companyName: { fontSize: 14, fontFamily: "Helvetica-Bold" },
  meta: { fontSize: 9, color: "#6b6b6b", marginTop: 2 },
  quoteLabel: { fontSize: 18, fontFamily: "Helvetica-Bold", textAlign: "right" },
  divider: { borderBottomWidth: 1, marginBottom: 20 },
  billRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 20 },
  label: { fontSize: 8, textTransform: "uppercase", marginBottom: 4, fontFamily: "Helvetica-Bold" },
  customerName: { fontSize: 11, fontFamily: "Helvetica-Bold" },
  metaCol: { alignItems: "flex-end" },
  metaLine: { fontSize: 9, marginBottom: 2 },
  metaLabelInline: { color: "#9a9a9a" },
  table: { borderWidth: 1, borderRadius: 4, marginBottom: 20 },
  tableHeaderRow: { flexDirection: "row", padding: 8 },
  tableHeaderCell: { fontFamily: "Helvetica-Bold", fontSize: 8, textTransform: "uppercase" },
  tableRow: { flexDirection: "row", padding: 8, borderTopWidth: 1 },
  colItem: { flex: 1 },
  colQty: { width: 40, textAlign: "center" },
  colPrice: { width: 70, textAlign: "right" },
  colTotal: { width: 70, textAlign: "right" },
  totalsBlock: { alignSelf: "flex-end", width: 200, marginBottom: 20 },
  totalsRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 4 },
  grandTotalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    paddingTop: 6,
    marginTop: 4,
  },
  bold: { fontFamily: "Helvetica-Bold" },
  notes: { marginBottom: 16, color: "#6b6b6b" },
  paymentBlock: { borderWidth: 1, borderRadius: 6, padding: 10, marginBottom: 16 },
  paymentTitle: {
    fontSize: 8,
    textTransform: "uppercase",
    marginBottom: 6,
    fontFamily: "Helvetica-Bold",
  },
  paymentRow: { flexDirection: "row", gap: 24 },
  paymentLabel: { fontSize: 8, color: "#9a9a9a" },
  paymentValue: { fontSize: 10, fontFamily: "Helvetica-Bold", marginTop: 1 },
  footer: {
    borderTopWidth: 1,
    paddingTop: 12,
    fontSize: 8,
    color: "#9a9a9a",
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

export type PdfQuote = {
  number: number;
  createdAt: Date;
  depositPercent: number;
  currency: string;
  validUntil: Date | null;
  notes: string | null;
  items: { name: string; unit: string; priceCents: number; qty: number }[];
  customer: {
    name: string;
    businessName: string | null;
    email: string | null;
    phone: string | null;
    address: string | null;
  };
};

export type PdfCompany = {
  name: string;
  email: string | null;
  phone: string | null;
  website: string | null;
  address: string | null;
  logoUrl: string | null;
  brandColor: string | null;
  bankName: string | null;
  accountName: string | null;
  accountNumber: string | null;
};

export function QuotePdfDocument({ quote, company }: { quote: PdfQuote; company: PdfCompany }) {
  const subtotalCents = quoteTotalCents(quote);
  const depositCents = depositCentsFor(subtotalCents, quote.depositPercent);
  const balanceCents = subtotalCents - depositCents;
  const currency = quote.currency;

  // Falls back to the SolarQuote palette when the installer hasn't picked one.
  const accent = resolveBrandColor(company.brandColor);
  const rule = tint(accent, 0.72);
  const softBg = tint(accent, 0.92);
  const onSoftBg = shade(accent, 0.25);

  // @react-pdf can only embed raster images; an SVG would throw and take the
  // whole PDF down, so it is skipped rather than risked.
  const logoUrl = company.logoUrl && !isSvgUrl(company.logoUrl) ? company.logoUrl : null;

  const contactLines = [
    [company.phone, company.email].filter(Boolean).join(" · "),
    company.address,
    company.website,
  ].filter(Boolean) as string[];

  return (
    <Document title={`Quote Q-${quote.number}`} author={company.name} creator={company.name}>
      <Page size="A4" style={styles.page}>
        <View style={[styles.brandBar, { backgroundColor: accent }]} />

        <View style={styles.body}>
          <View style={styles.headerRow}>
            <View style={styles.headerLeft}>
              {/* eslint-disable-next-line jsx-a11y/alt-text -- @react-pdf/renderer's Image is not an HTML img */}
              {logoUrl ? <Image src={logoUrl} style={styles.logo} /> : null}
              <View>
                <Text style={styles.companyName}>{company.name}</Text>
                {contactLines.map((line, i) => (
                  <Text key={i} style={styles.meta}>
                    {line}
                  </Text>
                ))}
              </View>
            </View>
            <View>
              <Text style={[styles.quoteLabel, { color: accent }]}>QUOTE</Text>
            </View>
          </View>

          <View style={[styles.divider, { borderBottomColor: rule }]} />

          <View style={styles.billRow}>
            <View>
              <Text style={[styles.label, { color: onSoftBg }]}>Bill To</Text>
              <Text style={styles.customerName}>{quote.customer.name}</Text>
              {quote.customer.businessName ? (
                <Text style={styles.meta}>{quote.customer.businessName}</Text>
              ) : null}
              {quote.customer.phone ? <Text style={styles.meta}>{quote.customer.phone}</Text> : null}
              {quote.customer.email ? <Text style={styles.meta}>{quote.customer.email}</Text> : null}
              {quote.customer.address ? (
                <Text style={styles.meta}>{quote.customer.address}</Text>
              ) : null}
            </View>
            <View style={styles.metaCol}>
              <Text style={styles.metaLine}>
                <Text style={styles.metaLabelInline}>Quote No. </Text>Q-{quote.number}
              </Text>
              <Text style={styles.metaLine}>
                <Text style={styles.metaLabelInline}>Issue Date: </Text>
                {formatShortDate(quote.createdAt)}
              </Text>
              {quote.validUntil ? (
                <Text style={styles.metaLine}>
                  <Text style={styles.metaLabelInline}>Valid Until: </Text>
                  {formatLongDate(quote.validUntil)}
                </Text>
              ) : null}
            </View>
          </View>

          <View style={[styles.table, { borderColor: rule }]}>
            <View style={[styles.tableHeaderRow, { backgroundColor: softBg }]}>
              <Text style={[styles.colItem, styles.tableHeaderCell, { color: onSoftBg }]}>Item</Text>
              <Text style={[styles.colQty, styles.tableHeaderCell, { color: onSoftBg }]}>Qty</Text>
              <Text style={[styles.colPrice, styles.tableHeaderCell, { color: onSoftBg }]}>
                Price
              </Text>
              <Text style={[styles.colTotal, styles.tableHeaderCell, { color: onSoftBg }]}>
                Total
              </Text>
            </View>
            {quote.items.map((item, i) => (
              <View key={i} style={[styles.tableRow, { borderTopColor: rule }]}>
                <Text style={styles.colItem}>{item.name}</Text>
                <Text style={styles.colQty}>{item.qty}</Text>
                <Text style={styles.colPrice}>{formatCurrency(item.priceCents, currency)}</Text>
                <Text style={styles.colTotal}>
                  {formatCurrency(item.priceCents * item.qty, currency)}
                </Text>
              </View>
            ))}
          </View>

          <View style={styles.totalsBlock}>
            <View style={styles.totalsRow}>
              <Text>Subtotal</Text>
              <Text>{formatCurrency(subtotalCents, currency)}</Text>
            </View>
            <View style={[styles.grandTotalRow, { borderTopColor: rule }]}>
              <Text style={styles.bold}>Total</Text>
              <Text style={styles.bold}>{formatCurrency(subtotalCents, currency)}</Text>
            </View>
            <View style={styles.totalsRow}>
              <Text style={{ color: accent }}>Deposit due ({quote.depositPercent}%)</Text>
              <Text style={{ color: accent }}>{formatCurrency(depositCents, currency)}</Text>
            </View>
            <View style={styles.totalsRow}>
              <Text>Balance</Text>
              <Text>{formatCurrency(balanceCents, currency)}</Text>
            </View>
          </View>

          {quote.notes ? <Text style={styles.notes}>{quote.notes}</Text> : null}

          {company.bankName || company.accountName || company.accountNumber ? (
            <View style={[styles.paymentBlock, { borderColor: rule, backgroundColor: softBg }]}>
              <Text style={[styles.paymentTitle, { color: onSoftBg }]}>Payment Details</Text>
              <View style={styles.paymentRow}>
                {company.accountName ? (
                  <View>
                    <Text style={styles.paymentLabel}>Account Name</Text>
                    <Text style={styles.paymentValue}>{company.accountName}</Text>
                  </View>
                ) : null}
                {company.bankName ? (
                  <View>
                    <Text style={styles.paymentLabel}>Bank</Text>
                    <Text style={styles.paymentValue}>{company.bankName}</Text>
                  </View>
                ) : null}
                {company.accountNumber ? (
                  <View>
                    <Text style={styles.paymentLabel}>Account Number</Text>
                    <Text style={styles.paymentValue}>{company.accountNumber}</Text>
                  </View>
                ) : null}
              </View>
            </View>
          ) : null}

          <View style={[styles.footer, { borderTopColor: rule }]}>
            <Text>
              {quote.validUntil
                ? `This quotation is valid until ${formatLongDate(quote.validUntil)}.`
                : "Thank you for your business."}
            </Text>
            <Text>Prepared by {company.name}</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}

export async function renderQuotePdf(quote: PdfQuote, company: PdfCompany) {
  return renderToBuffer(<QuotePdfDocument quote={quote} company={company} />);
}
