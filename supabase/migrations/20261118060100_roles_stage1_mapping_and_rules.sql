-- Cuidance Admin Web, role migration Stage 1b: explicit role mapping and dual-read rules.
--
-- Additive and reversible (rollback: supabase/rollback/20261118_roles_stage1_rollback.sql).
-- No membership or invitation row is changed by this migration: existing members keep
-- their legacy role values, and every rule reads legacy and new values the same way
-- through one explicit mapping, public.role_group():
--
--   stored value                                  -> role group (what the rules check)
--   owner, super_admin                            -> super_admin  (Super Admin)
--   admin                                         -> admin        (Admin)
--   reviewer, content_editor, team_member         -> team_member  (Team Member)
--
-- Permission matrix (Team 03, Nov 16, 2026; app copy in shared/content/permissions.ts):
--   - Super Admins manage Admins and Team Members; Admins manage Team Members; no one
--     changes their own membership; the final Super Admin is protected (was D5).
--   - Super Admins and Admins assign reviews to Admins and Team Members. Team Members
--     assign only to Team Members. Super Admins are never assigned a review.
--   - Super Admins and Admins edit and reassign any task; Team Members only tasks they
--     created (sent).
--   - Reviewer separation: only the assigned reviewer records a decision (was D4), and
--     no one is assigned, or records a decision, on a task they created. So no one,
--     Super Admins included, approves their own content.
--   - Content Editor stays reserved: it can't be assigned or invited (D3).
--   - Invitations: Super Admins invite Admins and Team Members; Admins invite Team
--     Members. 'reviewer' is still accepted for older clients.

-- ---------------------------------------------------------------------------
-- The mapping layer
-- ---------------------------------------------------------------------------

-- Unknown values map to null, which every rule treats as "no access"
create function public.role_group(r public.workspace_role)
returns text
language sql
immutable
set search_path = ''
as $$
  select case r::text
    when 'owner' then 'super_admin'
    when 'super_admin' then 'super_admin'
    when 'admin' then 'admin'
    when 'reviewer' then 'team_member'
    when 'content_editor' then 'team_member'
    when 'team_member' then 'team_member'
  end
$$;

comment on function public.role_group(public.workspace_role) is
  'Role migration Stage 1: maps legacy and new role values to super_admin, admin or team_member.';

-- The signed-in user's active role group in a workspace, or null
create function public.member_group(target_workspace uuid)
returns text
language sql
stable
security definer
set search_path = ''
as $$
  select public.role_group(public.member_role(target_workspace))
$$;

create function public.has_group(target_workspace uuid, allowed text[])
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce(public.member_group(target_workspace) = any (allowed), false)
$$;

-- Kept for compatibility, now group-aware: has_role(ws, '{owner}') is also true for a
-- Super Admin, and has_role(ws, '{reviewer}') for any Team Member.
create or replace function public.has_role(target_workspace uuid, allowed public.workspace_role[])
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce(
    public.member_group(target_workspace) = any (array(select public.role_group(a) from unnest(allowed) as a)),
    false
  )
$$;

-- ---------------------------------------------------------------------------
-- Memberships: the final Super Admin (legacy Owner) is protected
-- ---------------------------------------------------------------------------

