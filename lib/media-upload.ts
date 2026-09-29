"use client";

import { createClient } from "./supabase/browser";
import { isRequestTimeout } from "./supabase/fetch";
import type { ActionResult } from "./types";

const formats: Record<string, { extension: string; signature: number[] }> = {
  "image/jpeg": { extension: "jpg", signature: [0xff, 0xd8, 0xff] },
  "image/png": {
    extension: "png",
    signature: [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a],
  },
  "image/webp": { extension: "webp", signature: [0x52, 0x49, 0x46, 0x46] },
  "application/pdf": {
    extension: "pdf",
    signature: [0x25, 0x50, 0x44, 0x46, 0x2d],
  },
};

export async function uploadMediaFromBrowser(
  file: File,
): Promise<ActionResult> {
  if (file.size === 0 || file.size > 8 * 1024 * 1024)
    return { ok: false, message: "Choose a file smaller than 8 MB." };

  const format = formats[file.type];
  const signature = new Uint8Array(
    await file
      .slice(0, Math.max(format?.signature.length || 0, 12))
      .arrayBuffer(),
  );
  if (
    !format ||
    !format.signature.every((byte, index) => signature[index] === byte) ||
    (file.type === "image/webp" &&
      String.fromCharCode(...signature.slice(8, 12)) !== "WEBP")
  )
    return { ok: false, message: "Use a valid JPEG, PNG, WebP, or PDF file." };

  try {
    const client = createClient();
    const {
      data: { user },
      error: authError,
    } = await client.auth.getUser();
    if (authError || !user)
      return { ok: false, message: "Your session expired. Sign in again." };

    const path = `${user.id}/${crypto.randomUUID()}.${format.extension}`;
    const { error } = await client.storage
      .from("portfolio-media")
      .upload(path, file, { contentType: file.type, upsert: false });
    if (error) {
      const denied = /row-level security|permission denied|unauthorized/i.test(
        error.message,
      );
      return {
        ok: false,
        message: denied
          ? "Supabase rejected the upload. Confirm this login is registered in public.admin_users and the storage policies were created."
          : `Upload failed: ${error.message}`,
      };
    }
    const { data } = client.storage.from("portfolio-media").getPublicUrl(path);
    return {
      ok: true,
      message: "Uploaded. Save the form to attach this file to your content.",
      url: data.publicUrl,
    };
  } catch (error) {
    return {
      ok: false,
      message: isRequestTimeout(error)
        ? "Supabase did not respond within 15 seconds. Check your connection and try again."
        : "Upload failed before reaching Supabase. Refresh the page and try again.",
    };
  }
}
