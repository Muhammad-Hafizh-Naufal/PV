-- Apply to a new Supabase project using the SQL editor or Supabase CLI.
begin;

create table public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);
alter table public.admin_users enable row level security;
create policy "Admins may read their own membership" on public.admin_users for select to authenticated using (user_id = (select auth.uid()));
revoke all on public.admin_users from anon, authenticated;
grant select on public.admin_users to authenticated;

create function public.is_admin() returns boolean
language sql stable security definer set search_path = ''
as $$ select exists(select 1 from public.admin_users where user_id = (select auth.uid())); $$;
revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

create table public.profile (
  id uuid primary key default '00000000-0000-4000-8000-000000000001' check (id = '00000000-0000-4000-8000-000000000001'),
  name text not null, title text not null, headline text not null, about text not null,
  location text not null default '', avatar_url text not null default '', cv_url text not null default '',
  updated_at timestamptz not null default now()
);
create table public.projects (
  id uuid primary key default gen_random_uuid(), title text not null,
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  summary text not null, content text not null default '', cover_url text not null default '',
  github_url text not null default '', demo_url text not null default '', category text not null default '',
  year text not null default '' check (year = '' or year ~ '^(19|20)[0-9]{2}$'),
  featured boolean not null default false, status text not null default 'draft' check (status in ('draft', 'published')),
  sort_order integer not null default 0 check (sort_order >= 0),
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create index projects_public_order on public.projects(status, sort_order);
create table public.technologies (
  id uuid primary key default gen_random_uuid(), name text not null unique,
  category text not null check (category in ('Frontend','Backend','Database','AI & APIs','Tools')),
  icon_key text not null default '', sort_order integer not null default 0 check (sort_order >= 0)
);
create table public.project_technologies (
  project_id uuid not null references public.projects(id) on delete cascade,
  technology_id uuid not null references public.technologies(id) on delete cascade,
  primary key(project_id, technology_id)
);
create index project_technologies_technology_idx on public.project_technologies(technology_id);
create table public.experiences (
  id uuid primary key default gen_random_uuid(), organization text not null, position text not null,
  location text not null default '', start_date date, end_date date,
  description text not null default '', sort_order integer not null default 0 check (sort_order >= 0),
  check (end_date is null or (start_date is not null and end_date >= start_date))
);
create table public.certificates (
  id uuid primary key default gen_random_uuid(), title text not null, issuer text not null,
  year text not null check (year ~ '^(19|20)[0-9]{2}$'), credential_url text not null default '', asset_url text not null default '',
  sort_order integer not null default 0 check (sort_order >= 0)
);
create table public.social_links (
  id uuid primary key default gen_random_uuid(), platform text not null, label text not null, url text not null,
  sort_order integer not null default 0 check (sort_order >= 0)
);
create table public.site_settings (
  id uuid primary key default '00000000-0000-4000-8000-000000000001' check (id = '00000000-0000-4000-8000-000000000001'),
  seo_title text not null, seo_description text not null, availability_text text not null,
  contact_email text not null default ''
);

create function public.set_updated_at() returns trigger language plpgsql set search_path = '' as $$
begin new.updated_at = now(); return new; end; $$;
create trigger profile_updated before update on public.profile for each row execute function public.set_updated_at();
create trigger projects_updated before update on public.projects for each row execute function public.set_updated_at();

alter table public.projects enable row level security;
alter table public.project_technologies enable row level security;
create policy "Published projects or admin" on public.projects for select to anon, authenticated using (status = 'published' or (select public.is_admin()));
create policy "Admin project writes" on public.projects for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "Published project tags or admin" on public.project_technologies for select to anon, authenticated using (
  exists(select 1 from public.projects where id = project_id and status = 'published') or (select public.is_admin())
);
create policy "Admin tag writes" on public.project_technologies for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));

do $$ declare content_table text; begin
  foreach content_table in array array['profile','technologies','experiences','certificates','social_links','site_settings'] loop
    execute format('alter table public.%I enable row level security', content_table);
    execute format('create policy "Public content read" on public.%I for select to anon, authenticated using (true)', content_table);
    execute format('create policy "Admin content writes" on public.%I for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()))', content_table);
  end loop;
end $$;

grant usage on schema public to anon, authenticated;
grant select on public.profile, public.projects, public.technologies, public.project_technologies, public.experiences, public.certificates, public.social_links, public.site_settings to anon, authenticated;
grant insert, update, delete on public.profile, public.projects, public.technologies, public.project_technologies, public.experiences, public.certificates, public.social_links, public.site_settings to authenticated;

-- The project and its tags are saved in one transaction. RLS remains active.
create function public.save_project(project_data jsonb, technology_ids uuid[])
returns uuid language plpgsql security invoker set search_path = '' as $$
declare saved_id uuid; begin
  if not public.is_admin() then raise exception 'Administrator access required' using errcode = '42501'; end if;
  insert into public.projects(id, title, slug, summary, content, cover_url, github_url, demo_url, category, year, featured, status, sort_order)
  values ((project_data->>'id')::uuid, project_data->>'title', project_data->>'slug', project_data->>'summary',
    coalesce(project_data->>'content',''), coalesce(project_data->>'cover_url',''), coalesce(project_data->>'github_url',''),
    coalesce(project_data->>'demo_url',''), coalesce(project_data->>'category',''), coalesce(project_data->>'year',''),
    coalesce((project_data->>'featured')::boolean,false), coalesce(project_data->>'status','draft'), coalesce((project_data->>'sort_order')::integer,0))
  on conflict(id) do update set title = excluded.title, slug = excluded.slug, summary = excluded.summary,
    content = excluded.content, cover_url = excluded.cover_url, github_url = excluded.github_url, demo_url = excluded.demo_url,
    category = excluded.category, year = excluded.year, featured = excluded.featured, status = excluded.status, sort_order = excluded.sort_order
  returning id into saved_id;
  delete from public.project_technologies where project_id = saved_id;
  insert into public.project_technologies(project_id, technology_id) select saved_id, unnest(coalesce(technology_ids, '{}'::uuid[])) on conflict do nothing;
  return saved_id;
end $$;
revoke all on function public.save_project(jsonb, uuid[]) from public, anon;
grant execute on function public.save_project(jsonb, uuid[]) to authenticated;

insert into storage.buckets(id, name, public, file_size_limit, allowed_mime_types)
values ('portfolio-media', 'portfolio-media', true, 8388608, array['image/jpeg','image/png','image/webp','application/pdf']);
create policy "Admin media listing" on storage.objects for select to authenticated using (bucket_id = 'portfolio-media' and (select public.is_admin()));
create policy "Admin media uploads" on storage.objects for insert to authenticated with check (
  bucket_id = 'portfolio-media' and (select public.is_admin()) and (storage.foldername(name))[1] = (select auth.uid())::text
);
create policy "Admin media deletion" on storage.objects for delete to authenticated using (bucket_id = 'portfolio-media' and (select public.is_admin()));
-- No UPDATE policy: assets are immutable, and replacements get new object names.
-- The bucket is public by design; never upload confidential or draft-only materials.

commit;
