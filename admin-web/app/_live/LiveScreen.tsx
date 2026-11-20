'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { adminScreens } from '../../../shared/content/admin-web-screens';
import {
  brandWebsitePrototypeUrl,
  liveAreas,
  liveCopy as copy,
  liveCurrent,
  liveStatusMeta,
  type LiveStatus,
  type LiveSurface,
  type LiveUpdate,
} from '../../../shared/content/live';
import { can } from '../../../shared/content/permissions';
import { memberName } from '../../../shared/content/team-roster';
import appWelcome from '../../../shared/brand/live/app-welcome.jpg';
import webHero from '../../../shared/brand/live/web-home-hero.jpg';
import { DemoBanner } from '../../components/feedback/DemoBanner';
import { StateMessage } from '../../components/feedback/StateMessage';
import { Select } from '../../components/forms/Select';
import { TextInput } from '../../components/forms/TextInput';
import { Textarea } from '../../components/forms/Textarea';
import { PageHeader } from '../../components/layout/PageHeader';
import { Dialog } from '../../components/overlay/Dialog';
import { Drawer } from '../../components/overlay/Drawer';
import { Button } from '../../components/ui/Button';
import { CuIcon } from '../../components/ui/CuIcon';
import { StatusBadge, type StatusTone } from '../../components/ui/StatusBadge';
import { demoModeCopy } from '../../../shared/content/demo-mode';
import { WorkflowError } from '../../../shared/workflows/product-workflow';
import { applyLiveAction, canEditLive, liveActions, publishingAvailable, saveLiveUpdate, validateLiveUpdate } from '../../../shared/workflows/live-workflow';
import { updateDemo, useDemo } from '../_data/demoStore';
import { useIdentity } from '../_data/identity';
import styles from './live.module.css';

export type LiveViewState = 'ready' | 'loading' | 'empty' | 'error' | 'unavailable';
type PreviewMode = { kind: 'current' } | { kind: 'next' } | { kind: 'update'; id: string } | { kind: 'unavailable' };

const tones: Record<LiveStatus, StatusTone> = {
  draft: 'neutral',
  review: 'info',
  changes: 'error',
  ready: 'alert',
  published: 'success',
  archived: 'muted',
};
const base = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
const DELAY = 450;
const focusLater = (id: string) => window.setTimeout(() => document.getElementById(id)?.focus(), 40);

function LiveStatusBadge({ status }: { status: LiveStatus }) {
  const meta = liveStatusMeta[status];
  return <StatusBadge label={meta.label} icon={meta.icon} tone={tones[status]} />;
}

