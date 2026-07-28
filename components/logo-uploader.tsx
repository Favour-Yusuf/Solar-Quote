"use client";

import Image from "next/image";
import { useRef } from "react";
import { Loader2, Trash2, Upload } from "lucide-react";
import { LOGO_ACCEPT_ATTR } from "@/lib/hooks/use-logo-upload";
import { isSvgUrl } from "@/lib/supabase/storage";

export function LogoUploader({
  logoUrl,
  uploading,
  onSelect,
  onRemove,
  ariaLabel = "Upload company logo",
  alt = "Company logo",
  placeholder = "logo",
  hint = "PNG or JPG, at least 200×200px, up to 2MB. Appears on your dashboard, quotes and PDFs.",
}: {
  logoUrl?: string | null;
  uploading: boolean;
  onSelect: (file: File) => void;
  onRemove?: () => void;
  ariaLabel?: string;
  alt?: string;
  placeholder?: string;
  hint?: string;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  function openPicker() {
    fileInputRef.current?.click();
  }

  return (
    <div className="flex items-center gap-3.5">
      <button
        type="button"
        onClick={openPicker}
        disabled={uploading}
        aria-label={ariaLabel}
        aria-busy={uploading}
        className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl border-[1.5px] border-dashed border-border bg-card text-[10.5px] text-muted-foreground transition-colors hover:border-primary/60 disabled:cursor-progress"
      >
        {uploading ? (
          <Loader2 className="size-5 animate-spin text-primary" />
        ) : logoUrl ? (
          <Image
            src={logoUrl}
            alt={alt}
            width={64}
            height={64}
            unoptimized={isSvgUrl(logoUrl)}
            className="size-full object-contain"
          />
        ) : (
          placeholder
        )}
      </button>

      <input
        ref={fileInputRef}
        type="file"
        accept={LOGO_ACCEPT_ATTR}
        className="hidden"
        disabled={uploading}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onSelect(file);
          // Reset so picking the same file twice still fires a change event.
          e.target.value = "";
        }}
      />

      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={openPicker}
            disabled={uploading}
            className="flex items-center gap-1.5 rounded-lg border border-border px-2.5 py-1.5 text-[12.5px] font-semibold transition-colors hover:bg-muted disabled:opacity-60"
          >
            {uploading ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <Upload className="size-3.5" strokeWidth={2.2} />
            )}
            {uploading ? "Uploading…" : logoUrl ? "Replace logo" : "Upload logo"}
          </button>
          {logoUrl && onRemove && !uploading ? (
            <button
              type="button"
              onClick={onRemove}
              className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-[12.5px] font-semibold text-muted-foreground transition-colors hover:text-destructive"
            >
              <Trash2 className="size-3.5" strokeWidth={2.2} />
              Remove
            </button>
          ) : null}
        </div>
        <p className="mt-1.5 text-[12.5px] leading-relaxed text-muted-foreground">{hint}</p>
      </div>
    </div>
  );
}
