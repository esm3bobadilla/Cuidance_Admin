'use client';

import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { adminRoles, rolesCopy } from '../../../shared/content/admin-roles';
import { supabaseModeCopy } from '../../../shared/content/supabase-mode';
import { teamAccessCopy as copy } from '../../../shared/content/team-access';
import { uiSymbols } from '../../../shared/content/ui-symbols';
import { isValidEmail } from '../../../shared/onboarding/onboarding-rules';
import { formatDecisionDate } from '../../../shared/review-loop/review-decisions';
import { unnamedLabel } from '../../../shared/review-loop/supabase-mapping';
import { RolesPolicy } from '../../components/content/RolesPolicy';
import { DataTable } from '../../components/data/DataTable';
import { Select } from '../../components/forms/Select';
import { TextInput } from '../../components/forms/TextInput';
import { Button } from '../../components/ui/Button';
import { ReviewStatePanel } from '../_review/ReviewShared';
import { useAuth } from '../_data/authStore';
import { callInvitations, type FunctionResult, type InvitationState, type InvitationSummary } from '../_data/invitationsApi';
import { getSupabase } from '../_data/supabaseClient';
import styles from './teamAccess.module.css';

const team = supabaseModeCopy.team;
// Database role codes use "_", the shared role list uses "-"
const roleName = (id: string) => adminRoles.find((role) => role.id === id.replace('_', '-'))?.name ?? id;
// D5: Owners invite Admins and Reviewers; Admins invite Reviewers
const invitableRoles = (myRole: string | null): string[] => (myRole === 'owner' ? ['reviewer', 'admin'] : myRole === 'admin' ? ['reviewer'] : []);

type Member = { userId: string; name: string; role: string; status: string; joinedAt: string };
type Row = InvitationSummary & { createdAt: string };
type Feedback = { tone: 'success' | 'error'; text: string } | null;

const errorText = (result: Extract<FunctionResult<unknown>, { ok: false }>): string => {
  switch (result.error) {
    case 'invalid-email':
      return team.errors.email;
    case 'invalid-role':
      return team.errors.role;
    case 'already-member':
      return team.errors.alreadyMember;
    case 'already-pending':
      return team.errors.alreadyPending;
    case 'not-allowed':
      return team.errors.notAllowed;
    case 'expired':
      return team.errors.expired;
    case 'not-pending':
      return team.errors.notPending;
    case 'too-soon':
      return team.errors.tooSoon(result.retryAfter ?? 60);
    case 'send-failed':
      return team.errors.sendFailed;
    default:
      return team.errors.generic;
  }
};

const stateOf = (status: string, expiresAt: string): InvitationState =>
  status === 'pending' && new Date(expiresAt).getTime() <= Date.now() ? 'expired' : (status as InvitationState);

/*
 * Phase A3, Supabase mode: Settings / Team Access.
 * - Everyone in the workspace sees its members (RLS).
 * - Owners and Admins invite (D5), resend links and withdraw invitations through the
 *   invitations Edge Function. Admins only see and manage Reviewer invitations (RLS).
 * The function and the database check every rule again.
 */
