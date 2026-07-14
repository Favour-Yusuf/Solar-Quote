import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { requireOnboardedCompany } from "@/lib/session";
import { getProducts } from "@/services/products";
import { ProductsGrid } from "@/features/products/products-grid";
import { ProductModal } from "@/features/products/product-modal";

export const metadata: Metadata = { title: "Products — SolarQuote" };

export default async function ProductsPage() {
  const { company } = await requireOnboardedCompany();
  const products = await getProducts(company.id);

  return (
    <div className="animate-sq-fade-up">
      <PageHeader title="Product Catalogue" action={<ProductModal />} />
      <ProductsGrid products={products} />
    </div>
  );
}
