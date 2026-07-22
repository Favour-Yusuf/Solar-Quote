import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

export type PackageWithItems = Prisma.PackageGetPayload<{ include: { items: true } }>;

const PICKER_ORDER_BY = [
  { isFavorite: "desc" as const },
  { lastUsedAt: { sort: "desc" as const, nulls: "last" as const } },
  { name: "asc" as const },
];

export function getPackages(companyId: string) {
  return prisma.package.findMany({
    where: { companyId },
    include: { items: true },
    orderBy: PICKER_ORDER_BY,
  });
}

export function getActivePackagesForPicker(companyId: string) {
  return prisma.package.findMany({
    where: { companyId, isActive: true },
    include: { items: true },
    orderBy: PICKER_ORDER_BY,
  });
}

export function getPackageById(id: string, companyId: string) {
  return prisma.package.findFirst({
    where: { id, companyId },
    include: { items: true },
  });
}

type PackageItemInput = {
  productId: string;
  qty: number;
  customPriceCents?: number;
};

async function snapshotItems(
  tx: Prisma.TransactionClient,
  companyId: string,
  items: PackageItemInput[]
) {
  const products = await tx.product.findMany({
    where: { companyId, id: { in: items.map((item) => item.productId) } },
  });
  const productById = new Map(products.map((p) => [p.id, p]));

  return items.flatMap((item) => {
    const product = productById.get(item.productId);
    if (!product) return [];
    return [
      {
        productId: product.id,
        name: product.name,
        unit: product.unit,
        priceCents: product.priceCents,
        customPriceCents: item.customPriceCents ?? null,
        qty: item.qty,
      },
    ];
  });
}

export async function createPackage(
  companyId: string,
  input: {
    name: string;
    description?: string;
    category?: string;
    coverImageUrl?: string;
    depositPercent: number;
    isActive: boolean;
    items: PackageItemInput[];
  }
) {
  return prisma.$transaction(async (tx) => {
    const items = await snapshotItems(tx, companyId, input.items);
    return tx.package.create({
      data: {
        companyId,
        name: input.name,
        description: input.description || null,
        category: input.category || null,
        coverImageUrl: input.coverImageUrl || null,
        depositPercent: input.depositPercent,
        isActive: input.isActive,
        items: { create: items },
      },
      include: { items: true },
    });
  });
}

export async function updatePackage(
  id: string,
  companyId: string,
  input: {
    name: string;
    description?: string;
    category?: string;
    coverImageUrl?: string;
    depositPercent: number;
    isActive: boolean;
    items: PackageItemInput[];
  }
) {
  return prisma.$transaction(async (tx) => {
    const items = await snapshotItems(tx, companyId, input.items);
    // Only replace product-backed rows — the builder UI only edits those.
    // Rows whose product was since deleted (productId null) are archived
    // snapshots and must survive an edit untouched, not be silently dropped.
    await tx.packageItem.deleteMany({ where: { packageId: id, productId: { not: null } } });
    return tx.package.update({
      where: { id },
      data: {
        name: input.name,
        description: input.description || null,
        category: input.category || null,
        coverImageUrl: input.coverImageUrl || null,
        depositPercent: input.depositPercent,
        isActive: input.isActive,
        items: { create: items },
      },
      include: { items: true },
    });
  });
}

export async function deletePackage(id: string, companyId: string) {
  const { count } = await prisma.package.deleteMany({ where: { id, companyId } });
  return count > 0;
}

export async function duplicatePackage(id: string, companyId: string) {
  const original = await getPackageById(id, companyId);
  if (!original) return null;

  return prisma.package.create({
    data: {
      companyId,
      name: `${original.name} (Copy)`,
      description: original.description,
      category: original.category,
      coverImageUrl: original.coverImageUrl,
      depositPercent: original.depositPercent,
      isActive: original.isActive,
      items: {
        create: original.items.map((item) => ({
          productId: item.productId,
          name: item.name,
          unit: item.unit,
          priceCents: item.priceCents,
          customPriceCents: item.customPriceCents,
          qty: item.qty,
        })),
      },
    },
    include: { items: true },
  });
}

export async function toggleFavorite(id: string, companyId: string, isFavorite: boolean) {
  const { count } = await prisma.package.updateMany({
    where: { id, companyId },
    data: { isFavorite },
  });
  return count > 0;
}

export async function touchLastUsed(id: string, companyId: string) {
  const { count } = await prisma.package.updateMany({
    where: { id, companyId },
    data: { lastUsedAt: new Date() },
  });
  return count > 0;
}
