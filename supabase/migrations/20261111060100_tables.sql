-- Cuidance Admin Web, Phase 2.1: tables.
-- RLS is turned on for every table in the RLS migration. Until then nothing is
-- granted to the API roles (see that migration).

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null default '' check (char_length(full_name) <= 200),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.profiles is 'One row per Admin Web user, created automatically when the auth user is created.';

create table public.workspaces (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(btrim(name)) between 1 and 200),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.workspace_members (
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  role public.workspace_role not null,
  status public.member_status not null default 'active',
  joined_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (workspace_id, user_id)
);

create index workspace_members_user_id_idx on public.workspace_members (user_id);

comment on table public.workspace_members is 'Membership and role. Rows are added only by the trusted invitation Edge Function (Phase 2.5). Members are deactivated, never deleted.';

create table public.invitations (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  email extensions.citext not null check (email ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  -- D5: Owners invite Admins and Reviewers, Admins invite Reviewers. No one invites an Owner.
  -- D3: content_editor is reserved and can't be invited yet.
  role public.workspace_role not null check (role in ('admin', 'reviewer')),
  invited_by uuid references public.profiles (id) on delete set null,
  status public.invitation_status not null default 'pending',
  -- D7: 7 days
  expires_at timestamptz not null default (now() + interval '7 days'),
  accepted_by uuid references public.profiles (id) on delete set null,
  responded_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (expires_at > created_at)
);

-- Only one pending invitation per email per workspace
create unique index invitations_one_pending_idx on public.invitations (workspace_id, email) where status = 'pending';
create index invitations_workspace_id_idx on public.invitations (workspace_id);

comment on table public.invitations is 'Invitations are created, answered and revoked only through trusted Edge Functions (Phase 2.5).';

create table public.review_tasks (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  title text not null check (char_length(btrim(title)) between 1 and 300),
  type public.task_type not null,
  status public.task_status not null default 'needs_review',
  priority public.task_priority not null default 'medium',
  assigned_to uuid references public.profiles (id) on delete set null,
  open_question boolean not null default false,
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index review_tasks_workspace_id_idx on public.review_tasks (workspace_id);
create index review_tasks_assigned_to_idx on public.review_tasks (assigned_to);

comment on column public.review_tasks.status is 'Changed only by a review decision (trigger). Not writable through the API after insert.';

create table public.review_decisions (
  id uuid primary key default gen_random_uuid(),
  -- Decisions are an audit record: a task with decisions can't be deleted
  task_id uuid not null references public.review_tasks (id) on delete restrict,
  workspace_id uuid not null references public.workspaces (id) on delete restrict,
  decision public.decision_kind not null,
  note text not null default '' check (char_length(note) <= 2000),
  -- Users are deactivated, not deleted, so decisions keep their author
  decided_by uuid not null references public.profiles (id) on delete restrict,
  decided_at timestamptz not null default now(),
  -- Request changes needs a reviewer note (Week 11 rule)
  constraint review_decisions_note_required check (decision <> 'changes_requested' or char_length(btrim(note)) > 0)
);

create index review_decisions_task_id_idx on public.review_decisions (task_id, decided_at);
create index review_decisions_workspace_id_idx on public.review_decisions (workspace_id);

comment on table public.review_decisions is 'Append-only. Each decision sets its task''s status through a trigger. Never updated or deleted.';
