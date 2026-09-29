"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderOpen,
  User,
  BriefcaseBusiness,
  Code2,
  Award,
  Link2,
  Settings,
  Image,
  ArrowUpRight,
  LogOut,
} from "lucide-react";
import { logout } from "@/lib/actions";

const navigation = [
  ["/admin", "Overview", LayoutDashboard],
  ["/admin/projects", "Projects", FolderOpen],
  ["/admin/profile", "Profile", User],
  ["/admin/experiences", "Experience", BriefcaseBusiness],
  ["/admin/technologies", "Skills", Code2],
  ["/admin/certificates", "Certificates", Award],
  ["/admin/social_links", "Social links", Link2],
  ["/admin/media", "Media library", Image],
  ["/admin/site_settings", "Settings", Settings],
] as const;
export function AdminShell({
  children,
  demo,
  email,
}: {
  children: React.ReactNode;
  demo: boolean;
  email?: string;
}) {
  const path = usePathname();
  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <Link href="/" className="wordmark">
            hafizh<span>.</span>
          </Link>
          <small>CONTENT STUDIO</small>
        </div>
        <nav className="admin-nav" aria-label="Admin navigation">
          {navigation.map(([href, label, Icon]) => (
            <Link
              href={href}
              key={href}
              className={
                (href === "/admin" ? path === href : path.startsWith(href))
                  ? "active"
                  : ""
              }
            >
              <Icon size={17} />
              {label}
            </Link>
          ))}
        </nav>
        <div className="admin-sidebar-footer">
          <Link href="/" target="_blank">
            View portfolio <ArrowUpRight size={13} />
          </Link>
          {!demo && (
            <form action={logout}>
              <button type="submit">
                <LogOut size={13} /> Sign out
              </button>
            </form>
          )}
          {demo && (
            <Link href="/admin/login">
              Connect your account <ArrowUpRight size={13} />
            </Link>
          )}
        </div>
      </aside>
      <main id="main-content" className="admin-main">
        <div className="admin-topbar">
          <span>YOUR SPACE TO KEEP THINGS FRESH.</span>
          <span>
            {demo ? (
              <span className="badge preview">READ-ONLY PREVIEW</span>
            ) : (
              email
            )}
          </span>
        </div>
        {demo && (
          <div className="notice warning">
            You’re viewing sample content. Connect Supabase and create an admin
            account to save changes or upload media. Setup instructions are in
            README.md.
          </div>
        )}
        {children}
      </main>
    </div>
  );
}
