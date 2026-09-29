"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "./supabase/server";
import { supabaseConfig } from "./supabase/config";
import { getAdmin } from "./auth";
import { collection, isCollection, parseContent } from "./content";
import type { ActionResult } from "./types";
import { isRequestTimeout } from "./supabase/fetch";

export async function login(
  _previous: ActionResult,
  form: FormData,
): Promise<ActionResult> {
  if (!supabaseConfig())
    return {
      ok: false,
      message: "Connect Supabase first. See README.md for setup instructions.",
    };
  const parsed = z
    .object({ email: z.email(), password: z.string().min(1).max(256) })
    .safeParse({ email: form.get("email"), password: form.get("password") });
  if (!parsed.success)
    return { ok: false, message: "Enter a valid email and password." };
  const client = await createClient();
  const { error } = await client.auth.signInWithPassword(parsed.data);
  if (error)
    return {
      ok: false,
      message: "Unable to sign in. Check your credentials and try again later.",
    };
  if (!(await getAdmin())) {
    await client.auth.signOut();
    return {
      ok: false,
      message: "This account does not have administrator access.",
    };
  }
  redirect("/admin");
}
export async function logout() {
  if (supabaseConfig()) {
    const client = await createClient();
    await client.auth.signOut();
  }
  redirect("/admin/login");
}
function refreshContent() {
  revalidatePath("/");
  revalidatePath("/projects/[slug]", "page");
  revalidatePath("/sitemap.xml");
}

function requestFailure(error: unknown): ActionResult {
  if (isRequestTimeout(error)) {
    return {
      ok: false,
      message:
        "Supabase did not respond within 15 seconds. Check your connection, then try saving again.",
    };
  }
  console.error("Content request failed", error);
  return {
    ok: false,
    message:
      "The request could not be completed. Refresh the page and try again.",
  };
}
export async function saveContent(
  key: string,
  _previous: ActionResult,
  form: FormData,
): Promise<ActionResult> {
  if (!isCollection(key))
    return { ok: false, message: "Unknown content type." };
  let admin;
  try {
    admin = await getAdmin();
  } catch (error) {
    return requestFailure(error);
  }
  if (!admin)
    return {
      ok: false,
      message:
        "Your session has expired or Supabase is not connected. Please sign in.",
    };
  const parsed = parseContent(key, form);
  if (!parsed.success)
    return {
      ok: false,
      message: parsed.error.issues
        .map((i) => `${i.path.join(".")}: ${i.message}`)
        .join(" "),
    };
  for (const field of collection(key).fields.filter(
    (f) => f.type === "image" || f.type === "file",
  )) {
    const value = parsed.data[field.name];
    if (
      value &&
      !String(value).startsWith(
        `${supabaseConfig()!.url}/storage/v1/object/public/portfolio-media/`,
      )
    )
      return {
        ok: false,
        message:
          "Upload media to this project's storage bucket before using its URL.",
      };
  }
  const { technology_ids, ...record } = parsed.data;
  let result;
  try {
    result =
      key === "projects"
        ? await admin.client.rpc("save_project", {
            project_data: record,
            technology_ids: technology_ids || [],
          })
        : collection(key).singleton
          ? await admin.client
              .from(key)
              .update(record)
              .eq("id", String(record.id))
              .select("id")
              .single()
          : await admin.client.from(key).upsert(record).select("id").single();
  } catch (error) {
    return requestFailure(error);
  }
  if (result.error) {
    console.error("Content save failed", {
      collection: key,
      code: result.error.code,
      message: result.error.message,
    });
    const denied =
      result.error.code === "42501" ||
      /row-level security|permission denied/i.test(result.error.message);
    return {
      ok: false,
      message:
        result.error.code === "23505"
          ? "This slug or name is already in use."
          : denied
            ? "Supabase rejected this change. Confirm that your Authentication user UUID is registered in public.admin_users."
            : "Could not save. Check your connection and database setup, then try again.",
    };
  }
  refreshContent();
  if (form.get("_new") === "true" && !collection(key).singleton)
    redirect(`/admin/${key}/${record.id}?saved=1`);
  return { ok: true, message: "Saved. Your portfolio has been updated." };
}
export async function deleteContent(
  key: string,
  id: string,
): Promise<ActionResult> {
  if (
    !isCollection(key) ||
    collection(key).singleton ||
    !z.uuid().safeParse(id).success
  )
    return { ok: false, message: "Invalid record." };
  const admin = await getAdmin();
  if (!admin) return { ok: false, message: "Please sign in again." };
  const { data, error } = await admin.client
    .from(key)
    .delete()
    .eq("id", id)
    .select("id");
  if (error || !data?.length)
    return {
      ok: false,
      message: "Could not delete this record. Refresh and try again.",
    };
  refreshContent();
  return {
    ok: true,
    message: "Record deleted. Uploaded files remain in the media library.",
  };
}
export async function deleteMedia(path: string): Promise<ActionResult> {
  const admin = await getAdmin();
  if (!admin) return { ok: false, message: "Please sign in again." };
  if (!/^[0-9a-f-]{36}\/[0-9a-f-]{36}\.(jpg|png|webp|pdf)$/.test(path))
    return { ok: false, message: "Invalid file path." };
  const {
    data: { publicUrl },
  } = admin.client.storage.from("portfolio-media").getPublicUrl(path);
  const checks = await Promise.all([
    admin.client
      .from("projects")
      .select("id")
      .eq("cover_url", publicUrl)
      .limit(1),
    admin.client
      .from("profile")
      .select("id")
      .or(`avatar_url.eq.${publicUrl},cv_url.eq.${publicUrl}`)
      .limit(1),
    admin.client
      .from("certificates")
      .select("id")
      .eq("asset_url", publicUrl)
      .limit(1),
  ]);
  if (checks.some((r) => r.error))
    return {
      ok: false,
      message: "Could not check file references. Nothing was deleted.",
    };
  if (checks.some((r) => r.data?.length))
    return {
      ok: false,
      message:
        "This file is still in use. Replace or remove its content reference first.",
    };
  const { error } = await admin.client.storage
    .from("portfolio-media")
    .remove([path]);
  if (error) return { ok: false, message: "Could not remove the file." };
  revalidatePath("/admin/media");
  return { ok: true, message: "Unused file permanently removed from storage." };
}
