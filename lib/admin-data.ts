import "server-only";
import { demoPortfolio } from "./demo";
import { requireAdmin } from "./auth";
import { supabaseConfig } from "./supabase/config";
import { collection, type CollectionKey } from "./content";

export type ContentRow = Record<
  string,
  string | number | boolean | null | string[]
>;
export async function getAdminRows(key: CollectionKey): Promise<ContentRow[]> {
  if (!supabaseConfig()) {
    const data = demoPortfolio[key];
    const rows = Array.isArray(data) ? data : [data];
    return rows.map((row) => ({
      ...row,
      ...("technologies" in row
        ? { technology_ids: row.technologies?.map((t) => t.id) ?? [] }
        : {}),
    })) as unknown as ContentRow[];
  }
  const { client } = await requireAdmin();
  const query = client
    .from(key)
    .select(
      key === "projects" ? "*, project_technologies(technology_id)" : "*",
    );
  const { data, error } = collection(key).singleton
    ? await query
    : await query.order("sort_order");
  if (error)
    throw new Error(
      `Unable to read ${collection(key).label}. Check that the database migration has been applied.`,
    );
  return (data ?? []).map((row) => {
    const record = row as unknown as Record<string, unknown>;
    return {
      ...record,
      ...(key === "projects"
        ? {
            technology_ids: (
              record.project_technologies as { technology_id: string }[]
            ).map((t) => t.technology_id),
          }
        : {}),
    };
  }) as ContentRow[];
}
