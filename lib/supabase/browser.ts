"use client";

import { createBrowserClient } from "@supabase/ssr";
import { fetchWithTimeout } from "./fetch";

let browserClient: ReturnType<typeof createBrowserClient> | undefined;

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) throw new Error("Supabase has not been configured.");
  browserClient ??= createBrowserClient(url, key, {
    global: { fetch: fetchWithTimeout },
  });
  return browserClient;
}
