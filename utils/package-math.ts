export function effectivePriceCents(item: { priceCents: number; customPriceCents?: number | null }) {
  return item.customPriceCents ?? item.priceCents;
}

export function packageTotalCents(pkg: {
  items: { priceCents: number; customPriceCents?: number | null; qty: number }[];
}) {
  return pkg.items.reduce((sum, item) => sum + effectivePriceCents(item) * item.qty, 0);
}
