import Link from "next/link";
export default function NotFound() {
  return (
    <main id="main-content" className="standalone">
      <span className="eyebrow">404 / A SMALL DETOUR</span>
      <h1>
        Nothing here.
        <br />
        <span>Plenty to explore.</span>
      </h1>
      <p>This page may have moved, or the project isn’t published yet.</p>
      <Link className="button button-dark" href="/">
        Back to the portfolio ↗
      </Link>
    </main>
  );
}
