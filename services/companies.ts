import { prisma } from "@/lib/prisma";

export function getCompanyByOwnerId(ownerId: string) {
  return prisma.company.findUnique({ where: { ownerId } });
}

export function createCompany(input: { ownerId: string; name: string }) {
  return prisma.company.create({
    data: { ownerId: input.ownerId, name: input.name },
  });
}
