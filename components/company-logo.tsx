import Image from "next/image";
import { cn } from "@/lib/utils";
import { getInitials } from "@/utils/format";
import { onBrand, resolveBrandColor } from "@/lib/branding";
import { isSvgUrl } from "@/lib/supabase/storage";

export function CompanyLogo({
  logoUrl,
  name,
  size = 40,
  brandColor,
  className,
}: {
  logoUrl?: string | null;
  name: string;
  size?: number;
  /** Tints the initials fallback so an installer without a logo still looks branded. */
  brandColor?: string | null;
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
          unoptimized={isSvgUrl(logoUrl)}
          className="size-full object-contain"
        />
      </div>
    );
  }

  const brand = resolveBrandColor(brandColor);

  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-[11px] font-heading font-bold",
        className
      )}
      style={{
        width: size,
        height: size,
        fontSize: size * 0.36,
        backgroundColor: brand,
        color: onBrand(brand),
      }}
    >
      {getInitials(name) || "?"}
    </div>
  );
}
