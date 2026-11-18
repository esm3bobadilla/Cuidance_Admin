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


-- ===========================================================================
-- Role migration Stage 1: the mapping layer, new role values beside legacy ones,
-- assignment rules and reviewer separation (Team 03 decisions, Nov 16, 2026).
-- Extra members stored with the NEW values (example.com only, D13):
--   8888 Super Admin (new value), 9999 and aaaa Team Members (new value)
-- ===========================================================================
insert into auth.users (instance_id, id, aud, role, email, raw_user_meta_data, created_at, updated_at) values
  ('00000000-0000-0000-0000-000000000000', '88888888-8888-4888-8888-888888888888', 'authenticated', 'authenticated', 'super.admin@example.com', '{"full_name":"Test Super Admin"}', now(), now()),
  ('00000000-0000-0000-0000-000000000000', '99999999-9999-4999-8999-999999999999', 'authenticated', 'authenticated', 'team.member.a@example.com', '{"full_name":"Test Team Member A"}', now(), now()),
  ('00000000-0000-0000-0000-000000000000', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'authenticated', 'authenticated', 'team.member.b@example.com', '{"full_name":"Test Team Member B"}', now(), now());
insert into public.workspace_members (workspace_id, user_id, role) values
  ('00000000-0000-4000-8000-000000000001', '88888888-8888-4888-8888-888888888888', 'super_admin'),
  ('00000000-0000-4000-8000-000000000001', '99999999-9999-4999-8999-999999999999', 'team_member'),
  ('00000000-0000-4000-8000-000000000001', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'team_member');

-- ---------------------------------------------------------------------------
-- The explicit mapping
-- ---------------------------------------------------------------------------
select results_eq(
  $$select r::text, public.role_group(r) from unnest(enum_range(null::public.workspace_role)) as r order by 1$$,
  $$values ('admin', 'admin'), ('content_editor', 'team_member'), ('owner', 'super_admin'), ('reviewer', 'team_member'), ('super_admin', 'super_admin'), ('team_member', 'team_member')$$,
  'Every stored role value maps to exactly one role group');

select pg_temp.act_as('11111111-1111-4111-8111-111111111111');
select is(public.member_group('00000000-0000-4000-8000-000000000001'), 'super_admin', 'A legacy Owner reads as a Super Admin');
select pg_temp.act_as('33333333-3333-4333-8333-333333333333');
select is(public.member_group('00000000-0000-4000-8000-000000000001'), 'team_member', 'A legacy Reviewer reads as a Team Member');
select pg_temp.act_as('88888888-8888-4888-8888-888888888888');
select ok(public.has_role('00000000-0000-4000-8000-000000000001', array['owner']::public.workspace_role[]), 'has_role stays compatible: a new Super Admin passes a legacy Owner check');
select pg_temp.act_as('55555555-5555-4555-8555-555555555555');
select is(public.member_group('00000000-0000-4000-8000-000000000001'), null, 'A non-member has no role group');

-- ---------------------------------------------------------------------------
-- Workspace and members with new values
-- ---------------------------------------------------------------------------
select pg_temp.act_as('99999999-9999-4999-8999-999999999999');
update public.workspaces set name = 'Renamed by a Team Member' where id = '00000000-0000-4000-8000-000000000001';
select is((select name from public.workspaces where id = '00000000-0000-4000-8000-000000000001'), 'Cuidance Content Team', 'A Team Member (new value) can''t rename the workspace');
select is((select count(*)::int from public.invitations), 0, 'A Team Member (new value) sees no invitations');

