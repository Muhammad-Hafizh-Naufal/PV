export default function Loading() {
  return (
    <div
      className="loading-page"
      aria-busy="true"
      aria-label="Loading content studio"
    >
      <div className="skeleton skeleton-label" />
      <div className="skeleton skeleton-title" />
      <div className="skeleton skeleton-title" />
      <div className="skeleton skeleton-card" />
      <span className="sr-only">Loading content…</span>
    </div>
  );
}
