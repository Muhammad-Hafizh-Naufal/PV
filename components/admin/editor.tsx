"use client";

import { useActionState, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Check, Upload, ExternalLink } from "lucide-react";
import { collection, type CollectionKey, type Field } from "@/lib/content";
import { saveContent } from "@/lib/actions";
import { uploadMediaFromBrowser } from "@/lib/media-upload";
import type { ContentRow } from "@/lib/admin-data";
import type { Technology } from "@/lib/types";

function isImageUrl(url: string) {
  return /\.(?:jpe?g|png|webp)(?:$|[?#])/i.test(url);
}

function MediaField({
  field,
  initial,
  disabled,
  onBusy,
}: {
  field: Field;
  initial: string;
  disabled: boolean;
  onBusy: (busy: boolean) => void;
}) {
  const [url, setUrl] = useState(initial);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  async function upload(file?: File) {
    if (!file) return;
    setBusy(true);
    onBusy(true);
    setMessage("Uploading…");
    try {
      const result = await uploadMediaFromBrowser(file);
      if (result.url) setUrl(result.url);
      setMessage(result.message);
    } catch {
      setMessage("Upload failed. Please check your connection and try again.");
    } finally {
      setBusy(false);
      onBusy(false);
    }
  }
  return (
    <div className="upload-control">
      <input
        id={field.name}
        name={field.name}
        type="url"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Upload a file or paste its storage URL"
        disabled={disabled || busy}
      />
      {/^https?:\/\//.test(url) &&
        (field.type === "image" ||
          (field.type === "media" && isImageUrl(url))) && (
          <div className="asset-preview">
            <Image
              src={url}
              alt={`${field.label} preview`}
              fill
              sizes="270px"
              unoptimized
            />
          </div>
        )}
      {url &&
        (field.type === "file" ||
          (field.type === "media" && !isImageUrl(url))) && (
          <a className="text-link" href={url} target="_blank" rel="noreferrer">
            View uploaded file <ExternalLink size={13} />
          </a>
        )}
      <label className="text-link" htmlFor={`upload-${field.name}`}>
        <Upload size={13} /> {busy ? "Uploading…" : "Upload file"}
      </label>
      <input
        id={`upload-${field.name}`}
        type="file"
        accept={
          field.type === "image"
            ? "image/jpeg,image/png,image/webp"
            : field.type === "media"
              ? "image/jpeg,image/png,image/webp,application/pdf"
              : "application/pdf"
        }
        disabled={disabled || busy}
        onChange={(e) => void upload(e.target.files?.[0])}
      />
      <small>
        Max. 8 MB.{" "}
        {field.type === "image"
          ? "JPEG, PNG, or WebP."
          : field.type === "media"
            ? "JPEG, PNG, WebP, or PDF."
            : "PDF only."}{" "}
        Files are publicly accessible.
      </small>
      {message && (
        <span className="upload-status" role="status">
          {message}
        </span>
      )}
    </div>
  );
}
export function Editor({
  kind,
  row,
  technologies,
  demo,
  isNew,
  saved = false,
}: {
  kind: CollectionKey;
  row: ContentRow;
  technologies: Technology[];
  demo: boolean;
  isNew?: boolean;
  saved?: boolean;
}) {
  const config = collection(kind);
  const [state, action, pending] = useActionState(
    saveContent.bind(null, kind),
    {
      ok: saved,
      message: saved ? "Saved. Your portfolio has been updated." : "",
    },
  );
  const [uploadCount, setUploadCount] = useState(0);
  const [title, setTitle] = useState(String(row.title || ""));
  const [slug, setSlug] = useState(String(row.slug || ""));
  const [slugTouched, setSlugTouched] = useState(!isNew);
  const disabled = demo || pending;
  return (
    <>
      <div className="admin-title">
        <div>
          <Link
            href={config.singleton ? "/admin" : `/admin/${kind}`}
            className="text-link"
            style={{ marginBottom: 18 }}
          >
            <ArrowLeft size={13} />{" "}
            {config.singleton ? "Overview" : config.label}
          </Link>
          <h1>
            {config.singleton
              ? config.label
              : `${isNew && !state.ok ? "New" : "Edit"} ${config.singular.toLowerCase()}`}
          </h1>
          <p>{config.description}</p>
        </div>
        {kind === "projects" && row.status === "published" && (
          <Link
            className="text-link"
            href={`/projects/${row.slug}`}
            target="_blank"
          >
            View <ExternalLink size={13} />
          </Link>
        )}
      </div>
      <form className="editor-form" action={action}>
        <input type="hidden" name="id" value={String(row.id)} />
        <input type="hidden" name="_new" value={isNew ? "true" : "false"} />
        <div className="admin-card">
          <div className="form-grid">
            {config.fields.map((field) => (
              <div
                className={`field ${field.full ? "full" : ""}`}
                key={field.name}
              >
                {field.type !== "checkbox" && (
                  <label htmlFor={field.name}>
                    {field.label}
                    {field.required && <span aria-hidden="true"> *</span>}
                  </label>
                )}
                {field.type === "textarea" ? (
                  <textarea
                    id={field.name}
                    name={field.name}
                    className={field.name === "content" ? "tall" : ""}
                    defaultValue={String(row[field.name] || "")}
                    required={field.required}
                    disabled={disabled}
                  />
                ) : field.type === "select" ? (
                  <select
                    name={field.name}
                    id={field.name}
                    defaultValue={String(row[field.name] || field.options?.[0])}
                    disabled={disabled}
                  >
                    {field.options?.map((option) => (
                      <option key={option}>{option}</option>
                    ))}
                  </select>
                ) : field.type === "checkbox" ? (
                  <label className="checkbox-field">
                    <input
                      type="checkbox"
                      name={field.name}
                      defaultChecked={Boolean(row[field.name])}
                      disabled={disabled}
                    />
                    {field.label}
                  </label>
                ) : field.type === "image" ||
                  field.type === "file" ||
                  field.type === "media" ? (
                  <MediaField
                    field={field}
                    initial={String(row[field.name] || "")}
                    disabled={disabled}
                    onBusy={(busy) =>
                      setUploadCount((count) => count + (busy ? 1 : -1))
                    }
                  />
                ) : kind === "projects" && field.name === "title" ? (
                  <input
                    id="title"
                    name="title"
                    required
                    value={title}
                    disabled={disabled}
                    onChange={(e) => {
                      setTitle(e.target.value);
                      if (!slugTouched)
                        setSlug(
                          e.target.value
                            .toLowerCase()
                            .replace(/[^a-z0-9]+/g, "-")
                            .replace(/^-|-$/g, ""),
                        );
                    }}
                  />
                ) : kind === "projects" && field.name === "slug" ? (
                  <input
                    id="slug"
                    name="slug"
                    required
                    value={slug}
                    disabled={disabled}
                    onChange={(e) => {
                      setSlugTouched(true);
                      setSlug(e.target.value);
                    }}
                  />
                ) : (
                  <input
                    id={field.name}
                    name={field.name}
                    type={field.type || "text"}
                    defaultValue={String(
                      row[field.name] ?? (field.type === "number" ? 0 : ""),
                    )}
                    required={field.required}
                    disabled={disabled}
                    min={field.type === "number" ? 0 : undefined}
                    max={field.type === "number" ? 10000 : undefined}
                  />
                )}{" "}
                {field.hint && <small>{field.hint}</small>}
              </div>
            ))}
            {kind === "projects" && (
              <fieldset className="field full">
                <legend className="field-label" style={{ marginBottom: 12 }}>
                  Technology tags
                </legend>
                <div className="technology-options">
                  {technologies.map((tech) => (
                    <label key={tech.id}>
                      <input
                        name="technology_ids"
                        type="checkbox"
                        value={tech.id}
                        defaultChecked={(
                          (row.technology_ids as string[]) || []
                        ).includes(tech.id)}
                        disabled={disabled}
                      />
                      {tech.name}
                    </label>
                  ))}
                </div>
                {!technologies.length && (
                  <small>
                    Add technologies in Skills before tagging a project.
                  </small>
                )}
              </fieldset>
            )}
          </div>
        </div>
        <div className="form-footer">
          <button
            type="submit"
            className="button button-dark"
            disabled={disabled || uploadCount > 0}
          >
            {pending ? "Saving…" : "Save changes"}
            <Check size={15} />
          </button>
          {state.message && (
            <p
              role={state.ok ? "status" : "alert"}
              className={`form-message ${state.ok ? "" : "error"}`}
            >
              {state.message}
            </p>
          )}
        </div>
      </form>
    </>
  );
}
