import type { Product } from "@prisma/client";
import { Package } from "lucide-react";
import { EmptyState } from "@/components/empty-state";
import { formatCurrency } from "@/utils/format";
import { DEFAULT_CURRENCY } from "@/lib/currency";
import { ProductModal } from "@/features/products/product-modal";

export function ProductsGrid({
  products,
  currency = DEFAULT_CURRENCY,
}: {
  products: Product[];
  currency?: string;
}) {
  if (products.length === 0) {
    return (
      <EmptyState
        icon={Package}
        title="No products yet"
        description="Add your panels, inverters, and services to start building quotes."
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 min-[561px]:grid-cols-2 min-[901px]:grid-cols-3">
      {products.map((product) => (
        <div
          key={product.id}
          className="flex flex-col gap-2.5 rounded-2xl border border-border bg-card p-5"
        >
          <div
            className="flex h-21 w-full items-center justify-center rounded-xl font-mono text-[11px] text-success-foreground"
            style={{
              backgroundImage:
                "repeating-linear-gradient(135deg, oklch(96% 0.02 152) 0px, oklch(96% 0.02 152) 10px, oklch(93% 0.03 152) 10px, oklch(93% 0.03 152) 20px)",
            }}
          >
            product photo
          </div>
          <div className="text-[15px] font-bold leading-tight">{product.name}</div>
          <div className="text-[13px] text-muted-foreground">per {product.unit}</div>
          <div className="mt-auto flex items-center justify-between border-t border-border pt-2.5">
            <div className="font-heading text-[17px] font-extrabold">
              {formatCurrency(product.priceCents, currency)}
            </div>
            <ProductModal product={product} />
          </div>
        </div>
      ))}
    </div>
  );
}
