"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Company } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FieldError } from "@/components/field-error";
import { LogoUploader } from "@/components/logo-uploader";
import { useLogoUpload } from "@/lib/hooks/use-logo-upload";
import { updateCompanyAction, updateCompanyLogoAction } from "@/actions/settings";
import {
  companySettingsSchema,
  VALIDITY_DAY_OPTIONS,
  type CompanySettingsInput,
} from "@/lib/validations/settings";
import { CURRENCY_OPTIONS, DEFAULT_CURRENCY } from "@/lib/currency";
import { DEFAULT_BRAND_COLOR } from "@/lib/branding";

const selectClass =
  "h-11 w-full rounded-[11px] border border-input bg-transparent px-3.5 text-[14.5px] outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

export function CompanySection({ company, userId }: { company: Company; userId: string }) {
  const [logoUrl, setLogoUrl] = useState(company.logoUrl ?? undefined);
  const { upload, uploading } = useLogoUpload(userId);
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CompanySettingsInput>({
    resolver: zodResolver(companySettingsSchema),
    defaultValues: {
      name: company.name,
      phone: company.phone ?? "",
      email: company.email ?? "",
      website: company.website ?? "",
      address: company.address ?? "",
      brandColor: company.brandColor ?? "",
      bankName: company.bankName ?? "",
      accountName: company.accountName ?? "",
      accountNumber: company.accountNumber ?? "",
      defaultCurrency: company.defaultCurrency ?? DEFAULT_CURRENCY,
      defaultValidityDays: String(company.defaultValidityDays ?? 30),
    },
  });
  const brandColor = watch("brandColor");

  // The logo saves on its own the moment it uploads, so it survives a refresh
  // even if the installer never submits the rest of the form.
  async function persistLogo(url: string | null) {
    const result = await updateCompanyLogoAction(url);
    if (result && "error" in result) {
      toast.error(result.error);
      return false;
    }
    setLogoUrl(url ?? undefined);
    return true;
  }

  async function handleLogoSelect(file: File) {
    const result = await upload(file, logoUrl);
    if ("error" in result) {
      toast.error(result.error);
      return;
    }
    if (await persistLogo(result.url)) {
      toast.success("Logo updated.");
    }
  }

  async function handleLogoRemove() {
    if (await persistLogo(null)) {
      toast.success("Logo removed.");
    }
  }

  async function onSubmit(data: CompanySettingsInput) {
    const result = await updateCompanyAction({ ...data, logoUrl });
    if (result && "error" in result) {
      toast.error(result.error);
      return;
    }
    toast.success("Branding saved — it's live across your quotes.");
  }

  return (
    <section className="rounded-2xl border border-border bg-card p-[22px]">
      <h2 className="mb-1 font-heading text-[17px] font-bold">Company branding</h2>
      <p className="mb-5 text-[13.5px] text-muted-foreground">
        Your logo, colour and contact details appear on your dashboard and on every
        quote your customers see.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <LogoUploader
          logoUrl={logoUrl}
          uploading={uploading}
          onSelect={handleLogoSelect}
          onRemove={handleLogoRemove}
        />

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <Label htmlFor="name" className="mb-1.5 block text-[13px] font-semibold">
              Company name
            </Label>
            <Input id="name" className="h-11 rounded-[11px] px-3.5 text-[14.5px]" {...register("name")} />
            <FieldError message={errors.name?.message} />
          </div>
          <div>
            <Label htmlFor="phone" className="mb-1.5 block text-[13px] font-semibold">
              Phone
            </Label>
            <Input id="phone" className="h-11 rounded-[11px] px-3.5 text-[14.5px]" {...register("phone")} />
          </div>
          <div>
            <Label htmlFor="email" className="mb-1.5 block text-[13px] font-semibold">
              Business email
            </Label>
            <Input
              id="email"
              type="email"
              className="h-11 rounded-[11px] px-3.5 text-[14.5px]"
              {...register("email")}
            />
            <FieldError message={errors.email?.message} />
          </div>
          <div>
            <Label htmlFor="website" className="mb-1.5 block text-[13px] font-semibold">
              Website
            </Label>
            <Input
              id="website"
              type="url"
              className="h-11 rounded-[11px] px-3.5 text-[14.5px]"
              {...register("website")}
            />
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="address" className="mb-1.5 block text-[13px] font-semibold">
              Business address
            </Label>
            <Input
              id="address"
              className="h-11 rounded-[11px] px-3.5 text-[14.5px]"
              {...register("address")}
            />
          </div>
        </div>

        <div className="rounded-xl border border-border p-3.5">
          <Label htmlFor="brandColor" className="mb-1.5 block text-[13px] font-semibold">
            Primary brand colour
          </Label>
          <p className="mb-3 text-[12.5px] text-muted-foreground">
            Used for headings, buttons and accents across the app, your quotes and your
            PDFs. Leave it unset to use the default palette.
          </p>
          <div className="flex flex-wrap items-center gap-2.5">
            <input
              id="brandColor"
              type="color"
              aria-label="Pick your primary brand colour"
              value={brandColor || DEFAULT_BRAND_COLOR}
              onChange={(e) => setValue("brandColor", e.target.value, { shouldDirty: true })}
              className="h-10 w-12 cursor-pointer rounded-lg border border-border bg-transparent p-0.5"
            />
            <Input
              aria-label="Brand colour hex code"
              placeholder={DEFAULT_BRAND_COLOR}
              className="h-10 w-32 rounded-[11px] px-3 font-mono text-[13.5px] uppercase"
              {...register("brandColor")}
            />
            {brandColor ? (
              <button
                type="button"
                onClick={() => setValue("brandColor", "", { shouldDirty: true })}
                className="text-[12.5px] font-semibold text-muted-foreground underline"
              >
                Reset to default
              </button>
            ) : null}
          </div>
          <FieldError message={errors.brandColor?.message} />
        </div>

        <div className="border-t border-border pt-4">
          <h3 className="mb-3 text-[13.5px] font-bold">Quote defaults</h3>
          <p className="-mt-2 mb-3 text-[12.5px] text-muted-foreground">
            Pre-filled onto new quotes — you can still override them per quote.
          </p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <Label htmlFor="defaultCurrency" className="mb-1.5 block text-[13px] font-semibold">
                Default currency
              </Label>
              <select
                id="defaultCurrency"
                className={selectClass}
                {...register("defaultCurrency")}
              >
                {CURRENCY_OPTIONS.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.label} ({c.symbol})
                  </option>
                ))}
              </select>
              <FieldError message={errors.defaultCurrency?.message} />
            </div>
            <div>
              <Label htmlFor="defaultValidityDays" className="mb-1.5 block text-[13px] font-semibold">
                Default validity
              </Label>
              <select
                id="defaultValidityDays"
                className={selectClass}
                {...register("defaultValidityDays")}
              >
                {VALIDITY_DAY_OPTIONS.map((days) => (
                  <option key={days} value={days}>
                    {days} days
                  </option>
                ))}
              </select>
              <FieldError message={errors.defaultValidityDays?.message} />
            </div>
          </div>
        </div>

        <div className="border-t border-border pt-4">
          <h3 className="mb-3 text-[13.5px] font-bold">Payment details</h3>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div>
              <Label htmlFor="accountName" className="mb-1.5 block text-[13px] font-semibold">
                Account name
              </Label>
              <Input
                id="accountName"
                className="h-11 rounded-[11px] px-3.5 text-[14.5px]"
                {...register("accountName")}
              />
            </div>
            <div>
              <Label htmlFor="bankName" className="mb-1.5 block text-[13px] font-semibold">
                Bank
              </Label>
              <Input
                id="bankName"
                className="h-11 rounded-[11px] px-3.5 text-[14.5px]"
                {...register("bankName")}
              />
            </div>
            <div>
              <Label htmlFor="accountNumber" className="mb-1.5 block text-[13px] font-semibold">
                Account number
              </Label>
              <Input
                id="accountNumber"
                className="h-11 rounded-[11px] px-3.5 text-[14.5px]"
                {...register("accountNumber")}
              />
            </div>
          </div>
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="mt-1 h-11 w-fit rounded-xl px-6 text-[14.5px] font-bold"
        >
          {isSubmitting ? "Saving…" : "Save changes"}
        </Button>
      </form>
    </section>
  );
}
