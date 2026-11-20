'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { can } from '../../../shared/content/permissions';
import {
  productCategories,
  productGuidanceGroups,
  productGuidanceOptions,
  productLibraryCopy as copy,
  productSeed,
  productStatusMeta,
  type ProductRecord,
  type ProductStatus,
} from '../../../shared/content/product-library';
import { memberName } from '../../../shared/content/team-roster';
import catProduct from '../../../shared/brand/illustrations/content-categories/cat-product.webp';
import emptyContent from '../../../shared/brand/illustrations/empty/empty-content.webp';
import { StateMessage } from '../../components/feedback/StateMessage';
import { Select } from '../../components/forms/Select';
import { SearchField } from '../../components/forms/SearchField';
import { TextInput } from '../../components/forms/TextInput';
import { Textarea } from '../../components/forms/Textarea';
import { UploadField, type UploadValue } from '../../components/forms/UploadField';
import { useObjectUrl } from '../../components/forms/useObjectUrl';
import { Dialog } from '../../components/overlay/Dialog';
import { Drawer } from '../../components/overlay/Drawer';
import { Button } from '../../components/ui/Button';
import { CuIcon } from '../../components/ui/CuIcon';
import { StatusBadge, type StatusTone } from '../../components/ui/StatusBadge';
import { useIdentity } from '../_data/identity';
import styles from './productLibrary.module.css';

export type LibraryState = 'ready' | 'loading' | 'empty' | 'error';

type ProductImage = NonNullable<UploadValue>;
type LibraryRecord = ProductRecord & { image: UploadValue; extraImages: ProductImage[] };
type Errors = Partial<Record<string, string>>;

const tones: Record<ProductStatus, StatusTone> = {
  draft: 'neutral',
  review: 'info',
  changes: 'error',
  approved: 'success',
  archived: 'muted',
};

const MAX_EXTRA = 4;
const DELAY = 450;

const seedRecords = (): LibraryRecord[] => productSeed.map((p) => ({ ...p, image: null, extraImages: [] }));

const blankRecord = (ownerId: string): LibraryRecord => ({
  id: `new-${Date.now()}`,
  name: '',
  brand: '',
  category: '',
  description: '',
  url: '',
  ingredients: [{ name: '', role: '', notes: '', source: '' }],
  claims: [{ text: '', source: '' }],
  safety: '',
  status: 'draft',
  ownerId,
  reviewerId: '',
  links: [],
  updatedDaysAgo: 0,
  changeNote: '',
  image: null,
  extraImages: [],
});

const urlOk = (value: string) => /^https?:\/\/[^\s/.]+\.[^\s]+$/i.test(value.trim());

// Alt text is required for every image: spaces alone don't count
const altMissing = (r: LibraryRecord) => (!!r.image && !r.image.alt.trim()) || r.extraImages.some((im) => !im.alt.trim());

function validate(r: LibraryRecord): Errors {
  const e: Errors = {};
  if (!r.name.trim()) e['pl-name'] = copy.errors.name;
  if (!r.brand.trim()) e['pl-brand'] = copy.errors.brand;
  if (!r.category) e['pl-category'] = copy.errors.category;
  if (!r.description.trim()) e['pl-description'] = copy.errors.description;
  else if (r.description.length > 200) e['pl-description'] = copy.errors.descriptionLong;
  if (!r.url.trim()) e['pl-url'] = copy.errors.url;
  else if (!urlOk(r.url)) e['pl-url'] = copy.errors.urlFormat;
  if (r.image && !r.image.alt.trim()) e['pl-image-alt'] = copy.errors.alt;
  r.extraImages.forEach((im, i) => {
    if (!im.alt.trim()) e[`pl-extra-${i}-alt`] = copy.errors.altExtra(i + 1);
  });
  return e;
}

const fieldNames: Record<string, string> = {
  'pl-name': 'Product name',
  'pl-brand': 'Brand',
  'pl-category': 'Category',
  'pl-description': 'Short description',
  'pl-url': 'Product URL',
  'pl-image-alt': 'Image alt text',
};
const fieldName = (id: string) => fieldNames[id] ?? (id.startsWith('pl-extra-') ? `Additional image ${Number(id.split('-')[2]) + 1} alt text` : id);

const focusLater = (id: string) => window.setTimeout(() => document.getElementById(id)?.focus(), 40);

function ImagePreview({ image, className }: { image: ProductImage; className?: string }) {
  const src = useObjectUrl(image.file);
  return src ? <img src={src} alt={image.alt} className={className} /> : null;
}

function ProductStatusBadge({ status }: { status: ProductStatus }) {
  const meta = productStatusMeta[status];
  return <StatusBadge label={meta.label} icon={meta.icon} tone={tones[status]} />;
}

const guidanceTitle = (id: string) => productGuidanceOptions.find((g) => g.id === id)?.title ?? id;

