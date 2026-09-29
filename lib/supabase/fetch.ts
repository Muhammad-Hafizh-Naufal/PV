const REQUEST_TIMEOUT_MS = 15_000;

/** Prevent a stalled Supabase request from leaving a Server Action pending forever. */
export function fetchWithTimeout(
  input: RequestInfo | URL,
  init: RequestInit = {},
) {
  const timeout = AbortSignal.timeout(REQUEST_TIMEOUT_MS);
  const signal = init.signal
    ? AbortSignal.any([init.signal, timeout])
    : timeout;

  return fetch(input, { ...init, signal });
}

export function isRequestTimeout(error: unknown) {
  return (
    error instanceof Error &&
    (error.name === "TimeoutError" || error.name === "AbortError")
  );
}
