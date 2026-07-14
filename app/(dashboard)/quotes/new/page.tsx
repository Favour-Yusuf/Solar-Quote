import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { requireOnboardedCompany } from "@/lib/session";
import { getCustomers } from "@/services/customers";
import { getProducts } from "@/services/products";
import { QuoteBuilder } from "@/features/quotes/quote-builder";

export const metadata: Metadata = { title: "New Quote — SolarQuote" };

export default async function NewQuotePage() {
  const { company } = await requireOnboardedCompany();
  const [customers, products] = await Promise.all([
    getCustomers(company.id),
    getProducts(company.id),
  ]);

  return (
    <div className="animate-sq-fade-up">
      <PageHeader
        title="New Quote"
        description="Fill in the details on the left — your totals update instantly on the right."
      />
      <QuoteBuilder customers={customers} products={products} />
    </div>
  );
}
