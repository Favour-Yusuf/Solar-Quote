"use client";

import type { Product } from "@prisma/client";
import { Minus, Plus, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/utils/format";
import { currencyMeta, DEFAULT_CURRENCY } from "@/lib/currency";

export type LineItem = {
  productId: string;
  name: string;
  unit: string;
  priceCents: number;
  qty: number;
};

export function ProductLinePicker({
  title,
  search,
  onSearchChange,
  results,
  onAdd,
  lineItems,
  onQtyChange,
  onPriceChange,
  onRemove,
  currency = DEFAULT_CURRENCY,
}: {
  title?: string;
  search: string;
  onSearchChange: (v: string) => void;
  results: Product[];
  onAdd: (product: Product) => void;
  lineItems: LineItem[];
  onQtyChange: (productId: string, qty: number) => void;
  onPriceChange: (productId: string, priceCents: number) => void;
  onRemove: (productId: string) => void;
  currency?: string;
}) {
  const currencySymbol = currencyMeta(currency).symbol;
  return (
    <div className="rounded-2xl border border-border bg-card p-[22px]">
      {title ? <h2 className="mb-3.5 font-heading text-[15px] font-bold">{title}</h2> : null}

      <Input
        placeholder="Search the catalogue…"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        className="mb-2.5 h-11 rounded-[11px] px-3.5 text-[14.5px]"
      />
      <div className="mb-3.5 flex max-h-[180px] flex-col gap-0.5 overflow-auto">
        {results.map((product) => (
          <button
            type="button"
            key={product.id}
            onClick={() => onAdd(product)}
            className="flex items-center gap-3 rounded-[10px] px-3 py-2.5 text-left hover:bg-muted"
          >
            <div className="flex-1">
              <div className="text-sm font-semibold">{product.name}</div>
              <div className="text-[12.5px] text-muted-foreground">
                {formatCurrency(product.priceCents, currency)} / {product.unit}
              </div>
            </div>
            <div className="flex size-[26px] shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
              <Plus className="size-3.5" strokeWidth={2.4} />
            </div>
          </button>
        ))}
      </div>

      {lineItems.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border py-5 text-center text-[13.5px] text-muted-foreground">
          No line items yet — search above to add products.
        </div>
      ) : (
        <div className="flex flex-col">
          {lineItems.map((item) => (
            <div
              key={item.productId}
              className="flex items-center gap-3 border-t border-border py-3 first:border-t-0"
            >
              <div className="flex-1">
                <div className="text-[14.5px] font-semibold">{item.name}</div>
                <div className="flex items-center gap-1 text-[12.5px] text-muted-foreground">
                  {currencySymbol}
                  <input
                    type="number"
                    min={0}
                    step="0.01"
                    value={item.priceCents / 100}
                    onChange={(e) =>
                      onPriceChange(
                        item.productId,
                        Math.max(0, Math.round(Number(e.target.value) * 100))
                      )
                    }
                    aria-label={`Unit price for ${item.name}`}
                    className="w-16 rounded-md border border-transparent bg-transparent px-1 py-0.5 hover:border-border focus:border-border focus:outline-none"
                  />
                  / {item.unit}
                </div>
              </div>
              <div className="flex items-center gap-2 rounded-[10px] bg-muted p-1">
                <button
                  type="button"
                  onClick={() => onQtyChange(item.productId, item.qty - 1)}
                  className="flex size-[26px] items-center justify-center rounded-[7px] bg-card shadow-sm"
                  aria-label={`Decrease quantity of ${item.name}`}
                >
                  <Minus className="size-3.5" strokeWidth={2.4} />
                </button>
                <div className="w-6 text-center text-sm font-bold">{item.qty}</div>
                <button
                  type="button"
                  onClick={() => onQtyChange(item.productId, item.qty + 1)}
                  className="flex size-[26px] items-center justify-center rounded-[7px] bg-card shadow-sm"
                  aria-label={`Increase quantity of ${item.name}`}
                >
                  <Plus className="size-3.5" strokeWidth={2.4} />
                </button>
              </div>
              <div className="w-20 text-right text-[14.5px] font-bold">
                {formatCurrency(item.priceCents * item.qty, currency)}
              </div>
              <button
                type="button"
                onClick={() => onRemove(item.productId)}
                className="p-1 text-muted-foreground"
                aria-label={`Remove ${item.name}`}
              >
                <X className="size-4" strokeWidth={2} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
