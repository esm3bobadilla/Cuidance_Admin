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

-- The seed matches the Week 10 / Week 11 sample data, and the Review Queue counts hold
select pg_temp.act_as_postgres();
select is((select name from public.workspaces where id = '00000000-0000-4000-8000-000000000001'), 'Cuidance Content Team', 'The seeded workspace exists');
select is((select count(*)::int from public.review_tasks where workspace_id = '00000000-0000-4000-8000-000000000001'), 5, 'Five seeded tasks');
select set_eq(
  $$select title, type::text, status::text, priority::text from public.review_tasks where workspace_id = '00000000-0000-4000-8000-000000000001'$$,
  $$values ('Understanding sensitive skin', 'guidance_content', 'in_review', 'high'),
           ('Review ingredient benefit wording', 'claims_safety', 'needs_changes', 'high'),
           ('Which care areas would you like guidance on?', 'quiz_content', 'in_review', 'medium'),
           ('Check partner disclosure is visible', 'partner_content', 'pending_disclosure', 'medium'),
           ('Validate source support for claim', 'sources', 'needs_review', 'low')$$,
  'The seeded tasks match the sample data');

-- Review Queue counts (same rule as shared/review-loop/review-decisions.ts)
create temp view queue_counts as
  select
    count(*) filter (where type in ('guidance_content', 'quiz_content', 'sources')) as content_for_review,
    count(*) filter (where type = 'claims_safety') as safety_checks,
    count(*) filter (where type = 'partner_content') as partner_content,
    count(*) filter (where open_question) as open_questions
  from public.review_tasks where workspace_id = '00000000-0000-4000-8000-000000000001' and status <> 'approved';
select results_eq('select content_for_review::int, safety_checks::int, partner_content::int, open_questions::int from queue_counts',
  $$values (3, 1, 1, 0)$$, 'The seed gives 3 / 1 / 1 / 0');

select pg_temp.act_as('33333333-3333-4333-8333-333333333333');
insert into public.review_decisions (task_id, workspace_id, decision, decided_by) values ('00000000-0000-4000-8000-000000000101', '00000000-0000-4000-8000-000000000001', 'approved', '33333333-3333-4333-8333-333333333333');
select pg_temp.act_as_postgres();
select results_eq('select content_for_review::int, safety_checks::int, partner_content::int, open_questions::int from queue_counts',
  $$values (2, 1, 1, 0)$$, 'Approving a guidance task gives 2 / 1 / 1 / 0, as in the prototype');

select pg_temp.act_as_postgres();
select * from finish();
rollback;