function linkSummary(links: string[]) {
  if (!links.length) return copy.notLinked;
  return guidanceTitle(links[0]) + (links.length > 1 ? copy.moreLinks(links.length - 1) : '');
}

export function ProductLibrary({ state = 'ready' }: { state?: LibraryState }) {
  const me = useIdentity();
  const rights = can(me.adminRole);
  const canReview = !!rights?.productReview;
  const canArchive = !!rights?.productArchive;

  const [records, setRecords] = useState<LibraryRecord[]>(() => (state === 'empty' ? [] : seedRecords()));
  const [loadState, setLoadState] = useState<LibraryState>(state);
  useEffect(() => setLoadState(state), [state]);

  // Search, filters and sort
  const [query, setQuery] = useState('');
  const [brand, setBrand] = useState('all');
  const [category, setCategory] = useState('all');
  const [status, setStatus] = useState('active');
  const [link, setLink] = useState('all');
  const [sort, setSort] = useState('new');

  // The open record
  const [openId, setOpenId] = useState<string | null>(null);
  const [mode, setMode] = useState<'view' | 'edit'>('view');
  const [draft, setDraft] = useState<LibraryRecord | null>(null);
  const [errors, setErrors] = useState<Errors>({});
  const [busy, setBusy] = useState('');
  const [message, setMessage] = useState('');
  const [confirm, setConfirm] = useState<'archive' | 'changes' | null>(null);
  const [note, setNote] = useState('');
  const [noteError, setNoteError] = useState('');
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const brands = useMemo(() => Array.from(new Set(records.map((r) => r.brand))).sort(), [records]);
  const filtersOn = [brand, category, link].filter((v) => v !== 'all').length + (status !== 'active' ? 1 : 0) + (query.trim() ? 1 : 0);

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = records
      .filter((r) => brand === 'all' || r.brand === brand)
      .filter((r) => category === 'all' || r.category === category)
      .filter((r) => (status === 'all' ? true : status === 'active' ? r.status !== 'archived' : r.status === status))
      .filter((r) => (link === 'all' ? true : link === 'any' ? r.links.length > 0 : link === 'none' ? r.links.length === 0 : r.links.includes(link)))
      .filter((r) => !q || `${r.name} ${r.brand} ${r.ingredients.map((i) => i.name).join(' ')}`.toLowerCase().includes(q));
    return list.sort((a, b) => (sort === 'new' ? a.updatedDaysAgo - b.updatedDaysAgo : sort === 'old' ? b.updatedDaysAgo - a.updatedDaysAgo : a.name.localeCompare(b.name)));
  }, [records, query, brand, category, status, link, sort]);

  const resetFilters = () => {
    setQuery('');
    setBrand('all');
    setCategory('all');
    setStatus('active');
    setLink('all');
    focusLater('pl-search');
  };

  const isNew = openId === 'new';
  const current = openId && !isNew ? records.find((r) => r.id === openId) ?? null : null;
  const editing = mode === 'edit' && !!draft;
  const mine = (r: LibraryRecord) => r.ownerId === me.id;
  const canEdit = (r: LibraryRecord) => r.status !== 'archived' && (!!rights?.productEditAny || mine(r));

  const resetDrawer = () => {
    setErrors({});
    setBusy('');
    setMessage('');
    setConfirm(null);
    setNote('');
    setNoteError('');
  };
  const close = () => {
    setOpenId(null);
    setMode('view');
    setDraft(null);
    resetDrawer();
  };
  const openRecord = (id: string, how: 'view' | 'edit') => {
    const r = records.find((x) => x.id === id);
    if (!r) return;
    resetDrawer();
    setOpenId(id);
    setMode(how);
    setDraft(how === 'edit' ? { ...r, ingredients: r.ingredients.map((i) => ({ ...i })), claims: r.claims.map((c) => ({ ...c })), extraImages: [...r.extraImages] } : null);
  };
  const startNew = () => {
    resetDrawer();
    setOpenId('new');
    setMode('edit');
    setDraft(blankRecord(me.id));
  };

  // Simulated save: a short busy state, then the result is announced in the drawer
  const later = (label: string, apply: () => void) => {
    setBusy(label);
    setMessage('');
    timer.current = window.setTimeout(() => {
      apply();
      setBusy('');
      focusLater('pl-message');
    }, DELAY);
  };
  const update = (id: string, patch: Partial<LibraryRecord>) =>
    setRecords((all) => all.map((r) => (r.id === id ? { ...r, ...patch, updatedDaysAgo: 0 } : r)));

  const commit = (to: 'draft' | 'review') => {
    if (!draft || busy || altMissing(draft)) return;
    const e = validate(draft);
    if (Object.keys(e).length) {
      setErrors(e);
      focusLater('pl-error-summary');
      return;
    }
    const wasNew = isNew;
    const previous = records.find((r) => r.id === draft.id);
    const saved: LibraryRecord = { ...draft, status: to, updatedDaysAgo: 0, changeNote: to === 'review' ? '' : draft.changeNote };
    later(to === 'review' ? copy.busy.submitting : copy.busy.saving, () => {
      setRecords((all) => (wasNew ? [saved, ...all] : all.map((r) => (r.id === saved.id ? saved : r))));
      setOpenId(saved.id);
      setMode('view');
      setDraft(null);
      setErrors({});
      setMessage(
        to === 'review'
          ? wasNew
            ? copy.done.createdSubmitted(saved.name)
            : copy.done.submitted
          : wasNew
            ? copy.done.created(saved.name)
            : previous && (previous.status === 'approved' || previous.status === 'review')
              ? copy.done.savedReset
              : copy.done.saved,
      );
    });
  };

  const submitCurrent = () => {
    if (!current) return;
    const e = validate(current);
    if (Object.keys(e).length) {
      openRecord(current.id, 'edit');
      setErrors(e);
      focusLater('pl-error-summary');
      return;
    }
    later(copy.busy.submitting, () => {
      update(current.id, { status: 'review', changeNote: '' });
      setMessage(copy.done.submitted);
    });
  };

  const approve = () => {
    if (!current) return;
    later(copy.busy.approving, () => {
      update(current.id, { status: 'approved', reviewerId: me.id, changeNote: '' });
      setMessage(copy.done.approved(current.name));
    });
  };

  const confirmArchive = () => {
    if (!current) return;
    const r = current;
    setConfirm(null);
    later(copy.busy.archiving, () => {
      update(r.id, { status: 'archived' });
      setMessage(copy.done.archived(r.name));
    });
  };

  const confirmChanges = () => {
    if (!current) return;
    const text = note.trim();
    if (!text) {
      setNoteError(copy.errors.note);
      focusLater('pl-change-note');
      return;
    }
    const r = current;
    setConfirm(null);
    later(copy.busy.requesting, () => {
      update(r.id, { status: 'changes', reviewerId: me.id, changeNote: text });
      setNote('');
      setNoteError('');
      setMessage(copy.done.changes(memberName(r.ownerId)));
    });
  };

  const restore = () => {
    if (!current) return;
    later(copy.busy.restoring, () => {
      update(current.id, { status: 'draft' });
      setMessage(copy.done.restored(current.name));
    });
  };

  const active = records.filter((r) => r.status !== 'archived').length;
  const archived = records.length - active;
  const roleId = me.adminRole ?? 'team_member';

  // ---------- drawer content
  const head = editing ? draft : current;
  const drawerTitle = editing ? (isNew ? copy.drawer.newTitle : copy.drawer.editTitle) : current?.name ?? '';
  const drawerEyebrow = head && head.brand && head.category ? `${head.brand} · ${head.category}` : copy.drawer.fallbackEyebrow;
  const blocked = editing && altMissing(draft);

  const footer = (() => {
    if (editing) {
      return (
        <>
          <Button variant="ghost" onClick={isNew ? close : () => openRecord(draft.id, 'view')} disabled={!!busy}>
            {copy.actions.cancel}
          </Button>
          {isNew ? (
            <>
              <Button onClick={() => commit('review')} disabled={blocked || !!busy} aria-describedby={blocked ? 'pl-alt-block' : undefined}>
                {copy.actions.submit}
              </Button>
              <Button variant="primary" onClick={() => commit('draft')} disabled={blocked || !!busy} aria-describedby={blocked ? 'pl-alt-block' : undefined}>
                {copy.actions.create}
              </Button>
            </>
          ) : (
            <>
              <Button onClick={() => commit('draft')} disabled={blocked || !!busy} aria-describedby={blocked ? 'pl-alt-block' : undefined}>
                {copy.actions.saveDraft}
              </Button>
              <Button variant="primary" onClick={() => commit('review')} disabled={blocked || !!busy} aria-describedby={blocked ? 'pl-alt-block' : undefined}>
                {copy.actions.submit}
              </Button>
            </>
          )}
        </>
      );
    }
    if (!current) return null;
    const editable = canEdit(current);
    const reviewable = current.status === 'review' && canReview && !mine(current);
    return (
      <>
        {canArchive && current.status !== 'archived' && (
          <Button id="pl-act-archive" variant="ghost" onClick={() => setConfirm('archive')} disabled={!!busy} aria-haspopup="dialog">
            {copy.actions.archive}
          </Button>
        )}
        {canArchive && current.status === 'archived' && (
          <Button onClick={restore} disabled={!!busy}>
            {copy.actions.restore}
          </Button>
        )}
        {current.status !== 'archived' && (
          <Button onClick={() => openRecord(current.id, 'edit')} disabled={!editable || !!busy} aria-describedby={!editable ? 'pl-action-note' : undefined}>
            {copy.actions.edit}
          </Button>
        )}
        {reviewable && (
          <Button id="pl-act-changes" onClick={() => setConfirm('changes')} disabled={!!busy} aria-haspopup="dialog">
            {copy.actions.requestChanges}
          </Button>
        )}
        {reviewable && (
          <Button variant="primary" onClick={approve} disabled={!!busy}>
            {copy.actions.approve}
          </Button>
        )}
        {(current.status === 'draft' || current.status === 'changes') && editable && (
          <Button variant="primary" onClick={submitCurrent} disabled={!!busy}>
            {copy.actions.submit}
          </Button>
        )}
      </>
    );
  })();

  const actionNote = (() => {
    if (editing || !current) return '';
    if (!canReview) {
      if (current.status === 'review') return copy.notes.submitted;
      if (current.status === 'archived') return copy.notes.archivedTeam;
      if (!canEdit(current)) return `${copy.notes.notAssigned(memberName(current.ownerId))} ${copy.notes.approvalRoles}`;
      return copy.notes.approvalRoles;
    }
    if (current.status === 'archived') return copy.notes.archived;
    if (current.status === 'review' && mine(current)) return copy.notes.ownContent;
    return '';
  })();

  const errorList = Object.entries(errors).filter(([, v]) => v) as [string, string][];

  return (
    <>
      <section className={styles.intro} aria-label={copy.accessLabel}>
        <p id="pl-intro" className={styles.introText}>
          {copy.roleNote[roleId]}
        </p>
        <Button variant="primary" onClick={startNew} aria-haspopup="dialog" disabled={loadState === 'loading' || loadState === 'error'}>
          <span className={styles.buttonIcon}>
            <CuIcon name="plus" size={16} />
            {copy.newProduct}
          </span>
        </Button>
      </section>

      <section className={styles.panel} aria-labelledby="pl-records" aria-busy={loadState === 'loading'}>
        <div className={styles.panelHeader}>
          <h2 id="pl-records" className={styles.title}>
            {copy.recordsTitle}
          </h2>
          {loadState === 'ready' || loadState === 'empty' ? <p className={styles.count}>{copy.count(active, archived)}</p> : null}
        </div>

        <SearchField id="pl-search" label={copy.searchLabel} placeholder={copy.searchPlaceholder} value={query} onChange={(event) => setQuery(event.target.value)} />

        <div role="group" aria-label={copy.filtersLabel} className={styles.filters}>
          <Select
            id="pl-f-brand"
            label={copy.filters.brand}
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            options={[{ value: 'all', label: copy.filters.allBrands }, ...brands.map((b) => ({ value: b, label: b }))]}
          />
          <Select
            id="pl-f-category"
            label={copy.filters.category}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            options={[{ value: 'all', label: copy.filters.allCategories }, ...productCategories.map((c) => ({ value: c, label: c }))]}
          />
          <Select
            id="pl-f-status"
            label={copy.filters.status}
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            options={[
              { value: 'active', label: copy.filters.activeStatuses },
              ...(Object.keys(productStatusMeta) as ProductStatus[]).map((s) => ({ value: s, label: productStatusMeta[s].label })),
              { value: 'all', label: copy.filters.allStatuses },
            ]}
          />
          <Select
            id="pl-f-link"
            label={copy.filters.link}
            value={link}
            onChange={(e) => setLink(e.target.value)}
            options={[
              { value: 'all', label: copy.filters.allLinks },
              { value: 'any', label: copy.filters.anyLink },
              { value: 'none', label: copy.filters.noLink },
              ...productGuidanceOptions.map((g) => ({ value: g.id, label: g.title })),
            ]}
          />
          <Select
            id="pl-f-sort"
            label={copy.filters.sort}
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            options={[
              { value: 'new', label: copy.filters.newest },
              { value: 'old', label: copy.filters.oldest },
              { value: 'name', label: copy.filters.name },
            ]}
          />
        </div>

        <div className={styles.summaryRow}>
          <p role="status" className={styles.count}>
            {loadState === 'ready' && filtersOn > 0 ? copy.summary(shown.length, records.length) : ''}
          </p>
          {filtersOn > 0 && (
            <Button variant="ghost" onClick={resetFilters}>
              {copy.reset}
            </Button>
          )}
        </div>

        {loadState === 'loading' && <StateMessage kind="loading" title={copy.states.loading} />}
        {loadState === 'error' && (
          <StateMessage kind="error" title={copy.states.errorTitle} body={copy.states.errorBody} action={<Button onClick={() => setLoadState('ready')}>{copy.states.retry}</Button>} />
        )}
        {(loadState === 'ready' || loadState === 'empty') && shown.length === 0 && (
          <StateMessage
            kind="empty"
            image={{ src: emptyContent.src, width: 96, height: Math.round((96 * emptyContent.height) / emptyContent.width) }}
            title={records.length ? copy.states.noMatchTitle : copy.states.emptyTitle}
            body={records.length ? copy.states.noMatchBody : copy.states.emptyBody}
            action={
              records.length ? (
                <Button onClick={resetFilters}>{copy.reset}</Button>
              ) : (
                <Button onClick={startNew} aria-haspopup="dialog">
                  {copy.newProduct}
                </Button>
              )
            }
          />
        )}
        {(loadState === 'ready' || loadState === 'empty') && shown.length > 0 && (
          <ul className={styles.cards} aria-label={copy.cardsLabel}>
            {shown.map((r) => (
              <li key={r.id}>
                <ProductCard record={r} selected={openId === r.id} canEdit={canEdit(r)} onOpen={(how) => openRecord(r.id, how)} />
              </li>
            ))}
          </ul>
        )}
      </section>

      <Drawer open={!!openId} onClose={close} eyebrow={drawerEyebrow} title={drawerTitle} closeLabel={copy.drawer.close} footer={footer}>
        <div className={styles.drawerBody}>
          <div className={styles.drawerStatus}>
            {head && <ProductStatusBadge status={head.status} />}
            <p id="pl-message" tabIndex={-1} role="status" className={busy ? styles.busy : message ? styles.success : styles.statusLine}>
              {busy ? (
                busy
              ) : message ? (
                <>
                  <span aria-hidden="true">✓ </span>
                  {message}
                </>
              ) : (
                ''
              )}
            </p>
          </div>
          {actionNote && (
            <p id="pl-action-note" className={styles.actionNote}>
              {actionNote}
            </p>
          )}

          {editing && draft ? (
            <ProductForm draft={draft} setDraft={setDraft} errors={errors} setErrors={setErrors} errorList={errorList} blocked={blocked} />
          ) : current ? (
            <ProductDetails record={current} />
          ) : null}
        </div>
      </Drawer>

      <Dialog
        open={confirm === 'archive' && !!current}
        onClose={() => setConfirm(null)}
        title={copy.archiveDialog.title(current?.name ?? '')}
        tone="alert"
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
        title={copy.changesDialog.title(current?.name ?? '')}
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
          id="pl-change-note"
          label={copy.changesDialog.noteLabel}
          helper={copy.changesDialog.noteHelper}
          error={noteError || undefined}
          required
          aria-required="true"
          rows={4}
          value={note}
          onChange={(e) => {
            setNote(e.target.value);
            if (noteError && e.target.value.trim()) setNoteError('');
          }}
        />
      </Dialog>
    </>
  );
}

