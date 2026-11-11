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

-- Review tasks: members read; Owners and Admins create and assign; status only via decisions
select pg_temp.act_as('33333333-3333-4333-8333-333333333333');
select is((select count(*)::int from public.review_tasks), 5, 'A Reviewer sees their workspace''s five tasks only');
select throws_ok($$insert into public.review_tasks (workspace_id, title, type, created_by) values ('00000000-0000-4000-8000-000000000001', 'Reviewer task', 'sources', '33333333-3333-4333-8333-333333333333')$$,
  '42501', null, 'A Reviewer can''t create tasks');
update public.review_tasks set title = 'Changed' where id = '00000000-0000-4000-8000-000000000101';
select is((select title from public.review_tasks where id = '00000000-0000-4000-8000-000000000101'), 'Understanding sensitive skin', 'A Reviewer can''t edit tasks');
select throws_ok($$update public.review_tasks set status = 'approved' where id = '00000000-0000-4000-8000-000000000101'$$, '42501', null,
  'A Reviewer can''t set a task''s status');

select pg_temp.act_as('55555555-5555-4555-8555-555555555555');
select is((select count(*)::int from public.review_tasks), 0, 'A signed-in non-member sees no tasks');

select pg_temp.act_as('22222222-2222-4222-8222-222222222222');
select lives_ok($$insert into public.review_tasks (workspace_id, title, type, created_by, assigned_to) values ('00000000-0000-4000-8000-000000000001', 'Admin task', 'quiz_content', '22222222-2222-4222-8222-222222222222', '44444444-4444-4444-8444-444444444444')$$,
  'An Admin creates and assigns a task to a Reviewer');
select throws_ok($$insert into public.review_tasks (workspace_id, title, type, created_by) values ('00000000-0000-4000-8000-000000000001', 'Spoofed', 'quiz_content', '11111111-1111-4111-8111-111111111111')$$,
  '42501', null, 'Tasks are created as yourself');
select throws_ok($$insert into public.review_tasks (workspace_id, title, type, created_by) values ('00000000-0000-4000-8000-000000000002', 'Other workspace', 'quiz_content', '22222222-2222-4222-8222-222222222222')$$,
  '42501', null, 'An Admin can''t create tasks in another workspace');
select throws_ok($$insert into public.review_tasks (workspace_id, title, type, status, created_by) values ('00000000-0000-4000-8000-000000000001', 'Pre-approved', 'quiz_content', 'approved', '22222222-2222-4222-8222-222222222222')$$,
  'P0001', null, 'A task can''t start as Approved');
select lives_ok($$update public.review_tasks set assigned_to = '44444444-4444-4444-8444-444444444444', priority = 'low' where id = '00000000-0000-4000-8000-000000000101'$$, 'An Admin reassigns a task');
select throws_ok($$update public.review_tasks set assigned_to = '11111111-1111-4111-8111-111111111111' where id = '00000000-0000-4000-8000-000000000101'$$, 'P0001',
  'Tasks can only be assigned to an active Reviewer in the same workspace.', 'Tasks can''t be assigned to a non-Reviewer');
select throws_ok($$update public.review_tasks set status = 'approved' where id = '00000000-0000-4000-8000-000000000102'$$, '42501', null,
  'An Admin can''t set a task''s status directly');
select throws_ok($$delete from public.review_tasks where id = '00000000-0000-4000-8000-000000000103'$$, '42501', null, 'Tasks can''t be deleted');

select pg_temp.act_as('11111111-1111-4111-8111-111111111111');
select throws_ok($$update public.review_tasks set assigned_to = '66666666-6666-4666-8666-666666666666' where id = '00000000-0000-4000-8000-000000000103'$$, 'P0001', null,
  'Tasks can''t be assigned to someone outside the workspace');

select pg_temp.act_as_postgres();
select * from finish();
rollback;
