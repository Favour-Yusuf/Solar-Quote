export type StarterProduct = {
  key: string;
  name: string;
  unit: string;
  priceCents: number;
};

export const STARTER_PRODUCTS: StarterProduct[] = [
  { key: "panels", name: "Solar Panels", unit: "panel", priceCents: 24900 },
  { key: "inverter", name: "Inverter", unit: "unit", priceCents: 189900 },
  { key: "battery", name: "Battery Storage", unit: "unit", priceCents: 489900 },
  { key: "install", name: "Installation Fee", unit: "day", priceCents: 65000 },
];
