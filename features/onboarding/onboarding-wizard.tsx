"use client";

import { useState } from "react";
import { completeOnboardingAction } from "@/actions/onboarding";
import { createClient } from "@/lib/supabase/client";
import { OnboardingShell } from "@/features/onboarding/onboarding-shell";
import { WelcomeStep } from "@/features/onboarding/steps/welcome-step";
import { CompanyStep } from "@/features/onboarding/steps/company-step";
import { ProductsStep } from "@/features/onboarding/steps/products-step";
import { PaymentStep } from "@/features/onboarding/steps/payment-step";
import { DoneStep } from "@/features/onboarding/steps/done-step";

const TOTAL_STEPS = 4;

export function OnboardingWizard({
  userId,
  initialCompanyName,
}: {
  userId: string;
  initialCompanyName: string;
}) {
  const [step, setStep] = useState(1);
  const [companyName, setCompanyName] = useState(initialCompanyName);
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [logoUrl, setLogoUrl] = useState<string | undefined>();
  const [logoUploading, setLogoUploading] = useState(false);
  const [productKeys, setProductKeys] = useState<Set<string>>(new Set());
  const [bankName, setBankName] = useState("");
  const [accountName, setAccountName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function toggleProduct(key: string) {
    setProductKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  async function handleLogoSelect(file: File) {
    setLogoUploading(true);
    try {
      const supabase = createClient();
      const ext = file.name.split(".").pop() ?? "png";
      const path = `${userId}/logo-${Date.now()}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from("logos")
        .upload(path, file, { upsert: true });
      if (!uploadError) {
        const { data } = supabase.storage.from("logos").getPublicUrl(path);
        setLogoUrl(data.publicUrl);
      }
    } finally {
      setLogoUploading(false);
    }
  }

  async function finish() {
    setSubmitting(true);
    setError(null);
    const result = await completeOnboardingAction({
      companyName,
      phone,
      email,
      address,
      logoUrl,
      productKeys: Array.from(productKeys),
      bankName,
      accountName,
      accountNumber,
    });
    if (result && "error" in result) {
      setError(result.error);
      setSubmitting(false);
    }
  }

  return (
    <OnboardingShell step={step - 1} totalSteps={TOTAL_STEPS} showProgress={step > 1}>
      {step === 1 && <WelcomeStep onNext={() => setStep(2)} />}
      {step === 2 && (
        <CompanyStep
          companyName={companyName}
          onCompanyNameChange={setCompanyName}
          phone={phone}
          onPhoneChange={setPhone}
          email={email}
          onEmailChange={setEmail}
          address={address}
          onAddressChange={setAddress}
          logoUrl={logoUrl}
          logoUploading={logoUploading}
          onLogoSelect={handleLogoSelect}
          onBack={() => setStep(1)}
          onNext={() => setStep(3)}
        />
      )}
      {step === 3 && (
        <ProductsStep
          selectedKeys={productKeys}
          onToggle={toggleProduct}
          onBack={() => setStep(2)}
          onNext={() => setStep(4)}
        />
      )}
      {step === 4 && (
        <PaymentStep
          bankName={bankName}
          onBankNameChange={setBankName}
          accountName={accountName}
          onAccountNameChange={setAccountName}
          accountNumber={accountNumber}
          onAccountNumberChange={setAccountNumber}
          onBack={() => setStep(3)}
          onNext={() => setStep(5)}
        />
      )}
      {step === 5 && (
        <DoneStep onFinish={finish} submitting={submitting} error={error} />
      )}
    </OnboardingShell>
  );
}
