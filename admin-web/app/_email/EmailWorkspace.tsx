'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import {
  emailAudiences,
  emailCategories,
  emailCopy as copy,
  emailSeed,
  emailStatusMeta,
  emailTemplates,
  type EmailDoc,
  type EmailStatus,
  type EmailTemplateId,
} from '../../../shared/content/email';
import { can } from '../../../shared/content/permissions';
import heroEmail from '../../../shared/brand/heroes/hero-email.jpg';
import cardInvite from '../../../shared/brand/illustrations/email/card-invite.webp';
import cardNudge from '../../../shared/brand/illustrations/email/card-nudge.webp';
import cardReset from '../../../shared/brand/illustrations/email/card-reset.webp';
import cardWelcome from '../../../shared/brand/illustrations/email/card-welcome.webp';
import emptyContent from '../../../shared/brand/illustrations/empty/empty-content.webp';
import { StateMessage } from '../../components/feedback/StateMessage';
import { Toast } from '../../components/feedback/Toast';
import { SearchField } from '../../components/forms/SearchField';
import { Select } from '../../components/forms/Select';
import { TextInput } from '../../components/forms/TextInput';
import { Textarea } from '../../components/forms/Textarea';
import { UploadField, type UploadValue } from '../../components/forms/UploadField';
import { useObjectUrl } from '../../components/forms/useObjectUrl';
import { PageHeader } from '../../components/layout/PageHeader';
import { Dialog } from '../../components/overlay/Dialog';
import { Button } from '../../components/ui/Button';
import { CuIcon } from '../../components/ui/CuIcon';
import { HeroBanner } from '../../components/ui/HeroBanner';
import { StatusBadge, type StatusTone } from '../../components/ui/StatusBadge';
import { Tabs } from '../../components/ui/Tabs';
import { useIdentity } from '../_data/identity';
import styles from './email.module.css';

export type EmailViewState = 'ready' | 'loading' | 'empty' | 'error';

type Tab = 'templates' | 'drafts' | 'scheduled' | 'sent';
type WorkDoc = EmailDoc & { image: UploadValue; templateAlt: string };
type Errors = Partial<Record<string, string>>;
type Confirm = { kind: 'send' | 'schedule' | 'delete' | 'archive' | 'cancelScheduled'; id: string; name: string; audience?: string } | null;

const cards: Record<EmailTemplateId, { src: string; width: number; height: number }> = {
  invite: cardInvite,
  welcome: cardWelcome,
  nudge: cardNudge,
  reset: cardReset,
};
const tabForStatus: Record<EmailStatus, Tab> = { draft: 'drafts', scheduled: 'scheduled', sent: 'sent' };
const tones: Record<EmailStatus, StatusTone> = { draft: 'neutral', scheduled: 'info', sent: 'success' };
const DELAY = 450;

const template = (id: EmailTemplateId) => emailTemplates.find((t) => t.id === id)!;
const seedDocs = (): WorkDoc[] => emailSeed.map((d) => ({ ...d, image: null, templateAlt: template(d.template).imageAlt }));
const fromTemplate = (id: EmailTemplateId, ownerId: string): WorkDoc => {
  const t = template(id);
  return {
    id: '',
    template: id,
    name: t.name,
    subject: t.subject,
    audience: t.audience,
    heading: t.heading,
    body: t.body,
    button: t.button,
    link: t.link,
    status: 'draft',
    when: '',
    ownerId,
    image: null,
    templateAlt: t.imageAlt,
  };
};
const newId = () => `e-${Date.now()}`;
const focusLater = (id: string) => window.setTimeout(() => document.getElementById(id)?.focus(), 40);
const urlOk = (v: string) => !v.trim() || /^https:\/\/[^\s/.]+\.[^\s]+$/i.test(v.trim());
const altMissing = (w: WorkDoc) => (w.image ? !w.image.alt.trim() : !w.templateAlt.trim());

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
function formatWhen(value: string) {
  const [d, t] = value.split('T');
  const [, mo, da] = d.split('-').map(Number);
  const [h24, mi] = t.split(':').map(Number);
  return `${MONTHS[mo - 1]} ${da}, ${h24 % 12 || 12}:${String(mi).padStart(2, '0')} ${h24 >= 12 ? 'PM' : 'AM'}`;
}

