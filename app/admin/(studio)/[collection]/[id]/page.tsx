import { notFound } from "next/navigation";
import { isCollection, collection } from "@/lib/content";
import { getAdminRows } from "@/lib/admin-data";
import { Editor } from "@/components/admin/editor";
import { supabaseConfig } from "@/lib/supabase/config";
import type { Technology } from "@/lib/types";
export default async function EditPage({
  params,
  searchParams,
}: {
  params: Promise<{ collection: string; id: string }>;
  searchParams: Promise<{ saved?: string }>;
}) {
  const { collection: key, id } = await params;
  if (!isCollection(key) || collection(key).singleton) notFound();
  const isNew = id === "new";
  const saved = (await searchParams).saved === "1";
  const [rows, technologies] = await Promise.all([
    getAdminRows(key),
    key === "projects" ? getAdminRows("technologies") : Promise.resolve([]),
  ]);
  const row = isNew
    ? { id: crypto.randomUUID(), status: "draft", sort_order: rows.length }
    : rows.find((r) => r.id === id);
  if (!row) notFound();
  return (
    <Editor
      key={String(row.id)}
      kind={key}
      row={row}
      isNew={isNew}
      saved={saved}
      technologies={technologies as unknown as Technology[]}
      demo={!supabaseConfig()}
    />
  );
}
