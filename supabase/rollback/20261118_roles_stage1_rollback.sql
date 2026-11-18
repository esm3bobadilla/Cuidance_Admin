-- Cuidance Admin Web: ROLLBACK for role migration Stage 1
--   (20261118060000_roles_stage1_add_values.sql and 20261118060100_roles_stage1_mapping_and_rules.sql)
--
-- NOT a migration: it lives outside supabase/migrations so it never runs on its own.
-- Run it only if Team 03 decides to undo Stage 1, through the same reviewed route as
-- migrations (a team member's `supabase db push` of a migration that contains this
-- file's body, after review). Never by hand on the hosted project, never from an AI session.
--
-- What it does, in one transaction:
--   1. Maps any NEW role values back to legacy ones (super_admin -> owner,
--      team_member -> reviewer) in memberships and invitations. Lossless: the groups match.
--   2. Restores the Phase 2.1 invitation role check (admin, reviewer).
--   3. Restores the Phase 2.1 helper and trigger functions, copied verbatim from
--      20261111060200_functions_and_triggers.sql.
--   4. Restores the Phase 2.1 RLS policies, copied verbatim from 20261111060300_rls_and_grants.sql.
--   5. Drops the Stage 1 mapping functions.
--
-- What it can't undo:
--   - Postgres can't drop enum values, so 'super_admin' and 'team_member' stay in the
--     role list, unused. That is harmless; removing them is the final, separately
--     approved stage.
--   - Tasks created by Team Members, or assigned to Admins, under Stage 1 stay as they
--     are. Step 6 lists open tasks assigned to an Admin: under the Phase 2.1 rules only
--     a Reviewer can decide, so reassign those to a Reviewer.

begin;

-- 1. New values back to legacy values (same role group, so nothing gains or loses access)
update public.workspace_members set role = 'owner' where role = 'super_admin';
update public.workspace_members set role = 'reviewer' where role = 'team_member';
update public.invitations set role = 'reviewer' where role = 'team_member';

-- 2. The Phase 2.1 invitation role check
alter table public.invitations drop constraint invitations_role_check;
alter table public.invitations add constraint invitations_role_check check (role in ('admin', 'reviewer'));

-- 3. The Phase 2.1 functions (verbatim)
create or replace function public.has_role(target_workspace uuid, allowed public.workspace_role[])
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce(public.member_role(target_workspace) = any (allowed), false)
$$;

create or replace function public.guard_workspace_member()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  other_owners integer;
begin
  if tg_op = 'UPDATE' and (new.workspace_id <> old.workspace_id or new.user_id <> old.user_id) then
    raise exception 'A membership''s workspace and user can''t be changed.' using errcode = 'P0001';
  end if;

  if tg_op = 'UPDATE' and new.role = 'content_editor' and old.role <> 'content_editor' then
    raise exception 'The Content Editor role is reserved and can''t be assigned yet.' using errcode = 'P0001';
  end if;

  -- Losing an active Owner (demoted, deactivated or removed)
  if old.role = 'owner' and old.status = 'active'
     and (tg_op = 'DELETE' or new.role <> 'owner' or new.status <> 'active') then
    select count(*) into other_owners
    from public.workspace_members m
    where m.workspace_id = old.workspace_id
      and m.role = 'owner'
      and m.status = 'active'
      and m.user_id <> old.user_id;
    if other_owners = 0 then
      raise exception 'The final Owner can''t be demoted, deactivated or removed.' using errcode = 'P0001';
    end if;
  end if;

  if tg_op = 'DELETE' then
    return old;
  end if;
  return new;
end;
$$;

create or replace function public.guard_review_task()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if tg_op = 'INSERT' and new.status = 'approved' then
    raise exception 'A task can''t start as Approved. It''s approved by a review decision.' using errcode = 'P0001';
  end if;

  if tg_op = 'UPDATE' and new.workspace_id <> old.workspace_id then
    raise exception 'A task can''t move to another workspace.' using errcode = 'P0001';
  end if;

  -- Tasks are assigned to an active Reviewer of the same workspace (D4)
  if new.assigned_to is not null
     and (tg_op = 'INSERT' or new.assigned_to is distinct from old.assigned_to)
     and not exists (
       select 1 from public.workspace_members m
       where m.workspace_id = new.workspace_id
         and m.user_id = new.assigned_to
         and m.role = 'reviewer'
         and m.status = 'active'
     ) then
    raise exception 'Tasks can only be assigned to an active Reviewer in the same workspace.' using errcode = 'P0001';
  end if;

  return new;
end;
$$;

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
  select t.id, t.workspace_id, t.status, t.assigned_to into task
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

  if not exists (
    select 1 from public.workspace_members m
    where m.workspace_id = task.workspace_id
      and m.user_id = new.decided_by
      and m.role = 'reviewer'
      and m.status = 'active'
  ) then
    raise exception 'Only an active Reviewer can record a decision.' using errcode = 'P0001';
  end if;

  new.workspace_id := task.workspace_id;
  new.decided_at := now();
  return new;
end;
$$;

-- 4. The Phase 2.1 policies (verbatim)
drop policy "Workspaces: Super Admins can rename" on public.workspaces;
create policy "Workspaces: the Owner can rename"
  on public.workspaces for update to authenticated
  using (public.has_role(id, array['owner']::public.workspace_role[]))
  with check (public.has_role(id, array['owner']::public.workspace_role[]));

drop policy "Members: Super Admins and Admins manage the roles below them" on public.workspace_members;
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

drop policy "Invitations: Super Admins all, Admins Team Member invitations" on public.invitations;
create policy "Invitations: Owners see all, Admins see Reviewer invitations"
  on public.invitations for select to authenticated
  using (
    public.has_role(workspace_id, array['owner']::public.workspace_role[])
    or (public.has_role(workspace_id, array['admin']::public.workspace_role[]) and role = 'reviewer')
  );

drop policy "Tasks: members create, as themselves" on public.review_tasks;
create policy "Tasks: Owners and Admins create, as themselves"
  on public.review_tasks for insert to authenticated
  with check (
    public.has_role(workspace_id, array['owner', 'admin']::public.workspace_role[])
    and created_by = (select auth.uid())
  );

drop policy "Tasks: Super Admins and Admins edit any, Team Members own" on public.review_tasks;
create policy "Tasks: Owners and Admins edit and assign"
  on public.review_tasks for update to authenticated
  using (public.has_role(workspace_id, array['owner', 'admin']::public.workspace_role[]))
  with check (public.has_role(workspace_id, array['owner', 'admin']::public.workspace_role[]));

drop policy "Decisions: the assigned reviewer, never on a task they created" on public.review_decisions;
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

-- 5. The Stage 1 mapping functions are no longer used
drop function public.has_group(uuid, text[]);
drop function public.member_group(uuid);
drop function public.role_group(public.workspace_role);

-- 6. Open tasks assigned to an Admin (Phase 2.1 lets only Reviewers decide): reassign these
select t.id, t.title
from public.review_tasks t
join public.workspace_members m on m.workspace_id = t.workspace_id and m.user_id = t.assigned_to
where m.role = 'admin' and t.status <> 'approved';

commit;
