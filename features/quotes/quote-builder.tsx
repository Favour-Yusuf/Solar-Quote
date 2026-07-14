"use client";

import { useMemo, useState } from "react";
import type { Customer, Product } from "@prisma/client";
import { createQuoteAction } from "@/actions/quotes";
import { CustomerPicker } from "@/features/quotes/customer-picker";
import { ProductPicker, type QuoteLineItem } from "@/features/quotes/product-picker";
import {
  QuoteBuilderExtras,
  QuoteSummaryPanel,
} from "@/features/quotes/quote-summary-panel";

export function QuoteBuilder({
  customers,
  products,
  initialCustomerId,
}: {
  customers: Customer[];
  products: Product[];
  initialCustomerId?: string;
}) {
  const [customerId, setCustomerId] = useState<string | null>(
    initialCustomerId && customers.some((c) => c.id === initialCustomerId)
      ? initialCustomerId
      : null
  );
  const [customerSearch, setCustomerSearch] = useState("");
  const [productSearch, setProductSearch] = useState("");
  const [lineItems, setLineItems] = useState<QuoteLineItem[]>([]);
  const [depositPercent, setDepositPercent] = useState(50);
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedCustomer = customers.find((c) => c.id === customerId) ?? null;

  const customerResults = useMemo(() => {
    const query = customerSearch.trim().toLowerCase();
    const pool = query
      ? customers.filter(
          (c) =>
            c.name.toLowerCase().includes(query) ||
            c.businessName?.toLowerCase().includes(query)
        )
      : customers;
    return pool.slice(0, 5);
  }, [customers, customerSearch]);

  const productResults = useMemo(() => {
    const query = productSearch.trim().toLowerCase();
    const pool = query
      ? products.filter((p) => p.name.toLowerCase().includes(query))
      : products;
    return pool.slice(0, 5);
  }, [products, productSearch]);

  function addProduct(product: Product) {
    setLineItems((prev) => {
      const existing = prev.find((li) => li.productId === product.id);
      if (existing) {
        return prev.map((li) =>
          li.productId === product.id ? { ...li, qty: li.qty + 1 } : li
        );
      }
      return [
        ...prev,
        {
          productId: product.id,
          name: product.name,
          unit: product.unit,
          priceCents: product.priceCents,
          qty: 1,
        },
      ];
    });
  }

  function updateQty(productId: string, qty: number) {
    setLineItems((prev) => {
      if (qty <= 0) return prev.filter((li) => li.productId !== productId);
      return prev.map((li) => (li.productId === productId ? { ...li, qty } : li));
    });
  }

  function removeItem(productId: string) {
    setLineItems((prev) => prev.filter((li) => li.productId !== productId));
  }

  const subtotalCents = lineItems.reduce((sum, li) => sum + li.priceCents * li.qty, 0);
  const depositCents = Math.round((subtotalCents * depositPercent) / 100);
  const canGenerate = !!customerId && lineItems.length > 0 && !submitting;

  async function generateQuote() {
    if (!customerId || lineItems.length === 0) return;
    setSubmitting(true);
    setError(null);
    const result = await createQuoteAction({
      customerId,
      depositPercent,
      notes,
      items: lineItems.map((li) => ({ productId: li.productId, qty: li.qty })),
    });
    if (result && "error" in result) {
      setError(result.error);
      setSubmitting(false);
    }
  }

  return (
    <div className="grid grid-cols-1 items-start gap-5 min-[901px]:grid-cols-[1fr_360px]">
      <div className="flex flex-col gap-4">
        <CustomerPicker
          selectedCustomer={selectedCustomer}
          search={customerSearch}
          onSearchChange={setCustomerSearch}
          results={customerResults}
          onSelect={(c) => setCustomerId(c.id)}
          onClear={() => setCustomerId(null)}
        />
        <ProductPicker
          search={productSearch}
          onSearchChange={setProductSearch}
          results={productResults}
          onAdd={addProduct}
          lineItems={lineItems}
          onQtyChange={updateQty}
          onRemove={removeItem}
        />
        <QuoteBuilderExtras
          depositPercent={depositPercent}
          onDepositChange={setDepositPercent}
          notes={notes}
          onNotesChange={setNotes}
        />
      </div>

      <QuoteSummaryPanel
        subtotalCents={subtotalCents}
        depositCents={depositCents}
        depositPercent={depositPercent}
        itemCount={lineItems.length}
        canGenerate={canGenerate}
        submitting={submitting}
        error={error}
        onGenerate={generateQuote}
      />
    </div>
  );
}
