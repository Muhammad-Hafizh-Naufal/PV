import { Script } from "node:vm";
import { expect, test } from "@playwright/test";

test("login receives complete JavaScript and starts without syntax errors", async ({
  page,
}) => {
  const runtimeErrors: string[] = [];
  page.on("pageerror", (error) => runtimeErrors.push(error.message));

  const response = await page.goto("/admin/login", { waitUntil: "load" });
  expect(response?.status()).toBe(200);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

  // Inspect HTTP responses, not build artifacts: injected/truncated responses
  // can be broken even when every JavaScript file on disk is syntactically valid.
  const scripts = await page
    .locator("script[src]")
    .evaluateAll((elements) =>
      elements.map((element) => (element as HTMLScriptElement).src),
    );
  expect(scripts.length).toBeGreaterThan(0);
  for (const url of scripts) {
    const script = await page.request.get(url);
    expect(script.status(), new URL(url).pathname).toBe(200);
    const source = await script.text();
    expect(
      () => new Script(source, { filename: new URL(url).pathname }),
      `JavaScript response must be complete: ${new URL(url).pathname}`,
    ).not.toThrow();
  }
  expect(runtimeErrors).toEqual([]);
});