select pg_temp.act_as('88888888-8888-4888-8888-888888888888');
select lives_ok($$update public.workspaces set name = 'Cuidance Content Team (renamed)' where id = '00000000-0000-4000-8000-000000000001'$$, 'A Super Admin (new value) renames the workspace');
select lives_ok($$update public.workspace_members set role = 'admin' where workspace_id = '00000000-0000-4000-8000-000000000001' and user_id = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'$$, 'A Super Admin (new value) promotes a Team Member to Admin');
select lives_ok($$update public.workspace_members set role = 'team_member' where workspace_id = '00000000-0000-4000-8000-000000000001' and user_id = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'$$, 'A Super Admin (new value) sets an Admin back to Team Member');
select throws_ok($$update public.workspace_members set role = 'super_admin' where workspace_id = '00000000-0000-4000-8000-000000000001' and user_id = '22222222-2222-4222-8222-222222222222'$$,
  '42501', null, 'No one makes a Super Admin through the API');

select pg_temp.act_as('22222222-2222-4222-8222-222222222222');
select lives_ok($$update public.workspace_members set role = 'team_member' where workspace_id = '00000000-0000-4000-8000-000000000001' and user_id = '44444444-4444-4444-8444-444444444444'$$, 'An Admin moves a legacy Reviewer to the new Team Member value');
select throws_ok($$update public.workspace_members set role = 'admin' where workspace_id = '00000000-0000-4000-8000-000000000001' and user_id = '99999999-9999-4999-8999-999999999999'$$,
  '42501', null, 'An Admin can''t promote a Team Member (new value)');
update public.workspace_members set status = 'deactivated' where workspace_id = '00000000-0000-4000-8000-000000000001' and user_id = '88888888-8888-4888-8888-888888888888';
select is((select status::text from public.workspace_members where user_id = '88888888-8888-4888-8888-888888888888'), 'active', 'An Admin can''t change a Super Admin (new value)');

-- The final Super Admin is protected across legacy and new values
select pg_temp.act_as_postgres();
select lives_ok($$update public.workspace_members set status = 'deactivated' where user_id = '88888888-8888-4888-8888-888888888888' and workspace_id = '00000000-0000-4000-8000-000000000001'$$, 'A Super Admin can be deactivated while another one (legacy Owner) is active');
select lives_ok($$update public.workspace_members set role = 'super_admin' where user_id = '11111111-1111-4111-8111-111111111111' and workspace_id = '00000000-0000-4000-8000-000000000001'$$, 'Owner to Super Admin keeps the same group, even for the final one');
select throws_ok($$update public.workspace_members set role = 'admin' where user_id = '11111111-1111-4111-8111-111111111111' and workspace_id = '00000000-0000-4000-8000-000000000001'$$,
  'P0001', 'The final Owner can''t be demoted, deactivated or removed.', 'The final Super Admin (new value) can''t be demoted');
update public.workspace_members set role = 'owner' where user_id = '11111111-1111-4111-8111-111111111111' and workspace_id = '00000000-0000-4000-8000-000000000001';
update public.workspace_members set status = 'active' where user_id = '88888888-8888-4888-8888-888888888888' and workspace_id = '00000000-0000-4000-8000-000000000001';

-- ---------------------------------------------------------------------------
-- Invitations with the new value
-- ---------------------------------------------------------------------------
select lives_ok($$insert into public.invitations (workspace_id, email, role) values ('00000000-0000-4000-8000-000000000001', 'new.team.member@example.com', 'team_member')$$, 'Trusted code can invite a Team Member (new value)');
select throws_ok($$insert into public.invitations (workspace_id, email, role) values ('00000000-0000-4000-8000-000000000001', 'new.super@example.com', 'super_admin')$$,
  '23514', null, 'No one is invited as a Super Admin');
select pg_temp.act_as('22222222-2222-4222-8222-222222222222');
select is((select count(*)::int from public.invitations where email = 'new.team.member@example.com'), 1, 'An Admin sees Team Member invitations (new value)');
select pg_temp.act_as('88888888-8888-4888-8888-888888888888');
select is((select count(*)::int from public.invitations where email = 'new.team.member@example.com'), 1, 'A Super Admin (new value) sees invitations');

-- ---------------------------------------------------------------------------
-- Assigning: Super Admins and Admins assign to Admins and Team Members;
-- Team Members assign to Team Members only; Super Admins are never assigned
-- ---------------------------------------------------------------------------
select pg_temp.act_as('99999999-9999-4999-8999-999999999999');
select lives_ok($$insert into public.review_tasks (workspace_id, title, type, created_by, assigned_to) values ('00000000-0000-4000-8000-000000000001', 'Sent by Team Member A', 'sources', '99999999-9999-4999-8999-999999999999', '33333333-3333-4333-8333-333333333333')$$,
  'A Team Member (new value) sends a task to a Team Member (legacy Reviewer)');
select throws_ok($$insert into public.review_tasks (workspace_id, title, type, created_by, assigned_to) values ('00000000-0000-4000-8000-000000000001', 'To an Admin', 'sources', '99999999-9999-4999-8999-999999999999', '22222222-2222-4222-8222-222222222222')$$,
  'P0001', null, 'A Team Member can''t assign to an Admin');
select throws_ok($$insert into public.review_tasks (workspace_id, title, type, created_by, assigned_to) values ('00000000-0000-4000-8000-000000000001', 'To a Super Admin', 'sources', '99999999-9999-4999-8999-999999999999', '88888888-8888-4888-8888-888888888888')$$,
  'P0001', null, 'A Team Member can''t assign to a Super Admin');
select throws_ok($$insert into public.review_tasks (workspace_id, title, type, created_by, assigned_to) values ('00000000-0000-4000-8000-000000000001', 'To myself', 'sources', '99999999-9999-4999-8999-999999999999', '99999999-9999-4999-8999-999999999999')$$,
  'P0001', 'You can''t be assigned to review a task you created.', 'No one is assigned to review a task they created');
select throws_ok($$insert into public.review_tasks (workspace_id, title, type, created_by) values ('00000000-0000-4000-8000-000000000001', 'Spoofed', 'sources', '22222222-2222-4222-8222-222222222222')$$,
  '42501', null, 'A Team Member creates tasks only as themselves');

-- Reassigning: Team Members only tasks they sent
select lives_ok($$update public.review_tasks set assigned_to = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa' where title = 'Sent by Team Member A'$$, 'A Team Member reassigns a task they sent');
select throws_ok($$update public.review_tasks set assigned_to = '22222222-2222-4222-8222-222222222222' where title = 'Sent by Team Member A'$$,
  'P0001', null, '...but only to another Team Member');
update public.review_tasks set assigned_to = '99999999-9999-4999-8999-999999999999' where id = '00000000-0000-4000-8000-000000000101';
select is((select assigned_to from public.review_tasks where id = '00000000-0000-4000-8000-000000000101'), '33333333-3333-4333-8333-333333333333'::uuid, 'A Team Member can''t reassign a task someone else sent');
select pg_temp.act_as('33333333-3333-4333-8333-333333333333');
update public.review_tasks set assigned_to = '44444444-4444-4444-8444-444444444444' where title = 'Sent by Team Member A';
select is((select assigned_to from public.review_tasks where title = 'Sent by Team Member A'), 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'::uuid, 'A legacy Reviewer can''t reassign a task another Team Member sent');

select pg_temp.act_as('22222222-2222-4222-8222-222222222222');
select lives_ok($$update public.review_tasks set assigned_to = '44444444-4444-4444-8444-444444444444' where title = 'Sent by Team Member A'$$, 'An Admin reassigns a task a Team Member sent');
select lives_ok($$insert into public.review_tasks (workspace_id, title, type, created_by, assigned_to) values ('00000000-0000-4000-8000-000000000001', 'Admin to Admin', 'claims_safety', '22222222-2222-4222-8222-222222222222', '77777777-7777-4777-8777-777777777777')$$,
  'An Admin assigns a review to another Admin');
select throws_ok($$update public.review_tasks set assigned_to = '88888888-8888-4888-8888-888888888888' where title = 'Admin to Admin'$$,
  'P0001', null, 'A Super Admin (new value) is never assigned a review');

select pg_temp.act_as('88888888-8888-4888-8888-888888888888');
select lives_ok($$insert into public.review_tasks (workspace_id, title, type, created_by, assigned_to) values ('00000000-0000-4000-8000-000000000001', 'Super Admin content', 'guidance_content', '88888888-8888-4888-8888-888888888888', '99999999-9999-4999-8999-999999999999')$$,
  'A Super Admin (new value) sends their content to a Team Member');
select lives_ok($$update public.review_tasks set priority = 'high' where id = '00000000-0000-4000-8000-000000000101'$$, 'A Super Admin (new value) edits any task');

select pg_temp.act_as_postgres();
select throws_ok($$update public.review_tasks set assigned_to = '11111111-1111-4111-8111-111111111111' where id = '00000000-0000-4000-8000-000000000105'$$,
  'P0001', null, 'Even trusted code can''t assign a review to a Super Admin (legacy Owner)');

-- ---------------------------------------------------------------------------
-- Decisions: the assigned reviewer, never on their own content
-- ---------------------------------------------------------------------------
select pg_temp.act_as('88888888-8888-4888-8888-888888888888');
select throws_ok($$insert into public.review_decisions (task_id, workspace_id, decision, decided_by) values ((select id from public.review_tasks where title = 'Super Admin content'), '00000000-0000-4000-8000-000000000001', 'approved', '88888888-8888-4888-8888-888888888888')$$,
  'P0001', 'Only the assigned Reviewer can record a decision on this task.', 'A Super Admin can''t approve their own content (they are never its assigned reviewer)');

select pg_temp.act_as('77777777-7777-4777-8777-777777777777');
select lives_ok($$insert into public.review_decisions (task_id, workspace_id, decision, decided_by) values ((select id from public.review_tasks where title = 'Admin to Admin'), '00000000-0000-4000-8000-000000000001', 'approved', '77777777-7777-4777-8777-777777777777')$$,
  'An assigned Admin records a decision');
select is((select status::text from public.review_tasks where title = 'Admin to Admin'), 'approved', '...and the task is Approved');

select pg_temp.act_as('99999999-9999-4999-8999-999999999999');
select lives_ok($$insert into public.review_decisions (task_id, workspace_id, decision, note, decided_by) values ((select id from public.review_tasks where title = 'Super Admin content'), '00000000-0000-4000-8000-000000000001', 'changes_requested', 'Add the evidence label.', '99999999-9999-4999-8999-999999999999')$$,
  'An assigned Team Member (new value) records a decision on a Super Admin''s content');

-- The creator can't decide even if a task is forced onto them outside the API
select pg_temp.act_as_postgres();
update public.review_tasks set created_by = '99999999-9999-4999-8999-999999999999' where title = 'Super Admin content';
select pg_temp.act_as('99999999-9999-4999-8999-999999999999');
select throws_ok($$insert into public.review_decisions (task_id, workspace_id, decision, decided_by) values ((select id from public.review_tasks where title = 'Super Admin content'), '00000000-0000-4000-8000-000000000001', 'approved', '99999999-9999-4999-8999-999999999999')$$,
  'P0001', 'You can''t record a decision on a task you created.', 'No one records a decision on a task they created (the trigger refuses before the policy check)');
select pg_temp.act_as_postgres();
select throws_ok($$insert into public.review_decisions (task_id, workspace_id, decision, decided_by) values ((select id from public.review_tasks where title = 'Super Admin content'), '00000000-0000-4000-8000-000000000001', 'approved', '99999999-9999-4999-8999-999999999999')$$,
  'P0001', 'You can''t record a decision on a task you created.', '...and even trusted code can''t (trigger)');

update public.workspace_members set status = 'deactivated' where user_id = '44444444-4444-4444-8444-444444444444' and workspace_id = '00000000-0000-4000-8000-000000000001';
select throws_ok($$insert into public.review_decisions (task_id, workspace_id, decision, decided_by) values ((select id from public.review_tasks where title = 'Sent by Team Member A'), '00000000-0000-4000-8000-000000000001', 'approved', '44444444-4444-4444-8444-444444444444')$$,
  'P0001', 'Only an active Reviewer can record a decision.', 'A deactivated Team Member can''t record a decision');

select pg_temp.act_as_postgres();
select * from finish();
rollback;