// ---------- card

function ProductCard({
  record: r,
  selected,
  canEdit,
  onOpen,
}: {
  record: LibraryRecord;
  selected: boolean;
  canEdit: boolean;
  onOpen: (how: 'view' | 'edit') => void;
}) {
  const titleId = `pl-card-${r.id}`;
  const linkCount = copy.card.linked(r.links.length);
  return (
    <article className={styles.card} aria-labelledby={titleId} data-selected={selected}>
      <div className={styles.cardMedia}>
        {r.image ? (
          <ImagePreview image={r.image} className={styles.cardImage} />
        ) : (
          <>
            <img src={catProduct.src} width={72} height={72} alt="" className={styles.cardPlaceholder} />
            <span className={styles.cardNoImage}>{copy.card.noImage}</span>
          </>
        )}
      </div>
      <div className={styles.cardBody}>
        <div className={styles.cardStatus}>
          <ProductStatusBadge status={r.status} />
          {selected && <span className="visually-hidden">{copy.card.selected}</span>}
        </div>
        <h3 id={titleId} className={styles.cardTitle}>
          {r.name}
        </h3>
        <p className={styles.cardMeta}>
          {r.brand} · {r.category}
        </p>
        <p className={styles.cardDescription}>{r.description}</p>
        <dl className={styles.cardFacts}>
          <div>
            <dt>{copy.columns.link}</dt>
            <dd className={r.links.length ? undefined : styles.muted}>
              {linkCount}
              {r.links.length > 0 && <span className={styles.cardLinkTitle}>{linkSummary(r.links)}</span>}
            </dd>
          </div>
          <div>
            <dt>{copy.columns.updated}</dt>
            <dd>{copy.updated(r.updatedDaysAgo)}</dd>
          </div>
        </dl>
      </div>
      <div className={styles.cardActions}>
        <Button onClick={() => onOpen('view')} aria-haspopup="dialog" aria-label={copy.open(r.name)}>
          {copy.card.view}
        </Button>
        {canEdit && (
          <Button variant="ghost" onClick={() => onOpen('edit')} aria-haspopup="dialog" aria-label={copy.edit(r.name)}>
            {copy.editShort}
          </Button>
        )}
      </div>
    </article>
  );
}

