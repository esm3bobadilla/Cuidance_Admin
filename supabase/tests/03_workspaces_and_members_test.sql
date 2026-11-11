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

-- Workspaces and memberships, including D5 and the final-Owner rule
select pg_temp.act_as('33333333-3333-4333-8333-333333333333');
select is((select count(*)::int from public.workspaces), 1, 'A member sees only their own workspace');
select is((select count(*)::int from public.workspace_members where workspace_id = '00000000-0000-4000-8000-000000000001'), 5, 'A member sees their workspace''s members');
select is((select count(*)::int from public.workspace_members where workspace_id = '00000000-0000-4000-8000-000000000002'), 0, 'A member can''t see another workspace''s members');
update public.workspaces set name = 'Renamed' where id = '00000000-0000-4000-8000-000000000001';
select is((select name from public.workspaces where id = '00000000-0000-4000-8000-000000000001'), 'Cuidance Content Team', 'A Reviewer can''t rename the workspace');

select pg_temp.act_as('55555555-5555-4555-8555-555555555555');
select is((select count(*)::int from public.workspaces), 0, 'A signed-in non-member sees no workspaces');
select is((select count(*)::int from public.workspace_members), 0, 'A signed-in non-member sees no members');
select throws_ok($$insert into public.workspace_members (workspace_id, user_id, role) values ('00000000-0000-4000-8000-000000000001', '55555555-5555-4555-8555-555555555555', 'owner')$$,
  '42501', null, 'A non-member can''t add themselves to a workspace');

select pg_temp.act_as('11111111-1111-4111-8111-111111111111');
select lives_ok($$update public.workspaces set name = 'Cuidance Content Team (test)' where id = '00000000-0000-4000-8000-000000000001'$$, 'The Owner renames the workspace');
-- D5: Owner manages Admins and Reviewers
select lives_ok($$update public.workspace_members set role = 'reviewer' where workspace_id = '00000000-0000-4000-8000-000000000001' and user_id = '77777777-7777-4777-8777-777777777777'$$,
  'Owner changes an Admin to Reviewer');
select lives_ok($$update public.workspace_members set role = 'admin' where workspace_id = '00000000-0000-4000-8000-000000000001' and user_id = '77777777-7777-4777-8777-777777777777'$$,
  'Owner changes a Reviewer to Admin');
select lives_ok($$update public.workspace_members set status = 'deactivated' where workspace_id = '00000000-0000-4000-8000-000000000001' and user_id = '44444444-4444-4444-8444-444444444444'$$,
  'Owner deactivates a Reviewer');
select is((select status::text from public.workspace_members where workspace_id = '00000000-0000-4000-8000-000000000001' and user_id = '44444444-4444-4444-8444-444444444444'), 'deactivated', 'The Reviewer is deactivated');
select throws_ok($$update public.workspace_members set role = 'owner' where workspace_id = '00000000-0000-4000-8000-000000000001' and user_id = '77777777-7777-4777-8777-777777777777'$$,
  '42501', null, 'Owner can''t promote anyone to Owner through the API');
select throws_ok($$update public.workspace_members set role = 'content_editor' where workspace_id = '00000000-0000-4000-8000-000000000001' and user_id = '33333333-3333-4333-8333-333333333333'$$,
  'P0001', null, 'The reserved Content Editor role can''t be assigned (D3)');
update public.workspace_members set role = 'reviewer' where workspace_id = '00000000-0000-4000-8000-000000000001' and user_id = '11111111-1111-4111-8111-111111111111';
select is((select role::text from public.workspace_members where workspace_id = '00000000-0000-4000-8000-000000000001' and user_id = '11111111-1111-4111-8111-111111111111'), 'owner',
  'No one can change their own membership');
select throws_ok($$delete from public.workspace_members where workspace_id = '00000000-0000-4000-8000-000000000001' and user_id = '33333333-3333-4333-8333-333333333333'$$,
  '42501', null, 'Members can''t be deleted through the API (deactivate instead)');

select pg_temp.act_as('22222222-2222-4222-8222-222222222222');
-- D5: Admin manages Reviewers only
select lives_ok($$update public.workspace_members set status = 'active' where workspace_id = '00000000-0000-4000-8000-000000000001' and user_id = '44444444-4444-4444-8444-444444444444'$$,
  'Admin reactivates a Reviewer');
select throws_ok($$update public.workspace_members set role = 'admin' where workspace_id = '00000000-0000-4000-8000-000000000001' and user_id = '33333333-3333-4333-8333-333333333333'$$,
  '42501', null, 'Admin can''t promote a Reviewer to Admin');
update public.workspace_members set status = 'deactivated' where workspace_id = '00000000-0000-4000-8000-000000000001' and user_id = '77777777-7777-4777-8777-777777777777';
select is((select status::text from public.workspace_members where workspace_id = '00000000-0000-4000-8000-000000000001' and user_id = '77777777-7777-4777-8777-777777777777'), 'active',
  'Admin can''t manage another Admin');
update public.workspace_members set role = 'reviewer' where workspace_id = '00000000-0000-4000-8000-000000000001' and user_id = '11111111-1111-4111-8111-111111111111';
select is((select role::text from public.workspace_members where workspace_id = '00000000-0000-4000-8000-000000000001' and user_id = '11111111-1111-4111-8111-111111111111'), 'owner',
  'Admin can''t manage the Owner');

select pg_temp.act_as('33333333-3333-4333-8333-333333333333');
update public.workspace_members set status = 'deactivated' where workspace_id = '00000000-0000-4000-8000-000000000001' and user_id = '44444444-4444-4444-8444-444444444444';
select is((select status::text from public.workspace_members where workspace_id = '00000000-0000-4000-8000-000000000001' and user_id = '44444444-4444-4444-8444-444444444444'), 'active',
  'A Reviewer can''t manage members');

-- The final Owner, even for trusted (service) code
select pg_temp.act_as_postgres();
select throws_ok($$update public.workspace_members set role = 'admin' where workspace_id = '00000000-0000-4000-8000-000000000001' and user_id = '11111111-1111-4111-8111-111111111111'$$,
  'P0001', 'The final Owner can''t be demoted, deactivated or removed.', 'The final Owner can''t be demoted');
select throws_ok($$update public.workspace_members set status = 'deactivated' where workspace_id = '00000000-0000-4000-8000-000000000001' and user_id = '11111111-1111-4111-8111-111111111111'$$,
  'P0001', 'The final Owner can''t be demoted, deactivated or removed.', 'The final Owner can''t be deactivated');
select throws_ok($$delete from public.workspace_members where workspace_id = '00000000-0000-4000-8000-000000000001' and user_id = '11111111-1111-4111-8111-111111111111'$$,
  'P0001', 'The final Owner can''t be demoted, deactivated or removed.', 'The final Owner can''t be removed');
insert into public.workspace_members (workspace_id, user_id, role) values ('00000000-0000-4000-8000-000000000001', '55555555-5555-4555-8555-555555555555', 'owner');
select lives_ok($$update public.workspace_members set role = 'admin' where workspace_id = '00000000-0000-4000-8000-000000000001' and user_id = '11111111-1111-4111-8111-111111111111'$$,
  'With a second Owner, an Owner can be demoted');
select throws_ok($$update public.workspace_members set user_id = '33333333-3333-4333-8333-333333333333' where workspace_id = '00000000-0000-4000-8000-000000000001' and user_id = '55555555-5555-4555-8555-555555555555'$$,
  'P0001', null, 'A membership''s user can''t be changed');

select pg_temp.act_as_postgres();
select * from finish();
rollback;
