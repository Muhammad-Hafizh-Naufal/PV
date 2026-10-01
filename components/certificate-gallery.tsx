"use client";

import Image from "next/image";
import { Award, ExternalLink, Maximize2, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { Certificate } from "@/lib/types";

function isImageAsset(url: string) {
  return /\.(?:jpe?g|png|webp)(?:$|[?#])/i.test(url);
}

function pdfPreviewUrl(url: string, compact = false) {
  const [baseUrl] = url.split("#");
  return `${baseUrl}#page=1&view=FitH&toolbar=${compact ? "0" : "1"}&navpanes=0`;
}

export function CertificateGallery({
  certificates,
}: {
  certificates: Certificate[];
}) {
  const [selected, setSelected] = useState<Certificate | null>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const modalPanel = useRef<HTMLDivElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!selected) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButton.current?.focus();

    function handleModalKeyboard(event: KeyboardEvent) {
      if (event.key === "Escape") setSelected(null);
      if (event.key === "Tab") {
        const focusable = Array.from(
          modalPanel.current?.querySelectorAll<HTMLElement>(
            "a[href], button:not([disabled])",
          ) ?? [],
        );
        const first = focusable.at(0);
        const last = focusable.at(-1);
        if (!first || !last) return;
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    }

    window.addEventListener("keydown", handleModalKeyboard);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleModalKeyboard);
      previousFocus.current?.focus();
    };
  }, [selected]);

  function openPreview(certificate: Certificate) {
    previousFocus.current = document.activeElement as HTMLElement | null;
    setSelected(certificate);
  }

  return (
    <div className="certificates">
      <div className="certificate-heading">
        <div>
          <span className="eyebrow">CERTIFICATIONS</span>
          <h3>Learning, backed by practice.</h3>
        </div>
        <span className="micro">
          {certificates.length} credential{certificates.length === 1 ? "" : "s"}
        </span>
      </div>

      <div className="certificate-grid">
        {certificates.map((certificate) => {
          const hasImage = isImageAsset(certificate.asset_url);
          return (
            <article className="certificate-card" key={certificate.id}>
              {hasImage ? (
                <button
                  className="certificate-preview certificate-preview-image"
                  type="button"
                  onClick={() => openPreview(certificate)}
                  aria-label={`Preview ${certificate.title}`}
                >
                  <Image
                    src={certificate.asset_url}
                    alt={certificate.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1100px) 50vw, 33vw"
                    unoptimized
                  />
                  <span className="certificate-zoom" aria-hidden="true">
                    <Maximize2 size={17} />
                  </span>
                </button>
              ) : certificate.asset_url ? (
                <div className="certificate-preview certificate-preview-pdf">
                  <iframe
                    src={pdfPreviewUrl(certificate.asset_url, true)}
                    title={`${certificate.title} PDF preview`}
                    loading="lazy"
                    tabIndex={-1}
                    aria-hidden="true"
                  />
                  <span className="certificate-pdf-label">PDF</span>
                  <button
                    type="button"
                    className="certificate-preview-trigger"
                    onClick={() => openPreview(certificate)}
                    aria-label={`Preview ${certificate.title} PDF`}
                  >
                    <span className="certificate-zoom" aria-hidden="true">
                      <Maximize2 size={17} />
                    </span>
                  </button>
                </div>
              ) : (
                <div className="certificate-preview certificate-preview-file">
                  <Award size={38} strokeWidth={1.25} />
                  <span>CERTIFICATE</span>
                </div>
              )}

              <div className="certificate-content">
                <div>
                  <h4>{certificate.title}</h4>
                  <p>
                    {certificate.issuer} · {certificate.year}
                  </p>
                </div>
                <div className="certificate-actions">
                  {hasImage && (
                    <button
                      type="button"
                      className="text-link"
                      onClick={() => openPreview(certificate)}
                    >
                      View certificate <Maximize2 size={13} />
                    </button>
                  )}
                  {!hasImage && certificate.asset_url && (
                    <button
                      type="button"
                      className="text-link"
                      onClick={() => openPreview(certificate)}
                    >
                      Preview <Maximize2 size={13} />
                    </button>
                  )}
                  {!hasImage && certificate.asset_url && (
                    <a
                      className="text-link"
                      href={certificate.asset_url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Open PDF <ExternalLink size={13} />
                    </a>
                  )}
                  {certificate.credential_url && (
                    <a
                      className="text-link"
                      href={certificate.credential_url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Verify <ExternalLink size={13} />
                    </a>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {selected && (
        <div
          className="certificate-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="certificate-modal-title"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setSelected(null);
          }}
        >
          <div className="certificate-modal-panel" ref={modalPanel}>
            <div className="certificate-modal-bar">
              <div>
                <strong id="certificate-modal-title">{selected.title}</strong>
                <span>
                  {selected.issuer} · {selected.year}
                </span>
              </div>
              <div className="certificate-modal-actions">
                {!isImageAsset(selected.asset_url) && (
                  <a
                    className="text-link"
                    href={selected.asset_url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Open PDF <ExternalLink size={13} />
                  </a>
                )}
                <button
                  ref={closeButton}
                  type="button"
                  onClick={() => setSelected(null)}
                  aria-label="Close certificate preview"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            <div className="certificate-modal-document">
              {isImageAsset(selected.asset_url) ? (
                <Image
                  src={selected.asset_url}
                  alt={selected.title}
                  fill
                  sizes="95vw"
                  unoptimized
                />
              ) : (
                <iframe
                  src={pdfPreviewUrl(selected.asset_url)}
                  title={`${selected.title} PDF`}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
