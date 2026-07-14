"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="flex min-h-screen items-center justify-center bg-[oklch(98%_0.012_95)] px-6 font-sans text-[oklch(21%_0.02_90)]">
        <div className="max-w-sm text-center">
          <div className="mb-4 text-4xl">⚠️</div>
          <h1 className="mb-2 text-xl font-bold">Something went wrong</h1>
          <p className="mb-6 text-sm text-[oklch(48%_0.02_90)]">
            SolarQuote hit an unexpected error. Try again, or reload the page.
          </p>
          <button
            onClick={() => reset()}
            className="rounded-xl bg-[oklch(52%_0.14_152)] px-5 py-2.5 text-sm font-bold text-white"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
