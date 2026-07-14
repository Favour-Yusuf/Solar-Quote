import { prisma } from "@/lib/prisma";

export function getCompanyByOwnerId(ownerId: string) {
  return prisma.company.findUnique({ where: { ownerId } });
}

export function createCompany(input: { ownerId: string; name: string }) {
  return prisma.company.create({
    data: { ownerId: input.ownerId, name: input.name },
  });
}

export async function completeOnboarding(
  ownerId: string,
  input: {
    companyName: string;
    phone?: string;
    email?: string;
    address?: string;
    logoUrl?: string;
    bankName?: string;
    accountName?: string;
    accountNumber?: string;
    products: { name: string; unit: string; priceCents: number }[];
  }
) {
  const company = await prisma.company.update({
    where: { ownerId },
    data: {
      name: input.companyName,
      phone: input.phone || null,
      email: input.email || null,
      address: input.address || null,
      logoUrl: input.logoUrl || null,
      bankName: input.bankName || null,
      accountName: input.accountName || null,
      accountNumber: input.accountNumber || null,
      onboardedAt: new Date(),
    },
  });

  if (input.products.length > 0) {
    await prisma.product.createMany({
      data: input.products.map((p) => ({
        companyId: company.id,
        name: p.name,
        unit: p.unit,
        priceCents: p.priceCents,
      })),
    });
  }

  return company;
}
