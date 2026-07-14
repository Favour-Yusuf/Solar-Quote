import { prisma } from "@/lib/prisma";

export function getCustomers(companyId: string) {
  return prisma.customer.findMany({
    where: { companyId },
    orderBy: { name: "asc" },
  });
}

export function getCustomerById(id: string, companyId: string) {
  return prisma.customer.findFirst({ where: { id, companyId } });
}

export function createCustomer(input: {
  companyId: string;
  name: string;
  businessName?: string;
  email?: string;
  phone?: string;
  address?: string;
}) {
  return prisma.customer.create({ data: input });
}
