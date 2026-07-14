"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Customer } from "@prisma/client";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FieldError } from "@/components/field-error";
import { createCustomerAction } from "@/actions/customers";
import {
  createCustomerSchema,
  type CreateCustomerInput,
} from "@/lib/validations/customers";

export function AddCustomerModal({
  defaultName,
  open: openProp,
  onOpenChange,
  onCreated,
}: {
  defaultName?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onCreated?: (customer: Customer) => void;
} = {}) {
  const router = useRouter();
  const isControlled = openProp !== undefined;
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const open = isControlled ? openProp : uncontrolledOpen;
  const setOpen = onOpenChange ?? setUncontrolledOpen;
  const [formError, setFormError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CreateCustomerInput>({ resolver: zodResolver(createCustomerSchema) });

  useEffect(() => {
    if (open && defaultName) setValue("name", defaultName);
  }, [open, defaultName, setValue]);

  async function onSubmit(data: CreateCustomerInput) {
    setFormError(null);
    const result = await createCustomerAction(data);
    if (result && "error" in result) {
      setFormError(result.error);
      return;
    }
    reset();
    setOpen(false);
    toast.success("Customer added.");
    if (onCreated) {
      onCreated(result.customer);
    } else {
      router.refresh();
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {isControlled ? null : (
        <DialogTrigger
          render={
            <Button className="h-auto gap-2 rounded-xl px-4 py-2.5 font-heading text-sm font-bold" />
          }
        >
          <Plus className="size-[15px]" strokeWidth={2.4} />
          Add Customer
        </DialogTrigger>
      )}
      <DialogContent className="max-w-[440px] rounded-[20px] p-7 sm:max-w-[440px]">
        <DialogHeader>
          <DialogTitle className="font-heading text-[19px] font-extrabold">
            Add Customer
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
          <div>
            <Input
              placeholder="Full name"
              className="h-11 rounded-[11px] px-3.5 text-[14.5px]"
              {...register("name")}
            />
            <FieldError message={errors.name?.message} />
          </div>
          <Input
            placeholder="Company (optional)"
            className="h-11 rounded-[11px] px-3.5 text-[14.5px]"
            {...register("businessName")}
          />
          <Input
            placeholder="Phone"
            className="h-11 rounded-[11px] px-3.5 text-[14.5px]"
            {...register("phone")}
          />
          <div>
            <Input
              type="email"
              placeholder="Email"
              className="h-11 rounded-[11px] px-3.5 text-[14.5px]"
              {...register("email")}
            />
            <FieldError message={errors.email?.message} />
          </div>

          <FieldError message={formError ?? undefined} />

          <DialogFooter className="mt-1 -mx-0 -mb-0 flex-row gap-2.5 rounded-none border-t-0 bg-transparent p-0">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setOpen(false)}
              className="h-11 flex-1 rounded-xl text-sm font-bold"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-11 flex-1 rounded-xl text-sm font-bold"
            >
              {isSubmitting ? "Saving…" : "Save Customer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
