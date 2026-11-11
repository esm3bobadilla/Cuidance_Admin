-- Cuidance Admin Web, Phase 2.1: local development seed.
--
-- LOCAL ONLY (supabase start / supabase db reset). It isn't applied to the hosted
-- project by migrations. No real people: test users are created by the database
-- tests with example.com addresses (D13), so the tasks here start unassigned.
--
-- The five tasks match the Week 10 / Week 11 sample data, so the Review Queue
-- counts are 3 / 1 / 1 / 0 (Content for review / Safety checks / Partner content /
-- Open questions), the same as the browser-only prototype.

insert into public.workspaces (id, name, slug)
values ('00000000-0000-4000-8000-000000000001', 'Cuidance Content Team', 'cuidance-content-team');

insert into public.review_tasks (id, workspace_id, title, type, status, priority, open_question) values
  ('00000000-0000-4000-8000-000000000101', '00000000-0000-4000-8000-000000000001', 'Understanding sensitive skin', 'guidance_content', 'in_review', 'high', false),
  ('00000000-0000-4000-8000-000000000102', '00000000-0000-4000-8000-000000000001', 'Review ingredient benefit wording', 'claims_safety', 'needs_changes', 'high', false),
  ('00000000-0000-4000-8000-000000000103', '00000000-0000-4000-8000-000000000001', 'Which care areas would you like guidance on?', 'quiz_content', 'in_review', 'medium', false),
  ('00000000-0000-4000-8000-000000000104', '00000000-0000-4000-8000-000000000001', 'Check partner disclosure is visible', 'partner_content', 'pending_disclosure', 'medium', false),
  ('00000000-0000-4000-8000-000000000105', '00000000-0000-4000-8000-000000000001', 'Validate source support for claim', 'sources', 'needs_review', 'low', false);
