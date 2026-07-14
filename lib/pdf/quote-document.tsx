import { Document, Page, View, Text, Image, StyleSheet, renderToBuffer } from "@react-pdf/renderer";
import { quoteTotalCents, depositCentsFor } from "@/utils/quote-math";
import { formatCurrency, formatShortDate } from "@/utils/format";
import { DEFAULT_BRAND_COLOR } from "@/lib/branding";

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 10, fontFamily: "Helvetica", color: "#212121" },
  headerRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 28 },
  headerLeft: { flexDirection: "row", alignItems: "center", gap: 10 },
  logo: { width: 36, height: 36, objectFit: "contain", borderRadius: 6 },
  companyName: { fontSize: 14, fontFamily: "Helvetica-Bold" },
  meta: { fontSize: 9, color: "#6b6b6b", marginTop: 2 },
  quoteLabel: { fontSize: 16, fontFamily: "Helvetica-Bold", textAlign: "right" },
  section: { marginBottom: 20 },
  label: { fontSize: 8, textTransform: "uppercase", color: "#9a9a9a", marginBottom: 4 },
  customerName: { fontSize: 11, fontFamily: "Helvetica-Bold" },
  table: { borderWidth: 1, borderColor: "#e5e5e5", borderRadius: 4, marginBottom: 20 },
  tableHeaderRow: { flexDirection: "row", backgroundColor: "#f7f7f7", padding: 8 },
  tableHeaderCell: { fontFamily: "Helvetica-Bold" },
  tableRow: { flexDirection: "row", padding: 8, borderTopWidth: 1, borderTopColor: "#e5e5e5" },
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
    borderTopColor: "#e5e5e5",
    paddingTop: 6,
    marginTop: 4,
  },
  bold: { fontFamily: "Helvetica-Bold" },
  notes: { marginBottom: 16, color: "#6b6b6b" },
  paymentBlock: {
    borderWidth: 1,
    borderColor: "#e5e5e5",
    borderRadius: 6,
    padding: 10,
    marginBottom: 16,
  },
  paymentTitle: {
    fontSize: 8,
    textTransform: "uppercase",
    color: "#9a9a9a",
    marginBottom: 6,
  },
  paymentRow: { flexDirection: "row", gap: 24 },
  paymentLabel: { fontSize: 8, color: "#9a9a9a" },
  paymentValue: { fontSize: 10, fontFamily: "Helvetica-Bold", marginTop: 1 },
  footer: { borderTopWidth: 1, borderTopColor: "#e5e5e5", paddingTop: 12, fontSize: 8, color: "#9a9a9a" },
});

export type PdfQuote = {
  number: number;
  createdAt: Date;
  depositPercent: number;
  notes: string | null;
  items: { name: string; unit: string; priceCents: number; qty: number }[];
  customer: { name: string; businessName: string | null; address: string | null };
};

export type PdfCompany = {
  name: string;
  email: string | null;
  phone: string | null;
  website: string | null;
  logoUrl: string | null;
  brandColor: string | null;
  bankName: string | null;
  accountName: string | null;
  accountNumber: string | null;
};

export function QuotePdfDocument({ quote, company }: { quote: PdfQuote; company: PdfCompany }) {
  const subtotalCents = quoteTotalCents(quote);
  const depositCents = depositCentsFor(subtotalCents, quote.depositPercent);
  const accent = company.brandColor || DEFAULT_BRAND_COLOR;

  return (
    <Document title={`Quote Q-${quote.number}`}>
      <Page size="A4" style={styles.page}>
        <View style={styles.headerRow}>
          <View style={styles.headerLeft}>
            {/* eslint-disable-next-line jsx-a11y/alt-text -- @react-pdf/renderer's Image is not an HTML img */}
            {company.logoUrl ? <Image src={company.logoUrl} style={styles.logo} /> : null}
            <View>
              <Text style={styles.companyName}>{company.name}</Text>
              <Text style={styles.meta}>
                {[company.email, company.phone, company.website].filter(Boolean).join(" · ")}
              </Text>
            </View>
          </View>
          <View>
            <Text style={[styles.quoteLabel, { color: accent }]}>QUOTE</Text>
            <Text style={styles.meta}>
              Q-{quote.number} · {formatShortDate(quote.createdAt)}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Prepared for</Text>
          <Text style={styles.customerName}>{quote.customer.name}</Text>
          {quote.customer.businessName ? (
            <Text style={styles.meta}>{quote.customer.businessName}</Text>
          ) : null}
          {quote.customer.address ? <Text style={styles.meta}>{quote.customer.address}</Text> : null}
        </View>

        <View style={styles.table}>
          <View style={styles.tableHeaderRow}>
            <Text style={[styles.colItem, styles.tableHeaderCell]}>Item</Text>
            <Text style={[styles.colQty, styles.tableHeaderCell]}>Qty</Text>
            <Text style={[styles.colPrice, styles.tableHeaderCell]}>Price</Text>
            <Text style={[styles.colTotal, styles.tableHeaderCell]}>Total</Text>
          </View>
          {quote.items.map((item, i) => (
            <View key={i} style={styles.tableRow}>
              <Text style={styles.colItem}>{item.name}</Text>
              <Text style={styles.colQty}>{item.qty}</Text>
              <Text style={styles.colPrice}>{formatCurrency(item.priceCents)}</Text>
              <Text style={styles.colTotal}>{formatCurrency(item.priceCents * item.qty)}</Text>
            </View>
          ))}
        </View>

        <View style={styles.totalsBlock}>
          <View style={styles.totalsRow}>
            <Text>Subtotal</Text>
            <Text>{formatCurrency(subtotalCents)}</Text>
          </View>
          <View style={styles.grandTotalRow}>
            <Text style={styles.bold}>Total</Text>
            <Text style={styles.bold}>{formatCurrency(subtotalCents)}</Text>
          </View>
          <View style={styles.totalsRow}>
            <Text style={{ color: accent }}>Deposit due ({quote.depositPercent}%)</Text>
            <Text style={{ color: accent }}>{formatCurrency(depositCents)}</Text>
          </View>
        </View>

        {quote.notes ? <Text style={styles.notes}>{quote.notes}</Text> : null}

        {company.bankName || company.accountName || company.accountNumber ? (
          <View style={styles.paymentBlock}>
            <Text style={styles.paymentTitle}>Payment Details</Text>
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

        <Text style={styles.footer}>This quote is valid for 30 days.</Text>
      </Page>
    </Document>
  );
}

export async function renderQuotePdf(quote: PdfQuote, company: PdfCompany) {
  return renderToBuffer(<QuotePdfDocument quote={quote} company={company} />);
}
