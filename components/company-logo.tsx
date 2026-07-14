import Image from "next/image";
import { cn } from "@/lib/utils";
import { getInitials } from "@/utils/format";

export function CompanyLogo({
  logoUrl,
  name,
  size = 40,
  className,
}: {
  logoUrl?: string | null;
  name: string;
  size?: number;
  className?: string;
}) {
  if (logoUrl) {
    return (
      <div
        className={cn(
          "shrink-0 overflow-hidden rounded-[11px] border border-border bg-white",
          className
        )}
        style={{ width: size, height: size }}
      >
        <Image
          src={logoUrl}
          alt={`${name} logo`}
          width={size}
          height={size}
          className="size-full object-contain"
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-[11px] bg-primary font-heading font-bold text-primary-foreground",
        className
      )}
      style={{ width: size, height: size, fontSize: size * 0.36 }}
    >
      {getInitials(name) || "?"}
    </div>
  );
}
