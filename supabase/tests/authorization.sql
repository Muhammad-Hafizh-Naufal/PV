-- Run after migrations in the Supabase SQL editor. All test changes roll back.
begin;
insert into public.projects(id,title,slug,summary,status) values
('99999999-0000-4000-8000-000000000001','RLS draft test','rls-draft-test','Hidden','draft'),
('99999999-0000-4000-8000-000000000002','RLS public test','rls-public-test','Visible','published');
set local role anon;
do $$ begin
  if exists(select 1 from public.projects where slug = 'rls-draft-test') then raise exception 'FAIL: anon can read draft'; end if;
  if not exists(select 1 from public.projects where slug = 'rls-public-test') then raise exception 'FAIL: anon cannot read published'; end if;
  begin
    insert into public.projects(title,slug,summary) values('Forbidden','forbidden','Forbidden');
    raise exception 'FAIL: anon can insert';
  exception when insufficient_privilege then null; end;
end $$;
reset role;
set local role authenticated;
select set_config('request.jwt.claim.sub','99999999-0000-4000-8000-000000000099',true);
do $$ declare changed integer; begin
  if public.is_admin() then raise exception 'FAIL: non-admin recognized as admin'; end if;
  if exists(select 1 from public.projects where slug = 'rls-draft-test') then raise exception 'FAIL: non-admin can read draft'; end if;
  update public.projects set title = 'Forbidden' where slug = 'rls-public-test';
  get diagnostics changed = row_count;
  if changed <> 0 then raise exception 'FAIL: non-admin can update'; end if;
  delete from public.projects where slug = 'rls-public-test';
  get diagnostics changed = row_count;
  if changed <> 0 then raise exception 'FAIL: non-admin can delete'; end if;
  begin
    insert into public.admin_users(user_id) values('99999999-0000-4000-8000-000000000099');
    raise exception 'FAIL: non-admin can self-promote';
  exception when insufficient_privilege then null; end;
  begin
    perform public.save_project('{"id":"99999999-0000-4000-8000-000000000001","title":"Forbidden","slug":"forbidden","summary":"Forbidden"}'::jsonb,'{}'::uuid[]);
    raise exception 'FAIL: non-admin can invoke save_project';
  exception when insufficient_privilege then null; end;
end $$;
reset role;
rollback;
