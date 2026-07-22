"use client";

import { useMemo, useState } from "react";
import type { Customer, Product } from "@prisma/client";
import { createQuoteAction } from "@/actions/quotes";
import { markPackageUsedAction } from "@/actions/packages";
import type { PackageWithItems } from "@/services/packages";
import { AddCustomerModal } from "@/features/customers/add-customer-modal";
import { CustomerPicker } from "@/features/quotes/customer-picker";
import { PackagePicker } from "@/features/quotes/package-picker";
import { ProductLinePicker, type LineItem } from "@/components/product-line-picker";
import {
  QuoteBuilderExtras,
  QuoteSummaryPanel,
} from "@/features/quotes/quote-summary-panel";
import { effectivePriceCents } from "@/utils/package-math";

export function QuoteBuilder({
  customers,
  products,
  packages,
  initialCustomerId,
  defaultCurrency,
  defaultValidityDays,
}: {
  customers: Customer[];
  products: Product[];
  packages: PackageWithItems[];
  initialCustomerId?: string;
  defaultCurrency: string;
  defaultValidityDays: number;
}) {
  const [customerList, setCustomerList] = useState(customers);
  const [customerId, setCustomerId] = useState<string | null>(
    initialCustomerId && customers.some((c) => c.id === initialCustomerId)
      ? initialCustomerId
      : null
  );
  const [customerSearch, setCustomerSearch] = useState("");
  const [showAddCustomer, setShowAddCustomer] = useState(false);
  const [mode, setMode] = useState<"products" | "package">("products");
  const [productSearch, setProductSearch] = useState("");
  const [packageSearch, setPackageSearch] = useState("");
  const [lineItems, setLineItems] = useState<LineItem[]>([]);
  const [sourcePackageId, setSourcePackageId] = useState<string | undefined>();
  const [depositPercent, setDepositPercent] = useState(50);
  const [currency, setCurrency] = useState(defaultCurrency);
  // "7" | "14" | … (a preset day count) or "custom" when using a picked date.
  const [validityMode, setValidityMode] = useState(String(defaultValidityDays));
  const [customValidUntil, setCustomValidUntil] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validUntil = useMemo(() => {
    if (validityMode === "custom") {
      if (!customValidUntil) return null;
      const parsed = new Date(customValidUntil);
      return Number.isNaN(parsed.getTime()) ? null : parsed;
    }
    const days = Number(validityMode);
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() + days);
    return date;
  }, [validityMode, customValidUntil]);

  const selectedCustomer = customerList.find((c) => c.id === customerId) ?? null;

  const customerResults = useMemo(() => {
    const query = customerSearch.trim().toLowerCase();
    const pool = query
      ? customerList.filter(
          (c) =>
            c.name.toLowerCase().includes(query) ||
            c.businessName?.toLowerCase().includes(query)
        )
      : customerList;
    return pool.slice(0, 5);
  }, [customerList, customerSearch]);

  function handleCustomerCreated(customer: Customer) {
    setCustomerList((prev) => [customer, ...prev]);
    setCustomerId(customer.id);
    setCustomerSearch("");
  }

  const productResults = useMemo(() => {
    const query = productSearch.trim().toLowerCase();
    const pool = query
      ? products.filter((p) => p.name.toLowerCase().includes(query))
      : products;
    return pool.slice(0, 5);
  }, [products, productSearch]);

  const packageResults = useMemo(() => {
    const query = packageSearch.trim().toLowerCase();
    return query
      ? packages.filter((p) => p.name.toLowerCase().includes(query))
      : packages;
  }, [packages, packageSearch]);

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

  function applyPackage(pkg: PackageWithItems) {
    setLineItems((prev) => {
      const next = [...prev];
      for (const item of pkg.items) {
        if (!item.productId) continue;
        const existing = next.find((li) => li.productId === item.productId);
        if (existing) {
          existing.qty += item.qty;
        } else {
          next.push({
            productId: item.productId,
            name: item.name,
            unit: item.unit,
            priceCents: effectivePriceCents(item),
            qty: item.qty,
          });
        }
      }
      return next;
    });
    setDepositPercent(pkg.depositPercent);
    setSourcePackageId(pkg.id);
    setMode("products");
    void markPackageUsedAction(pkg.id);
  }

  function updateQty(productId: string, qty: number) {
    setLineItems((prev) => {
      if (qty <= 0) return prev.filter((li) => li.productId !== productId);
      return prev.map((li) => (li.productId === productId ? { ...li, qty } : li));
    });
  }

  function updatePrice(productId: string, priceCents: number) {
    setLineItems((prev) =>
      prev.map((li) => (li.productId === productId ? { ...li, priceCents } : li))
    );
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
      currency,
      validUntil: validUntil ?? undefined,
      notes,
      sourcePackageId,
      items: lineItems.map((li) => ({
        productId: li.productId,
        qty: li.qty,
        priceCentsOverride: li.priceCents,
      })),
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
          onAddNew={() => setShowAddCustomer(true)}
        />
        <AddCustomerModal
          open={showAddCustomer}
          onOpenChange={setShowAddCustomer}
          defaultName={customerSearch}
          onCreated={handleCustomerCreated}
        />

        <div className="rounded-2xl border border-border bg-card p-[22px]">
          <h2 className="mb-3.5 font-heading text-[15px] font-bold">2. Products</h2>
          <div className="flex gap-2 rounded-xl bg-muted p-1">
            <button
              type="button"
              onClick={() => setMode("products")}
              className={`flex-1 rounded-lg py-2 text-[13.5px] font-semibold transition-colors ${
                mode === "products" ? "bg-card shadow-sm" : "text-muted-foreground"
              }`}
            >
              Add Individual Products
            </button>
            <button
              type="button"
              onClick={() => setMode("package")}
              className={`flex-1 rounded-lg py-2 text-[13.5px] font-semibold transition-colors ${
                mode === "package" ? "bg-card shadow-sm" : "text-muted-foreground"
              }`}
            >
              Use Saved Package
            </button>
          </div>
        </div>

        {mode === "package" ? (
          <PackagePicker
            search={packageSearch}
            onSearchChange={setPackageSearch}
            results={packageResults}
            onSelect={applyPackage}
            currency={currency}
          />
        ) : null}

        <ProductLinePicker
          search={productSearch}
          onSearchChange={setProductSearch}
          results={productResults}
          onAdd={addProduct}
          lineItems={lineItems}
          onQtyChange={updateQty}
          onPriceChange={updatePrice}
          onRemove={removeItem}
          currency={currency}
        />
        <QuoteBuilderExtras
          currency={currency}
          onCurrencyChange={setCurrency}
          validityMode={validityMode}
          onValidityModeChange={setValidityMode}
          customValidUntil={customValidUntil}
          onCustomValidUntilChange={setCustomValidUntil}
          validUntil={validUntil}
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
        currency={currency}
        itemCount={lineItems.length}
        canGenerate={canGenerate}
        submitting={submitting}
        error={error}
        onGenerate={generateQuote}
      />
    </div>
  );
}
