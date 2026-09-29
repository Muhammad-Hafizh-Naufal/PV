import type { MetadataRoute } from "next";
import { getPortfolio } from "@/lib/data";
export const dynamic = "force-dynamic";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { projects } = await getPortfolio();
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  return [
    { url: base, changeFrequency: "monthly", priority: 1 },
    ...projects.map((p) => ({
      url: `${base}/projects/${p.slug}`,
      lastModified: p.updated_at,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
