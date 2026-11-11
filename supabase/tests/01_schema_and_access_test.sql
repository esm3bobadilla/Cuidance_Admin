-- Shared test setup (generated; identical in every test file).
-- Test users use example.com addresses only (D13). Everything is rolled back.
begin;
create extension if not exists pgtap with schema extensions;
set local search_path = public, extensions;
select no_plan();

-- Test users (as postgres): the trigger creates their profiles
insert into auth.users (instance_id, id, aud, role, email, raw_user_meta_data, created_at, updated_at) values
  ('00000000-0000-0000-0000-000000000000', '11111111-1111-4111-8111-111111111111', 'authenticated', 'authenticated', 'owner@example.com', '{"full_name":"Test Owner"}', now(), now()),
  ('00000000-0000-0000-0000-000000000000', '22222222-2222-4222-8222-222222222222', 'authenticated', 'authenticated', 'admin@example.com', '{"full_name":"Test Admin"}', now(), now()),
  ('00000000-0000-0000-0000-000000000000', '33333333-3333-4333-8333-333333333333', 'authenticated', 'authenticated', 'reviewer.a@example.com', '{"full_name":"Test Reviewer A"}', now(), now()),
  ('00000000-0000-0000-0000-000000000000', '44444444-4444-4444-8444-444444444444', 'authenticated', 'authenticated', 'reviewer.b@example.com', '{"full_name":"Test Reviewer B"}', now(), now()),
  ('00000000-0000-0000-0000-000000000000', '55555555-5555-4555-8555-555555555555', 'authenticated', 'authenticated', 'outsider@example.com', '{"full_name":"Test Outsider"}', now(), now()),
  ('00000000-0000-0000-0000-000000000000', '66666666-6666-4666-8666-666666666666', 'authenticated', 'authenticated', 'owner.two@example.com', '{"full_name":"Other Workspace Owner"}', now(), now()),
  ('00000000-0000-0000-0000-000000000000', '77777777-7777-4777-8777-777777777777', 'authenticated', 'authenticated', 'admin.two@example.com', '{"full_name":"Second Admin"}', now(), now());

-- Workspace 1 is the seeded "Cuidance Content Team"; workspace 2 checks isolation
insert into public.workspaces (id, name, slug) values ('00000000-0000-4000-8000-000000000002', 'Other Test Workspace', 'other-test-workspace');
insert into public.workspace_members (workspace_id, user_id, role) values
  ('00000000-0000-4000-8000-000000000001', '11111111-1111-4111-8111-111111111111', 'owner'),
  ('00000000-0000-4000-8000-000000000001', '22222222-2222-4222-8222-222222222222', 'admin'),
  ('00000000-0000-4000-8000-000000000001', '77777777-7777-4777-8777-777777777777', 'admin'),
  ('00000000-0000-4000-8000-000000000001', '33333333-3333-4333-8333-333333333333', 'reviewer'),
  ('00000000-0000-4000-8000-000000000001', '44444444-4444-4444-8444-444444444444', 'reviewer'),
  ('00000000-0000-4000-8000-000000000002', '66666666-6666-4666-8666-666666666666', 'owner');

-- Seeded tasks: Reviewer A has tasks 1 to 4, Reviewer B has task 5
update public.review_tasks set assigned_to = '33333333-3333-4333-8333-333333333333' where id in ('00000000-0000-4000-8000-000000000101', '00000000-0000-4000-8000-000000000102', '00000000-0000-4000-8000-000000000103', '00000000-0000-4000-8000-000000000104');
update public.review_tasks set assigned_to = '44444444-4444-4444-8444-444444444444' where id = '00000000-0000-4000-8000-000000000105';
insert into public.review_tasks (id, workspace_id, title, type, priority) values
  ('00000000-0000-4000-8000-000000000201', '00000000-0000-4000-8000-000000000002', 'Other workspace task', 'sources', 'low');

-- Act as a signed-in user (sets the role and auth.uid()) or as a signed-out visitor
create function pg_temp.act_as(uid uuid) returns void language plpgsql as $$
begin
  perform set_config('request.jwt.claims', json_build_object('sub', uid, 'role', 'authenticated')::text, true);
  perform set_config('role', 'authenticated', true);
