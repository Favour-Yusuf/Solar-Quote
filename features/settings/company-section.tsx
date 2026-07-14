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
import { updateCompanyAction } from "@/actions/settings";
import { companySettingsSchema, type CompanySettingsInput } from "@/lib/validations/settings";

const DEFAULT_BRAND_COLOR = "#1c8a4c";

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
    },
  });
  const brandColor = watch("brandColor");

  async function handleLogoSelect(file: File) {
    const url = await upload(file);
    if (url) setLogoUrl(url);
    else toast.error("Couldn't upload that logo. Try a different file.");
  }

  async function onSubmit(data: CompanySettingsInput) {
    const result = await updateCompanyAction({ ...data, logoUrl });
    if (result && "error" in result) {
      toast.error(result.error);
      return;
    }
    toast.success("Company details saved.");
  }

  return (
    <section className="rounded-2xl border border-border bg-card p-[22px]">
      <h2 className="mb-1 font-heading text-[17px] font-bold">Company</h2>
      <p className="mb-5 text-[13.5px] text-muted-foreground">
        This appears on every quote you send to customers.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <LogoUploader logoUrl={logoUrl} uploading={uploading} onSelect={handleLogoSelect} />

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

        <div className="flex items-center gap-3">
          <Label htmlFor="brandColor" className="text-[13.5px] font-semibold">
            Brand colour
          </Label>
          <input
            id="brandColor"
            type="color"
            value={brandColor || DEFAULT_BRAND_COLOR}
            onChange={(e) => setValue("brandColor", e.target.value, { shouldDirty: true })}
            className="h-9 w-9 cursor-pointer rounded-lg border border-border bg-transparent p-0.5"
          />
          {brandColor ? (
            <button
              type="button"
              onClick={() => setValue("brandColor", "", { shouldDirty: true })}
              className="text-[12.5px] font-semibold text-muted-foreground underline"
            >
              Use default
            </button>
          ) : null}
          <FieldError message={errors.brandColor?.message} />
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
