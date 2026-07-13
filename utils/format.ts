import { format } from "date-fns";

export function formatCurrency(amountCents: number) {
  return (amountCents / 100).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
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