export function LiveScreen({ surface, state = 'ready' }: { surface: LiveSurface; state?: LiveViewState }) {
  const me = useIdentity();
  const rights = can(me.adminRole);
  const canApprove = !!rights?.liveApprove;
  const actor = { id: me.id, role: me.adminRole };

  const [loadState, setLoadState] = useState<LiveViewState>(state);
  useEffect(() => setLoadState(state), [state]);
  // Phase 2 PR 2: updates come from the demo store (this browser session), shared by both
  // Live pages and the Dashboard. ?state=empty previews an empty history and saves nothing.
  const demo = useDemo();
  const persist = state !== 'empty';
  const [emptyPreview, setEmptyPreview] = useState<LiveUpdate[]>([]);
  const [failed, setFailed] = useState('');
  const updates = useMemo(() => (persist ? demo.live : emptyPreview).filter((u) => u.surface === surface), [persist, demo.live, emptyPreview, surface]);
  const setUpdates = (change: (all: LiveUpdate[]) => LiveUpdate[]) => {
    if (!persist) return setEmptyPreview(change(emptyPreview));
    setFailed(updateDemo((d) => ({ ...d, live: change(d.live) })) ? '' : demoModeCopy.saveFailed);
  };
  const [fullPreview, setFullPreview] = useState(false);
  const [device, setDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [filter, setFilter] = useState('active');
  const [preview, setPreview] = useState<PreviewMode>(state === 'unavailable' ? { kind: 'unavailable' } : { kind: 'current' });

  const [openId, setOpenId] = useState<string | null>(null);
  const [editing, setEditing] = useState<LiveUpdate | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState('');
  const [message, setMessage] = useState('');
  const [confirm, setConfirm] = useState<'archive' | 'changes' | null>(null);
  const [note, setNote] = useState('');
  const [noteError, setNoteError] = useState('');
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const shown = useMemo(
    () => updates.filter((u) => (filter === 'all' ? true : filter === 'active' ? u.status !== 'archived' : u.status === filter)),
    [updates, filter],
  );
  const current = openId && openId !== 'new' ? updates.find((u) => u.id === openId) ?? null : null;
  const mine = (u: LiveUpdate) => u.ownerId === me.id;
  const canEdit = (u: LiveUpdate) => canEditLive(actor, u);
  const allowed = (u: LiveUpdate) => liveActions(actor, u);
  const roleId = me.adminRole ?? 'team_member';

  const resetDrawer = () => {
    setErrors({});
    setBusy('');
    setMessage('');
    setConfirm(null);
    setNote('');
    setNoteError('');
  };
  const open = (id: string) => {
    resetDrawer();
    setEditing(null);
    setOpenId(id);
  };
  const close = () => {
    setOpenId(null);
    setEditing(null);
    resetDrawer();
  };
  const prepare = () => {
    resetDrawer();
    setOpenId('new');
    setEditing({
      id: `${surface}-${Date.now()}`,
      surface,
      title: '',
      area: liveAreas[0],
      summary: '',
      previewHeadline: '',
      partner: false,
      status: 'draft',
      ownerId: me.id,
      updated: 'Just now',
      changeNote: '',
      history: [],
    });
  };
  const later = (label: string, apply: () => void) => {
    setBusy(label);
    setMessage('');
    timer.current = window.setTimeout(() => {
      apply();
      setBusy('');
      focusLater('lv-message');
    }, DELAY);
  };
  const replace = (u: LiveUpdate) => setUpdates((all) => (all.some((x) => x.id === u.id) ? all.map((x) => (x.id === u.id ? u : x)) : [u, ...all]));
  // Status changes go through the shared workflow rules, which refuse anything not allowed
  const attempt = (fn: () => void) => {
    try {
      fn();
    } catch (e) {
      if (e instanceof WorkflowError) setMessage(e.message);
      else throw e;
    }
  };

  const save = (to: 'draft' | 'review') => {
    if (!editing || busy) return;
    const e = validateLiveUpdate(editing, copy.errors);
    setErrors(e);
    if (Object.keys(e).length) {
      focusLater(Object.keys(e)[0]);
      return;
    }
    const isNew = !updates.some((u) => u.id === editing.id);
    const next = saveLiveUpdate(actor, editing, to, isNew);
    later(to === 'review' ? copy.busy.submitting : copy.busy.saving, () => {
      replace(next);
      setEditing(null);
      setOpenId(next.id);
      setMessage(to === 'review' ? copy.done.submitted(next.title) : copy.done.saved(next.title));
    });
  };
  const submit = () => {
    if (!current) return;
    const u = current;
    later(copy.busy.submitting, () => {
      attempt(() => {
        replace(applyLiveAction(actor, u, 'submit'));
        setMessage(copy.done.submitted(u.title));
      });
    });
  };
  const approve = () => {
    if (!current) return;
    const u = current;
    later(copy.busy.approving, () => {
      attempt(() => {
        replace(applyLiveAction(actor, u, 'approve'));
        setMessage(copy.done.approved(u.title));
      });
    });
  };
  const confirmChanges = () => {
    if (!current) return;
    if (!note.trim()) {
      setNoteError(copy.errors.note);
      focusLater('lv-change-note');
      return;
    }
    const u = current;
    const text = note.trim();
    setConfirm(null);
    later(copy.busy.requesting, () => {
      attempt(() => {
        replace(applyLiveAction(actor, u, 'requestChanges', text));
        setNote('');
        setMessage(copy.done.changes(memberName(u.ownerId)));
      });
    });
  };
  const confirmArchive = () => {
    if (!current) return;
    const u = current;
    setConfirm(null);
    later(copy.busy.archiving, () => {
      attempt(() => {
        replace(applyLiveAction(actor, u, 'archive'));
        setMessage(copy.done.archived(u.title));
      });
    });
  };
  const viewPreview = (u: LiveUpdate) => {
    setPreview({ kind: 'update', id: u.id });
    close();
    focusLater('lv-preview');
  };

  // ---------- preview content
  const ready = updates.filter((u) => u.status === 'ready');
  const previewUpdate = preview.kind === 'update' ? updates.find((u) => u.id === preview.id) : undefined;
  const headline =
    preview.kind === 'update' && previewUpdate
      ? previewUpdate.previewHeadline || liveCurrent[surface].headline
      : preview.kind === 'next' && ready[0]
        ? ready[0].previewHeadline
        : liveCurrent[surface].headline;
  const previewSelect = preview.kind === 'update' ? 'current' : preview.kind;

  // ---------- drawer footer
  const footer = (() => {
    if (editing) {
      return (
        <>
          <Button variant="ghost" onClick={() => (updates.some((u) => u.id === editing.id) ? setEditing(null) : close())} disabled={!!busy}>
            {copy.actions.cancel}
          </Button>
          <Button onClick={() => save('draft')} disabled={!!busy}>
            {copy.actions.saveDraft}
          </Button>
          <Button variant="primary" onClick={() => save('review')} disabled={!!busy}>
            {copy.actions.submit}
          </Button>
        </>
      );
    }
    if (!current) return null;
    const can = allowed(current);
    const reviewable = can.includes('approve');
    return (
      <>
        {can.includes('archive') && (
          <Button variant="ghost" onClick={() => setConfirm('archive')} disabled={!!busy} aria-haspopup="dialog">
            {copy.actions.archive}
          </Button>
        )}
        <Button variant="ghost" onClick={() => viewPreview(current)} disabled={!!busy}>
          {copy.actions.viewPreview}
        </Button>
        {canEdit(current) && (
          <Button onClick={() => setEditing({ ...current })} disabled={!!busy}>
            {copy.actions.edit}
          </Button>
        )}
        {reviewable && (
          <Button onClick={() => setConfirm('changes')} disabled={!!busy} aria-haspopup="dialog">
            {copy.actions.requestChanges}
          </Button>
        )}
        {reviewable && (
          <Button variant="primary" onClick={approve} disabled={!!busy}>
            {copy.actions.approve}
          </Button>
        )}
        {can.includes('submit') && (
          <Button variant="primary" onClick={submit} disabled={!!busy}>
            {copy.actions.submit}
          </Button>
        )}
        {can.includes('publish') && (
          // Publishing is unavailable in demo mode: shown, labeled and turned off
          <Button variant="primary" disabled={!publishingAvailable} aria-describedby="lv-action-note">
            {copy.actions.publishUnavailable}
          </Button>
        )}
      </>
    );
  })();

  const actionNote = (() => {
    if (editing || !current) return '';
    if (current.status === 'archived') return copy.notes.archived;
    if (current.status === 'published') return copy.notes.published;
    if (!canApprove) {
      if ((current.status === 'draft' || current.status === 'changes') && !mine(current)) return `${copy.notes.notOwner(memberName(current.ownerId))} ${copy.notes.team}`;
      return copy.notes.team;
    }
    if (current.status === 'ready') return copy.notes.publishOff;
    if (current.status === 'review' && mine(current)) return copy.notes.ownContent;
    return '';
  })();

  const head = editing ?? current;
  const drawerTitle = editing ? (updates.some((u) => u.id === editing.id) ? copy.drawer.editTitle : copy.drawer.newTitle) : current?.title ?? '';

  return (
    <main className="shell">
      <PageHeader eyebrow={copy.eyebrow} title={copy.title[surface]} description={copy.description[surface]} />
      <nav aria-label={copy.navLabel} className={styles.switcher}>
        <ul>
          {(['app', 'website'] as const).map((s) => (
            <li key={s}>
              <a href={`${base}${adminScreens[s === 'app' ? 'live-app' : 'live-website'].path}`} aria-current={s === surface ? 'page' : undefined}>
                {s === surface && <span aria-hidden="true">✓ </span>}
                <CuIcon name={s === 'app' ? 'phone' : 'web'} size={16} /> {copy.nav[s]}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <DemoBanner />
      {failed && (
        <p className={styles.actionNote} role="alert">
          {failed}
        </p>
      )}
      <div className={styles.intro} aria-label={copy.accessLabel} role="group">
        <p>{copy.roleNote[roleId]}</p>
        <Button variant="primary" onClick={prepare} aria-haspopup="dialog" disabled={loadState === 'loading' || loadState === 'error'}>
          <CuIcon name="plus" size={16} /> {copy.prepare}
        </Button>
      </div>

      {loadState === 'loading' && <StateMessage kind="loading" title={copy.states.loading} />}
      {loadState === 'error' && (
        <StateMessage kind="error" title={copy.states.errorTitle} body={copy.states.errorBody} action={<Button onClick={() => setLoadState('ready')}>{copy.states.retry}</Button>} />
      )}

      {loadState !== 'loading' && loadState !== 'error' && (
        <div className={styles.layout}>
          <section className={styles.panel} aria-labelledby="lv-preview-heading">
            <div className={styles.panelHead}>
              <h2 id="lv-preview-heading" className={styles.sectionTitle}>
                {copy.preview.heading}
              </h2>
              <StatusBadge label={copy.preview.liveBadge[surface]} icon="live" tone="success" />
            </div>
            <dl className={styles.facts}>
              {liveCurrent[surface].facts.map((f) => (
                <div key={f.label}>
                  <dt>{f.label}</dt>
                  <dd>{f.value}</dd>
                </div>
              ))}
            </dl>
            <Select
              id="lv-preview-state"
              label={copy.preview.stateLabel}
              value={previewSelect}
              onChange={(e) => setPreview({ kind: e.target.value as 'current' | 'next' | 'unavailable' })}
              options={[
                { value: 'current', label: copy.preview.current },
                ...(ready.length ? [{ value: 'next', label: copy.preview.next }] : []),
                { value: 'unavailable', label: copy.preview.unavailable },
              ]}
            />
            <div id="lv-preview" tabIndex={-1} className={styles.previewArea}>
              {preview.kind === 'update' && previewUpdate && (
                <p className={styles.previewing} role="status">
                  <CuIcon name="review" size={16} /> {copy.preview.showing(previewUpdate.title)}{' '}
                  <Button variant="ghost" onClick={() => setPreview({ kind: 'current' })}>
                    {copy.preview.backToCurrent}
                  </Button>
                </p>
              )}
              {preview.kind === 'unavailable' ? (
                <StateMessage kind="unavailable" title={copy.preview.unavailableTitle} body={copy.preview.unavailableBody} />
              ) : surface === 'app' ? (
                <PhoneFrame headline={headline} changed={headline !== liveCurrent.app.headline} />
              ) : (
                <BrowserFrame headline={headline} />
              )}
            </div>
            {preview.kind !== 'unavailable' && (
              <div>
                <Button onClick={() => setFullPreview(true)} aria-haspopup="dialog">
                  <CuIcon name={surface === 'app' ? 'phone' : 'web'} size={16} /> {copy.preview.openFull}
                </Button>
              </div>
            )}
            {surface === 'website' && (
              <p className={styles.prototypeLink}>
                {brandWebsitePrototypeUrl ? (
                  <a href={brandWebsitePrototypeUrl} target="_blank" rel="noopener noreferrer">
                    <CuIcon name="web" size={16} /> {copy.preview.openPrototype} <span className="visually-hidden">{copy.preview.openPrototypeNew}</span>
                  </a>
                ) : (
                  <>
                    <CuIcon name="alert" size={16} /> {copy.preview.prototypeNotSet}
                  </>
                )}
              </p>
            )}
          </section>

          <section className={styles.panel} aria-labelledby="lv-history-heading">
            <div className={styles.panelHead}>
              <h2 id="lv-history-heading" className={styles.sectionTitle}>
                {copy.history.heading}
              </h2>
              <p className={styles.meta} role="status">
                {copy.history.count(shown.length)}
              </p>
            </div>
            <Select
              id="lv-filter"
              label={copy.history.statusFilter}
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              options={[
                { value: 'active', label: copy.history.allActive },
                ...(Object.keys(liveStatusMeta) as LiveStatus[]).map((s) => ({ value: s, label: liveStatusMeta[s].label })),
                { value: 'all', label: copy.history.all },
              ]}
            />
            {shown.length === 0 ? (
              updates.length === 0 ? (
                <StateMessage
                  kind="empty"
                  title={copy.states.emptyTitle}
                  body={copy.states.emptyBody}
                  action={
                    <Button onClick={prepare} aria-haspopup="dialog">
                      {copy.prepare}
                    </Button>
                  }
                />
              ) : (
                <StateMessage kind="empty" title={copy.states.noMatch} />
              )
            ) : (
              <ul className={styles.updates}>
                {shown.map((u) => (
                  <li key={u.id} className={styles.update} data-selected={openId === u.id}>
                    <div className={styles.updateTop}>
                      <LiveStatusBadge status={u.status} />
                      {u.partner && <span className={styles.partner}>{copy.history.partner}</span>}
                    </div>
                    <h3 className={styles.updateTitle}>{u.title}</h3>
                    <p className={styles.meta}>
                      {u.area} · {copy.history.owner} {memberName(u.ownerId)} · {copy.history.updated} {u.updated}
                    </p>
                    <div className={styles.updateActions}>
                      <Button onClick={() => open(u.id)} aria-haspopup="dialog" aria-label={copy.history.open(u.title)}>
                        {copy.history.openShort}
                      </Button>
                      <Button variant="ghost" onClick={() => viewPreview(u)} aria-label={copy.history.previewLabel(u.title)}>
                        {copy.history.previewShort}
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      )}

      <Drawer open={!!openId} onClose={close} eyebrow={copy.drawer.eyebrow[surface]} title={drawerTitle} closeLabel={copy.drawer.close} footer={footer}>
        <div className={styles.drawerBody}>
          <div className={styles.drawerStatus}>
            {head && <LiveStatusBadge status={head.status} />}
            <p id="lv-message" tabIndex={-1} role="status" className={busy ? styles.meta : message ? styles.success : styles.empty}>
              {busy || (message ? `✓ ${message}` : '')}
            </p>
          </div>
          {actionNote && (
            <p id="lv-action-note" className={styles.actionNote}>
              {actionNote}
            </p>
          )}
          {editing ? (
            <form className={styles.form} noValidate onSubmit={(e) => e.preventDefault()}>
              <TextInput
                id="lv-title"
                label={copy.form.title}
                required
                value={editing.title}
                error={errors['lv-title']}
                onChange={(e) => setEditing({ ...editing, title: e.target.value })}
              />
              <Select id="lv-area" label={copy.form.area} value={editing.area} onChange={(e) => setEditing({ ...editing, area: e.target.value })} options={liveAreas.map((a) => ({ value: a, label: a }))} />
              <Textarea
                id="lv-summary"
                label={copy.form.summary}
                helper={copy.form.summaryHelper}
                required
                rows={4}
                value={editing.summary}
                error={errors['lv-summary']}
                onChange={(e) => setEditing({ ...editing, summary: e.target.value })}
              />
              <TextInput
                id="lv-headline"
                label={copy.form.previewHeadline}
                helper={copy.form.previewHelper}
                value={editing.previewHeadline}
                onChange={(e) => setEditing({ ...editing, previewHeadline: e.target.value })}
              />
              <label className={styles.check} htmlFor="lv-partner">
                <input id="lv-partner" type="checkbox" checked={editing.partner} onChange={(e) => setEditing({ ...editing, partner: e.target.checked })} />
                <span>{copy.form.partner}</span>
              </label>
            </form>
          ) : current ? (
            <div className={styles.details}>
              {current.status === 'changes' && current.changeNote && (
                <div className={styles.changeNote}>
                  <p className={styles.changeTitle}>
                    <CuIcon name="alert" size={16} /> {copy.drawer.changeNote}
                  </p>
                  <p>{current.changeNote}</p>
                </div>
              )}
              <section aria-labelledby="lv-d-summary">
                <h3 id="lv-d-summary" className={styles.detailTitle}>
                  {copy.drawer.summary}
                </h3>
                <p>{current.summary}</p>
              </section>
              <dl className={styles.facts}>
                <div>
                  <dt>{copy.drawer.area}</dt>
                  <dd>
                    {current.area}
                    {current.partner && <span className={styles.partner}>{copy.history.partner}</span>}
                  </dd>
                </div>
                <div>
                  <dt>{copy.drawer.owner}</dt>
                  <dd>{memberName(current.ownerId)}</dd>
                </div>
                <div>
                  <dt>{copy.drawer.updated}</dt>
                  <dd>{current.updated}</dd>
                </div>
                <div>
                  <dt>{copy.drawer.previewText}</dt>
                  <dd>{current.previewHeadline || '·'}</dd>
                </div>
              </dl>
              <section aria-labelledby="lv-d-history">
                <h3 id="lv-d-history" className={styles.detailTitle}>
                  {copy.drawer.history}
                </h3>
                <ol className={styles.timeline}>
                  {current.history.map((h, i) => (
                    <li key={i}>
                      <span className={styles.timelineWhat}>{h.what}</span>
                      <span className={styles.meta}>
                        {memberName(h.whoId)} · {h.when}
                      </span>
                    </li>
                  ))}
                </ol>
              </section>
            </div>
          ) : null}
        </div>
      </Drawer>

      <Dialog
        open={fullPreview}
        onClose={() => setFullPreview(false)}
        size="wide"
        title={copy.preview.fullTitle[surface]}
        actions={
          <Button variant="primary" onClick={() => setFullPreview(false)}>
            {copy.preview.close}
          </Button>
        }
      >
        <p>{copy.preview.fullNote}</p>
        {surface === 'website' && (
          <div role="group" aria-label={copy.preview.deviceLabel} className={styles.devices}>
            {(['desktop', 'tablet', 'mobile'] as const).map((d) => (
              <button key={d} type="button" className={styles.deviceButton} aria-pressed={device === d} onClick={() => setDevice(d)}>
                {device === d && <span aria-hidden="true">✓ </span>}
                <CuIcon name={d === 'mobile' ? 'phone' : d} size={16} /> {copy.preview.devices[d]}
              </button>
            ))}
          </div>
        )}
        <div className={styles.fullStage}>
          {surface === 'app' ? (
            <PhoneFrame headline={headline} changed={headline !== liveCurrent.app.headline} large />
          ) : (
            <div className={styles.fullSite} data-device={device}>
              <BrowserFrame headline={headline} />
            </div>
          )}
        </div>
      </Dialog>

      <Dialog
        open={confirm === 'archive' && !!current}
        onClose={() => setConfirm(null)}
        tone="alert"
        title={copy.archiveDialog.title(current?.title ?? '')}
        actions={
          <>
            <Button onClick={() => setConfirm(null)}>{copy.archiveDialog.cancel}</Button>
            <Button variant="primary" onClick={confirmArchive}>
              {copy.archiveDialog.confirm}
            </Button>
          </>
        }
      >
        <p>{copy.archiveDialog.body}</p>
      </Dialog>
      <Dialog
        open={confirm === 'changes' && !!current}
        onClose={() => {
          setConfirm(null);
          setNoteError('');
        }}
        title={copy.changesDialog.title(current?.title ?? '')}
        actions={
          <>
            <Button
              onClick={() => {
                setConfirm(null);
                setNoteError('');
              }}
            >
              {copy.changesDialog.cancel}
            </Button>
            <Button variant="primary" onClick={confirmChanges}>
              {copy.changesDialog.confirm}
            </Button>
          </>
        }
      >
        <p>{copy.changesDialog.body(current ? memberName(current.ownerId) : '')}</p>
        <Textarea
          id="lv-change-note"
          label={copy.changesDialog.noteLabel}
          required
          rows={4}
          value={note}
          error={noteError || undefined}
          onChange={(e) => {
            setNote(e.target.value);
            if (noteError && e.target.value.trim()) setNoteError('');
          }}
        />
      </Dialog>
    </main>
  );
}

// ---------- frames

// The approved phone frame: the App screen image inside a device outline (420 x 968 ratio).
// When an update changes the headline, it shows as a labeled overlay on the screen.
function PhoneFrame({ headline, changed, large = false }: { headline: string; changed: boolean; large?: boolean }) {
  return (
    <figure className={large ? `${styles.phone} ${styles.phoneLarge}` : styles.phone} aria-label={copy.preview.phoneLabel}>
      <div className={styles.phoneScreen}>
        <img src={appWelcome.src} width={appWelcome.width} height={appWelcome.height} alt={copy.preview.phoneAlt} />
        {changed && <p className={styles.phoneOverlay}>{headline}</p>}
      </div>
    </figure>
  );
}

// The approved website preview frame: a browser bar, the site navigation and the hero
function BrowserFrame({ headline }: { headline: string }) {
  return (
    <figure className={styles.browser} aria-label={copy.preview.browserLabel}>
      <div className={styles.browserBar} aria-hidden="true">
        <span className={styles.dots}>
          <span />
          <span />
          <span />
        </span>
        <span className={styles.address}>{copy.preview.address}</span>
      </div>
      <div className={styles.site}>
        <p className={styles.siteNav}>{copy.preview.siteNav.join(' · ')}</p>
        <div className={styles.siteHero}>
          <img src={webHero.src} width={webHero.width} height={webHero.height} alt="" className={styles.siteHeroArt} />
          <div className={styles.siteHeroText}>
            <p className={styles.siteEyebrow}>{copy.preview.siteEyebrow}</p>
            <p className={styles.siteHeadline}>{headline}</p>
            <p className={styles.siteBody}>{copy.preview.siteBody}</p>
          </div>
        </div>
        <div className={styles.siteHelps}>
          <p className={styles.siteHelpsTitle}>{copy.preview.siteHelps}</p>
          <ul>
            {copy.preview.siteHelpItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </figure>
  );
}