create or replace function public.guard_workspace_member()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  other_super_admins integer;
begin
  if tg_op = 'UPDATE' and (new.workspace_id <> old.workspace_id or new.user_id <> old.user_id) then
    raise exception 'A membership''s workspace and user can''t be changed.' using errcode = 'P0001';
  end if;

  if tg_op = 'UPDATE' and new.role = 'content_editor' and old.role <> 'content_editor' then
    raise exception 'The Content Editor role is reserved and can''t be assigned yet.' using errcode = 'P0001';
  end if;

  -- Losing an active Super Admin (legacy Owner): demoted, deactivated or removed.
  -- Moving between 'owner' and 'super_admin' keeps the same group, so it isn't a loss.
  if public.role_group(old.role) = 'super_admin' and old.status = 'active'
     and (tg_op = 'DELETE' or public.role_group(new.role) is distinct from 'super_admin' or new.status <> 'active') then
    select count(*) into other_super_admins
    from public.workspace_members m
    where m.workspace_id = old.workspace_id
      and public.role_group(m.role) = 'super_admin'
      and m.status = 'active'
      and m.user_id <> old.user_id;
    if other_super_admins = 0 then
      -- Message unchanged so existing callers keep matching it
      raise exception 'The final Owner can''t be demoted, deactivated or removed.' using errcode = 'P0001';
    end if;
  end if;

  if tg_op = 'DELETE' then
    return old;
  end if;
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- Review tasks: who may be assigned
-- ---------------------------------------------------------------------------

create or replace function public.guard_review_task()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  caller uuid := (select auth.uid());
  assigner_group text;
  assignee_group text;
begin
  if tg_op = 'INSERT' and new.status = 'approved' then
    raise exception 'A task can''t start as Approved. It''s approved by a review decision.' using errcode = 'P0001';
  end if;

  if tg_op = 'UPDATE' and new.workspace_id <> old.workspace_id then
    raise exception 'A task can''t move to another workspace.' using errcode = 'P0001';
  end if;

  if new.assigned_to is not null
     and (tg_op = 'INSERT' or new.assigned_to is distinct from old.assigned_to) then

    -- Reviewer separation: the person who created (sent) the task can't review it
    if new.created_by is not null and new.assigned_to = new.created_by then
      raise exception 'You can''t be assigned to review a task you created.' using errcode = 'P0001';
    end if;

    select public.role_group(m.role) into assignee_group
    from public.workspace_members m
    where m.workspace_id = new.workspace_id
      and m.user_id = new.assigned_to
      and m.status = 'active';

    -- Trusted code (no signed-in user) follows the Super Admin and Admin rule
    if caller is not null then
      select public.role_group(m.role) into assigner_group
      from public.workspace_members m
      where m.workspace_id = new.workspace_id
        and m.user_id = caller
        and m.status = 'active';
      if assigner_group is null then
        raise exception 'Only active members of this workspace can assign tasks.' using errcode = 'P0001';
      end if;
    end if;

    if assignee_group is null
       or (assigner_group = 'team_member' and assignee_group <> 'team_member')
       or (assignee_group not in ('admin', 'team_member')) then
      raise exception 'Tasks can only be assigned to an active Admin or Team Member in the same workspace. Team Members assign to Team Members only.' using errcode = 'P0001';
    end if;
  end if;

  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- Review decisions: the assigned reviewer, never the task's creator
-- ---------------------------------------------------------------------------

create or replace function public.guard_review_decision()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  task record;
begin
  -- Lock the task so two decisions on the same task are handled one at a time
  select t.id, t.workspace_id, t.status, t.assigned_to, t.created_by into task
  from public.review_tasks t
  where t.id = new.task_id
  for update;

  if not found then
    raise exception 'This task isn''t available.' using errcode = 'P0001';
  end if;

  if task.status = 'approved' then
    raise exception 'This task is already approved.' using errcode = 'P0001';
  end if;

  -- When a signed-in user records the decision, it's always recorded as them
  if (select auth.uid()) is not null then
    new.decided_by := (select auth.uid());
  end if;

  if task.assigned_to is null or new.decided_by <> task.assigned_to then
    raise exception 'Only the assigned Reviewer can record a decision on this task.' using errcode = 'P0001';
  end if;

  -- Reviewer separation: no one approves (or returns) content they sent for review
  if task.created_by is not null and new.decided_by = task.created_by then
    raise exception 'You can''t record a decision on a task you created.' using errcode = 'P0001';
  end if;

  if not exists (
    select 1 from public.workspace_members m
    where m.workspace_id = task.workspace_id
      and m.user_id = new.decided_by
      and public.role_group(m.role) in ('admin', 'team_member')
      and m.status = 'active'
  ) then
    raise exception 'Only an active Reviewer can record a decision.' using errcode = 'P0001';
  end if;

  new.workspace_id := task.workspace_id;
  new.decided_at := now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- Invitations may name the new Team Member value (legacy 'reviewer' still accepted)
