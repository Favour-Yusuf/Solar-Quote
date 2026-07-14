"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Product } from "@prisma/client";
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
import { createProductAction, updateProductAction } from "@/actions/products";
import { productFormSchema, type ProductFormInput } from "@/lib/validations/products";

export function ProductModal({ product }: { product?: Product }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormInput>({
    resolver: zodResolver(productFormSchema),
    defaultValues: product
      ? { name: product.name, unit: product.unit, price: product.priceCents / 100 }
      : undefined,
  });

  async function onSubmit(data: ProductFormInput) {
    setFormError(null);
    const result = product
      ? await updateProductAction(product.id, data)
      : await createProductAction(data);
    if (result && "error" in result) {
      setFormError(result.error);
      return;
    }
    if (!product) reset();
    setOpen(false);
    router.refresh();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          product ? (
            <Button
              variant="secondary"
              className="h-auto rounded-[9px] border border-border px-2.75 py-1.5 text-[13px] font-semibold"
            />
          ) : (
            <Button className="h-auto gap-2 rounded-xl px-4 py-2.5 font-heading text-sm font-bold" />
          )
        }
      >
        {product ? (
          "Edit"
        ) : (
          <>
            <Plus className="size-[15px]" strokeWidth={2.4} />
            Add Product
          </>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-[440px] rounded-[20px] p-7 sm:max-w-[440px]">
        <DialogHeader>
          <DialogTitle className="font-heading text-[19px] font-extrabold">
            {product ? "Edit Product" : "Add Product"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
          <div>
            <Input
              placeholder="Product name"
              className="h-11 rounded-[11px] px-3.5 text-[14.5px]"
              {...register("name")}
            />
            <FieldError message={errors.name?.message} />
          </div>
          <div className="flex gap-2.5">
            <div className="flex-1">
              <Input
                placeholder="Unit (e.g. panel)"
                className="h-11 rounded-[11px] px-3.5 text-[14.5px]"
                {...register("unit")}
              />
              <FieldError message={errors.unit?.message} />
            </div>
            <div className="w-33">
              <Input
                type="number"
                step="0.01"
                placeholder="Price ($)"
                className="h-11 rounded-[11px] px-3.5 text-[14.5px]"
                {...register("price", { valueAsNumber: true })}
              />
              <FieldError message={errors.price?.message} />
            </div>
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
              {isSubmitting ? "Saving…" : "Save Product"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
