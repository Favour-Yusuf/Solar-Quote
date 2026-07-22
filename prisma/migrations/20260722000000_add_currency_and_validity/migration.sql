-- AlterTable
ALTER TABLE "companies" ADD COLUMN "defaultCurrency" TEXT NOT NULL DEFAULT 'NGN';
ALTER TABLE "companies" ADD COLUMN "defaultValidityDays" INTEGER NOT NULL DEFAULT 30;

-- AlterTable
ALTER TABLE "quotes" ADD COLUMN "currency" TEXT NOT NULL DEFAULT 'NGN';
ALTER TABLE "quotes" ADD COLUMN "validUntil" TIMESTAMP(3);
