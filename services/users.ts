import { prisma } from "@/lib/prisma";

export function upsertUser(input: { id: string; email: string; fullName: string }) {
  return prisma.user.upsert({
    where: { id: input.id },
    create: input,
    update: { email: input.email, fullName: input.fullName },
  });
}
