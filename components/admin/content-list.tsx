"use client";
import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Pencil, Trash2, FolderOpen, Plus } from "lucide-react";
import { collection, type CollectionKey } from "@/lib/content";
import type { ContentRow } from "@/lib/admin-data";
import { deleteContent } from "@/lib/actions";

export function ContentList({
  kind,
  rows,
  demo,
}: {
  kind: CollectionKey;
  rows: ContentRow[];
  demo: boolean;
}) {
  const config = collection(kind);
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");
  const [pending, startTransition] = useTransition();
  const filtered = rows.filter(
    (row) =>
      String(row[config.titleKey])
        .toLowerCase()
        .includes(query.toLowerCase()) &&
      (status === "all" || row.status === status),
  );
  return (
    <>
      <div className="admin-title">
        <div>
          <h1>{config.label}</h1>
          <p>{config.description}</p>
        </div>
        <Link href={`/admin/${kind}/new`} className="button button-dark">
          <Plus size={15} /> Add {config.singular.toLowerCase()}
        </Link>
      </div>
      <div className="admin-search">
        <Search size={15} />
        <input
          aria-label={`Search ${config.label.toLowerCase()}`}
          placeholder={`Search ${config.label.toLowerCase()}…`}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {kind === "projects" && (
          <select
            aria-label="Filter by publication status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="all">All</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        )}
      </div>
      {message && (
        <div className="notice" role="status">
          {message}
        </div>
      )}
      <div className="admin-card">
        {filtered.length ? (
          <table className="admin-list">
            <thead>
              <tr>
                <th>{config.singular}</th>
                <th className="optional-col">Order</th>
                {kind === "projects" && <th>Status</th>}
                <th>
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row) => (
                <tr key={String(row.id)}>
                  <td>
                    <Link href={`/admin/${kind}/${row.id}`}>
                      {String(row[config.titleKey])}
                    </Link>
                    <small>
                      {String(
                        row.category ||
                          row.position ||
                          row.issuer ||
                          row.platform ||
                          "",
                      )}
                      {row.featured ? " · Featured" : ""}
                    </small>
                  </td>
                  <td className="optional-col">{row.sort_order}</td>
                  {kind === "projects" && (
                    <td>
                      <span
                        className={`badge ${row.status === "draft" ? "draft" : ""}`}
                      >
                        {String(row.status)}
                      </span>
                    </td>
                  )}
                  <td>
                    <div className="admin-actions">
                      {confirm === row.id ? (
                        <div className="confirm-delete">
                          <span>Delete?</span>
                          <button
                            className="danger"
                            disabled={pending}
                            onClick={() =>
                              startTransition(async () => {
                                try {
                                  const result = await deleteContent(
                                    kind,
                                    String(row.id),
                                  );
                                  setMessage(result.message);
                                  setConfirm("");
                                  if (result.ok) router.refresh();
                                } catch {
                                  setMessage(
                                    "Delete failed. Please try again.",
                                  );
                                }
                              })
                            }
                          >
                            {pending ? "…" : "Yes"}
                          </button>
                          <button
                            disabled={pending}
                            onClick={() => setConfirm("")}
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <>
                          <Link
                            href={`/admin/${kind}/${row.id}`}
                            aria-label={`Edit ${row[config.titleKey]}`}
                          >
                            <Pencil size={14} />
                          </Link>
                          <button
                            disabled={demo || pending}
                            aria-label={`Delete ${row[config.titleKey]}`}
                            onClick={() => setConfirm(String(row.id))}
                          >
                            <Trash2 size={14} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="admin-empty">
            <FolderOpen size={28} />
            <p>
              {query || status !== "all"
                ? "No matching records. Try another search or filter."
                : `No ${config.label.toLowerCase()} yet. Add your first record to get started.`}
            </p>
          </div>
        )}
      </div>
    </>
  );
}
