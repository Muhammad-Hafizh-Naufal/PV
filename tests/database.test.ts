import { beforeAll, afterAll, describe, expect, it } from "vitest";
import { readFile } from "node:fs/promises";
import { PGlite } from "@electric-sql/pglite";

const db = new PGlite();
const adminId = "88888888-0000-4000-8000-000000000001";
const projectId = "88888888-0000-4000-8000-000000000002";
beforeAll(async () => {
  // Model only the Supabase-managed schemas needed to execute the real migration.
  await db.exec(`
    create role anon nologin; create role authenticated nologin;
    create schema auth; create schema storage;
    create table auth.users(id uuid primary key);
    create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid; $$;
    grant usage on schema auth, storage to anon, authenticated;
    create table storage.buckets(id text primary key, name text, public boolean, file_size_limit bigint, allowed_mime_types text[]);
    create table storage.objects(id uuid primary key default gen_random_uuid(), bucket_id text references storage.buckets(id), name text);
    alter table storage.objects enable row level security;
    grant select, insert, update, delete on storage.objects to authenticated;
    create function storage.foldername(name text) returns text[] language sql immutable as $$ select string_to_array(name,'/'); $$;
  `);
  await db.exec(
    await readFile("supabase/migrations/001_portfolio.sql", "utf8"),
  );
  const seed = await readFile("supabase/migrations/002_seed.sql", "utf8");
  await db.exec(seed);
  await db.exec(seed);
  await db.exec(
    `insert into auth.users(id) values('${adminId}'); insert into public.admin_users(user_id) values('${adminId}');`,
  );
});
afterAll(async () => {
  await db.close();
});

describe("real PostgreSQL migration and RLS", () => {
  it("seeds four projects without duplicating records on repeat", async () => {
    const result = await db.query<{ count: number }>(
      "select count(*)::integer as count from public.projects",
    );
    expect(result.rows[0].count).toBe(4);
  });
  it("denies anonymous and ordinary authenticated writes, draft access, and self-promotion", async () => {
    await db.exec(await readFile("supabase/tests/authorization.sql", "utf8"));
  });
  it("lets an admin create a draft and tags atomically, then publish it", async () => {
    await db.exec(
      `set role authenticated; select set_config('request.jwt.claim.sub','${adminId}',false);`,
    );
    const record = {
      id: projectId,
      title: "Integration project",
      slug: "integration-project",
      summary: "Testing transactions",
      status: "draft",
    };
    await db.query("select public.save_project($1::jsonb,$2::uuid[])", [
      JSON.stringify(record),
      ["10000000-0000-4000-8000-000000000001"],
    ]);
    expect(
      (await db.query("select * from public.projects where id=$1", [projectId]))
        .rows,
    ).toHaveLength(1);
    await db.exec(
      "reset role; select set_config('request.jwt.claim.sub','',false); set role anon;",
    );
    expect(
      (await db.query("select * from public.projects where id=$1", [projectId]))
        .rows,
    ).toHaveLength(0);
    expect(
      (
        await db.query(
          "select * from public.project_technologies where project_id=$1",
          [projectId],
        )
      ).rows,
    ).toHaveLength(0);
    await db.exec(
      `reset role; set role authenticated; select set_config('request.jwt.claim.sub','${adminId}',false);`,
    );
    await db.query("select public.save_project($1::jsonb,$2::uuid[])", [
      JSON.stringify({ ...record, status: "published" }),
      ["10000000-0000-4000-8000-000000000001"],
    ]);
    await db.exec(
      "reset role; select set_config('request.jwt.claim.sub','',false); set role anon;",
    );
    expect(
      (await db.query("select * from public.projects where id=$1", [projectId]))
        .rows,
    ).toHaveLength(1);
    expect(
      (
        await db.query(
          "select * from public.project_technologies where project_id=$1",
          [projectId],
        )
      ).rows,
    ).toHaveLength(1);
    await db.exec("reset role;");
  });
  it("rolls back a project update when its technology relation is invalid", async () => {
    await db.exec(
      `set role authenticated; select set_config('request.jwt.claim.sub','${adminId}',false);`,
    );
    await expect(
      db.query("select public.save_project($1::jsonb,$2::uuid[])", [
        JSON.stringify({
          id: projectId,
          title: "Must roll back",
          slug: "integration-project",
          summary: "Changed",
          status: "published",
        }),
        ["77777777-0000-4000-8000-000000000001"],
      ]),
    ).rejects.toThrow();
    const result = await db.query<{ title: string }>(
      "select title from public.projects where id=$1",
      [projectId],
    );
    expect(result.rows[0].title).toBe("Integration project");
    expect(
      (
        await db.query(
          "select * from public.project_technologies where project_id=$1",
          [projectId],
        )
      ).rows,
    ).toHaveLength(1);
    await db.exec("reset role;");
  });
  it("restricts uploads to an admin-owned path and blocks ordinary users", async () => {
    await db.exec(
      `set role authenticated; select set_config('request.jwt.claim.sub','${adminId}',false);`,
    );
    await db.query(
      "insert into storage.objects(bucket_id,name) values ('portfolio-media',$1)",
      [`${adminId}/test.png`],
    );
    await expect(
      db.query(
        "insert into storage.objects(bucket_id,name) values ('portfolio-media','another-user/test.png')",
      ),
    ).rejects.toThrow();
    await db.exec(
      "select set_config('request.jwt.claim.sub','77777777-0000-4000-8000-000000000001',false);",
    );
    await expect(
      db.query(
        "insert into storage.objects(bucket_id,name) values ('portfolio-media','77777777-0000-4000-8000-000000000001/test.png')",
      ),
    ).rejects.toThrow();
    await db.exec("reset role;");
  });
  it("lets admins delete content with cascading technology relations", async () => {
    await db.exec(
      `set role authenticated; select set_config('request.jwt.claim.sub','${adminId}',false);`,
    );
    await db.query("delete from public.projects where id=$1", [projectId]);
    expect(
      (
        await db.query(
          "select * from public.project_technologies where project_id=$1",
          [projectId],
        )
      ).rows,
    ).toHaveLength(0);
    await db.exec("reset role;");
  });
});
