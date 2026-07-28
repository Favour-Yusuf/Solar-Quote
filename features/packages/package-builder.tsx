"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import type { Product } from "@prisma/client";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { LogoUploader } from "@/components/logo-uploader";
import { ProductLinePicker, type LineItem } from "@/components/product-line-picker";
import { useLogoUpload } from "@/lib/hooks/use-logo-upload";
import { createPackageAction, updatePackageAction } from "@/actions/packages";
import type { PackageWithItems } from "@/services/packages";
import { PackageSummaryPanel } from "@/features/packages/package-summary-panel";

export function PackageBuilder({
  products,
  userId,
  existingPackage,
  currency,
}: {
  products: Product[];
  userId: string;
  existingPackage?: PackageWithItems;
  currency: string;
}) {
  const [name, setName] = useState(existingPackage?.name ?? "");
  const [description, setDescription] = useState(existingPackage?.description ?? "");
  const [category, setCategory] = useState(existingPackage?.category ?? "");
  const [coverImageUrl, setCoverImageUrl] = useState<string | undefined>(
    existingPackage?.coverImageUrl ?? undefined
  );
  const { upload, uploading } = useLogoUpload(userId, "package-cover");
  const [depositPercent, setDepositPercent] = useState(existingPackage?.depositPercent ?? 50);
  const [isActive, setIsActive] = useState(existingPackage?.isActive ?? true);
  const [productSearch, setProductSearch] = useState("");
  const [lineItems, setLineItems] = useState<LineItem[]>(
    existingPackage?.items
      .filter((item) => item.productId)
      .map((item) => ({
        productId: item.productId as string,
        name: item.name,
        unit: item.unit,
        priceCents: item.customPriceCents ?? item.priceCents,
        qty: item.qty,
      })) ?? []
  );
  const archivedCount =
    existingPackage?.items.filter((item) => !item.productId).length ?? 0;
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const productResults = useMemo(() => {
    const query = productSearch.trim().toLowerCase();
    const pool = query
      ? products.filter((p) => p.name.toLowerCase().includes(query))
      : products;
    return pool.slice(0, 5);
  }, [products, productSearch]);

  async function handleCoverSelect(file: File) {
    const result = await upload(file, coverImageUrl);
    if ("error" in result) {
      toast.error(result.error);
      return;
    }
    setCoverImageUrl(result.url);
    toast.success("Cover image updated.");
  }

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

  function updatePrice(productId: string, priceCents: number) {
    setLineItems((prev) =>
      prev.map((li) => (li.productId === productId ? { ...li, priceCents } : li))
    );
  }

  function removeItem(productId: string) {
    setLineItems((prev) => prev.filter((li) => li.productId !== productId));
  }

  const subtotalCents = lineItems.reduce((sum, li) => sum + li.priceCents * li.qty, 0);
  const canSave = name.trim().length > 0 && lineItems.length > 0 && !submitting;

  async function handleSave() {
    if (!canSave) return;
    setSubmitting(true);
    setError(null);
    const payload = {
      name,
      description,
      category,
      coverImageUrl,
      depositPercent,
      isActive,
      items: lineItems.map((li) => ({
        productId: li.productId,
        qty: li.qty,
        customPriceCents: li.priceCents,
      })),
    };
    const result = existingPackage
      ? await updatePackageAction(existingPackage.id, payload)
      : await createPackageAction(payload);
    if (result && "error" in result) {
      setError(result.error);
      setSubmitting(false);
    }
  }

  return (
    <div className="grid grid-cols-1 items-start gap-5 min-[901px]:grid-cols-[1fr_360px]">
      <div className="flex flex-col gap-4">
        <div className="rounded-2xl border border-border bg-card p-[22px]">
          <h2 className="mb-3.5 font-heading text-[15px] font-bold">1. Package Details</h2>
          <div className="mb-4">
            <LogoUploader
              logoUrl={coverImageUrl}
              uploading={uploading}
              onSelect={handleCoverSelect}
              onRemove={() => setCoverImageUrl(undefined)}
              ariaLabel="Upload cover image"
              alt="Package cover"
              placeholder="cover"
              hint="Cover image (optional) — PNG or JPG, up to 2MB."
            />
          </div>
          <div className="flex flex-col gap-3">
            <Input
              placeholder="Package name (e.g. 5kVA Home Package)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-11 rounded-[11px] px-3.5 text-[14.5px]"
            />
            <Textarea
              placeholder="Description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-16 rounded-[11px] px-3.5 py-3 text-sm"
            />
            <Input
              placeholder="Category (optional, e.g. Residential)"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="h-11 rounded-[11px] px-3.5 text-[14.5px]"
            />
          </div>
          <div className="mt-4 flex items-center justify-between rounded-xl bg-muted px-3.5 py-3">
            <span className="text-[13.5px] font-semibold">Active</span>
            <button
              type="button"
              role="switch"
              aria-checked={isActive}
              onClick={() => setIsActive((prev) => !prev)}
              className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
                isActive ? "bg-primary" : "bg-border"
              }`}
            >
              <span
                className={`absolute top-0.5 size-5 rounded-full bg-white shadow transition-transform ${
                  isActive ? "translate-x-5" : "translate-x-0.5"
                }`}
              />
            </button>
          </div>
        </div>

        <ProductLinePicker
          title="2. Products"
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
        {archivedCount > 0 ? (
          <p className="-mt-2 px-1 text-[12.5px] text-muted-foreground">
            {archivedCount} archived {archivedCount === 1 ? "item" : "items"} from deleted
            products are preserved but not shown here.
          </p>
        ) : null}

        <div className="rounded-2xl border border-border bg-card p-[22px]">
          <h2 className="mb-4 font-heading text-[15px] font-bold">3. Default Deposit</h2>
          <div className="mb-1.5 flex items-center gap-4">
            <Slider
              value={[depositPercent]}
              onValueChange={(v) => setDepositPercent(Array.isArray(v) ? v[0] : v)}
              min={0}
              max={100}
              step={5}
              className="flex-1"
            />
            <div className="w-16 text-right font-heading text-xl font-extrabold text-primary">
              {depositPercent}%
            </div>
          </div>
        </div>
      </div>

      <PackageSummaryPanel
        subtotalCents={subtotalCents}
        itemCount={lineItems.length}
        canSave={canSave}
        submitting={submitting}
        error={error}
        onSave={handleSave}
        isEditing={!!existingPackage}
        currency={currency}
      />
    </div>
  );
}
