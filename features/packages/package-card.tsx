"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { MoreVertical, Star } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { PackageWithItems } from "@/services/packages";
import {
  deletePackageAction,
  duplicatePackageAction,
  toggleFavoritePackageAction,
} from "@/actions/packages";
import { packageTotalCents } from "@/utils/package-math";
import { formatCurrency, formatShortDate } from "@/utils/format";
import { DEFAULT_CURRENCY } from "@/lib/currency";

export function PackageCard({
  pkg,
  currency = DEFAULT_CURRENCY,
}: {
  pkg: PackageWithItems;
  currency?: string;
}) {
  const [favorite, setFavorite] = useState(pkg.isFavorite);
  const [busy, setBusy] = useState(false);

  async function handleFavoriteToggle() {
    setFavorite((prev) => !prev);
    const result = await toggleFavoritePackageAction(pkg.id, !favorite);
    if (result && "error" in result) {
      setFavorite((prev) => !prev);
      toast.error(result.error);
    }
  }

  async function handleDuplicate() {
    setBusy(true);
    const result = await duplicatePackageAction(pkg.id);
    setBusy(false);
    if (result && "error" in result) {
      toast.error(result.error);
      return;
    }
    toast.success("Package duplicated.");
  }

  async function handleDelete() {
    if (!confirm(`Delete "${pkg.name}"? This can't be undone.`)) return;
    setBusy(true);
    const result = await deletePackageAction(pkg.id);
    setBusy(false);
    if (result && "error" in result) {
      toast.error(result.error);
    }
  }

  return (
    <div className="flex flex-col gap-2.5 rounded-2xl border border-border bg-card p-5">
      <div className="relative">
        {pkg.coverImageUrl ? (
          <div className="h-24 w-full overflow-hidden rounded-xl">
            <Image
              src={pkg.coverImageUrl}
              alt={pkg.name}
              width={320}
              height={96}
              className="size-full object-cover"
            />
          </div>
        ) : (
          <div
            className="flex h-24 w-full items-center justify-center rounded-xl font-mono text-[11px] text-accent-foreground"
            style={{
              backgroundImage:
                "repeating-linear-gradient(135deg, oklch(95% 0.035 152) 0px, oklch(95% 0.035 152) 10px, oklch(92% 0.045 152) 10px, oklch(92% 0.045 152) 20px)",
            }}
          >
            {pkg.category || "package"}
          </div>
        )}
        <button
          type="button"
          onClick={handleFavoriteToggle}
          aria-label={favorite ? "Unfavorite package" : "Favorite package"}
          aria-pressed={favorite}
          className="absolute right-2 top-2 flex size-7 items-center justify-center rounded-full bg-card/90 shadow-sm"
        >
          <Star
            className="size-4"
            strokeWidth={2}
            fill={favorite ? "currentColor" : "none"}
            color={favorite ? "var(--warning-foreground)" : "currentColor"}
          />
        </button>
        {!pkg.isActive ? (
          <span className="absolute left-2 top-2 rounded-full bg-muted px-2 py-0.5 text-[11px] font-semibold text-muted-foreground">
            Inactive
          </span>
        ) : null}
      </div>

      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="truncate text-[15px] font-bold leading-tight">{pkg.name}</div>
          {pkg.category ? (
            <div className="text-[12.5px] text-muted-foreground">{pkg.category}</div>
          ) : null}
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <button
                type="button"
                aria-label="Package actions"
                className="flex size-7 shrink-0 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted"
                disabled={busy}
              />
            }
          >
            <MoreVertical className="size-4" strokeWidth={2} />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem render={<Link href={`/packages/${pkg.id}`} />}>
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleDuplicate}>Duplicate</DropdownMenuItem>
            <DropdownMenuItem variant="destructive" onClick={handleDelete}>
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex items-center justify-between border-t border-border pt-2.5 text-[13px] text-muted-foreground">
        <span>
          {pkg.items.length} {pkg.items.length === 1 ? "product" : "products"}
        </span>
        <span className="font-heading text-[15px] font-extrabold text-foreground">
          {formatCurrency(packageTotalCents(pkg), currency)}
        </span>
      </div>
      <div className="text-[12px] text-muted-foreground">
        Updated {formatShortDate(pkg.updatedAt)}
      </div>
    </div>
  );
}
