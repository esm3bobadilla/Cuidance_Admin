'use client';

import { useMemo, useState } from 'react';
import { adminRoles, rolesCopy } from '../../../shared/content/admin-roles';
import { adminScreens } from '../../../shared/content/admin-web-screens';
import { memberStatuses, teamAccessCopy as copy, teamMembersSeed, type MemberStatus } from '../../../shared/content/team-access';
import { uiSymbols } from '../../../shared/content/ui-symbols';
import { RolesPolicy } from '../../components/content/RolesPolicy';
import { DataTable } from '../../components/data/DataTable';
import { ReviewStatePanel, type ReviewViewState } from '../_review/ReviewShared';
import styles from './teamAccess.module.css';

const dashboardHref = `${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}${adminScreens.dashboard.path}`;
const roleName = (id: string) => adminRoles.find((role) => role.id === id)?.name ?? id;

// PROVISIONAL status treatment. Text always shows; Active also shows ✓
function MemberStatusLabel({ status }: { status: MemberStatus }) {
  const className = status === 'Active' ? styles.statusActive : status === 'Invitation pending' ? styles.statusPending : styles.statusOff;
  return (
    <span className={`${styles.status} ${className}`}>
      {status === 'Active' && (
        <span className={styles.statusIcon} aria-hidden="true">
          {uiSymbols.selected}
        </span>
      )}
      {status}
    </span>
  );
}

// Settings: static Team Access (prototype F09) and the approved roles policy card.
// Filters are the only interaction. Nothing is invited, changed, saved or enforced.
export function TeamAccessView({ state }: { state: ReviewViewState }) {
  const [filter, setFilter] = useState<'all' | MemberStatus>('all');
  const all = state === 'ready' ? teamMembersSeed : [];
  const shown = useMemo(() => all.filter((m) => filter === 'all' || m.status === filter), [all, filter]);
  const options: { value: 'all' | MemberStatus; label: string }[] = [
    { value: 'all', label: `${copy.all} · ${all.length}` },
    ...memberStatuses.map((s) => ({ value: s, label: s })),
  ];

  return (
    <div className={styles.view}>
      <p className="note">{rolesCopy.settingsNote}</p>

      <section className={styles.section} aria-labelledby="team-access-heading" aria-busy={state === 'loading'}>
        <div className={styles.sectionText}>
          <h2 id="team-access-heading" className="section-title">
            {copy.title}
          </h2>
          <p className={styles.description}>{copy.description}</p>
        </div>

        <noscript>
          <style>{`.${styles.filters} { display: none !important; }`}</style>
        </noscript>
        <div className={styles.filters} role="group" aria-label={copy.filterLabel}>
          {options.map((option) => {
            const pressed = filter === option.value;
            return (
              <button
                key={option.value}
                type="button"
                className={styles.filter}
                aria-pressed={pressed}
                disabled={state !== 'ready'}
                onClick={() => setFilter(option.value)}
              >
                {pressed && (
                  <span aria-hidden="true" className={styles.filterCheck}>
                    {uiSymbols.selected}
                  </span>
                )}
                {option.label}
              </button>
            );
          })}
        </div>

        {state !== 'ready' ? (
          <ReviewStatePanel state={state} messages={copy.states} emptyActionHref={dashboardHref} />
        ) : (
          <DataTable
            caption={copy.tableCaption}
            columns={[
              { key: 'member', header: copy.columns.member },
              { key: 'role', header: copy.columns.role },
              { key: 'status', header: copy.columns.status },
              { key: 'lastActive', header: copy.columns.lastActive },
            ]}
            rows={shown.map((m) => ({
              id: m.id,
              cells: {
                member: <span className={styles.member}>{m.name}</span>,
                role: <span className={styles.role}>{roleName(m.role)}</span>,
                status: <MemberStatusLabel status={m.status} />,
                lastActive: m.lastActive,
              },
            }))}
          />
        )}
        <p className={styles.boundary}>{copy.boundary}</p>
      </section>

      <div className="section">
        <RolesPolicy />
      </div>
    </div>
  );
}
