"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function useLogoUpload(userId: string) {
  const [uploading, setUploading] = useState(false);

  async function upload(file: File): Promise<string | null> {
    setUploading(true);
    try {
      const supabase = createClient();
      const ext = file.name.split(".").pop() ?? "png";
      const path = `${userId}/logo-${Date.now()}.${ext}`;
      const { error } = await supabase.storage
        .from("logos")
        .upload(path, file, { upsert: true });
      if (error) return null;
      const { data } = supabase.storage.from("logos").getPublicUrl(path);
      return data.publicUrl;
    } finally {
      setUploading(false);
    }
  }

  return { upload, uploading };
}
