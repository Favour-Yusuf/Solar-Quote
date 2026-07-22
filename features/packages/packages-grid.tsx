import Link from "next/link";
import { Boxes, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/empty-state";
import type { PackageWithItems } from "@/services/packages";
import { DEFAULT_CURRENCY } from "@/lib/currency";
import { PackageCard } from "@/features/packages/package-card";

export function PackagesGrid({
  packages,
  currency = DEFAULT_CURRENCY,
}: {
  packages: PackageWithItems[];
  currency?: string;
}) {
  if (packages.length === 0) {
    return (
      <EmptyState
        icon={Boxes}
        title="No packages yet"
        description="Bundle your most-sold systems — like a 5kVA Home Package — so quotes go out in seconds."
        action={
          <Button
            render={<Link href="/packages/new" />}
            className="h-auto gap-2 rounded-xl px-4 py-2.5 font-heading text-sm font-bold"
          >
            <Plus className="size-[15px]" strokeWidth={2.4} />
            Create your first package
          </Button>
        }
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 min-[561px]:grid-cols-2 min-[901px]:grid-cols-3">
      {packages.map((pkg) => (
        <PackageCard key={pkg.id} pkg={pkg} currency={currency} />
      ))}
    </div>
  );
}
