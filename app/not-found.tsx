import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LogoMark } from "@/components/logo";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 text-center">
      <Link href="/" className="mb-8">
        <LogoMark />
      </Link>
      <div className="mb-3 font-heading text-5xl font-extrabold text-primary">404</div>
      <h1 className="mb-2 font-heading text-xl font-extrabold">Page not found</h1>
      <p className="mb-6 max-w-sm text-sm text-muted-foreground">
        The page you&apos;re looking for doesn&apos;t exist or may have been moved.
      </p>
      <Button render={<Link href="/" />} className="rounded-xl px-5 text-sm font-bold">
        Back to home
      </Button>
    </div>
  );
}
