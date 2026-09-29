import Link from "next/link";
import { ArrowUpRight, Plus } from "lucide-react";
import { getAdminRows } from "@/lib/admin-data";
export default async function Dashboard() {
  const [projects, experiences, technologies, certificates] = await Promise.all(
    [
      getAdminRows("projects"),
      getAdminRows("experiences"),
      getAdminRows("technologies"),
      getAdminRows("certificates"),
    ],
  );
  const stats = [
    [
      "Projects",
      projects.length,
      `${projects.filter((p) => p.status === "published").length} PUBLISHED`,
    ],
    ["Experience", experiences.length, "STEPS IN YOUR JOURNEY"],
    ["Technologies", technologies.length, "TOOLS IN YOUR TOOLKIT"],
    ["Certificates", certificates.length, "CREDENTIALS & LEARNING"],
  ];
  const recent = [...projects]
    .sort((a, b) => String(b.updated_at).localeCompare(String(a.updated_at)))
    .slice(0, 5);
  return (
    <>
      <div className="admin-title">
        <div>
          <span className="eyebrow" style={{ marginBottom: 15 }}>
            A FRESH PERSPECTIVE
          </span>
          <h1>Your portfolio, at a glance.</h1>
          <p>A home for your work. A little room for what comes next.</p>
        </div>
        <Link href="/admin/projects/new" className="button button-dark">
          <Plus size={15} /> New project
        </Link>
      </div>
      <div className="stats-grid">
        {stats.map(([label, count, note]) => (
          <div className="stat-card" key={label}>
            <span>{label}</span>
            <strong>{String(count).padStart(2, "0")}</strong>
            <small>{note}</small>
          </div>
        ))}
      </div>
      <section className="admin-card">
        <h2>Recently updated projects</h2>
        <table className="admin-list">
          <thead>
            <tr>
              <th>Project</th>
              <th>Publication</th>
              <th className="optional-col">Visibility</th>
              <th>
                <span className="sr-only">Edit</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {recent.map((p) => (
              <tr key={String(p.id)}>
                <td>
                  <Link href={`/admin/projects/${p.id}`}>{p.title}</Link>
                  <small>{p.category}</small>
                </td>
                <td>
                  <span
                    className={`badge ${p.status === "draft" ? "draft" : ""}`}
                  >
                    {p.status}
                  </span>
                </td>
                <td className="optional-col">
                  {p.featured ? "Featured" : "Standard"}
                </td>
                <td>
                  <Link
                    href={`/admin/projects/${p.id}`}
                    aria-label={`Edit ${p.title}`}
                  >
                    <ArrowUpRight size={17} />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!projects.length && (
          <p className="admin-empty">
            Add your first project to start telling your story.
          </p>
        )}
      </section>
      <section className="admin-card">
        <h2>Make it yours.</h2>
        <p>
          Add verified experience dates, your contact email, live project links,
          a portrait, and your CV. The sample artwork can be replaced with
          actual project screenshots in each project editor.
        </p>
        <Link href="/admin/profile" className="text-link">
          Update your profile <ArrowUpRight size={14} />
        </Link>
      </section>
    </>
  );
}
