import { z } from "zod";
import { SINGLETON_ID } from "./demo";

export type Field = {
  name: string;
  label: string;
  type?:
    | "text"
    | "textarea"
    | "url"
    | "email"
    | "number"
    | "date"
    | "select"
    | "checkbox"
    | "image"
    | "file";
  required?: boolean;
  full?: boolean;
  hint?: string;
  options?: string[];
};
export type Collection = {
  label: string;
  singular: string;
  description: string;
  singleton?: boolean;
  titleKey: string;
  fields: Field[];
};
const order: Field = {
  name: "sort_order",
  label: "Display order",
  type: "number",
  hint: "Lower numbers appear first.",
};
export const collections = {
  projects: {
    label: "Projects",
    singular: "Project",
    description: "The ideas, products, and case studies in your portfolio.",
    titleKey: "title",
    fields: [
      { name: "title", label: "Project title", required: true },
      {
        name: "slug",
        label: "URL slug",
        required: true,
        hint: "Lowercase letters, numbers, and hyphens.",
      },
      { name: "summary", label: "Short summary", required: true, full: true },
      {
        name: "content",
        label: "Case study",
        type: "textarea",
        required: true,
        full: true,
        hint: "Separate paragraphs with a blank line. For section headings, put the heading on its own line immediately above the paragraph.",
      },
      { name: "category", label: "Category", required: true },
      {
        name: "year",
        label: "Year",
        hint: "Optional; use the actual project year.",
      },
      { name: "cover_url", label: "Project cover", type: "image", full: true },
      { name: "github_url", label: "Source code URL", type: "url" },
      { name: "demo_url", label: "Live project URL", type: "url" },
      {
        name: "status",
        label: "Publication",
        type: "select",
        options: ["draft", "published"],
      },
      order,
      { name: "featured", label: "Featured project", type: "checkbox" },
    ],
  },
  profile: {
    label: "Profile",
    singular: "Profile",
    description: "Introduce the person behind the work.",
    singleton: true,
    titleKey: "name",
    fields: [
      { name: "name", label: "Full name", required: true },
      { name: "title", label: "Professional title", required: true },
      {
        name: "headline",
        label: "Hero introduction",
        required: true,
        full: true,
      },
      {
        name: "about",
        label: "About you",
        type: "textarea",
        required: true,
        full: true,
      },
      { name: "location", label: "Location", required: true },
      { name: "avatar_url", label: "Portrait", type: "image", full: true },
      { name: "cv_url", label: "CV (PDF)", type: "file", full: true },
    ],
  },
  experiences: {
    label: "Experience",
    singular: "Experience",
    description: "Work, programmes, and meaningful learning.",
    titleKey: "organization",
    fields: [
      { name: "organization", label: "Organization", required: true },
      { name: "position", label: "Role / programme", required: true },
      { name: "location", label: "Location" },
      order,
      { name: "start_date", label: "Start date", type: "date" },
      {
        name: "end_date",
        label: "End date",
        type: "date",
        hint: "Leave blank for an ongoing role.",
      },
      {
        name: "description",
        label: "Description",
        type: "textarea",
        full: true,
        required: true,
      },
    ],
  },
  technologies: {
    label: "Skills",
    singular: "Technology",
    description: "Keep your toolkit focused and organized.",
    titleKey: "name",
    fields: [
      { name: "name", label: "Technology", required: true },
      {
        name: "category",
        label: "Category",
        type: "select",
        options: ["Frontend", "Backend", "Database", "AI & APIs", "Tools"],
      },
      {
        name: "icon_key",
        label: "Icon label",
        hint: "Optional label for future icon customization.",
      },
      order,
    ],
  },
  certificates: {
    label: "Certificates",
    singular: "Certificate",
    description: "Verified learning and credentials.",
    titleKey: "title",
    fields: [
      { name: "title", label: "Certificate title", required: true },
      { name: "issuer", label: "Issuer", required: true },
      { name: "year", label: "Year", required: true },
      order,
      {
        name: "credential_url",
        label: "Verification URL",
        type: "url",
        full: true,
      },
      {
        name: "asset_url",
        label: "Certificate (PDF)",
        type: "file",
        full: true,
      },
    ],
  },
  social_links: {
    label: "Social links",
    singular: "Social link",
    description: "Where people can find and follow your work.",
    titleKey: "label",
    fields: [
      { name: "platform", label: "Platform", required: true },
      { name: "label", label: "Display label", required: true },
      {
        name: "url",
        label: "Profile URL",
        type: "url",
        required: true,
        full: true,
      },
      order,
    ],
  },
  site_settings: {
    label: "Settings",
    singular: "Site settings",
    description: "Search previews, availability, and contact details.",
    singleton: true,
    titleKey: "seo_title",
    fields: [
      { name: "seo_title", label: "SEO title", required: true, full: true },
      {
        name: "seo_description",
        label: "SEO description",
        required: true,
        type: "textarea",
        full: true,
      },
      {
        name: "availability_text",
        label: "Availability message",
        required: true,
      },
      { name: "contact_email", label: "Contact email", type: "email" },
    ],
  },
} satisfies Record<string, Collection>;
export type CollectionKey = keyof typeof collections;
export function isCollection(value: string): value is CollectionKey {
  return Object.hasOwn(collections, value);
}
export function collection(value: CollectionKey): Collection {
  return collections[value];
}

