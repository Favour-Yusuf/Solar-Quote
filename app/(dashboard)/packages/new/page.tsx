import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { requireOnboardedCompany } from "@/lib/session";
import { getProducts } from "@/services/products";
import { PackageBuilder } from "@/features/packages/package-builder";

export const metadata: Metadata = { title: "New Package — SolarQuote" };

export default async function NewPackagePage() {
  const { user, company } = await requireOnboardedCompany();
  const products = await getProducts(company.id);

  return (
    <div className="animate-sq-fade-up">
      <PageHeader
        title="New Package"
        description="Bundle products you sell together so quotes go out in one click."
      />
      <PackageBuilder products={products} userId={user.id} currency={company.defaultCurrency} />
    </div>
  );
}
