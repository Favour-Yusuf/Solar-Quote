"use client";

import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FieldError } from "@/components/field-error";
import { formatCurrency } from "@/utils/format";
import { DEFAULT_CURRENCY } from "@/lib/currency";

export function PackageSummaryPanel({
  subtotalCents,
  itemCount,
  canSave,
  submitting,
  error,
  onSave,
  isEditing,
  currency = DEFAULT_CURRENCY,
}: {
  subtotalCents: number;
  itemCount: number;
  canSave: boolean;
  submitting: boolean;
  error: string | null;
  onSave: () => void;
  isEditing: boolean;
  currency?: string;
}) {
  return (
    <div className="h-fit rounded-[20px] bg-foreground p-[26px] text-background min-[901px]:sticky min-[901px]:top-8">
      <h2 className="mb-4.5 font-heading text-[15px] font-bold opacity-85">Summary</h2>
      <div className="mb-4 flex justify-between text-sm opacity-75">
        <span>Items</span>
        <span>{itemCount}</span>
      </div>
      <div className="mb-4 h-px bg-background/10" />
      <div className="mb-5.5 flex justify-between font-heading text-[26px] font-extrabold">
        <span>Estimated Value</span>
        <span>{formatCurrency(subtotalCents, currency)}</span>
      </div>

      <FieldError message={error ?? undefined} />

      <Button
        onClick={onSave}
        disabled={!canSave}
        className="h-[52px] w-full gap-2 rounded-[13px] bg-[oklch(60%_0.15_145)] text-[15.5px] font-bold text-white hover:bg-[oklch(55%_0.15_145)] disabled:opacity-50"
      >
        <Check className="size-4" strokeWidth={2.4} />
        {submitting ? "Saving…" : isEditing ? "Save Changes" : "Save Package"}
      </Button>
      <p className="mt-3 text-center text-xs opacity-55">
        Fill in a name and at least one product to continue
      </p>
    </div>
  );
}