end $$;
create function pg_temp.act_as_anon() returns void language plpgsql as $$
begin
  perform set_config('request.jwt.claims', '{"role":"anon"}', true);
  perform set_config('role', 'anon', true);
end $$;
create function pg_temp.act_as_postgres() returns void language plpgsql as $$
begin
  perform set_config('request.jwt.claims', '', true);
  perform set_config('role', 'postgres', true);
end $$;

-- Schema, RLS switched on, and the API roles' privileges
select has_table('public', t, 'table ' || t || ' exists')
  from unnest(array['profiles','workspaces','workspace_members','invitations','review_tasks','review_decisions']) as t;

select ok(
  (select bool_and(c.relrowsecurity) from pg_class c join pg_namespace n on n.oid = c.relnamespace
   where n.nspname = 'public' and c.relname in ('profiles','workspaces','workspace_members','invitations','review_tasks','review_decisions')),
  'RLS is on for all six tables');

select is(
  (select count(*)::int from information_schema.role_table_grants
   where grantee = 'anon' and table_schema = 'public' and table_name in ('profiles','workspaces','workspace_members','invitations','review_tasks','review_decisions')),
  0, 'Signed-out visitors (anon) have no table privileges');

select is(
  (select count(*)::int from information_schema.role_table_grants
   where grantee = 'authenticated' and table_schema = 'public' and table_name in ('profiles','workspaces','workspace_members','invitations','review_tasks','review_decisions') and privilege_type in ('DELETE', 'TRUNCATE')),
  0, 'Signed-in users can''t delete or truncate anything');

select ok(not has_column_privilege('authenticated', 'public.review_tasks', 'status', 'UPDATE'),
  'Task status can''t be updated through the API');
select ok(not has_table_privilege('authenticated', 'public.workspace_members', 'INSERT'),
  'Memberships can''t be added through the API');
select ok(not has_table_privilege('authenticated', 'public.invitations', 'INSERT')
  and not has_table_privilege('authenticated', 'public.invitations', 'UPDATE'),
  'Invitations can''t be written through the API');
select ok(not has_table_privilege('authenticated', 'public.review_decisions', 'UPDATE'),
  'Decisions can''t be updated through the API');

select ok(not has_function_privilege('anon', 'public.is_member(uuid)', 'EXECUTE')
  and not has_function_privilege('anon', 'public.has_role(uuid, public.workspace_role[])', 'EXECUTE'),
  'Signed-out visitors can''t call the role helpers');
select ok(not has_function_privilege('authenticated', 'public.handle_new_user()', 'EXECUTE')
  and not has_function_privilege('authenticated', 'public.apply_review_decision()', 'EXECUTE'),
  'Trigger functions can''t be called directly');

select is(
  (select count(*)::int from pg_proc p join pg_namespace n on n.oid = p.pronamespace
   where n.nspname = 'public' and p.prosecdef
     and not coalesce(p.proconfig @> array['search_path=""'], false)),
  0, 'Every security definer function pins an empty search_path');

select enum_has_labels('public', 'workspace_role', array['owner', 'admin', 'reviewer', 'content_editor'],
  'Roles include the reserved content_editor (D3)');
select enum_has_labels('public', 'task_status', array['in_review', 'needs_review', 'pending_disclosure', 'needs_changes', 'approved'],
  'Task statuses match the Week 10 and Week 11 screens');

-- Signed-out visitors are refused outright
select pg_temp.act_as_anon();
select throws_ok('select count(*) from public.review_tasks', '42501', null, 'Signed out: reading tasks is refused');
select throws_ok('select count(*) from public.profiles', '42501', null, 'Signed out: reading profiles is refused');
select throws_ok('select count(*) from public.workspace_members', '42501', null, 'Signed out: reading members is refused');
select throws_ok($$insert into public.review_decisions (task_id, workspace_id, decision, decided_by) values ('00000000-0000-4000-8000-000000000101', '00000000-0000-4000-8000-000000000001', 'approved', '33333333-3333-4333-8333-333333333333')$$,
  '42501', null, 'Signed out: recording a decision is refused');

select pg_temp.act_as_postgres();
select * from finish();
rollback;
