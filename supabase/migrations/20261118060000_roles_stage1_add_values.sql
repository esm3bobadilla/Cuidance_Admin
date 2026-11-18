-- Cuidance Admin Web, role migration Stage 1a: add the new role values (additive only).
--
-- Team 03 decisions of Nov 16, 2026 (docs/Phase-B1/role-migration-plan.md):
--   Owner -> Super Admin, Admin -> Admin, Reviewer and Content Editor -> Team Member.
--
-- This file only ADDS two values to the role list. Nothing is renamed or removed:
-- 'owner', 'admin', 'reviewer' and 'content_editor' stay valid until a later,
-- separately reviewed stage. Postgres can't use a new enum value in the same
-- transaction that adds it, so the rules that use these values are in the next file.
--
-- Rollback: none needed for this file. Unused enum values are harmless; removing
-- them is part of the final (destructive) stage, which needs its own approval.

alter type public.workspace_role add value if not exists 'super_admin';
alter type public.workspace_role add value if not exists 'team_member';
