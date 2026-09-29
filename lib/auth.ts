import "server-only";
import { redirect } from "next/navigation";
import { createClient } from "./supabase/server";
import { supabaseConfig } from "./supabase/config";

export async function getAdmin() {
  if (!supabaseConfig()) return null;
  const client = await createClient();
  const {
    data: { user },
    error,
  } = await client.auth.getUser();
  if (error || !user) return null;
  const { data: admin, error: roleError } = await client
    .from("admin_users")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();
  return !roleError && admin ? { user, client } : null;
}
export async function requireAdmin() {
  const admin = await getAdmin();
  if (!admin) redirect("/admin/login");
  return admin;
}
