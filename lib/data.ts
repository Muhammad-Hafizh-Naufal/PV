import "server-only";
import { cache } from "react";
import { createClient } from "@supabase/supabase-js";
import { demoPortfolio } from "./demo";
import { supabaseConfig } from "./supabase/config";
import { fetchWithTimeout } from "./supabase/fetch";
import type { Portfolio, Project, Technology } from "./types";

export const getPortfolio = cache(async (): Promise<Portfolio> => {
  const config = supabaseConfig();
  if (!config) return demoPortfolio;
  // A separate anonymous client prevents an admin's session exposing drafts publicly.
  const db = createClient(config.url, config.key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { fetch: fetchWithTimeout },
  });
  const results = await Promise.all([
    db.from("profile").select("*").limit(1).maybeSingle(),
    db
      .from("projects")
      .select("*, project_technologies(technologies(*))")
      .eq("status", "published")
      .order("sort_order"),
    db.from("technologies").select("*").order("sort_order"),
    db.from("experiences").select("*").order("sort_order"),
    db.from("certificates").select("*").order("sort_order"),
    db.from("social_links").select("*").order("sort_order"),
    db.from("site_settings").select("*").limit(1).maybeSingle(),
  ]);
  if (results.some((result) => result.error)) {
    console.error(
      "Portfolio query failed",
      results.map((result) => result.error?.code).filter(Boolean),
    );
    throw new Error("Portfolio content is temporarily unavailable.");
  }
  const [
    profile,
    projects,
    technologies,
    experiences,
    certificates,
    socials,
    settings,
  ] = results;
  if (!profile.data || !settings.data)
    throw new Error("Portfolio setup is incomplete. Run the seed migration.");
  return {
    demo: false,
    profile: profile.data,
    site_settings: settings.data,
    projects: (projects.data ?? []).map((p) => ({
      ...p,
      technologies: (
        p.project_technologies as { technologies: Technology }[]
      ).map((relation) => relation.technologies),
    })) as Project[],
    technologies: technologies.data ?? [],
    experiences: experiences.data ?? [],
    certificates: certificates.data ?? [],
    social_links: socials.data ?? [],
  };
});
