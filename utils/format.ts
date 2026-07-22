import { format } from "date-fns";
import { currencyMeta, DEFAULT_CURRENCY } from "@/lib/currency";

/**
 * Formats an integer cent amount in the given currency. Grouping is done with a
 * fixed "en-US" locale so the output is byte-for-byte identical on the server,
 * in the browser preview and inside the PDF renderer. Alphabetic symbols (e.g.
 * "KES") get a space; glyph symbols (₦, $, GH₵) sit flush against the number.
 */
export function formatCurrency(amountCents: number, currency: string = DEFAULT_CURRENCY) {
  const { symbol } = currencyMeta(currency);
  const amount = (amountCents / 100).toLocaleString("en-US", {
    maximumFractionDigits: 0,
  });
  const separator = /[A-Za-z]$/.test(symbol) ? " " : "";
  return `${symbol}${separator}${amount}`;
}

export function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function formatShortDate(date: Date) {
  return format(date, "MMM d");
}

/** Long, unambiguous date for the "Valid until" line, e.g. "31 August 2026". */
export function formatLongDate(date: Date) {
  return format(date, "d MMMM yyyy");
}
