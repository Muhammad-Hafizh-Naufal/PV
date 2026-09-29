"use client";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main id="main-content" className="standalone">
      <span className="eyebrow">A BRIEF INTERRUPTION</span>
      <h1>Let’s try that again.</h1>
      <p>The content couldn’t be loaded. Please try again in a moment.</p>
      <button className="button button-dark" onClick={reset}>
        Try again
      </button>
    </main>
  );
}
