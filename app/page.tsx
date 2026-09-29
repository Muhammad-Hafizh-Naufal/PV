import type { Metadata } from "next";
import { getPortfolio } from "@/lib/data";
import { PortfolioView } from "@/components/portfolio";
// Supabase is an external runtime dependency; do not require it during builds.
export const dynamic = "force-dynamic";
export async function generateMetadata(): Promise<Metadata> {
  const { site_settings: settings } = await getPortfolio();
  return {
    title: { absolute: settings.seo_title },
    description: settings.seo_description,
    alternates: { canonical: "/" },
    openGraph: {
      title: settings.seo_title,
      description: settings.seo_description,
      url: "/",
    },
  };
}
export default async function Home() {
  return <PortfolioView data={await getPortfolio()} />;
}
