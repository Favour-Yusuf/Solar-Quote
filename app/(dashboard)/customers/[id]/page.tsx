import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireOnboardedCompany } from "@/lib/session";
import { getCustomerById, getCustomerQuotes } from "@/services/customers";
import { CustomerDetail } from "@/features/customers/customer-detail";

export const metadata: Metadata = { title: "Customer — SolarQuote" };

export default async function CustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { company } = await requireOnboardedCompany();

  const customer = await getCustomerById(id, company.id);
  if (!customer) {
    notFound();
  }

  const quotes = await getCustomerQuotes(customer.id, company.id);

  return <CustomerDetail customer={customer} quotes={quotes} />;
}
