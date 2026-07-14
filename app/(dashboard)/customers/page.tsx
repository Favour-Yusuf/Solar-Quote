import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { requireOnboardedCompany } from "@/lib/session";
import { getCustomersWithQuoteCounts } from "@/services/customers";
import { CustomersGrid } from "@/features/customers/customers-grid";
import { AddCustomerModal } from "@/features/customers/add-customer-modal";

export const metadata: Metadata = { title: "Customers — SolarQuote" };

export default async function CustomersPage() {
  const { company } = await requireOnboardedCompany();
  const customers = await getCustomersWithQuoteCounts(company.id);

  return (
    <div className="animate-sq-fade-up">
      <PageHeader title="Customers" action={<AddCustomerModal />} />
      <CustomersGrid customers={customers} />
    </div>
  );
}
