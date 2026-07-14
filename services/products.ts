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
