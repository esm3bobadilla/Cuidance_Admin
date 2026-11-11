-- Cuidance Admin Web, Phase 2.1: types and extensions.
--
-- Approved by Team 03 (Phase 2.0 decisions, Nov 11, 2026):
--   D1  separate Admin Supabase project (not the public app's)
--   D3  content_editor is reserved in the role list but not used yet
-- Nothing here is used by the app yet: sample mode stays the default (D9).

create extension if not exists citext with schema extensions;

-- Workspace roles. content_editor is RESERVED (D3): it can't be invited or assigned yet.
create type public.workspace_role as enum ('owner', 'admin', 'reviewer', 'content_editor');

create type public.member_status as enum ('active', 'deactivated');

create type public.invitation_status as enum ('pending', 'accepted', 'declined', 'revoked');

-- The five review task types used by the Week 10 / Week 11 screens
create type public.task_type as enum ('guidance_content', 'claims_safety', 'quiz_content', 'partner_content', 'sources');

-- The Week 10 statuses plus Approved (Week 11)
create type public.task_status as enum ('in_review', 'needs_review', 'pending_disclosure', 'needs_changes', 'approved');

create type public.task_priority as enum ('high', 'medium', 'low');

create type public.decision_kind as enum ('approved', 'changes_requested');
