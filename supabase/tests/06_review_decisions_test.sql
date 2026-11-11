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

-- Review decisions: D4 (assigned Reviewer only), D12, the note rule, append-only, status trigger
select pg_temp.act_as('33333333-3333-4333-8333-333333333333');
select lives_ok($$insert into public.review_decisions (task_id, workspace_id, decision, decided_by) values ('00000000-0000-4000-8000-000000000101', '00000000-0000-4000-8000-000000000001', 'approved', '33333333-3333-4333-8333-333333333333')$$,
  'The assigned Reviewer approves without a note');
select is((select status::text from public.review_tasks where id = '00000000-0000-4000-8000-000000000101'), 'approved', 'Approve sets the task to Approved');
select throws_ok($$insert into public.review_decisions (task_id, workspace_id, decision, decided_by) values ('00000000-0000-4000-8000-000000000101', '00000000-0000-4000-8000-000000000001', 'changes_requested', '33333333-3333-4333-8333-333333333333')$$,
  'P0001', null, 'No further decision once Approved (D12)');

select throws_ok($$insert into public.review_decisions (task_id, workspace_id, decision, decided_by) values ('00000000-0000-4000-8000-000000000103', '00000000-0000-4000-8000-000000000001', 'changes_requested', '33333333-3333-4333-8333-333333333333')$$,
  '23514', null, 'Request changes without a note is refused');
select throws_ok($$insert into public.review_decisions (task_id, workspace_id, decision, note, decided_by) values ('00000000-0000-4000-8000-000000000103', '00000000-0000-4000-8000-000000000001', 'changes_requested', '   ', '33333333-3333-4333-8333-333333333333')$$,
  '23514', null, 'A note of only spaces is refused');
select lives_ok($$insert into public.review_decisions (task_id, workspace_id, decision, note, decided_by) values ('00000000-0000-4000-8000-000000000103', '00000000-0000-4000-8000-000000000001', 'changes_requested', 'Add the source.', '33333333-3333-4333-8333-333333333333')$$,
  'Request changes with a note');
select is((select status::text from public.review_tasks where id = '00000000-0000-4000-8000-000000000103'), 'needs_changes', 'Request changes sets Needs changes');
select lives_ok($$insert into public.review_decisions (task_id, workspace_id, decision, note, decided_by) values ('00000000-0000-4000-8000-000000000103', '00000000-0000-4000-8000-000000000001', 'approved', 'Source added.', '33333333-3333-4333-8333-333333333333')$$,
  'Another decision is allowed after Needs changes (D12)');
select is((select status::text from public.review_tasks where id = '00000000-0000-4000-8000-000000000103'), 'approved', 'The latest decision sets the status');
select is((select count(*)::int from public.review_decisions where task_id = '00000000-0000-4000-8000-000000000103'), 2, 'Both decisions are kept');

select throws_ok($$insert into public.review_decisions (task_id, workspace_id, decision, decided_by) values ('00000000-0000-4000-8000-000000000105', '00000000-0000-4000-8000-000000000001', 'approved', '33333333-3333-4333-8333-333333333333')$$,
  'P0001', 'Only the assigned Reviewer can record a decision on this task.', 'A Reviewer can''t decide on a task assigned to someone else (D4)');
select lives_ok($$insert into public.review_decisions (task_id, workspace_id, decision, note, decided_by) values ('00000000-0000-4000-8000-000000000104', '00000000-0000-4000-8000-000000000001', 'changes_requested', 'Show the Partner label.', '44444444-4444-4444-8444-444444444444')$$,
  'A decision sent as someone else is still saved...');
select is((select decided_by from public.review_decisions where task_id = '00000000-0000-4000-8000-000000000104'), '33333333-3333-4333-8333-333333333333'::uuid, '...but recorded as the signed-in Reviewer');
select throws_ok($$update public.review_decisions set note = 'edited' where task_id = '00000000-0000-4000-8000-000000000101'$$, '42501', null, 'Decisions can''t be edited');
select throws_ok($$delete from public.review_decisions where task_id = '00000000-0000-4000-8000-000000000101'$$, '42501', null, 'Decisions can''t be deleted');

