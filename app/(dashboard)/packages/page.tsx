import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/page-header";
import { requireOnboardedCompany } from "@/lib/session";
import { getPackages } from "@/services/packages";
import { PackagesGrid } from "@/features/packages/packages-grid";

export const metadata: Metadata = { title: "Packages" };

export default async function PackagesPage() {
  const { company } = await requireOnboardedCompany();
  const packages = await getPackages(company.id);

  return (
    <div className="animate-sq-fade-up">
      <PageHeader
        title="Packages"
        description="Reusable bundles you can drop into any quote in one click."
        action={
          <Button
            render={<Link href="/packages/new" />}
            className="h-auto gap-2 rounded-xl px-4 py-2.5 font-heading text-sm font-bold"
          >
            <Plus className="size-[15px]" strokeWidth={2.4} />
            New Package
          </Button>
        }
      />
      <PackagesGrid packages={packages} currency={company.defaultCurrency} />
    </div>
  );
}
