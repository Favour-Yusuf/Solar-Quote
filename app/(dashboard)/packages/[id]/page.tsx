import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { requireOnboardedCompany } from "@/lib/session";
import { getPackageById } from "@/services/packages";
import { getProducts } from "@/services/products";
import { PackageBuilder } from "@/features/packages/package-builder";

export const metadata: Metadata = { title: "Edit Package — SolarQuote" };

export default async function EditPackagePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { user, company } = await requireOnboardedCompany();
  const [pkg, products] = await Promise.all([
    getPackageById(id, company.id),
    getProducts(company.id),
  ]);

  if (!pkg) {
    notFound();
  }

  return (
    <div className="animate-sq-fade-up">
      <PageHeader title="Edit Package" description={pkg.name} />
      <PackageBuilder
        products={products}
        userId={user.id}
        existingPackage={pkg}
        currency={company.defaultCurrency}
      />
    </div>
  );
}
