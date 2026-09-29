import { describe, expect, it } from "vitest";
import {
  collection,
  contentSchema,
  parseContent,
  type CollectionKey,
} from "../lib/content";
import { demoPortfolio } from "../lib/demo";

function formFor(key: CollectionKey, data: Record<string, unknown>) {
  const form = new FormData();
  form.set("id", String(data.id));
  for (const field of collection(key).fields) {
    if (field.type === "checkbox") {
      if (data[field.name]) form.set(field.name, "on");
    } else form.set(field.name, String(data[field.name] ?? ""));
  }
  return form;
}
describe("content validation", () => {
  it("accepts the starter project while removing unrelated fields", () => {
    const form = formFor("projects", demoPortfolio.projects[0]);
    form.set("user_role", "admin");
    const result = parseContent("projects", form);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.featured).toBe(true);
      expect(result.data).not.toHaveProperty("user_role");
    }
  });
  it.each(["javascript:alert(1)", "data:text/html,test", "//evil.example"])(
    "rejects an unsafe link: %s",
    (url) => {
      const form = formFor("projects", demoPortfolio.projects[0]);
      form.set("demo_url", url);
      expect(parseContent("projects", form).success).toBe(false);
    },
  );
  it("rejects invalid slugs, publication status, and technology identifiers", () => {
    const form = formFor("projects", demoPortfolio.projects[0]);
    form.set("slug", "../admin");
    expect(parseContent("projects", form).success).toBe(false);
    form.set("slug", "valid-slug");
    form.set("status", "anything");
    expect(parseContent("projects", form).success).toBe(false);
    form.set("status", "draft");
    form.append("technology_ids", "not-a-uuid");
    expect(parseContent("projects", form).success).toBe(false);
  });
  it("supports an ongoing experience but rejects reversed or invalid dates", () => {
    const form = formFor("experiences", demoPortfolio.experiences[0]);
    expect(parseContent("experiences", form).success).toBe(true);
    form.set("start_date", "2025-01-01");
    form.set("end_date", "2024-01-01");
    expect(parseContent("experiences", form).success).toBe(false);
    form.set("end_date", "2025-02-30");
    expect(parseContent("experiences", form).success).toBe(false);
    form.set("end_date", "");
    expect(parseContent("experiences", form).success).toBe(true);
  });
  it("prevents additional profile singleton records", () => {
    expect(
      contentSchema("profile").safeParse({
        ...demoPortfolio.profile,
        id: crypto.randomUUID(),
      }).success,
    ).toBe(false);
  });
  it("accepts optional contact details but rejects malformed emails", () => {
    const form = formFor("site_settings", demoPortfolio.site_settings);
    expect(parseContent("site_settings", form).success).toBe(true);
    form.set("contact_email", "not-email");
    expect(parseContent("site_settings", form).success).toBe(false);
  });
});
