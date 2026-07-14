"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LogoUploader } from "@/components/logo-uploader";
import { OnboardingCard } from "@/features/onboarding/onboarding-shell";

const DEFAULT_BRAND_COLOR = "#1c8a4c";

export function CompanyStep({
  companyName,
  onCompanyNameChange,
  phone,
  onPhoneChange,
  email,
  onEmailChange,
  website,
  onWebsiteChange,
  address,
  onAddressChange,
  logoUrl,
  logoUploading,
  onLogoSelect,
  brandColor,
  onBrandColorChange,
  onBack,
  onNext,
}: {
  companyName: string;
  onCompanyNameChange: (v: string) => void;
  phone: string;
  onPhoneChange: (v: string) => void;
  email: string;
  onEmailChange: (v: string) => void;
  website: string;
  onWebsiteChange: (v: string) => void;
  address: string;
  onAddressChange: (v: string) => void;
  logoUrl?: string;
  logoUploading: boolean;
  onLogoSelect: (file: File) => void;
  brandColor: string;
  onBrandColorChange: (v: string) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  return (
    <OnboardingCard>
      <h1 className="font-heading text-[21px] font-extrabold">
        Set up your company
      </h1>
      <p className="mt-2 mb-6 text-sm leading-relaxed text-muted-foreground">
        Your branding appears automatically on every quote you send.
      </p>

      <div className="mb-4">
        <LogoUploader logoUrl={logoUrl} uploading={logoUploading} onSelect={onLogoSelect} />
      </div>

      <div className="flex flex-col gap-3">
        <Input
          placeholder="Company name"
          value={companyName}
          onChange={(e) => onCompanyNameChange(e.target.value)}
          className="h-11 rounded-[11px] px-3.5 text-[14.5px]"
        />
        <Input
          placeholder="Phone number"
          value={phone}
          onChange={(e) => onPhoneChange(e.target.value)}
          className="h-11 rounded-[11px] px-3.5 text-[14.5px]"
        />
        <Input
          type="email"
          placeholder="Business email"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          className="h-11 rounded-[11px] px-3.5 text-[14.5px]"
        />
        <Input
          type="url"
          placeholder="Website (optional)"
          value={website}
          onChange={(e) => onWebsiteChange(e.target.value)}
          className="h-11 rounded-[11px] px-3.5 text-[14.5px]"
        />
        <Input
          placeholder="Business address"
          value={address}
          onChange={(e) => onAddressChange(e.target.value)}
          className="h-11 rounded-[11px] px-3.5 text-[14.5px]"
        />
      </div>

      <div className="mt-4 flex items-center gap-3">
        <label htmlFor="brandColor" className="text-[13.5px] font-semibold">
          Brand colour <span className="font-normal text-muted-foreground">(optional)</span>
        </label>
        <input
          id="brandColor"
          type="color"
          value={brandColor || DEFAULT_BRAND_COLOR}
          onChange={(e) => onBrandColorChange(e.target.value)}
          className="h-9 w-9 cursor-pointer rounded-lg border border-border bg-transparent p-0.5"
        />
        {brandColor ? (
          <button
            type="button"
            onClick={() => onBrandColorChange("")}
            className="text-[12.5px] font-semibold text-muted-foreground underline"
          >
            Use default
          </button>
        ) : null}
      </div>

      <div className="mt-6 flex gap-2.5">
        <Button
          variant="secondary"
          onClick={onBack}
          className="h-11 rounded-xl px-5 text-[14.5px] font-bold"
        >
          Back
        </Button>
        <Button
          onClick={onNext}
          disabled={!companyName.trim()}
          className="h-11 flex-1 rounded-xl text-[15px] font-bold"
        >
          Continue
        </Button>
      </div>
    </OnboardingCard>
  );
}