const webUrl = z
  .string()
  .trim()
  .max(2048)
  .refine((value) => {
    if (!value) return true;
    try {
      return ["https:", "http:"].includes(new URL(value).protocol);
    } catch {
      return false;
    }
  }, "Use a complete http or https URL.");
const dateString = z
  .string()
  .refine(
    (value) =>
      /^\d{4}-\d{2}-\d{2}$/.test(value) &&
      !Number.isNaN(Date.parse(value)) &&
      new Date(value).toISOString().slice(0, 10) === value,
    "Use a valid date.",
  )
  .nullable();
export function contentSchema(key: CollectionKey) {
  const shape: Record<string, z.ZodType> = { id: z.uuid() };
  for (const field of collection(key).fields) {
    let schema: z.ZodType;
    if (field.type === "checkbox") schema = z.boolean();
    else if (field.type === "number")
      schema = z.number().int().min(0).max(10000);
    else if (field.type === "date") schema = dateString;
    else if (field.type === "select")
      schema = z.enum(field.options as [string, ...string[]]);
    else if (["url", "image", "file"].includes(field.type || ""))
      schema = field.required
        ? webUrl.refine(Boolean, "This URL is required.")
        : webUrl;
    else if (field.type === "email")
      schema = z.union([z.email().max(254), z.literal("")]);
    else if (field.name === "slug")
      schema = z
        .string()
        .max(100)
        .regex(
          /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
          "Use lowercase letters, numbers, and hyphens.",
        );
    else if (field.name === "year")
      schema = z
        .string()
        .regex(
          field.required ? /^(19|20)\d{2}$/ : /^(?:(19|20)\d{2})?$/,
          "Use a four-digit year.",
        );
    else
      schema = z
        .string()
        .trim()
        .min(field.required ? 1 : 0, `${field.label} is required.`)
        .max(
          field.name === "content"
            ? 30000
            : field.type === "textarea"
              ? 5000
              : 500,
        );
    shape[field.name] = schema;
  }
  if (key === "projects") shape.technology_ids = z.array(z.uuid()).max(50);
  return z.object(shape).superRefine((data, ctx) => {
    if (collection(key).singleton && data.id !== SINGLETON_ID)
      ctx.addIssue({
        code: "custom",
        path: ["id"],
        message: "Invalid singleton record.",
      });
    if (
      key === "experiences" &&
      data.end_date &&
      (!data.start_date || String(data.end_date) < String(data.start_date))
    )
      ctx.addIssue({
        code: "custom",
        path: ["end_date"],
        message: "End date must follow the start date.",
      });
  });
}
export function parseContent(key: CollectionKey, form: FormData) {
  const values: Record<string, unknown> = { id: form.get("id") };
  for (const field of collection(key).fields) {
    const raw = form.get(field.name);
    values[field.name] =
      field.type === "checkbox"
        ? raw === "on"
        : field.type === "number"
          ? Number(raw || 0)
          : field.type === "date"
            ? raw || null
            : typeof raw === "string"
              ? raw.trim()
              : "";
  }
  if (key === "projects") values.technology_ids = form.getAll("technology_ids");
  return contentSchema(key).safeParse(values);
}