-- ---------------------------------------------------------------------------

alter table public.invitations drop constraint invitations_role_check;
alter table public.invitations add constraint invitations_role_check
  check (role in ('admin', 'reviewer', 'team_member'));

-- ---------------------------------------------------------------------------
-- Row Level Security, rewritten on role groups
-- ---------------------------------------------------------------------------

drop policy "Workspaces: the Owner can rename" on public.workspaces;
create policy "Workspaces: Super Admins can rename"
  on public.workspaces for update to authenticated
  using (public.has_group(id, array['super_admin']))
  with check (public.has_group(id, array['super_admin']));

drop policy "Members: Owners manage Admins and Reviewers, Admins manage Reviewers" on public.workspace_members;
create policy "Members: Super Admins and Admins manage the roles below them"
  on public.workspace_members for update to authenticated
  using (
    user_id <> (select auth.uid())
    and (
      (public.has_group(workspace_id, array['super_admin']) and public.role_group(role) in ('admin', 'team_member'))
      or (public.has_group(workspace_id, array['admin']) and public.role_group(role) = 'team_member')
    )
  )
  with check (
    user_id <> (select auth.uid())
    and (
      (public.has_group(workspace_id, array['super_admin']) and public.role_group(role) in ('admin', 'team_member'))
      or (public.has_group(workspace_id, array['admin']) and public.role_group(role) = 'team_member')
    )
  );

drop policy "Invitations: Owners see all, Admins see Reviewer invitations" on public.invitations;
create policy "Invitations: Super Admins all, Admins Team Member invitations"
  on public.invitations for select to authenticated
  using (
    public.has_group(workspace_id, array['super_admin'])
    or (public.has_group(workspace_id, array['admin']) and public.role_group(role) = 'team_member')
  );

drop policy "Tasks: Owners and Admins create, as themselves" on public.review_tasks;
create policy "Tasks: members create, as themselves"
  on public.review_tasks for insert to authenticated
  with check (
    public.is_member(workspace_id)
    and created_by = (select auth.uid())
  );

drop policy "Tasks: Owners and Admins edit and assign" on public.review_tasks;
create policy "Tasks: Super Admins and Admins edit any, Team Members own"
  on public.review_tasks for update to authenticated
  using (
    public.has_group(workspace_id, array['super_admin', 'admin'])
    or (public.has_group(workspace_id, array['team_member']) and created_by = (select auth.uid()))
  )
  with check (
    public.has_group(workspace_id, array['super_admin', 'admin'])
    or (public.has_group(workspace_id, array['team_member']) and created_by = (select auth.uid()))
  );

drop policy "Decisions: the assigned Reviewer records, as themselves" on public.review_decisions;
create policy "Decisions: the assigned reviewer, never on a task they created"
  on public.review_decisions for insert to authenticated
  with check (
    decided_by = (select auth.uid())
    and exists (
      select 1 from public.review_tasks t
      where t.id = task_id
        and t.assigned_to = (select auth.uid())
        and t.created_by is distinct from (select auth.uid())
        and public.has_group(t.workspace_id, array['admin', 'team_member'])
    )
  );

-- ---------------------------------------------------------------------------
-- Function access
-- ---------------------------------------------------------------------------

revoke all on function public.role_group(public.workspace_role) from public, anon;
revoke all on function public.member_group(uuid) from public, anon;
revoke all on function public.has_group(uuid, text[]) from public, anon;
grant execute on function public.role_group(public.workspace_role) to authenticated;
grant execute on function public.member_group(uuid) to authenticated;
grant execute on function public.has_group(uuid, text[]) to authenticated;
