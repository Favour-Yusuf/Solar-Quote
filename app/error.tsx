"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ErrorPage({
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
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 text-center">
      <div className="mb-4 text-4xl">⚠️</div>
      <h1 className="mb-2 font-heading text-xl font-extrabold">
        Something went wrong
      </h1>
      <p className="mb-6 max-w-sm text-sm text-muted-foreground">
        We hit an unexpected error loading this page. You can try again, or
        head back home.
      </p>
      <div className="flex gap-3">
        <Button onClick={() => reset()} className="rounded-xl px-5 text-sm font-bold">
          Try again
        </Button>
        <Button
          variant="secondary"
          render={<Link href="/" />}
          className="rounded-xl px-5 text-sm font-bold"
        >
          Go home
        </Button>
      </div>
    </div>
  );
}