function validate(w: WorkDoc): Errors {
  const e: Errors = {};
  if (!w.name.trim()) e['em-name'] = copy.errors.name;
  if (!w.subject.trim()) e['em-subject'] = copy.errors.subject;
  if (!urlOk(w.link)) e['em-link'] = copy.errors.link;
  if (w.image && !w.image.alt.trim()) e['em-image-alt'] = copy.errors.alt;
  if (!w.image && !w.templateAlt.trim()) e['em-template-alt'] = copy.errors.templateAlt;
  return e;
}
const fieldNames: Record<string, string> = {
  'em-name': 'Email name',
  'em-subject': 'Subject',
  'em-link': 'Destination link',
  'em-image-alt': 'Image alt text',
  'em-template-alt': 'Template image alt text',
};

export function EmailWorkspace({ state = 'ready' }: { state?: EmailViewState }) {
  const me = useIdentity();
  const rights = can(me.adminRole);
  const canSend = !!rights?.emailSend;
  const canSchedule = !!rights?.emailSchedule;
  const canManage = !!rights?.emailManageTemplates;

  const [loadState, setLoadState] = useState<EmailViewState>(state);
  useEffect(() => setLoadState(state), [state]);
  const [docs, setDocs] = useState<WorkDoc[]>(() => (state === 'empty' ? [] : seedDocs()));
  const [archivedTemplates, setArchivedTemplates] = useState<string[]>([]);
  const [showArchived, setShowArchived] = useState(false);
  const [tab, setTab] = useState<Tab>('templates');
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [notice, setNotice] = useState('');

  // Editor
  const [work, setWork] = useState<WorkDoc | null>(null);
  const [mode, setMode] = useState<'edit' | 'preview'>('edit');
  const [errors, setErrors] = useState<Errors>({});
  const [busy, setBusy] = useState('');
  const [confirm, setConfirm] = useState<Confirm>(null);
  const [when, setWhen] = useState('');
  const [whenError, setWhenError] = useState('');
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  // The Dashboard's "Create an email" shortcut opens the editor (?new=1)
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get('new') === '1') openEditor(fromTemplate('welcome', me.id), 'edit');
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const ownsOrManages = (d: WorkDoc) => canManage || d.ownerId === me.id;
  const editable = (d: WorkDoc) => d.status === 'draft' && (d.id === '' || ownsOrManages(d));

  const q = query.trim().toLowerCase();
  const matches = (name: string, tpl: EmailTemplateId) => {
    const t = template(tpl);
    return (category === 'all' || t.category === category) && (!q || `${name} ${t.name} ${t.category} ${t.description}`.toLowerCase().includes(q));
  };
  const templatesShown = emailTemplates.filter((t) => matches(t.name, t.id) && (showArchived || !archivedTemplates.includes(t.id)));
  const listFor = (status: EmailStatus) => docs.filter((d) => d.status === status && matches(d.name, d.template));
  const counts = useMemo(
    () => ({ drafts: docs.filter((d) => d.status === 'draft').length, scheduled: docs.filter((d) => d.status === 'scheduled').length, sent: docs.filter((d) => d.status === 'sent').length }),
    [docs],
  );

  // ---------- editor
  function openEditor(doc: WorkDoc, how: 'edit' | 'preview') {
    setWork({ ...doc });
    setMode(how);
    setErrors({});
    setNotice('');
    focusLater('em-editor-title');
  }
  const closeEditor = () => {
    const back = work ? (work.status === 'draft' ? 'drafts' : tabForStatus[work.status]) : tab;
    setWork(null);
    setErrors({});
    setTab(back);
    focusLater('em-tabs-anchor');
  };

  const later = (label: string, apply: () => void) => {
    setBusy(label);
    setNotice('');
    timer.current = window.setTimeout(() => {
      apply();
      setBusy('');
    }, DELAY);
  };
  const upsert = (w: WorkDoc) => {
    const saved = { ...w, id: w.id || newId() };
    setDocs((all) => (all.some((d) => d.id === saved.id) ? all.map((d) => (d.id === saved.id ? saved : d)) : [saved, ...all]));
    setWork(saved);
    return saved;
  };
  const check = (w: WorkDoc) => {
    const e = validate(w);
    setErrors(e);
    if (Object.keys(e).length) {
      setMode('edit');
      focusLater('em-error-summary');
      return false;
    }
    return true;
  };

  const saveDraft = () => {
    if (!work || busy || altMissing(work) || !check(work)) return;
    later(copy.busy.saving, () => {
      const saved = upsert({ ...work, status: 'draft', when: '' });
      setNotice(copy.done.saved(saved.name));
    });
  };
  const askSend = () => {
    if (!work || !canSend || altMissing(work) || !check(work)) return;
    setConfirm({ kind: 'send', id: work.id, name: work.name, audience: work.audience });
  };
  const askSchedule = () => {
    if (!work || !canSchedule || altMissing(work) || !check(work)) return;
    setWhen('');
    setWhenError('');
    setConfirm({ kind: 'schedule', id: work.id, name: work.name });
  };
  const confirmSend = () => {
    if (!work) return;
    setConfirm(null);
    later(copy.busy.sending, () => {
      const saved = upsert({ ...work, status: 'sent', when: 'Sent just now' });
      setMode('preview');
      setNotice(copy.done.sent(saved.name));
    });
  };
  const confirmSchedule = () => {
    if (!work) return;
    if (!when || new Date(when).getTime() <= Date.now()) {
      setWhenError(copy.errors.when);
      focusLater('em-when');
      return;
    }
    const label = formatWhen(when);
    setConfirm(null);
    later(copy.busy.scheduling, () => {
      const saved = upsert({ ...work, status: 'scheduled', when: label });
      setMode('preview');
      setNotice(copy.done.scheduled(saved.name, label));
    });
  };
  const duplicate = (d: WorkDoc) => {
    const copyDoc: WorkDoc = { ...d, id: newId(), name: `${d.name}${copy.copySuffix}`, status: 'draft', when: '', ownerId: me.id };
    setDocs((all) => [copyDoc, ...all]);
    setNotice(copy.done.duplicated(copyDoc.name));
    if (work) openEditor(copyDoc, 'edit');
    else setTab('drafts');
  };

  // ---------- list-level confirmations
  const confirmOk = () => {
    if (!confirm) return;
    const { kind, id, name } = confirm;
    if (kind === 'send') return confirmSend();
    if (kind === 'schedule') return confirmSchedule();
    setConfirm(null);
    if (kind === 'delete') {
      setDocs((all) => all.filter((d) => d.id !== id));
      if (work) setWork(null);
      setTab('drafts');
      setNotice(copy.done.deleted(name));
      focusLater('em-tabs-anchor');
    } else if (kind === 'archive') {
      setArchivedTemplates((all) => [...all, id]);
      setNotice(copy.done.archived(name));
    } else if (kind === 'cancelScheduled') {
      setDocs((all) => all.map((d) => (d.id === id ? { ...d, status: 'draft', when: '' } : d)));
      setNotice(copy.done.cancelled(name));
    }
  };
  const dialogCopy = confirm ? copy.dialogs[confirm.kind] : null;

  const roleId = me.adminRole ?? 'team_member';
  const noticeRegion = (
    <div aria-live="polite" className={styles.notice}>
      {notice && <Toast tone="success" message={notice} />}
    </div>
  );

  // ---------- render: editor
  if (work) {
    const isNew = !docs.some((d) => d.id === work.id);
    const canEditThis = editable(work);
    const readOnly = !canEditThis;
    const showForm = mode === 'edit' && !readOnly;
    const blocked = !readOnly && altMissing(work);
    const errorList = Object.entries(errors).filter(([, v]) => v) as [string, string][];
    const title = readOnly ? copy.editor.previewTitle : isNew ? copy.editor.newTitle : copy.editor.editTitle;
    const note = work.status === 'sent' ? copy.notes.sent : readOnly ? copy.notes.notOwner : !canSend ? copy.notes.teamLock : copy.notes.noProvider;
    const set = (patch: Partial<WorkDoc>, clear?: string) => {
      setWork({ ...work, ...patch });
      if (clear && errors[clear]) setErrors({ ...errors, [clear]: '' });
    };
    const err = (id: string) => errors[id] || undefined;

    return (
      <main className="shell">
        <div>
          <Button variant="ghost" onClick={closeEditor}>
            <CuIcon name="arrowL" size={16} /> {copy.editor.back}
          </Button>
        </div>
        <div className={styles.editorHead}>
          <PageHeader eyebrow={copy.editor.fromTemplate(template(work.template).name)} title={title} description={work.name || undefined} />
          <div className={styles.editorStatus}>
            <StatusBadge label={emailStatusMeta[work.status].label} icon={emailStatusMeta[work.status].icon} tone={tones[work.status]} />
            {work.when && <span className={styles.meta}>{work.when}</span>}
          </div>
        </div>
        {/* The page heading is focused when the editor opens */}
        <span id="em-editor-title" tabIndex={-1} className="visually-hidden">
          {title}
        </span>
        <p className="note">{copy.sampleNote}</p>
        {noticeRegion}
        <p role="status" className={styles.busy}>
          {busy}
        </p>

        {!readOnly && (
          <div role="group" aria-label={copy.editor.modeLabel} className={styles.modeSwitch}>
            {(['edit', 'preview'] as const).map((m) => (
              <button key={m} type="button" className={styles.modeButton} aria-pressed={mode === m} onClick={() => setMode(m)}>
                {mode === m && <span aria-hidden="true">✓ </span>}
                {m === 'edit' ? copy.editor.edit : copy.editor.preview}
              </button>
            ))}
          </div>
        )}

        <div className={showForm ? styles.editorGrid : styles.previewOnly}>
          {showForm && (
            <form className={styles.form} noValidate onSubmit={(e) => e.preventDefault()} aria-labelledby="em-fields-heading">
              <h2 id="em-fields-heading" className={styles.sectionTitle}>
                {copy.editor.fields}
              </h2>
              {errorList.length > 0 && (
                <div id="em-error-summary" tabIndex={-1} role="alert" className={styles.errorSummary}>
                  <p className={styles.errorHeading}>
                    <CuIcon name="alert" size={16} /> {copy.errors.summary(errorList.length)}
                  </p>
                  <ul>
                    {errorList.map(([id, text]) => (
                      <li key={id}>
                        <a
                          href={`#${id}`}
                          onClick={(e) => {
                            e.preventDefault();
                            document.getElementById(id)?.focus();
                          }}
                        >
                          {fieldNames[id] ?? id}: {text}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <TextInput id="em-name" label={copy.editor.name} helper={copy.editor.nameHelper} required value={work.name} error={err('em-name')} onChange={(e) => set({ name: e.target.value }, 'em-name')} />
              <TextInput id="em-subject" label={copy.editor.subject} required value={work.subject} error={err('em-subject')} onChange={(e) => set({ subject: e.target.value }, 'em-subject')} />
              <Select
                id="em-audience"
                label={copy.editor.audience}
                value={work.audience}
                onChange={(e) => set({ audience: e.target.value })}
                options={Array.from(new Set([work.audience, ...emailAudiences])).map((a) => ({ value: a, label: a }))}
              />
              <TextInput id="em-heading" label={copy.editor.heading} value={work.heading} onChange={(e) => set({ heading: e.target.value })} />
              <Textarea id="em-body" label={copy.editor.body} helper={copy.editor.bodyHelper} rows={5} value={work.body} onChange={(e) => set({ body: e.target.value })} />
              <div className={styles.pair}>
                <TextInput id="em-button" label={copy.editor.button} value={work.button} onChange={(e) => set({ button: e.target.value })} />
                <TextInput id="em-link" type="url" label={copy.editor.link} helper={copy.editor.linkHelper} value={work.link} error={err('em-link')} onChange={(e) => set({ link: e.target.value }, 'em-link')} />
              </div>
              <div className={styles.imageBlock}>
                <UploadField
                  id="em-image"
                  label={copy.editor.image}
                  value={work.image}
                  showErrors
                  altMissing={copy.errors.alt}
                  onChange={(image) => {
                    set({ image }, 'em-image-alt');
                    if (image && !work.image) focusLater('em-image-alt');
                  }}
                />
                {!work.image && (
                  <>
                    <p className={styles.meta}>{copy.editor.templateImage}</p>
                    <TextInput
                      id="em-template-alt"
                      label={copy.editor.templateAlt}
                      required
                      value={work.templateAlt}
                      error={err('em-template-alt') ?? (!work.templateAlt.trim() ? copy.errors.templateAlt : undefined)}
                      onChange={(e) => set({ templateAlt: e.target.value }, 'em-template-alt')}
                    />
                  </>
                )}
              </div>
            </form>
          )}
          <EmailPreview doc={work} />
        </div>

        <div className={styles.actionBar}>
          <p id="em-action-note" className={styles.actionNote}>
            {blocked ? (
              <>
                <CuIcon name="alert" size={16} /> {copy.notes.altBlocked}
              </>
            ) : (
              note
            )}
          </p>
          <div className={styles.actions}>
            <Button variant="ghost" onClick={() => duplicate(work)} disabled={!!busy}>
              {copy.actions.duplicate}
            </Button>
            {!readOnly && !isNew && (
              <Button variant="ghost" onClick={() => setConfirm({ kind: 'delete', id: work.id, name: work.name })} disabled={!!busy} aria-haspopup="dialog">
                {copy.actions.delete}
              </Button>
            )}
            {!readOnly && (
              <Button variant={canSend ? 'secondary' : 'primary'} onClick={saveDraft} disabled={blocked || !!busy} aria-describedby={blocked ? 'em-action-note' : undefined}>
                {copy.actions.saveDraft}
              </Button>
            )}
            {!readOnly && canSchedule && (
              <Button onClick={askSchedule} disabled={blocked || !!busy} aria-describedby={blocked ? 'em-action-note' : undefined} aria-haspopup="dialog">
                {copy.actions.schedule}
              </Button>
            )}
            {!readOnly && canSend && (
              <Button variant="primary" onClick={askSend} disabled={blocked || !!busy} aria-describedby={blocked ? 'em-action-note' : undefined} aria-haspopup="dialog">
                {copy.actions.send}
              </Button>
            )}
          </div>
        </div>

        <ConfirmDialog confirm={confirm} dialogCopy={dialogCopy} onCancel={() => setConfirm(null)} onConfirm={confirmOk} when={when} setWhen={(v) => {
          setWhen(v);
          setWhenError('');
        }} whenError={whenError} />
      </main>
    );
  }

  // ---------- render: workspace
  const emptyFor = (t: Tab, shownCount: number, totalCount: number) =>
    shownCount === 0 ? (
      totalCount > 0 ? (
        <StateMessage
          kind="empty"
          title={copy.states.noMatchTitle}
          body={copy.states.noMatchBody}
          action={
            <Button
              onClick={() => {
                setQuery('');
                setCategory('all');
              }}
            >
              {copy.states.clear}
            </Button>
          }
        />
      ) : (
        <StateMessage kind="empty" title={copy.states.empty[t]} image={{ src: emptyContent.src, width: 96, height: Math.round((96 * emptyContent.height) / emptyContent.width) }} />
      )
    ) : null;

  const listPanel = (status: EmailStatus, t: Tab) => {
    const list = listFor(status);
    const total = docs.filter((d) => d.status === status).length;
    return (
      <div className={styles.tabBody}>
        <p className={styles.meta}>{copy.count(list.length)}</p>
        {emptyFor(t, list.length, total) ?? (
          <ul className={styles.rows} aria-label={copy.listCaption(copy.tabs[t])}>
            {list.map((d) => (
              <li key={d.id} className={styles.row}>
                <div className={styles.rowMain}>
                  <h3 className={styles.rowTitle}>{d.name}</h3>
                  <p className={styles.meta}>
                    {template(d.template).name} · {d.audience}
                  </p>
                </div>
                <div className={styles.rowWhen}>
                  <StatusBadge label={emailStatusMeta[d.status].label} icon={emailStatusMeta[d.status].icon} tone={tones[d.status]} />
                  <span className={styles.meta}>{d.when || copy.notScheduled}</span>
                </div>
                <div className={styles.rowActions}>
                  {status === 'draft' && editable(d) ? (
                    <Button onClick={() => openEditor(d, 'edit')} aria-label={copy.rowActions.edit(d.name)}>
                      {copy.rowActions.editShort}
                    </Button>
                  ) : (
                    <Button onClick={() => openEditor(d, 'preview')} aria-label={copy.rowActions.preview(d.name)}>
                      {copy.rowActions.previewShort}
                    </Button>
                  )}
                  {status !== 'scheduled' && (
                    <Button variant="ghost" onClick={() => duplicate(d)} aria-label={copy.rowActions.duplicate(d.name)}>
                      {copy.rowActions.duplicateShort}
                    </Button>
                  )}
                  {status === 'draft' && editable(d) && (
                    <Button variant="ghost" onClick={() => setConfirm({ kind: 'delete', id: d.id, name: d.name })} aria-label={copy.rowActions.delete(d.name)} aria-haspopup="dialog">
                      {copy.rowActions.deleteShort}
                    </Button>
                  )}
                  {status === 'scheduled' && canManage && (
                    <Button variant="ghost" onClick={() => setConfirm({ kind: 'cancelScheduled', id: d.id, name: d.name })} aria-label={copy.rowActions.cancel(d.name)} aria-haspopup="dialog">
                      {copy.rowActions.cancelShort}
                    </Button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  };

  const templatesPanel = (
    <div className={styles.tabBody}>
      <div className={styles.templateTools}>
        <p className={styles.meta}>{copy.templateCount(templatesShown.length)}</p>
        {archivedTemplates.length > 0 && (
          <label className={styles.check} htmlFor="em-show-archived">
            <input id="em-show-archived" type="checkbox" checked={showArchived} onChange={(e) => setShowArchived(e.target.checked)} />
            <span>{copy.showArchived}</span>
          </label>
        )}
      </div>
      {emptyFor('templates', templatesShown.length, emailTemplates.length) ?? (
        <ul className={styles.templates} aria-label={copy.listCaption(copy.tabs.templates)}>
          {templatesShown.map((t) => {
            const archived = archivedTemplates.includes(t.id);
            const art = cards[t.id];
            return (
              <li key={t.id}>
                <article className={styles.templateCard} aria-labelledby={`em-tpl-${t.id}`}>
                  <div className={styles.templateArt}>
                    <img src={art.src} width={160} height={Math.round((160 * art.height) / art.width)} alt="" />
                  </div>
                  <div className={styles.templateText}>
                    <p className={styles.category}>{t.category}</p>
                    <h3 id={`em-tpl-${t.id}`} className={styles.rowTitle}>
                      {t.name}
                    </h3>
                    <p className={styles.meta}>{t.description}</p>
                    {archived && <StatusBadge label={copy.archivedLabel} icon="lock" tone="muted" />}
                  </div>
                  <div className={styles.rowActions}>
                    {!archived && (
                      <>
                        <Button onClick={() => openEditor(fromTemplate(t.id, me.id), 'preview')} aria-label={copy.templateActions.preview(t.name)}>
                          {copy.templateActions.previewShort}
                        </Button>
                        <Button onClick={() => openEditor(fromTemplate(t.id, me.id), 'edit')} aria-label={copy.templateActions.use(t.name)}>
                          {copy.templateActions.useShort}
                        </Button>
                        <Button
                          variant="ghost"
                          onClick={() => {
                            const d: WorkDoc = { ...fromTemplate(t.id, me.id), id: newId(), name: `${t.name}${copy.copySuffix}` };
                            setDocs((all) => [d, ...all]);
                            setNotice(copy.done.templateDuplicated(t.name));
                            setTab('drafts');
                          }}
                          aria-label={copy.templateActions.duplicate(t.name)}
                        >
                          {copy.templateActions.duplicateShort}
                        </Button>
                      </>
                    )}
                    {canManage && !archived && (
                      <Button variant="ghost" onClick={() => setConfirm({ kind: 'archive', id: t.id, name: t.name })} aria-label={copy.templateActions.archive(t.name)} aria-haspopup="dialog">
                        {copy.templateActions.archiveShort}
                      </Button>
                    )}
                    {canManage && archived && (
                      <Button
                        onClick={() => {
                          setArchivedTemplates((all) => all.filter((x) => x !== t.id));
                          setNotice(copy.done.restored(t.name));
                        }}
                        aria-label={copy.templateActions.restore(t.name)}
                      >
                        {copy.templateActions.restoreShort}
                      </Button>
                    )}
                  </div>
                </article>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );

  return (
    <main className="shell">
      <HeroBanner
        title={copy.heroTitle}
        description={copy.heroDescription}
        image={heroEmail}
        actions={
          <Button variant="primary" onClick={() => openEditor(fromTemplate('welcome', me.id), 'edit')} disabled={loadState === 'loading' || loadState === 'error'}>
            <CuIcon name="plus" size={16} /> {copy.newEmail}
          </Button>
        }
      />
      <p className="note">{copy.sampleNote}</p>
      <p className={styles.roleNote} aria-label={copy.accessLabel}>
        {copy.roleNote[roleId]}
      </p>
      {noticeRegion}

      <section className={styles.panel} aria-labelledby="em-tabs-heading" aria-busy={loadState === 'loading'}>
        <h2 id="em-tabs-heading" className="visually-hidden">
          {copy.tabsLabel}
        </h2>
        <span id="em-tabs-anchor" tabIndex={-1} />
        <div className={styles.tools}>
          <SearchField id="em-search" label={copy.searchLabel} placeholder={copy.searchPlaceholder} value={query} onChange={(e) => setQuery(e.target.value)} />
          <Select
            id="em-category"
            label={copy.categoryLabel}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            options={[{ value: 'all', label: copy.allCategories }, ...emailCategories.map((c) => ({ value: c, label: c }))]}
          />
        </div>
        {loadState === 'loading' && <StateMessage kind="loading" title={copy.states.loading} />}
        {loadState === 'error' && (
          <StateMessage kind="error" title={copy.states.errorTitle} body={copy.states.errorBody} action={<Button onClick={() => setLoadState('ready')}>{copy.states.retry}</Button>} />
        )}
        {(loadState === 'ready' || loadState === 'empty') && (
          <Tabs
            label={copy.tabsLabel}
            selectedTab={tab}
            onChange={(id) => setTab(id as Tab)}
            tabs={[
              { id: 'templates', label: copy.tabs.templates, content: templatesPanel },
              { id: 'drafts', label: `${copy.tabs.drafts} (${counts.drafts})`, content: listPanel('draft', 'drafts') },
              { id: 'scheduled', label: `${copy.tabs.scheduled} (${counts.scheduled})`, content: listPanel('scheduled', 'scheduled') },
              { id: 'sent', label: `${copy.tabs.sent} (${counts.sent})`, content: listPanel('sent', 'sent') },
            ]}
          />
        )}
      </section>

      <ConfirmDialog confirm={confirm} dialogCopy={dialogCopy} onCancel={() => setConfirm(null)} onConfirm={confirmOk} when={when} setWhen={setWhen} whenError={whenError} />
    </main>
  );
}

// ---------- preview

function EmailPreview({ doc }: { doc: WorkDoc }) {
  const uploaded = useObjectUrl(doc.image?.file);
  const art = cards[doc.template];
  const src = doc.image ? uploaded : art.src;
  const alt = doc.image ? doc.image.alt : doc.templateAlt;
  return (
    <section className={styles.preview} aria-labelledby="em-preview-heading">
      <h2 id="em-preview-heading" className={styles.sectionTitle}>
        {copy.editor.previewLabel}
      </h2>
      <div className={styles.envelope}>
        <p className={styles.meta}>{copy.editor.previewFrom}</p>
        <p className={styles.meta}>{copy.editor.previewTo(doc.audience)}</p>
        <p className={styles.previewSubject}>{copy.editor.previewSubject(doc.subject || ' ')}</p>
      </div>
      <div className={styles.message}>
        {src && <img src={src} alt={alt} className={doc.image ? styles.messagePhoto : styles.messageArt} />}
        <p className={styles.messageHeading}>{doc.heading}</p>
        <p className={styles.messageBody}>{doc.body}</p>
        {doc.button && (
          <span className={styles.messageButton} aria-label={`${doc.button} (preview only, links to ${doc.link || 'no link yet'})`}>
            {doc.button}
          </span>
        )}
        <p className={styles.messageFooter}>{copy.editor.previewFooter}</p>
      </div>
    </section>
  );
}

// ---------- confirmations

type DialogText = { title: (name: string) => string; body: string | ((audience: string) => string); confirm: string; cancel: string };

function ConfirmDialog({
  confirm,
  dialogCopy,
  onCancel,
  onConfirm,
  when,
  setWhen,
  whenError,
}: {
  confirm: Confirm;
  dialogCopy: DialogText | null;
  onCancel: () => void;
  onConfirm: () => void;
  when: string;
  setWhen: (v: string) => void;
  whenError: string;
}) {
  const text = dialogCopy;
  const alert = confirm?.kind === 'delete' || confirm?.kind === 'archive' || confirm?.kind === 'cancelScheduled' || confirm?.kind === 'send';
  return (
    <Dialog
      open={!!confirm && !!text}
      onClose={onCancel}
      tone={alert ? 'alert' : 'default'}
      title={text && confirm ? text.title(confirm.name) : ''}
      actions={
        <>
          <Button onClick={onCancel}>{text?.cancel}</Button>
          <Button variant="primary" onClick={onConfirm}>
            {text?.confirm}
          </Button>
        </>
      }
    >
      {text && confirm && <p>{typeof text.body === 'function' ? text.body(confirm.audience ?? '') : text.body}</p>}
      {confirm?.kind === 'schedule' && (
        <TextInput id="em-when" type="datetime-local" label={copy.dialogs.schedule.whenLabel} required value={when} error={whenError || undefined} onChange={(e) => setWhen(e.target.value)} />
      )}
    </Dialog>
  );
}
