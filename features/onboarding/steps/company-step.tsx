"use client";

import Image from "next/image";
import { useRef } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { OnboardingCard } from "@/features/onboarding/onboarding-shell";

export function CompanyStep({
  companyName,
  onCompanyNameChange,
  phone,
  onPhoneChange,
  email,
  onEmailChange,
  address,
  onAddressChange,
  logoUrl,
  logoUploading,
  onLogoSelect,
  onBack,
  onNext,
}: {
  companyName: string;
  onCompanyNameChange: (v: string) => void;
  phone: string;
  onPhoneChange: (v: string) => void;
  email: string;
  onEmailChange: (v: string) => void;
  address: string;
  onAddressChange: (v: string) => void;
  logoUrl?: string;
  logoUploading: boolean;
  onLogoSelect: (file: File) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <OnboardingCard>
      <h1 className="font-heading text-[21px] font-extrabold">
        Set up your company
      </h1>
      <p className="mt-2 mb-6 text-sm leading-relaxed text-muted-foreground">
        Your branding appears automatically on every quote you send.
      </p>

      <div className="mb-4 flex items-center gap-3.5">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl border-[1.5px] border-dashed border-border text-[10.5px] text-muted-foreground"
        >
          {logoUploading ? (
            <Loader2 className="size-5 animate-spin" />
          ) : logoUrl ? (
            <Image src={logoUrl} alt="Company logo" width={64} height={64} className="size-full object-cover" />
          ) : (
            "logo"
          )}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/svg+xml,image/jpeg"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) onLogoSelect(file);
          }}
        />
        <p className="text-[13.5px] leading-relaxed text-muted-foreground">
          Drop your logo here — PNG or SVG, at least 200×200px.
        </p>
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
          placeholder="Business address"
          value={address}
          onChange={(e) => onAddressChange(e.target.value)}
          className="h-11 rounded-[11px] px-3.5 text-[14.5px]"
        />
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
