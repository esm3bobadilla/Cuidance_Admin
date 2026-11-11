-- Cuidance Admin Web, Phase 2.1: Row Level Security and API permissions.
--
-- The browser will use only the public (anon/publishable) key, so these
-- policies are the security boundary. Approved rules (Phase 2.0):
--   - Signed-out visitors (anon) get nothing.
--   - Members read their own workspace's data. Non-members see nothing.
--   - D5: Owners manage Admins and Reviewers; Admins manage Reviewers only;
--         Reviewers manage no one; no one changes their own membership.
--   - D4: only the assigned Reviewer records a decision (also enforced by trigger).
--   - Memberships and invitations are written only by the trusted Edge
--     Functions (Phase 2.5), using the service role, which bypasses RLS.
--   - Decisions are never updated or deleted; task status only changes
--     through a decision.

alter table public.profiles enable row level security;
alter table public.workspaces enable row level security;
alter table public.workspace_members enable row level security;
alter table public.invitations enable row level security;
alter table public.review_tasks enable row level security;
alter table public.review_decisions enable row level security;

-- ---------------------------------------------------------------------------
-- Table and column privileges. Start from nothing, then grant only what's used.
-- ---------------------------------------------------------------------------

revoke all on public.profiles, public.workspaces, public.workspace_members, public.invitations,
  public.review_tasks, public.review_decisions from anon, authenticated;

grant select on public.profiles, public.workspaces, public.workspace_members, public.invitations,
  public.review_tasks, public.review_decisions to authenticated;

-- Only these columns can ever be changed through the API
grant update (full_name) on public.profiles to authenticated;
grant update (name) on public.workspaces to authenticated;
grant update (role, status) on public.workspace_members to authenticated;
grant insert (workspace_id, title, type, status, priority, assigned_to, open_question, created_by) on public.review_tasks to authenticated;
-- Not status: it changes only through a review decision
grant update (title, type, priority, assigned_to, open_question) on public.review_tasks to authenticated;
grant insert (task_id, workspace_id, decision, note, decided_by) on public.review_decisions to authenticated;

-- ---------------------------------------------------------------------------
-- profiles
-- ---------------------------------------------------------------------------

create policy "Profiles: read your own and your workspace members'"
  on public.profiles for select to authenticated
  using (id = (select auth.uid()) or public.shares_workspace(id));

create policy "Profiles: update your own name"
  on public.profiles for update to authenticated
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()));

-- ---------------------------------------------------------------------------
-- workspaces
-- ---------------------------------------------------------------------------

create policy "Workspaces: members can read"
  on public.workspaces for select to authenticated
  using (public.is_member(id));

create policy "Workspaces: the Owner can rename"
  on public.workspaces for update to authenticated
  using (public.has_role(id, array['owner']::public.workspace_role[]))
  with check (public.has_role(id, array['owner']::public.workspace_role[]));

-- ---------------------------------------------------------------------------
-- workspace_members
-- ---------------------------------------------------------------------------

create policy "Members: members can read their workspace's members"
  on public.workspace_members for select to authenticated
  using (public.is_member(workspace_id));

-- D5: Owners manage Admins and Reviewers (and may move them between those two roles);
-- Admins manage Reviewers only and can't promote them. No one changes their own row.
-- Owners can't be changed through the API (the final Owner is also protected by trigger).
create policy "Members: Owners manage Admins and Reviewers, Admins manage Reviewers"
  on public.workspace_members for update to authenticated
  using (
    user_id <> (select auth.uid())
    and (
      (public.has_role(workspace_id, array['owner']::public.workspace_role[]) and role in ('admin', 'reviewer'))
      or (public.has_role(workspace_id, array['admin']::public.workspace_role[]) and role = 'reviewer')
    )
  )
  with check (
    user_id <> (select auth.uid())
    and (
      (public.has_role(workspace_id, array['owner']::public.workspace_role[]) and role in ('admin', 'reviewer'))
      or (public.has_role(workspace_id, array['admin']::public.workspace_role[]) and role = 'reviewer')
    )
  );

-- No insert or delete policies: members are added by the invitation Edge Function
-- and deactivated (status), never deleted.

-- ---------------------------------------------------------------------------
-- invitations (read-only through the API; written by Edge Functions)
-- ---------------------------------------------------------------------------

create policy "Invitations: Owners see all, Admins see Reviewer invitations"
  on public.invitations for select to authenticated
  using (
    public.has_role(workspace_id, array['owner']::public.workspace_role[])
    or (public.has_role(workspace_id, array['admin']::public.workspace_role[]) and role = 'reviewer')
  );

-- ---------------------------------------------------------------------------
-- review_tasks
-- ---------------------------------------------------------------------------

create policy "Tasks: members can read"
  on public.review_tasks for select to authenticated
  using (public.is_member(workspace_id));

create policy "Tasks: Owners and Admins create, as themselves"
  on public.review_tasks for insert to authenticated
  with check (
    public.has_role(workspace_id, array['owner', 'admin']::public.workspace_role[])
    and created_by = (select auth.uid())
  );

create policy "Tasks: Owners and Admins edit and assign"
  on public.review_tasks for update to authenticated
  using (public.has_role(workspace_id, array['owner', 'admin']::public.workspace_role[]))
  with check (public.has_role(workspace_id, array['owner', 'admin']::public.workspace_role[]));

-- No delete policy: tasks aren't deleted.

-- ---------------------------------------------------------------------------
-- review_decisions
-- ---------------------------------------------------------------------------

create policy "Decisions: members can read"
  on public.review_decisions for select to authenticated
  using (public.is_member(workspace_id));

-- D4: only the assigned Reviewer, recording as themselves (the trigger re-checks
-- this, sets the workspace and time, and refuses decisions on Approved tasks)
create policy "Decisions: the assigned Reviewer records, as themselves"
  on public.review_decisions for insert to authenticated
  with check (
    decided_by = (select auth.uid())
    and exists (
      select 1 from public.review_tasks t
      where t.id = task_id
        and t.assigned_to = (select auth.uid())
        and public.has_role(t.workspace_id, array['reviewer']::public.workspace_role[])
    )
  );

-- No update or delete policies: decisions are append-only (also enforced by trigger).
