"use client";

import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FieldError } from "@/components/field-error";
import { updateAccountAction } from "@/actions/settings";
import { accountSettingsSchema, type AccountSettingsInput } from "@/lib/validations/settings";

export function AccountSection({ fullName, email }: { fullName: string; email: string }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AccountSettingsInput>({
    resolver: zodResolver(accountSettingsSchema),
    defaultValues: { fullName },
  });

  async function onSubmit(data: AccountSettingsInput) {
    const result = await updateAccountAction(data);
    if (result && "error" in result) {
      toast.error(result.error);
      return;
    }
    toast.success("Account details saved.");
  }

  return (
    <section className="rounded-2xl border border-border bg-card p-[22px]">
      <h2 className="mb-1 font-heading text-[17px] font-bold">Account</h2>
      <p className="mb-5 text-[13.5px] text-muted-foreground">Your personal login details.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <Label htmlFor="fullName" className="mb-1.5 block text-[13px] font-semibold">
              Full name
            </Label>
            <Input
              id="fullName"
              className="h-11 rounded-[11px] px-3.5 text-[14.5px]"
              {...register("fullName")}
            />
            <FieldError message={errors.fullName?.message} />
          </div>
          <div>
            <Label className="mb-1.5 block text-[13px] font-semibold">Email</Label>
            <Input
              value={email}
              disabled
              className="h-11 rounded-[11px] bg-muted px-3.5 text-[14.5px] text-muted-foreground"
            />
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
