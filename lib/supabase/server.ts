import "server-only";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { supabaseConfig } from "./config";
import { fetchWithTimeout } from "./fetch";

export async function createClient() {
  const config = supabaseConfig();
  if (!config) throw new Error("Supabase has not been configured.");
  const cookieStore = await cookies();
  return createServerClient(config.url, config.key, {
    global: { fetch: fetchWithTimeout },
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (items) => {
        try {
          items.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          /* Server Components cannot set cookies; proxy refreshes them. */
        }
      },
    },
  });
}
