"use client";

import { Star } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { PackageWithItems } from "@/services/packages";
import { packageTotalCents } from "@/utils/package-math";
import { formatCurrency } from "@/utils/format";
import { DEFAULT_CURRENCY } from "@/lib/currency";

export function PackagePicker({
  search,
  onSearchChange,
  results,
  onSelect,
  currency = DEFAULT_CURRENCY,
}: {
  search: string;
  onSearchChange: (v: string) => void;
  results: PackageWithItems[];
  onSelect: (pkg: PackageWithItems) => void;
  currency?: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-[22px]">
      <Input
        placeholder="Search saved packages…"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        className="mb-2.5 h-11 rounded-[11px] px-3.5 text-[14.5px]"
      />
      {results.length === 0 ? (
        <p className="px-1 py-3 text-[13px] text-muted-foreground">
          No saved packages yet — create one from the Packages section.
        </p>
      ) : (
        <div className="flex max-h-[280px] flex-col gap-0.5 overflow-auto">
          {results.map((pkg) => (
            <button
              type="button"
              key={pkg.id}
              onClick={() => onSelect(pkg)}
              className="flex items-center gap-3 rounded-[10px] px-3 py-2.5 text-left hover:bg-muted"
            >
              <div className="flex-1">
                <div className="flex items-center gap-1.5 text-sm font-semibold">
                  {pkg.isFavorite ? (
                    <Star className="size-3.5 fill-warning-foreground text-warning-foreground" strokeWidth={0} />
                  ) : null}
                  {pkg.name}
                </div>
                <div className="text-[12.5px] text-muted-foreground">
                  {pkg.items.length} {pkg.items.length === 1 ? "item" : "items"} ·{" "}
                  {formatCurrency(packageTotalCents(pkg), currency)}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
