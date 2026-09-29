import { requireAdmin } from "@/lib/auth";
import { supabaseConfig } from "@/lib/supabase/config";
import { AdminShell } from "@/components/admin/shell";
export const dynamic = "force-dynamic";
export default async function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const demo = !supabaseConfig();
  const admin = demo ? null : await requireAdmin();
  return (
    <AdminShell demo={demo} email={admin?.user.email}>
      {children}
    </AdminShell>
  );
}
