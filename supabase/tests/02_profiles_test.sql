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

-- Profiles: created automatically; visible to yourself and your workspace members
select pg_temp.act_as_postgres();
select is((select full_name from public.profiles where id = '33333333-3333-4333-8333-333333333333'), 'Test Reviewer A',
  'A new auth user gets a profile with their name');
select is((select count(*)::int from public.profiles where id in ('11111111-1111-4111-8111-111111111111', '22222222-2222-4222-8222-222222222222', '33333333-3333-4333-8333-333333333333', '44444444-4444-4444-8444-444444444444', '55555555-5555-4555-8555-555555555555', '66666666-6666-4666-8666-666666666666', '77777777-7777-4777-8777-777777777777')), 7,
  'Every test user has a profile');

select pg_temp.act_as('33333333-3333-4333-8333-333333333333');
select is((select count(*)::int from public.profiles where id = '33333333-3333-4333-8333-333333333333'), 1, 'Reviewer reads their own profile');
select is((select count(*)::int from public.profiles where id = '11111111-1111-4111-8111-111111111111'), 1, 'Reviewer reads a co-member''s profile');
select is((select count(*)::int from public.profiles where id in ('55555555-5555-4555-8555-555555555555', '66666666-6666-4666-8666-666666666666')), 0,
  'Reviewer can''t read profiles outside their workspace');
select lives_ok($$update public.profiles set full_name = 'Renamed Reviewer' where id = '33333333-3333-4333-8333-333333333333'$$, 'Reviewer renames themselves');
select is((select full_name from public.profiles where id = '33333333-3333-4333-8333-333333333333'), 'Renamed Reviewer', 'The new name is saved');
update public.profiles set full_name = 'Hacked' where id = '11111111-1111-4111-8111-111111111111';
select is((select full_name from public.profiles where id = '11111111-1111-4111-8111-111111111111'), 'Test Owner', 'Reviewer can''t rename someone else');
select throws_ok($$update public.profiles set id = gen_random_uuid() where id = '33333333-3333-4333-8333-333333333333'$$, '42501', null,
  'A profile''s id can''t be changed');

select pg_temp.act_as('55555555-5555-4555-8555-555555555555');
select is((select count(*)::int from public.profiles), 1, 'A signed-in non-member sees only their own profile');

select pg_temp.act_as_postgres();
select * from finish();
rollback;
