"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border px-6 py-20 text-center">
      <div className="mb-4 text-3xl">⚠️</div>
      <h1 className="mb-1.5 font-heading text-lg font-bold">
        Couldn&apos;t load this page
      </h1>
      <p className="mb-5 max-w-sm text-sm text-muted-foreground">
        Something went wrong fetching your data. Try again in a moment.
      </p>
      <Button onClick={() => reset()} className="rounded-xl px-5 text-sm font-bold">
        Try again
      </Button>
    </div>
  );
}
