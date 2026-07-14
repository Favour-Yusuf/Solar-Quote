"use client";

import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FieldError } from "@/components/field-error";
import { changePasswordAction } from "@/actions/settings";
import { changePasswordSchema, type ChangePasswordInput } from "@/lib/validations/settings";

export function SecuritySection() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordInput>({ resolver: zodResolver(changePasswordSchema) });

  async function onSubmit(data: ChangePasswordInput) {
    const result = await changePasswordAction(data);
    if (result && "error" in result) {
      toast.error(result.error);
      return;
    }
    toast.success("Password updated.");
    reset();
  }

  return (
    <section className="rounded-2xl border border-border bg-card p-[22px]">
      <h2 className="mb-1 font-heading text-[17px] font-bold">Security</h2>
      <p className="mb-5 text-[13.5px] text-muted-foreground">Change your password.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <Label htmlFor="password" className="mb-1.5 block text-[13px] font-semibold">
              New password
            </Label>
            <Input
              id="password"
              type="password"
              autoComplete="new-password"
              className="h-11 rounded-[11px] px-3.5 text-[14.5px]"
              {...register("password")}
            />
            <FieldError message={errors.password?.message} />
          </div>
          <div>
            <Label htmlFor="confirmPassword" className="mb-1.5 block text-[13px] font-semibold">
              Confirm password
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              className="h-11 rounded-[11px] px-3.5 text-[14.5px]"
              {...register("confirmPassword")}
            />
            <FieldError message={errors.confirmPassword?.message} />
          </div>
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="mt-1 h-11 w-fit rounded-xl px-6 text-[14.5px] font-bold"
        >
          {isSubmitting ? "Updating…" : "Update password"}
        </Button>
      </form>
    </section>
  );
}
