import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { requireOnboardedCompany } from "@/lib/session";
import { getCustomers } from "@/services/customers";
import { getProducts } from "@/services/products";
import { getActivePackagesForPicker } from "@/services/packages";
import { QuoteBuilder } from "@/features/quotes/quote-builder";

export const metadata: Metadata = { title: "New Quote" };

export default async function NewQuotePage({
  searchParams,
}: {
  searchParams: Promise<{ customerId?: string }>;
}) {
  const { company } = await requireOnboardedCompany();
  const { customerId } = await searchParams;
  const [customers, products, packages] = await Promise.all([
    getCustomers(company.id),
    getProducts(company.id),
    getActivePackagesForPicker(company.id),
  ]);

  return (
    <div className="animate-sq-fade-up">
      <PageHeader
        title="New Quote"
        description="Fill in the details on the left — your totals update instantly on the right."
      />
      <QuoteBuilder
        customers={customers}
        products={products}
        packages={packages}
        initialCustomerId={customerId}
        defaultCurrency={company.defaultCurrency}
        defaultValidityDays={company.defaultValidityDays}
      />
    </div>
  );
}
