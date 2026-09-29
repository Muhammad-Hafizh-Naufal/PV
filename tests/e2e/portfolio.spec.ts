import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("home has readable content, project links, and no horizontal overflow", async ({
  page,
}, info) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Thoughtful code.Useful things.",
  );
  await expect(page.locator(".project-card")).toHaveCount(4);
  await expect(
    page.getByRole("link", { name: "Explore my work" }),
  ).toHaveAttribute("href", "#work");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  await page.screenshot({
    path: `test-results/home-${info.project.name}.png`,
    fullPage: true,
  });
  expect(errors).toEqual([]);
});
test("projects have real routes and missing projects return 404", async ({
  page,
}) => {
  for (const [slug, title] of [
    ["autocar", "AutoCar"],
    ["quiztfy", "Quiztfy"],
    ["dyy-fragrance", "DYY Fragrance"],
    ["news-management", "News Management"],
  ]) {
    const response = await page.goto(`/projects/${slug}`);
    expect(response?.status()).toBe(200);
    await expect(page.getByRole("heading", { level: 1 })).toContainText(title);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
  }
  const response = await page.goto("/projects/does-not-exist");
  expect(response?.status()).toBe(404);
  await expect(
    page.getByRole("link", { name: "Back to the portfolio" }),
  ).toBeVisible();
});
test("mobile navigation opens, closes on selection, and supports Escape", async ({
  page,
  isMobile,
}) => {
  test.skip(!isMobile);
  await page.goto("/");
  const toggle = page.getByRole("button", { name: "Open navigation" });
  await toggle.click();
  await expect(
    page.getByRole("navigation", { name: "Mobile navigation" }),
  ).toBeVisible();
  await page
    .getByRole("navigation", { name: "Mobile navigation" })
    .getByRole("link", { name: "About" })
    .click();
  await expect(
    page.getByRole("navigation", { name: "Mobile navigation" }),
  ).toHaveCount(0);
  await page.goto("/");
  await page.getByRole("button", { name: "Open navigation" }).click();
  await page.keyboard.press("Escape");
  await expect(
    page.getByRole("navigation", { name: "Mobile navigation" }),
  ).toHaveCount(0);
});
test("studio preview can search content but cannot save or upload", async ({
  page,
}, info) => {
  await page.goto("/admin");
  await expect(page.getByText("READ-ONLY PREVIEW")).toBeVisible();
  await page.screenshot({
    path: `test-results/admin-${info.project.name}.png`,
    fullPage: true,
  });
  await page.goto("/admin/projects");
  await page.getByRole("textbox", { name: "Search projects" }).fill("AutoCar");
  await expect(page.locator("tbody tr")).toHaveCount(1);
  await page.getByRole("link", { name: "Edit AutoCar", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Save changes" }),
  ).toBeDisabled();
  await expect(page.getByLabel("Upload file")).toBeDisabled();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
});
test("all admin modules and the new-project editor render", async ({
  page,
}) => {
  for (const path of [
    "profile",
    "experiences",
    "technologies",
    "certificates",
    "social_links",
    "site_settings",
    "media",
    "projects/new",
  ]) {
    const response = await page.goto(`/admin/${path}`);
    expect(response?.status()).toBe(200);
    await expect(page.locator("main h1")).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
  }
  await page.goto("/admin/login");
  await expect(
    page.getByRole("button", { name: "Sign in to your studio" }),
  ).toBeDisabled();
});
test("metadata, sitemap, and robots are served", async ({ page, request }) => {
  await page.goto("/");
  await expect(page).toHaveTitle("Hafizh — Full-Stack Developer");
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
    "content",
    "Hafizh — Full-Stack Developer",
  );
  const sitemap = await request.get("/sitemap.xml");
  expect(await sitemap.text()).toContain("/projects/autocar");
  const robots = await request.get("/robots.txt");
  expect(await robots.text()).toContain("Disallow: /admin/");
  const og = await request.get("/opengraph-image");
  expect(og.status()).toBe(200);
  expect(og.headers()["content-type"]).toContain("image/png");
});
test("core pages have no serious or critical accessibility violations", async ({
  page,
}) => {
  for (const path of [
    "/",
    "/projects/autocar",
    "/admin",
    "/admin/profile",
    "/admin/login",
  ]) {
    await page.goto(path);
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    const violations = results.violations.filter(
      (v) => v.impact === "critical" || v.impact === "serious",
    );
    expect(
      violations.map((v) => ({
        id: v.id,
        nodes: v.nodes.map((n) => n.target),
      })),
      path,
    ).toEqual([]);
  }
});
test("reduced motion keeps the portfolio readable", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  const animation = await page
    .locator(".code-object")
    .evaluate((el) => getComputedStyle(el).animationName);
  expect(animation).toBe("none");
});
