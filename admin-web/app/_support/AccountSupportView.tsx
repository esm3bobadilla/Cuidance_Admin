'use client';

import { useId, useMemo, useState } from 'react';
import { adminScreens } from '../../../shared/content/admin-web-screens';
import { accountSupportCopy as copy, supportRequestSeed, supportStatuses, type SupportRequest, type SupportStatus } from '../../../shared/content/account-support';
import { DataTable } from '../../components/data/DataTable';
import { SearchField } from '../../components/forms/SearchField';
import { Select } from '../../components/forms/Select';
import { ReviewStatePanel, type ReviewViewState } from '../_review/ReviewShared';
import { NoResults } from '../_listDetail/NoResults';
import { StatusChip, type ChipTone } from '../_listDetail/StatusChip';
import styles from '../_listDetail/listDetail.module.css';

const dashboardHref = `${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}${adminScreens.dashboard.path}`;
const tone: Record<SupportStatus, ChipTone> = { New: 'alert', 'In progress': 'neutral', 'Waiting for user': 'draft', Resolved: 'success' };
const requestTypes = [...new Set(supportRequestSeed.map((r) => r.requestType))];

// Search covers the ticket ID, request type and the masked reference only
const matches = (r: SupportRequest, query: string) => {
  const q = query.trim().toLowerCase();
  return !q || [r.ticket, r.requestType, r.userReference, r.status, r.assignedTo].some((v) => v.toLowerCase().includes(q));
};

// Account Support (aligned with the approved hi-fi): a limited, read-only internal
// view of support requests. User references stay masked; nothing is closed,
// resolved, changed or sent.
export function AccountSupportView({ state }: { state: ReviewViewState }) {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<'all' | SupportStatus>('all');
  const [type, setType] = useState('all');
  const [selectedId, setSelectedId] = useState(supportRequestSeed[0].id);
  const detailId = useId();
  const all = state === 'ready' ? supportRequestSeed : [];
  const shown = useMemo(() => all.filter((r) => matches(r, query) && (status === 'all' || r.status === status) && (type === 'all' || r.requestType === type)), [all, query, status, type]);
  const selected = shown.find((r) => r.id === selectedId) ?? shown[0];
  const details = selected?.details;
  const disabled = state !== 'ready';

  return (
    <div className={styles.view}>
      <p className="note">{copy.sampleDataNote}</p>
      <noscript>
        <style>{`.${styles.toolbar} { display: none !important; }`}</style>
      </noscript>
      <div className={styles.toolbar}>
        <div className={styles.search}>
          <SearchField id="support-search" label={copy.searchLabel} placeholder={copy.searchPlaceholder} value={query} onChange={(e) => setQuery(e.target.value)} disabled={disabled} />
        </div>
        <div className={styles.filter}>
          <Select id="support-status" label={copy.statusLabel} value={status} onChange={(e) => setStatus(e.target.value as 'all' | SupportStatus)} options={[{ value: 'all', label: copy.allStatuses }, ...supportStatuses.map((s) => ({ value: s, label: s }))]} disabled={disabled} />
        </div>
        <div className={styles.filter}>
          <Select id="support-type" label={copy.typeLabel} value={type} onChange={(e) => setType(e.target.value)} options={[{ value: 'all', label: copy.allTypes }, ...requestTypes.map((t) => ({ value: t, label: t }))]} disabled={disabled} />
        </div>
      </div>

      <section className={styles.body} aria-label={copy.tableCaption} aria-busy={state === 'loading'}>
        {state !== 'ready' ? (
          <div className={styles.list}>
            <ReviewStatePanel state={state} messages={copy.states} emptyActionHref={dashboardHref} />
          </div>
        ) : (
          <>
            <div className={styles.list}>
              {shown.length > 0 ? (
                <DataTable
                  caption={copy.tableCaption}
                  columns={[
                    { key: 'ticket', header: copy.columns.ticket },
                    { key: 'requestType', header: copy.columns.requestType },
                    { key: 'userReference', header: copy.columns.userReference },
                    { key: 'status', header: copy.columns.status },
                    { key: 'assignedTo', header: copy.columns.assignedTo },
                    { key: 'updated', header: copy.columns.updated },
                  ]}
                  rows={shown.map((r) => ({
                    id: r.id,
                    cells: {
                      ticket: (
                        <button type="button" className={`${styles.rowButton} ${styles.nowrap}`} aria-pressed={r.id === selected?.id} aria-controls={detailId} onClick={() => setSelectedId(r.id)}>
                          {r.ticket}
                        </button>
                      ),
                      requestType: r.requestType,
                      userReference: r.userReference,
                      status: <StatusChip tone={tone[r.status]}>{r.status}</StatusChip>,
                      assignedTo: r.assignedTo,
                      updated: r.updated,
                    },
                  }))}
                  selectedRowId={selected?.id}
                  compact
                />
              ) : (
                <NoResults
                  message={copy.states.noResults}
                  clearLabel={copy.states.clear}
                  searchId="support-search"
                  onClear={() => {
                    setQuery('');
                    setStatus('all');
                    setType('all');
                  }}
                />
              )}
              <p className={styles.count} role="status">
                {copy.requests(shown.length)}
              </p>
            </div>

            {selected && (
              <aside id={detailId} className={styles.detail} aria-labelledby={`${detailId}-title`}>
                <p className={styles.detailLabel}>{copy.detail.heading}</p>
                <p className={styles.chips}>
                  <strong>{selected.ticket}</strong>
                  <StatusChip tone={tone[selected.status]}>{selected.status}</StatusChip>
                  <span className={styles.subtle}>{selected.updated}</span>
                </p>
                <h2 id={`${detailId}-title`} className={styles.detailTitle}>
                  {selected.requestType}
                </h2>
                <dl className={styles.fields}>
                  <div className={styles.field}>
                    <dt>{copy.detail.userReference}</dt>
                    <dd>{selected.userReference}</dd>
                  </div>
                  <div className={styles.field}>
                    <dt>{copy.detail.assignedTo}</dt>
                    <dd>{selected.assignedTo}</dd>
                  </div>
                </dl>
                <div className={styles.section}>
                  <h3 className={styles.sectionLabel}>{copy.detail.summary}</h3>
                  <p className={details ? styles.sectionText : styles.pending}>{details?.summary ?? copy.detail.pending}</p>
                </div>
                <div className={styles.section}>
                  <h3 className={styles.sectionLabel}>{copy.detail.privacy}</h3>
                  <p className={styles.notice}>{copy.privacyNote}</p>
                </div>
                <div className={styles.section}>
                  <h3 className={styles.sectionLabel}>{copy.detail.internalNotes}</h3>
                  {details ? (
                    <>
                      <p className={styles.box}>{details.internalNotes}</p>
                      <p className={styles.subtle}>{details.notesUpdated}</p>
                    </>
                  ) : (
                    <p className={styles.pending}>{copy.detail.pending}</p>
                  )}
                </div>
                <div className={styles.section}>
                  <h3 className={styles.sectionLabel}>{copy.detail.nextAction}</h3>
                  <p className={details ? styles.box : styles.pending}>{details?.nextAction ?? copy.detail.pending}</p>
                </div>
              </aside>
            )}
          </>
        )}
      </section>
    </div>
  );
}
