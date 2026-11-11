-- Cuidance Admin Web, Phase 2.1: helper functions and triggers.
--
-- Rules enforced here, by the database itself (they hold for every caller,
-- including the trusted Edge Functions added in Phase 2.5):
--   D4  only the assigned Reviewer may record a review decision
--   D5  the final Owner can't be demoted, deactivated or removed
--   D12 a task may get another decision after Needs changes, until it's Approved
--   Request changes needs a note (table constraint); decisions are append-only.
--
-- Every security definer function uses an empty search_path and fully qualified names.

-- ---------------------------------------------------------------------------
-- Role helpers, used by the RLS policies
-- ---------------------------------------------------------------------------

-- The signed-in user's active role in a workspace, or null
create function public.member_role(target_workspace uuid)
returns public.workspace_role
language sql
stable
security definer
set search_path = ''
as $$
  select m.role
  from public.workspace_members m
  where m.workspace_id = target_workspace
    and m.user_id = (select auth.uid())
    and m.status = 'active'
$$;

create function public.is_member(target_workspace uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select public.member_role(target_workspace) is not null
$$;

create function public.has_role(target_workspace uuid, allowed public.workspace_role[])
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce(public.member_role(target_workspace) = any (allowed), false)
$$;

-- True when the signed-in user and another user are both active members of a workspace
create function public.shares_workspace(other_user uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.workspace_members mine
    join public.workspace_members theirs on theirs.workspace_id = mine.workspace_id
    where mine.user_id = (select auth.uid())
      and mine.status = 'active'
      and theirs.user_id = other_user
  )
$$;

-- ---------------------------------------------------------------------------
-- updated_at
-- ---------------------------------------------------------------------------

create function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create trigger profiles_set_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();
create trigger workspaces_set_updated_at before update on public.workspaces
  for each row execute function public.set_updated_at();
create trigger workspace_members_set_updated_at before update on public.workspace_members
  for each row execute function public.set_updated_at();
create trigger invitations_set_updated_at before update on public.invitations
  for each row execute function public.set_updated_at();
create trigger review_tasks_set_updated_at before update on public.review_tasks
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- A profile for every new auth user
-- ---------------------------------------------------------------------------

create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(left(btrim(new.raw_user_meta_data ->> 'full_name'), 200), ''));
  return new;
end;
$$;

create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- Memberships: identity is fixed, and the final Owner is protected (D5)
-- ---------------------------------------------------------------------------

create function public.guard_workspace_member()
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

create trigger workspace_members_guard before update or delete on public.workspace_members
  for each row execute function public.guard_workspace_member();

-- ---------------------------------------------------------------------------
-- Review tasks: assignment and starting status
-- ---------------------------------------------------------------------------

create function public.guard_review_task()
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

create trigger review_tasks_guard before insert or update on public.review_tasks
  for each row execute function public.guard_review_task();

-- ---------------------------------------------------------------------------
-- Review decisions
-- ---------------------------------------------------------------------------

-- Before a decision is saved: only the assigned Reviewer (D4), only while the
-- task isn't Approved (D12). The workspace and time are always set here.
create function public.guard_review_decision()
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

create trigger review_decisions_guard before insert on public.review_decisions
  for each row execute function public.guard_review_decision();

-- After a decision is saved: the task takes the decision's status
create function public.apply_review_decision()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.review_tasks
  set status = case new.decision when 'approved' then 'approved'::public.task_status else 'needs_changes'::public.task_status end
  where id = new.task_id;
  return new;
end;
$$;

create trigger review_decisions_apply after insert on public.review_decisions
  for each row execute function public.apply_review_decision();

-- Decisions are append-only
create function public.prevent_decision_change()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  raise exception 'Review decisions can''t be changed or deleted.' using errcode = 'P0001';
end;
$$;

create trigger review_decisions_append_only before update or delete on public.review_decisions
  for each row execute function public.prevent_decision_change();

-- ---------------------------------------------------------------------------
-- Function access
-- ---------------------------------------------------------------------------

-- Trigger functions are never called directly
revoke all on function public.set_updated_at() from public, anon, authenticated;
revoke all on function public.handle_new_user() from public, anon, authenticated;
revoke all on function public.guard_workspace_member() from public, anon, authenticated;
revoke all on function public.guard_review_task() from public, anon, authenticated;
revoke all on function public.guard_review_decision() from public, anon, authenticated;
revoke all on function public.apply_review_decision() from public, anon, authenticated;
revoke all on function public.prevent_decision_change() from public, anon, authenticated;

-- Role helpers: signed-in users only (RLS policies call them)
revoke all on function public.member_role(uuid) from public, anon;
revoke all on function public.is_member(uuid) from public, anon;
revoke all on function public.has_role(uuid, public.workspace_role[]) from public, anon;
revoke all on function public.shares_workspace(uuid) from public, anon;
grant execute on function public.member_role(uuid) to authenticated;
grant execute on function public.is_member(uuid) to authenticated;
grant execute on function public.has_role(uuid, public.workspace_role[]) to authenticated;
grant execute on function public.shares_workspace(uuid) to authenticated;
