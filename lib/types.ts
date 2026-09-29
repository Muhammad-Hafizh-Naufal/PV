export type Technology = {
  id: string;
  name: string;
  category: string;
  icon_key: string;
  sort_order: number;
};
export type Project = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  cover_url: string;
  github_url: string;
  demo_url: string;
  category: string;
  year: string;
  featured: boolean;
  status: "draft" | "published";
  sort_order: number;
  created_at: string;
  updated_at: string;
  technologies?: Technology[];
};
export type Profile = {
  id: string;
  name: string;
  title: string;
  headline: string;
  about: string;
  location: string;
  avatar_url: string;
  cv_url: string;
  updated_at?: string;
};
export type Experience = {
  id: string;
  organization: string;
  position: string;
  location: string;
  start_date: string | null;
  end_date: string | null;
  description: string;
  sort_order: number;
};
export type Certificate = {
  id: string;
  title: string;
  issuer: string;
  year: string;
  credential_url: string;
  asset_url: string;
  sort_order: number;
};
export type SocialLink = {
  id: string;
  platform: string;
  label: string;
  url: string;
  sort_order: number;
};
export type Settings = {
  id: string;
  seo_title: string;
  seo_description: string;
  availability_text: string;
  contact_email: string;
};
export type Portfolio = {
  profile: Profile;
  projects: Project[];
  technologies: Technology[];
  experiences: Experience[];
  certificates: Certificate[];
  social_links: SocialLink[];
  site_settings: Settings;
  demo: boolean;
};
export type ActionResult = { ok: boolean; message: string; url?: string };
