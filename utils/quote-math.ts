export function quoteTotalCents(quote: { items: { priceCents: number; qty: number }[] }) {
  return quote.items.reduce((sum, item) => sum + item.priceCents * item.qty, 0);
}

export function depositCentsFor(totalCents: number, depositPercent: number) {
  return Math.round((totalCents * depositPercent) / 100);
}