select pg_temp.act_as('22222222-2222-4222-8222-222222222222');
select throws_ok($$insert into public.review_decisions (task_id, workspace_id, decision, decided_by) values ('00000000-0000-4000-8000-000000000102', '00000000-0000-4000-8000-000000000001', 'approved', '22222222-2222-4222-8222-222222222222')$$,
  'P0001', 'Only the assigned Reviewer can record a decision on this task.', 'An Admin can''t record a decision (D4: override deferred)');
select pg_temp.act_as('11111111-1111-4111-8111-111111111111');
select throws_ok($$insert into public.review_decisions (task_id, workspace_id, decision, decided_by) values ('00000000-0000-4000-8000-000000000102', '00000000-0000-4000-8000-000000000001', 'approved', '11111111-1111-4111-8111-111111111111')$$,
  'P0001', 'Only the assigned Reviewer can record a decision on this task.', 'The Owner can''t record a decision (D4: override deferred)');
select pg_temp.act_as('55555555-5555-4555-8555-555555555555');
select throws_ok($$insert into public.review_decisions (task_id, workspace_id, decision, decided_by) values ('00000000-0000-4000-8000-000000000102', '00000000-0000-4000-8000-000000000001', 'approved', '55555555-5555-4555-8555-555555555555')$$,
  'P0001', null, 'A non-member can''t record a decision');
select is((select count(*)::int from public.review_decisions), 0, 'A non-member sees no decisions');

select pg_temp.act_as('44444444-4444-4444-8444-444444444444');
select is((select count(*)::int from public.review_decisions), 4, 'Members see their workspace''s decisions');
select is((select decided_by from public.review_decisions where task_id = '00000000-0000-4000-8000-000000000101'), '33333333-3333-4333-8333-333333333333'::uuid, 'Each decision records who made it');

-- The database rules hold for trusted (service) code too
select pg_temp.act_as_postgres();
select throws_ok($$insert into public.review_decisions (task_id, workspace_id, decision, decided_by) values ('00000000-0000-4000-8000-000000000102', '00000000-0000-4000-8000-000000000001', 'approved', '22222222-2222-4222-8222-222222222222')$$,
  'P0001', 'Only the assigned Reviewer can record a decision on this task.', 'Even trusted code can''t record a decision for a non-assignee');
select throws_ok($$update public.review_decisions set note = 'edited' where task_id = '00000000-0000-4000-8000-000000000101'$$, 'P0001',
  'Review decisions can''t be changed or deleted.', 'Even trusted code can''t edit a decision');
select throws_ok($$delete from public.review_tasks where id = '00000000-0000-4000-8000-000000000101'$$, '23503', null, 'A task with decisions can''t be deleted');
update public.workspace_members set status = 'deactivated' where workspace_id = '00000000-0000-4000-8000-000000000001' and user_id = '44444444-4444-4444-8444-444444444444';
select pg_temp.act_as('44444444-4444-4444-8444-444444444444');
select throws_ok($$insert into public.review_decisions (task_id, workspace_id, decision, decided_by) values ('00000000-0000-4000-8000-000000000105', '00000000-0000-4000-8000-000000000001', 'approved', '44444444-4444-4444-8444-444444444444')$$,
  'P0001', 'Only an active Reviewer can record a decision.', 'A deactivated Reviewer can''t record decisions');
select pg_temp.act_as_postgres();
insert into public.review_decisions (task_id, workspace_id, decision, decided_by) values ('00000000-0000-4000-8000-000000000102', '00000000-0000-4000-8000-000000000002', 'approved', '33333333-3333-4333-8333-333333333333');
select is((select workspace_id from public.review_decisions where task_id = '00000000-0000-4000-8000-000000000102'), '00000000-0000-4000-8000-000000000001'::uuid, 'The decision always takes its task''s workspace');

select pg_temp.act_as_postgres();
select * from finish();
rollback;