export function LiveTeamAccess() {
  const auth = useAuth();
  const membership = auth.status === 'signed-in' ? auth.membership : null;
  const myRole = membership?.role ?? null;
  const roles = invitableRoles(myRole);

  const [state, setState] = useState<'loading' | 'ready' | 'error'>('loading');
  const [members, setMembers] = useState<Member[]>([]);
  const [invitations, setInvitations] = useState<Row[]>([]);
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('reviewer');
  const [fieldError, setFieldError] = useState<string | undefined>();
  const [sending, setSending] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<Feedback>(null);

  const load = useCallback(async () => {
    if (!membership) return;
    try {
      const supabase = await getSupabase();
      const [memberRows, invitationRows] = await Promise.all([
        supabase
          .from('workspace_members')
          .select('user_id, role, status, joined_at, profile:profiles!workspace_members_user_id_fkey(full_name)')
          .eq('workspace_id', membership.workspaceId)
          .order('joined_at'),
        supabase
          .from('invitations')
          .select('id, email, role, status, expires_at, created_at')
          .eq('workspace_id', membership.workspaceId)
          .order('created_at', { ascending: false }),
      ]);
      if (memberRows.error || invitationRows.error) throw memberRows.error ?? invitationRows.error;
      setMembers(
        (memberRows.data as unknown as { user_id: string; role: string; status: string; joined_at: string; profile: { full_name: string } | null }[]).map((row) => ({
          userId: row.user_id,
          name: row.profile?.full_name?.trim() || unnamedLabel,
          role: row.role,
          status: row.status,
          joinedAt: row.joined_at,
        })),
      );
      setInvitations(
        (invitationRows.data ?? []).map((row) => ({
          id: row.id,
          email: row.email,
          role: row.role,
          state: stateOf(row.status, row.expires_at),
          expiresAt: row.expires_at,
          createdAt: row.created_at,
        })),
      );
      setState('ready');
    } catch {
      setState('error');
    }
  }, [membership]);

  useEffect(() => {
    void load();
  }, [load]);

  const invite = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (sending || !membership) return;
    const address = email.trim().toLowerCase();
    if (!isValidEmail(address)) {
      setFieldError(team.errors.email);
      return document.getElementById('team-invite-email')?.focus();
    }
    setFieldError(undefined);
    setFeedback(null);
    setSending(true);
    const result = await callInvitations({ action: 'create', workspaceId: membership.workspaceId, email: address, role });
    setSending(false);
    if (result.ok) {
      setEmail('');
      setFeedback({ tone: 'success', text: team.sent(address) });
      await load();
    } else {
      if (result.error === 'invalid-email') {
        setFieldError(team.errors.email);
        document.getElementById('team-invite-email')?.focus();
      }
      setFeedback({ tone: 'error', text: errorText(result) });
    }
  };

  const act = async (row: Row, action: 'resend' | 'revoke') => {
    if (busyId) return;
    setBusyId(row.id);
    setFeedback(null);
    const result = await callInvitations({ action, invitationId: row.id });
    setBusyId(null);
    if (result.ok) {
      setFeedback({ tone: 'success', text: action === 'resend' ? team.resent(row.email) : team.revoked(row.email) });
      await load();
    } else {
      setFeedback({ tone: 'error', text: errorText(result) });
      if (result.error === 'expired' || result.error === 'not-pending') await load();
    }
  };

  const statusLabel = (value: string) => {
    const className = value === 'active' || value === 'accepted' ? styles.statusActive : value === 'pending' ? styles.statusPending : styles.statusOff;
    const text = team.states[value] ?? (value === 'active' ? 'Active' : value === 'deactivated' ? 'Deactivated' : value);
    return (
      <span className={`${styles.status} ${className}`}>
        {(value === 'active' || value === 'accepted') && (
          <span className={styles.statusIcon} aria-hidden="true">
            {uiSymbols.selected}
          </span>
        )}
        {value === 'expired' && (
          <span className={styles.statusIcon} aria-hidden="true">
            {uiSymbols.error}
          </span>
        )}
        {text}
      </span>
    );
  };

  return (
    <div className={styles.view}>
      <p className="note">{rolesCopy.settingsNote}</p>

      <section className={styles.section} aria-labelledby="team-access-heading" aria-busy={state === 'loading'}>
        <div className={styles.sectionText}>
          <h2 id="team-access-heading" className="section-title">
            {copy.title}
          </h2>
          <p className={styles.description}>{membership ? copy.description.replace('Cuidance Content Team', membership.workspaceName) : copy.description}</p>
        </div>
        {state !== 'ready' ? (
          <ReviewStatePanel state={state} messages={copy.states} emptyActionHref={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}/`} />
        ) : (
          <DataTable
            caption={team.membersCaption}
            columns={[
              { key: 'member', header: copy.columns.member },
              { key: 'role', header: copy.columns.role },
              { key: 'status', header: copy.columns.status },
              { key: 'joined', header: team.columns.joined },
            ]}
            rows={members.map((m) => ({
              id: m.userId,
              cells: {
                member: <span className={styles.member}>{m.name}</span>,
                role: <span className={styles.role}>{roleName(m.role)}</span>,
                status: statusLabel(m.status),
                joined: formatDecisionDate(new Date(m.joinedAt)),
              },
            }))}
          />
        )}
      </section>

      <section className={styles.section} aria-labelledby="team-invite-heading">
        <div className={styles.sectionText}>
          <h2 id="team-invite-heading" className="section-title">
            {team.inviteHeading}
          </h2>
          <p className={styles.description}>{roles.length ? team.inviteIntro : team.reviewerNote}</p>
        </div>

        {roles.length > 0 && (
          <form className={styles.inviteForm} onSubmit={invite} noValidate aria-busy={sending}>
            <TextInput
              id="team-invite-email"
              label={team.email}
              type="email"
              inputMode="email"
              autoComplete="off"
              placeholder="name@example.com"
              value={email}
              disabled={sending}
              error={fieldError}
              onChange={(event) => {
                setEmail(event.target.value);
                if (fieldError) setFieldError(undefined);
              }}
            />
            <Select
              id="team-invite-role"
              label={team.role}
              value={role}
              disabled={sending}
              options={roles.map((value) => ({ value, label: roleName(value) }))}
              onChange={(event) => setRole(event.target.value)}
            />
            <div className={styles.inviteActions}>
              <Button variant="primary" type="submit" disabled={sending}>
                {sending ? team.sending : team.send}
              </Button>
            </div>
          </form>
        )}

        {/* Results of invite, resend and withdraw are announced here */}
        <p className={feedback?.tone === 'error' ? styles.feedbackError : styles.feedback} role="status">
          {feedback && (
            <span className={styles.statusIcon} aria-hidden="true">
              {feedback.tone === 'error' ? uiSymbols.error : uiSymbols.success}{' '}
            </span>
          )}
          {feedback?.text}
        </p>
      </section>

      {roles.length > 0 && state === 'ready' && (
        <section className={styles.section} aria-labelledby="team-invitations-heading">
          <div className={styles.sectionText}>
            <h2 id="team-invitations-heading" className="section-title">
              {team.invitationsHeading}
            </h2>
          </div>
          {invitations.length === 0 ? (
            <p className={styles.description}>{team.noInvitations}</p>
          ) : (
            <DataTable
              caption={team.invitationsCaption}
              columns={[
                { key: 'email', header: team.columns.email },
                { key: 'role', header: team.columns.role },
                { key: 'status', header: team.columns.status },
                { key: 'expires', header: team.columns.expires },
                { key: 'actions', header: team.columns.actions },
              ]}
              rows={invitations.map((row) => ({
                id: row.id,
                cells: {
                  email: <span className={styles.member}>{row.email}</span>,
                  role: <span className={styles.role}>{roleName(row.role)}</span>,
                  status: statusLabel(row.state),
                  expires: formatDecisionDate(new Date(row.expiresAt)),
                  actions:
                    row.state === 'pending' && roles.includes(row.role) ? (
                      <span className={styles.rowActions}>
                        <Button variant="secondary" disabled={!!busyId} onClick={() => void act(row, 'resend')} aria-label={`${team.resend}, ${row.email}`}>
                          {team.resend}
                        </Button>
                        <Button variant="ghost" disabled={!!busyId} onClick={() => void act(row, 'revoke')} aria-label={`${team.revoke}, ${row.email}`}>
                          {team.revoke}
                        </Button>
                      </span>
                    ) : null,
                },
              }))}
            />
          )}
        </section>
      )}

      <div className="section">
        <RolesPolicy />
      </div>
    </div>
  );
}
