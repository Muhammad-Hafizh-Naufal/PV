import { notFound } from "next/navigation";
import { isCollection, collection } from "@/lib/content";
import { getAdminRows } from "@/lib/admin-data";
import { ContentList } from "@/components/admin/content-list";
import { Editor } from "@/components/admin/editor";
import { supabaseConfig } from "@/lib/supabase/config";
import { SINGLETON_ID } from "@/lib/demo";
export default async function CollectionPage({
  params,
}: {
  params: Promise<{ collection: string }>;
}) {
  const { collection: key } = await params;
  if (!isCollection(key)) notFound();
  const rows = await getAdminRows(key);
  const demo = !supabaseConfig();
  return collection(key).singleton ? (
    <Editor
      kind={key}
      row={rows[0] || { id: SINGLETON_ID }}
      technologies={[]}
      demo={demo}
    />
  ) : (
    <ContentList kind={key} rows={rows} demo={demo} />
  );
}
