import Link from "next/link";
import { redirect } from "next/navigation";
import { getAdmin } from "@/lib/auth";
import { supabaseConfig } from "@/lib/supabase/config";
import { LoginForm } from "@/components/admin/login-form";
export default async function LoginPage() {
  const configured = Boolean(supabaseConfig());
  if (configured && (await getAdmin())) redirect("/admin");
  return (
    <main id="main-content" className="login-page">
      <section className="login-story">
        <Link href="/" className="wordmark">
          hafizh<span>.</span>
        </Link>
        <div className="login-orb" />
        <h2>
          Good work deserves
          <br />
          <span>a place to grow.</span>
        </h2>
        <span className="micro">YOUR PERSONAL CONTENT STUDIO</span>
      </section>
      <section className="login-content">
        <div className="login-box">
          <span className="eyebrow" style={{ marginBottom: 19 }}>
            WELCOME BACK
          </span>
          <h1>A little behind the scenes.</h1>
          <p>Sign in to keep your work, story, and portfolio up to date.</p>
          {!configured && (
            <div className="notice warning">
              Supabase is not connected yet. Add your environment variables and
              follow the database setup in README.md.
            </div>
          )}
          <LoginForm configured={configured} />
          <p className="login-footnote">
            Private access for authorized administrators. Account creation is
            managed in Supabase.
          </p>
          {!configured && (
            <Link className="login-preview-link" href="/admin">
              Explore the read-only studio preview →
            </Link>
          )}
        </div>
      </section>
    </main>
  );
}
