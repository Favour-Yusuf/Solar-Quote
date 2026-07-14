import { prisma } from "@/lib/prisma";

export function getProducts(companyId: string) {
  return prisma.product.findMany({
    where: { companyId },
    orderBy: { name: "asc" },
  });
}

export function createProduct(input: {
  companyId: string;
  name: string;
  unit: string;
  priceCents: number;
}) {
  return prisma.product.create({ data: input });
}

export async function updateProduct(
  id: string,
  companyId: string,
  input: { name: string; unit: string; priceCents: number }
) {
  const { count } = await prisma.product.updateMany({
    where: { id, companyId },
    data: input,
  });
  return count > 0;
}