// ---------- view mode

function ProductDetails({ record: r }: { record: LibraryRecord }) {
  const v = copy.view;
  const groups = productGuidanceGroups.map((g) => ({ ...g, items: r.links.filter((id) => productGuidanceOptions.find((o) => o.id === id)?.group === g.id) }));
  const sources = Array.from(new Set([r.url, ...r.ingredients.map((i) => i.source), ...r.claims.map((c) => c.source)].filter(Boolean)));
  return (
    <div className={styles.sections}>
      {r.status === 'changes' && r.changeNote && (
        <div className={styles.changeNote}>
          <p className={styles.changeNoteTitle}>
            <CuIcon name="alert" size={16} /> {v.changeNote}
          </p>
          <p>{r.changeNote}</p>
        </div>
      )}

      <section aria-labelledby="pl-v-overview" className={styles.section}>
        <h3 id="pl-v-overview" className={styles.sectionTitle}>
          {v.overview}
        </h3>
        <p>{r.description}</p>
        <dl className={styles.facts}>
          <div>
            <dt>{v.name}</dt>
            <dd>{r.name}</dd>
          </div>
          <div>
            <dt>{v.brand}</dt>
            <dd>{r.brand}</dd>
          </div>
          <div>
            <dt>{v.category}</dt>
            <dd>{r.category}</dd>
          </div>
          <div>
            <dt>{v.url}</dt>
            <dd className={styles.wrap}>{r.url}</dd>
          </div>
        </dl>
      </section>

      <section aria-labelledby="pl-v-ingredients" className={styles.section}>
        <h3 id="pl-v-ingredients" className={styles.sectionTitle}>
          {v.ingredients}
        </h3>
        <ul className={styles.plainList}>
          {r.ingredients.map((i, n) => (
            <li key={`${i.name}-${n}`} className={styles.listItem}>
              <p className={styles.itemName}>
                {i.name} <span className={styles.muted}>· {i.role}</span>
              </p>
              {i.notes && <p>{i.notes}</p>}
              <p className={i.source ? styles.wrap : styles.flag}>
                {i.source ? (
                  `${v.ingredientSource}: ${i.source}`
                ) : (
                  <>
                    <CuIcon name="alert" size={14} /> {v.noIngredientSource}
                  </>
                )}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="pl-v-claims" className={styles.section}>
        <h3 id="pl-v-claims" className={styles.sectionTitle}>
          {v.claims}
        </h3>
        <ul className={styles.plainList}>
          {r.claims.map((c, n) => (
            <li key={`${c.text}-${n}`} className={styles.listItem}>
              <p className={styles.caption}>{v.claim}</p>
              <p className={styles.itemName}>&ldquo;{c.text}&rdquo;</p>
              <p className={c.source ? styles.wrap : styles.flag}>
                {c.source ? (
                  `${v.claimSource}: ${c.source}`
                ) : (
                  <>
                    <CuIcon name="alert" size={14} /> {v.claimNoSource}
                  </>
                )}
              </p>
            </li>
          ))}
        </ul>
        <p className={styles.caption}>{v.safety}</p>
        <p className={r.safety ? undefined : styles.muted}>{r.safety || v.noSafety}</p>
      </section>

      <section aria-labelledby="pl-v-media" className={styles.section}>
        <h3 id="pl-v-media" className={styles.sectionTitle}>
          {v.media}
        </h3>
        {r.image ? (
          <figure className={styles.figure}>
            <ImagePreview image={r.image} className={styles.figureImage} />
            <figcaption className={styles.caption}>{v.altCaption(r.image.alt)}</figcaption>
          </figure>
        ) : (
          <p className={styles.muted}>{v.noImage}</p>
        )}
        {r.extraImages.length > 0 && (
          <>
            <p className={styles.caption}>{v.additionalImages}</p>
            <ul className={styles.thumbs}>
              {r.extraImages.map((im, n) => (
                <li key={n}>
                  <figure className={styles.figure}>
                    <ImagePreview image={im} className={styles.thumb} />
                    <figcaption className={styles.caption}>{v.altCaption(im.alt)}</figcaption>
                  </figure>
                </li>
              ))}
            </ul>
          </>
        )}
        <p className={styles.caption}>{v.sources}</p>
        <ul className={styles.sourceList}>
          {sources.map((s) => (
            <li key={s} className={styles.wrap}>
              {s}
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="pl-v-guidance" className={styles.section}>
        <h3 id="pl-v-guidance" className={styles.sectionTitle}>
          {v.guidance}
        </h3>
        {r.links.length === 0 ? (
          <p className={styles.muted}>{v.noGuidance}</p>
        ) : (
          groups
            .filter((g) => g.items.length)
            .map((g) => (
              <div key={g.id}>
                <p className={styles.caption}>{g.label}</p>
                <ul className={styles.bullets}>
                  {g.items.map((id) => (
                    <li key={id}>{guidanceTitle(id)}</li>
                  ))}
                </ul>
              </div>
            ))
        )}
      </section>

      <section aria-labelledby="pl-v-review" className={styles.section}>
        <h3 id="pl-v-review" className={styles.sectionTitle}>
          {v.review}
        </h3>
        <dl className={styles.facts}>
          <div>
            <dt>{copy.drawer.statusLabel}</dt>
            <dd>
              <ProductStatusBadge status={r.status} />
            </dd>
          </div>
          <div>
            <dt>{v.owner}</dt>
            <dd>{memberName(r.ownerId)}</dd>
          </div>
          <div>
            <dt>{v.reviewer}</dt>
            <dd>{r.reviewerId ? memberName(r.reviewerId) : v.noReviewer}</dd>
          </div>
          <div>
            <dt>{v.updated}</dt>
            <dd>{copy.updated(r.updatedDaysAgo)}</dd>
          </div>
        </dl>
      </section>
    </div>
  );
}

// ---------- create and edit

type FormProps = {
  draft: LibraryRecord;
  setDraft: (r: LibraryRecord) => void;
  errors: Errors;
  setErrors: (e: Errors) => void;
  errorList: [string, string][];
  blocked: boolean;
};

function ProductForm({ draft: d, setDraft, errors, setErrors, errorList, blocked }: FormProps) {
  const f = copy.form;
  const set = (patch: Partial<LibraryRecord>, clear?: string) => {
    setDraft({ ...d, ...patch });
    if (clear && errors[clear]) setErrors({ ...errors, [clear]: '' });
  };
  const setIngredient = (i: number, key: 'name' | 'role' | 'notes' | 'source', value: string) =>
    set({ ingredients: d.ingredients.map((x, j) => (j === i ? { ...x, [key]: value } : x)) });
  const setClaim = (i: number, key: 'text' | 'source', value: string) => set({ claims: d.claims.map((x, j) => (j === i ? { ...x, [key]: value } : x)) });
  const err = (id: string) => errors[id] || undefined;

  return (
    <form className={styles.form} noValidate onSubmit={(e) => e.preventDefault()}>
      {errorList.length > 0 && (
        <div id="pl-error-summary" tabIndex={-1} role="alert" className={styles.errorSummary} aria-labelledby="pl-error-heading">
          <p id="pl-error-heading" className={styles.errorHeading}>
            <CuIcon name="alert" size={16} /> {f.errorSummary(errorList.length)}
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
                  {fieldName(id)}: {text}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <fieldset className={styles.fieldset}>
        <legend className={styles.legend}>{f.overview}</legend>
        <TextInput id="pl-name" label={f.name} required value={d.name} error={err('pl-name')} onChange={(e) => set({ name: e.target.value }, 'pl-name')} />
        <div className={styles.pair}>
          <TextInput id="pl-brand" label={f.brand} required value={d.brand} error={err('pl-brand')} onChange={(e) => set({ brand: e.target.value }, 'pl-brand')} />
          <Select
            id="pl-category"
            label={f.category}
            required
            value={d.category}
            error={err('pl-category')}
            onChange={(e) => set({ category: e.target.value }, 'pl-category')}
            options={[{ value: '', label: f.chooseCategory }, ...productCategories.map((c) => ({ value: c, label: c }))]}
          />
        </div>
        <Textarea
          id="pl-description"
          label={f.description}
          helper={f.descriptionHelper(d.description.length)}
          required
          rows={3}
          value={d.description}
          error={err('pl-description')}
          onChange={(e) => set({ description: e.target.value }, 'pl-description')}
        />
        <TextInput id="pl-url" type="url" label={f.url} helper={f.urlHelper} required value={d.url} error={err('pl-url')} onChange={(e) => set({ url: e.target.value }, 'pl-url')} />
      </fieldset>

      <fieldset className={styles.fieldset}>
        <legend className={styles.legend}>{f.ingredients}</legend>
        {d.ingredients.map((ing, i) => (
          <div key={i} role="group" aria-label={f.ingredient(i + 1)} className={styles.repeat}>
            <div className={styles.repeatHead}>
              <p className={styles.caption}>{f.ingredient(i + 1)}</p>
              {d.ingredients.length > 1 && (
                <Button variant="ghost" aria-label={f.removeIngredient(i + 1, ing.name)} onClick={() => set({ ingredients: d.ingredients.filter((_, j) => j !== i) })}>
                  <CuIcon name="close" size={14} />
                </Button>
              )}
            </div>
            <div className={styles.pair}>
              <TextInput id={`pl-ing-name-${i}`} label={f.ingredientName} value={ing.name} onChange={(e) => setIngredient(i, 'name', e.target.value)} />
              <TextInput id={`pl-ing-role-${i}`} label={f.ingredientRole} value={ing.role} onChange={(e) => setIngredient(i, 'role', e.target.value)} />
            </div>
            <TextInput id={`pl-ing-notes-${i}`} label={f.ingredientNotes} value={ing.notes} onChange={(e) => setIngredient(i, 'notes', e.target.value)} />
            <TextInput id={`pl-ing-source-${i}`} type="url" label={f.ingredientSource} value={ing.source} onChange={(e) => setIngredient(i, 'source', e.target.value)} />
          </div>
        ))}
        <div>
          <Button
            onClick={() => {
              set({ ingredients: [...d.ingredients, { name: '', role: '', notes: '', source: '' }] });
              focusLater(`pl-ing-name-${d.ingredients.length}`);
            }}
          >
            <CuIcon name="plus" size={16} /> {f.addIngredient}
          </Button>
        </div>
      </fieldset>

      <fieldset className={styles.fieldset}>
        <legend className={styles.legend}>{f.claims}</legend>
        <p className={styles.caption}>{f.claimHelper}</p>
        {d.claims.map((c, i) => (
          <div key={i} role="group" aria-label={f.claim(i + 1)} className={styles.repeat}>
            <div className={styles.repeatHead}>
              <p className={styles.caption}>{f.claim(i + 1)}</p>
              {d.claims.length > 1 && (
                <Button variant="ghost" aria-label={f.removeClaim(i + 1)} onClick={() => set({ claims: d.claims.filter((_, j) => j !== i) })}>
                  <CuIcon name="close" size={14} />
                </Button>
              )}
            </div>
            <TextInput id={`pl-claim-text-${i}`} label={f.claimText} value={c.text} onChange={(e) => setClaim(i, 'text', e.target.value)} />
            <TextInput id={`pl-claim-source-${i}`} type="url" label={f.claimSource} value={c.source} onChange={(e) => setClaim(i, 'source', e.target.value)} />
          </div>
        ))}
        <div>
          <Button
            onClick={() => {
              set({ claims: [...d.claims, { text: '', source: '' }] });
              focusLater(`pl-claim-text-${d.claims.length}`);
            }}
          >
            <CuIcon name="plus" size={16} /> {f.addClaim}
          </Button>
        </div>
        <Textarea id="pl-safety" label={f.safety} helper={f.safetyHelper} rows={3} value={d.safety} onChange={(e) => set({ safety: e.target.value })} />
      </fieldset>

      <fieldset className={styles.fieldset}>
        <legend className={styles.legend}>{f.media}</legend>
        <UploadField
          id="pl-image"
          label={f.mainImage}
          value={d.image}
          showErrors
          altMissing={copy.errors.alt}
          onChange={(image) => {
            set({ image }, 'pl-image-alt');
            if (image && !d.image) focusLater('pl-image-alt');
          }}
        />
        <div className={styles.extraImages}>
          <p className={styles.caption}>{f.additionalImages}</p>
          {d.extraImages.map((im, i) => (
            <UploadField
              key={i}
              id={`pl-extra-${i}`}
              label={f.additionalImage(i + 1)}
              value={im}
              showErrors
              altMissing={copy.errors.altExtra(i + 1)}
              onChange={(next) => {
                set({ extraImages: next ? d.extraImages.map((x, j) => (j === i ? next : x)) : d.extraImages.filter((_, j) => j !== i) }, `pl-extra-${i}-alt`);
              }}
            />
          ))}
          {d.extraImages.length < MAX_EXTRA ? (
            <UploadField
              key={`add-${d.extraImages.length}`}
              id={`pl-extra-add-${d.extraImages.length}`}
              label={f.addImage}
              value={null}
              onChange={(next) => {
                if (!next) return;
                set({ extraImages: [...d.extraImages, next] });
                focusLater(`pl-extra-${d.extraImages.length}-alt`);
              }}
            />
          ) : (
            <p className={styles.caption}>{f.imagesFull}</p>
          )}
        </div>
      </fieldset>

      <fieldset className={styles.fieldset}>
        <legend className={styles.legend}>{f.guidance}</legend>
        {productGuidanceGroups.map((g) => (
          <fieldset key={g.id} className={styles.checkGroup}>
            <legend className={styles.caption}>{g.label}</legend>
            {productGuidanceOptions
              .filter((o) => o.group === g.id)
              .map((o) => {
                const on = d.links.includes(o.id);
                return (
                  <label key={o.id} className={styles.check} htmlFor={`pl-link-${o.id}`}>
                    <input
                      id={`pl-link-${o.id}`}
                      type="checkbox"
                      checked={on}
                      onChange={() => set({ links: on ? d.links.filter((x) => x !== o.id) : [...d.links, o.id] })}
                    />
                    <span>{o.title}</span>
                  </label>
                );
              })}
          </fieldset>
        ))}
      </fieldset>

      <fieldset className={styles.fieldset}>
        <legend className={styles.legend}>{f.reviewStatus}</legend>
        <dl className={styles.facts}>
          <div>
            <dt>{copy.drawer.statusLabel}</dt>
            <dd>
              <ProductStatusBadge status={d.status} />
            </dd>
          </div>
          <div>
            <dt>{copy.view.owner}</dt>
            <dd>{memberName(d.ownerId)}</dd>
          </div>
          <div>
            <dt>{copy.view.reviewer}</dt>
            <dd>{d.reviewerId ? memberName(d.reviewerId) : f.reviewerOnSubmit}</dd>
          </div>
        </dl>
      </fieldset>

      {blocked && (
        <p id="pl-alt-block" className={styles.blockNote} role="status">
          <CuIcon name="alert" size={16} /> {copy.notes.altBlocked}
        </p>
      )}
    </form>
  );
}
