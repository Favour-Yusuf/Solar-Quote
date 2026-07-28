"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { LOGO_BUCKET, logoPathFromPublicUrl } from "@/lib/supabase/storage";

const MAX_BYTES = 2 * 1024 * 1024;

/**
 * PNG and JPEG only, deliberately. @react-pdf/renderer can embed nothing else,
 * and a logo that renders on screen but silently vanishes from the customer's
 * PDF is exactly the broken-branding promise this feature exists to fix.
 */
const ACCEPTED = ["image/png", "image/jpeg"];

export const LOGO_ACCEPT_ATTR = ACCEPTED.join(",");

export type LogoUploadResult = { url: string } | { error: string };

const EXTENSIONS: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
};

/**
 * Uploads a company logo to the public `logos` bucket under `<uid>/…`, the
 * prefix the bucket's RLS policies key ownership off.
 *
 * Deliberately does NOT pass `upsert` — Storage turns that into an
 * `INSERT ... ON CONFLICT DO UPDATE`, which Postgres refuses under RLS unless
 * a SELECT policy exists, and every filename here is unique anyway. The
 * previous logo is removed explicitly instead, so a re-upload replaces rather
 * than accumulates.
 */
export function useLogoUpload(userId: string, filePrefix: string = "logo") {
  const [uploading, setUploading] = useState(false);

  async function upload(file: File, previousUrl?: string | null): Promise<LogoUploadResult> {
    if (!ACCEPTED.includes(file.type)) {
      return { error: "Use a PNG or JPG image so your logo renders in quote PDFs." };
    }
    if (file.size > MAX_BYTES) {
      return { error: "That image is over 2MB. Try a smaller file." };
    }
    if (!userId) {
      return { error: "Your session expired. Please log in again." };
    }

    setUploading(true);
    try {
      const supabase = createClient();
      const ext = EXTENSIONS[file.type] ?? file.name.split(".").pop() ?? "png";
      const path = `${userId}/${filePrefix}-${Date.now()}.${ext}`;

      const { error } = await supabase.storage
        .from(LOGO_BUCKET)
        .upload(path, file, { contentType: file.type, cacheControl: "3600" });

      if (error) {
        return { error: describeUploadError(error.message) };
      }

      const { data } = supabase.storage.from(LOGO_BUCKET).getPublicUrl(path);
      if (!data?.publicUrl) {
        return { error: "Uploaded, but the image URL couldn't be generated." };
      }

      // Best-effort cleanup of the logo this one replaces. A failure here
      // leaves an orphaned file but must never fail the upload itself.
      const previousPath = logoPathFromPublicUrl(previousUrl);
      if (previousPath && previousPath !== path && previousPath.startsWith(`${userId}/`)) {
        await supabase.storage.from(LOGO_BUCKET).remove([previousPath]);
      }

      return { url: data.publicUrl };
    } catch {
      return { error: "Couldn't reach storage. Check your connection and try again." };
    } finally {
      setUploading(false);
    }
  }

  return { upload, uploading };
}

function describeUploadError(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes("row-level security") || lower.includes("unauthorized")) {
    return "You don't have permission to upload this logo. Try logging out and back in.";
  }
  if (lower.includes("bucket not found")) {
    return "Logo storage isn't set up yet. Run the database migrations and try again.";
  }
  if (lower.includes("exceeded") || lower.includes("too large")) {
    return "That image is too large. Try a smaller file.";
  }
  if (lower.includes("mime") || lower.includes("content type")) {
    return "That file type isn't supported. Use a PNG or JPG.";
  }
  return message || "Couldn't upload that logo. Try a different file.";
}
