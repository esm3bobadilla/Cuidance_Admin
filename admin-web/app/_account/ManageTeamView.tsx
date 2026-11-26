'use client';

import { useMemo, useState } from 'react';
import { manageTeamCopy as copy } from '../../../shared/content/account-pages';
import { can, permissionSummary, roleNames, type AdminRoleId } from '../../../shared/content/permissions';
import { sampleWorkspaceName, teamRoster, type RosterMember } from '../../../shared/content/team-roster';
import { DataTable } from '../../components/data/DataTable';
import { Toast } from '../../components/feedback/Toast';
import { Select } from '../../components/forms/Select';
import { TextInput } from '../../components/forms/TextInput';
import { Dialog } from '../../components/overlay/Dialog';
import { Drawer } from '../../components/overlay/Drawer';
import { Button } from '../../components/ui/Button';
import { CuIcon } from '../../components/ui/CuIcon';
import { isSupabaseMode } from '../_data/config';
import { useIdentity } from '../_data/identity';
import { LiveTeamAccess } from '../_settings/LiveTeamAccess';
import { RoleBadge } from './RoleBadge';
import styles from './account.module.css';

const allRoles: AdminRoleId[] = ['super_admin', 'admin', 'team_member'];

export function ManageTeamView() {
  const me = useIdentity();
  const rights = can(me.adminRole);
  if (!rights?.seeManageTeam) {
    return (
      <section className={styles.card} aria-labelledby="no-access">
        <h2 id="no-access" className={styles.subtitle}>
          {copy.noAccessTitle}
        </h2>
        <p>{copy.noAccessBody}</p>
      </section>
    );
  }
  // Phase A3: Supabase mode keeps the live members and invitation tools
  if (isSupabaseMode) return <LiveTeamAccess />;
  return <SampleManageTeam />;
}

