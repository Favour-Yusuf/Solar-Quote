"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FieldError } from "@/components/field-error";
import { signUpAction } from "@/actions/auth";
import { registerSchema, type RegisterInput } from "@/lib/validations/auth";

export function RegisterForm() {
  const [formError, setFormError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({ resolver: zodResolver(registerSchema) });

  async function onSubmit(data: RegisterInput) {
    setFormError(null);
    const result = await signUpAction(data);
    if (result && "error" in result) {
      setFormError(result.error);
    }
  }

  return (
    <div>
      <h1 className="font-heading text-[26px] font-extrabold tracking-tight">
        Create your account
      </h1>
      <p className="mt-2 mb-6.5 text-[14.5px] text-muted-foreground">
        Free to start. Takes about 3 minutes.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
        <div>
          <Label htmlFor="fullName" className="sr-only">
            Full name
          </Label>
          <Input
            id="fullName"
            placeholder="Full name"
            autoComplete="name"
            className="h-11 rounded-[11px] px-3.5 text-[14.5px]"
            {...register("fullName")}
          />
          <FieldError message={errors.fullName?.message} />
        </div>
        <div>
          <Label htmlFor="companyName" className="sr-only">
            Company name
          </Label>
          <Input
            id="companyName"
            placeholder="Company name"
            autoComplete="organization"
            className="h-11 rounded-[11px] px-3.5 text-[14.5px]"
            {...register("companyName")}
          />
          <FieldError message={errors.companyName?.message} />
        </div>
        <div>
          <Label htmlFor="email" className="sr-only">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="Email"
            autoComplete="email"
            className="h-11 rounded-[11px] px-3.5 text-[14.5px]"
            {...register("email")}
          />
          <FieldError message={errors.email?.message} />
        </div>
        <div>
          <Label htmlFor="password" className="sr-only">
            Password
          </Label>
          <Input
            id="password"
            type="password"
            placeholder="Password"
            autoComplete="new-password"
            className="h-11 rounded-[11px] px-3.5 text-[14.5px]"
            {...register("password")}
          />
          <FieldError message={errors.password?.message} />
        </div>

        <FieldError message={formError ?? undefined} />

        <Button
          type="submit"
          disabled={isSubmitting}
          className="mt-1.5 h-11 rounded-xl text-[15px] font-bold"
        >
          {isSubmitting ? "Creating account…" : "Create account"}
        </Button>
      </form>

      <p className="mt-4.5 text-center text-[12.5px] text-muted-foreground">
        No credit card required · Cancel anytime
      </p>
      <p className="mt-4.5 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-primary">
          Log in
        </Link>
      </p>
    </div>
  );
}
