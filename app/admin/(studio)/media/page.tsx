import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { supabaseConfig } from "@/lib/supabase/config";
import { MediaLibrary, type MediaFile } from "@/components/admin/media-library";
export default async function MediaPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: raw } = await searchParams;
  const page = Math.max(
    1,
    Math.min(10000, Number.parseInt(raw || "1", 10) || 1),
  );
  const demo = !supabaseConfig();
  let files: MediaFile[] = [];
  let hasNext = false;
  if (!demo) {
    const { client, user } = await requireAdmin();
    const { data, error } = await client.storage
      .from("portfolio-media")
      .list(user.id, {
        limit: 25,
        offset: (page - 1) * 24,
        sortBy: { column: "created_at", order: "desc" },
      });
    if (error)
      throw new Error(
        "Unable to load media. Check your storage configuration.",
      );
    hasNext = (data?.length || 0) > 24;
    files = (data || [])
      .slice(0, 24)
      .filter((file) => file.id)
      .map((file) => {
        const path = `${user.id}/${file.name}`;
        return {
          name: file.name,
          path,
          size: Number(file.metadata?.size || 0),
          url: client.storage.from("portfolio-media").getPublicUrl(path).data
            .publicUrl,
        };
      });
  }
  return (
    <>
      <MediaLibrary files={files} demo={demo} />
      <div className="form-footer">
        {page > 1 && (
          <Link className="text-link" href={`/admin/media?page=${page - 1}`}>
            ← Previous page
          </Link>
        )}
        {hasNext && (
          <Link className="text-link" href={`/admin/media?page=${page + 1}`}>
            Next page →
          </Link>
        )}
      </div>
    </>
  );
}