function SampleManageTeam() {
  const me = useIdentity();
  const rights = can(me.adminRole)!;
  const [members, setMembers] = useState<RosterMember[]>(teamRoster);
  const [query, setQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | AdminRoleId>('all');
  const [notice, setNotice] = useState('');
  const [removing, setRemoving] = useState<RosterMember | null>(null);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [invite, setInvite] = useState({ email: '', role: rights.inviteAs[0] ?? 'team_member' });
  const [inviteTried, setInviteTried] = useState(false);

  const activeSupers = members.filter((m) => m.role === 'super_admin' && m.status === 'Active').length;
  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return members.filter((m) => (!q || m.name.toLowerCase().includes(q)) && (roleFilter === 'all' || m.role === roleFilter));
  }, [members, query, roleFilter]);
  const pending = members.filter((m) => m.status === 'Invited').length;
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(invite.email.trim());

  const isFinalSuper = (m: RosterMember) => m.role === 'super_admin' && m.status === 'Active' && activeSupers <= 1;

  const rows = shown.map((m) => {
    const self = m.id === me.id;
    const canChange = rights.changeRoles && !self && !isFinalSuper(m);
    const canRemove = !self && rights.removeRoles.includes(m.role) && !isFinalSuper(m);
    return {
      id: m.id,
      cells: {
        member: (
          <span className={styles.member}>
            <span className={styles.avatar} aria-hidden="true">
              {m.initials}
            </span>
            <strong>{m.name}</strong>
          </span>
        ),
        role: <RoleBadge role={m.role} />,
        status: <span className={m.status === 'Invited' ? styles.statusInvited : undefined}>{m.status}</span>,
        lastActive: m.lastActive,
        actions: (
          <span className={styles.actions}>
            {canChange && (
              <select
                className={styles.select}
                aria-label={copy.changeRole(m.name)}
                value={m.role}
                onChange={(event) => {
                  const role = event.target.value as AdminRoleId;
                  setMembers(members.map((x) => (x.id === m.id ? { ...x, role } : x)));
                  setNotice(copy.roleChanged(m.name, roleNames[role]));
                }}
              >
                {allRoles.map((r) => (
                  <option key={r} value={r}>
                    {roleNames[r]}
                  </option>
                ))}
              </select>
            )}
            {canRemove && (
              <Button aria-label={copy.removeLabel(m.name)} onClick={() => setRemoving(m)}>
                {copy.remove}
              </Button>
            )}
            {!canChange && !canRemove && <span className={styles.note}>{isFinalSuper(m) ? copy.finalSuperAdmin : copy.noActions}</span>}
          </span>
        ),
      },
    };
  });

  return (
    <div className={styles.page}>
      {notice && <Toast tone="success" message={notice} />}
      <section className={styles.bar} aria-labelledby="team-bar">
        <div>
          <h2 id="team-bar" className={styles.eyebrow}>
            {copy.barEyebrow}
          </h2>
          <p>{copy.barText}</p>
        </div>
        {rights.inviteAs.length > 0 && (
          <Button variant="primary" aria-haspopup="dialog" onClick={() => setInviteOpen(true)}>
            {copy.invite}
          </Button>
        )}
      </section>

      <section className={styles.card} aria-labelledby="team-heading">
        <div className={styles.cardHeader}>
          <div>
            <h2 id="team-heading" className={styles.title}>
              {sampleWorkspaceName}
            </h2>
            <p className={styles.note} role="status">
              {copy.summary(members.length, pending)}
            </p>
          </div>
          <div className={styles.tools}>
            <label className={styles.search}>
              <span className="visually-hidden">{copy.searchLabel}</span>
              <CuIcon name="search" size={18} />
              <input type="search" placeholder={copy.searchLabel} value={query} onChange={(e) => setQuery(e.target.value)} />
            </label>
            <select className={styles.select} aria-label={copy.roleFilter} value={roleFilter} onChange={(e) => setRoleFilter(e.target.value as 'all' | AdminRoleId)}>
              <option value="all">{copy.allRoles}</option>
              {allRoles.map((r) => (
                <option key={r} value={r}>
                  {roleNames[r]}
                </option>
              ))}
            </select>
          </div>
        </div>
        {shown.length ? (
          <DataTable
            caption={copy.caption}
            flush
            columns={[
              { key: 'member', header: copy.columns.member },
              { key: 'role', header: copy.columns.role },
              { key: 'status', header: copy.columns.status },
              { key: 'lastActive', header: copy.columns.lastActive },
              { key: 'actions', header: copy.columns.actions },
            ]}
            rows={rows}
          />
        ) : (
          <p className={styles.empty}>{copy.noResults}</p>
        )}
      </section>

      <section className={styles.card} aria-labelledby="roles-heading">
        <h2 id="roles-heading" className={styles.title}>
          {copy.rolesTitle}
        </h2>
        <ul className={styles.roles}>
          {allRoles.map((r) => (
            <li key={r} className={styles.roleCard}>
              <RoleBadge role={r} />
              <ul>
                {permissionSummary[r].map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </section>

      <Drawer
        open={inviteOpen}
        onClose={() => {
          setInviteOpen(false);
          setInviteTried(false);
        }}
        eyebrow={copy.inviteDrawer.eyebrow}
        title={copy.inviteDrawer.title}
        description={copy.inviteDrawer.description}
        footer={
          <>
            <Button onClick={() => setInviteOpen(false)}>{copy.inviteDrawer.cancel}</Button>
            <Button
              variant="primary"
              onClick={() => {
                setInviteTried(true);
                if (!emailOk) return;
                const email = invite.email.trim();
                setMembers([...members, { id: `inv-${members.length}`, name: email, initials: email[0].toUpperCase(), role: invite.role, status: 'Invited', lastActive: 'Pending', active: false }]);
                setNotice(copy.inviteDrawer.added(email));
                setInvite({ email: '', role: rights.inviteAs[0] });
                setInviteTried(false);
                setInviteOpen(false);
              }}
            >
              {copy.inviteDrawer.send}
            </Button>
          </>
        }
      >
        <div className={styles.form}>
          <TextInput
            id="invite-email"
            type="email"
            label={copy.inviteDrawer.email}
            helper={copy.inviteDrawer.emailHelper}
            error={inviteTried && !emailOk ? copy.inviteDrawer.emailError : undefined}
            value={invite.email}
            onChange={(e) => setInvite({ ...invite, email: e.target.value })}
          />
          <Select
            id="invite-role"
            label={copy.inviteDrawer.role}
            helper={copy.inviteDrawer.roleHelper(rights.inviteAs.map((r) => `${roleNames[r]}s`).join(' or '))}
            options={rights.inviteAs.map((r) => ({ value: r, label: roleNames[r] }))}
            value={invite.role}
            onChange={(e) => setInvite({ ...invite, role: e.target.value as AdminRoleId })}
          />
        </div>
      </Drawer>

      <Dialog
        open={!!removing}
        onClose={() => setRemoving(null)}
        tone="alert"
        title={removing ? copy.removeTitle(removing.name) : ''}
        actions={
          <>
            <Button onClick={() => setRemoving(null)}>{copy.removeCancel}</Button>
            <Button
              variant="primary"
              onClick={() => {
                if (!removing) return;
                setMembers(members.filter((m) => m.id !== removing.id));
                setNotice(copy.removed(removing.name));
                setRemoving(null);
              }}
            >
              {copy.removeConfirm}
            </Button>
          </>
        }
      >
        {copy.removeBody}
      </Dialog>
    </div>
  );
}
