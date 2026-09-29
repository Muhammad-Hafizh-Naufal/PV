"use client";
import { useState, useTransition } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FileText, Trash2, ExternalLink, Copy, Upload } from "lucide-react";
import { deleteMedia } from "@/lib/actions";
import { uploadMediaFromBrowser } from "@/lib/media-upload";
export type MediaFile = {
  name: string;
  path: string;
  url: string;
  size: number;
};
export function MediaLibrary({
  files,
  demo,
}: {
  files: MediaFile[];
  demo: boolean;
}) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [confirm, setConfirm] = useState("");
  const [pending, startTransition] = useTransition();
  return (
    <>
      <div className="admin-title">
        <div>
          <h1>Media library</h1>
          <p>Manage your uploaded images and documents.</p>
        </div>
      </div>
      <div className="notice">
        Files in this library are publicly accessible. Only upload material
        intended for your portfolio. Replaced files stay here until you remove
        them; files still attached to content cannot be deleted through the
        studio.
      </div>
      <div className="admin-card">
        <label className="text-link" htmlFor="library-upload">
          <Upload size={15} /> Upload an image or PDF
        </label>
        <input
          style={{ display: "block", marginTop: 15, fontSize: 12 }}
          id="library-upload"
          type="file"
          disabled={demo || pending}
          accept="image/jpeg,image/png,image/webp,application/pdf"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (!file) return;
            startTransition(async () => {
              try {
                const result = await uploadMediaFromBrowser(file);
                setMessage(
                  result.ok
                    ? "File uploaded. Copy its URL to use it in an editor."
                    : result.message,
                );
                if (result.ok) router.refresh();
              } catch {
                setMessage("Upload failed. Please try again.");
              }
            });
            event.target.value = "";
          }}
        />
        <p style={{ margin: "12px 0 0", fontSize: 11 }}>
          JPEG, PNG, WebP, PDF · Maximum 8 MB per file · Showing uploads from
          your account.
        </p>
      </div>
      {pending && (
        <p className="form-message" role="status">
          Working…
        </p>
      )}
      {message && (
        <div className="notice" role="status">
          {message}
        </div>
      )}
      <div className="media-grid">
        {files.map((file) => (
          <div className="media-item" key={file.path}>
            <div className="media-preview">
              {file.name.endsWith(".pdf") ? (
                <FileText size={35} />
              ) : (
                <Image
                  src={file.url}
                  alt={file.name}
                  fill
                  sizes="(max-width: 640px) 50vw, 33vw"
                />
              )}
            </div>
            <div className="media-info">
              <p>
                {file.name}
                <br />
                {Math.ceil(file.size / 1024)} KB
              </p>
              <div className="admin-actions">
                <a
                  href={file.url}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`Open ${file.name}`}
                >
                  <ExternalLink size={14} />
                </a>
                <button
                  aria-label={`Copy URL for ${file.name}`}
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(file.url);
                      setMessage("File URL copied.");
                    } catch {
                      setMessage(
                        "Unable to copy. Open the file and copy its address instead.",
                      );
                    }
                  }}
                >
                  <Copy size={14} />
                </button>
                {confirm === file.path ? (
                  <div className="confirm-delete">
                    <span>Delete forever?</span>
                    <button
                      disabled={pending}
                      className="danger"
                      onClick={() =>
                        startTransition(async () => {
                          try {
                            const result = await deleteMedia(file.path);
                            setMessage(result.message);
                            setConfirm("");
                            if (result.ok) router.refresh();
                          } catch {
                            setMessage("Delete failed. Please try again.");
                          }
                        })
                      }
                    >
                      Yes
                    </button>
                    <button onClick={() => setConfirm("")} disabled={pending}>
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    disabled={demo || pending}
                    aria-label={`Delete ${file.name}`}
                    onClick={() => setConfirm(file.path)}
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      {!files.length && (
        <div className="admin-card admin-empty">
          <FileText size={28} />
          <p>
            No files on this page. Upload your first image or document to get
            started.
          </p>
        </div>
      )}
    </>
  );
}
