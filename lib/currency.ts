/**
 * Supported quote currencies. `code` is the stored value (on Company.defaultCurrency
 * and Quote.currency); `symbol` is what renders on quotes, the preview and the PDF.
 * Amounts are always stored as integer minor units (cents) and formatted via
 * `formatCurrency` in utils/format.ts — a single source of truth shared by the
 * on-screen document and the PDF so the two never drift.
 */
export const CURRENCIES = {
  NGN: { code: "NGN", label: "Nigerian Naira", symbol: "₦" },
  USD: { code: "USD", label: "US Dollar", symbol: "$" },
  GBP: { code: "GBP", label: "British Pound", symbol: "£" },
  EUR: { code: "EUR", label: "Euro", symbol: "€" },
  GHS: { code: "GHS", label: "Ghana Cedi", symbol: "GH₵" },
  KES: { code: "KES", label: "Kenyan Shilling", symbol: "KES" },
} as const;

export type CurrencyCode = keyof typeof CURRENCIES;

export const DEFAULT_CURRENCY: CurrencyCode = "NGN";

/** Ordered list for building <select> options in the builder and settings. */
export const CURRENCY_OPTIONS = Object.values(CURRENCIES);

export function isCurrencyCode(value: string): value is CurrencyCode {
  return Object.prototype.hasOwnProperty.call(CURRENCIES, value);
}

/** Never throws — unknown codes fall back to the default so rendering is safe. */
export function currencyMeta(code: string) {
  return isCurrencyCode(code) ? CURRENCIES[code] : CURRENCIES[DEFAULT_CURRENCY];
}
