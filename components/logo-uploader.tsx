"use client";

import Image from "next/image";
import { useRef } from "react";
import { Loader2 } from "lucide-react";

export function LogoUploader({
  logoUrl,
  uploading,
  onSelect,
  ariaLabel = "Upload company logo",
  alt = "Company logo",
  placeholder = "logo",
  hint = "PNG or SVG, at least 200×200px.",
}: {
  logoUrl?: string | null;
  uploading: boolean;
  onSelect: (file: File) => void;
  ariaLabel?: string;
  alt?: string;
  placeholder?: string;
  hint?: string;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex items-center gap-3.5">
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        aria-label={ariaLabel}
        className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl border-[1.5px] border-dashed border-border text-[10.5px] text-muted-foreground"
      >
        {uploading ? (
          <Loader2 className="size-5 animate-spin" />
        ) : logoUrl ? (
          <Image src={logoUrl} alt={alt} width={64} height={64} className="size-full object-cover" />
        ) : (
          placeholder
        )}
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/svg+xml,image/jpeg"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onSelect(file);
        }}
      />
      <p className="text-[13.5px] leading-relaxed text-muted-foreground">{hint}</p>
    </div>
  );
}
