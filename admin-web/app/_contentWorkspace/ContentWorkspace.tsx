'use client';

import { useEffect, useMemo, useState } from 'react';
import { adminScreens } from '../../../shared/content/admin-web-screens';
import {
  contentWorkspaceCopy as copy,
  workspaceAreas,
  workspaceItems,
  workspaceStatuses,
  workspaceTypes,
  type WorkspaceItem,
  type WorkspaceType,
} from '../../../shared/content/content-workspace';
import { assignableMembers, roleNames } from '../../../shared/content/permissions';
import { teamRoster } from '../../../shared/content/team-roster';
import catArticles from '../../../shared/brand/illustrations/content-categories/cat-articles.webp';
import catMedia from '../../../shared/brand/illustrations/content-categories/cat-media.webp';
import catProduct from '../../../shared/brand/illustrations/content-categories/cat-product.webp';
import catQuiz from '../../../shared/brand/illustrations/content-categories/cat-quiz.webp';
import catReview from '../../../shared/brand/illustrations/content-categories/cat-review.webp';
import catSaved from '../../../shared/brand/illustrations/content-categories/cat-saved.webp';
import emptyContent from '../../../shared/brand/illustrations/empty/empty-content.webp';
import { DataTable } from '../../components/data/DataTable';
import { Toast } from '../../components/feedback/Toast';
import { Select } from '../../components/forms/Select';
import { TextInput } from '../../components/forms/TextInput';
import { Textarea } from '../../components/forms/Textarea';
import { Drawer } from '../../components/overlay/Drawer';
import { Button } from '../../components/ui/Button';
import { Chip } from '../../components/ui/Chip';
import { CuIcon } from '../../components/ui/CuIcon';
import { useIdentity } from '../_data/identity';
import styles from './contentWorkspace.module.css';

const base = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
const tiles = { quiz: catQuiz, articles: catArticles, product: catProduct, review: catReview, saved: catSaved, media: catMedia };
const toggle = <T,>(list: T[], value: T) => (list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);

type Draft = { title: string; type: WorkspaceType; body: string; reviewer: string; priority: string; due: string };
const emptyDraft: Draft = { title: '', type: 'Guidance', body: '', reviewer: '', priority: 'Medium', due: '' };

export function ContentWorkspace() {
  const me = useIdentity();
  const [items, setItems] = useState<WorkspaceItem[]>(workspaceItems);
  const [query, setQuery] = useState('');
  const [types, setTypes] = useState<WorkspaceType[]>([]);
  const [statuses, setStatuses] = useState<string[]>([]);
  const [filterOpen, setFilterOpen] = useState(false);
  // Choices inside the filter drawer apply when "Show results" is pressed
  const [pendingTypes, setPendingTypes] = useState<WorkspaceType[]>([]);
  const [pendingStatuses, setPendingStatuses] = useState<string[]>([]);
  const [editorOpen, setEditorOpen] = useState(false);
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [tried, setTried] = useState<'none' | 'draft' | 'send'>('none');
  const [notice, setNotice] = useState('');

  // The Dashboard's "New content" shortcut opens the editor (?new=1)
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get('new') === '1') setEditorOpen(true);
  }, []);

  const reviewers = assignableMembers(me.adminRole, teamRoster, me.id);
  const reviewerRoles = Array.from(new Set(reviewers.map((r) => r.role))).map((r) => `${roleNames[r]}s`).join(' or ');

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter(
      (item) =>
        (!q || item.title.toLowerCase().includes(q) || item.type.toLowerCase().includes(q)) &&
        (types.length === 0 || types.includes(item.type)) &&
        (statuses.length === 0 || statuses.includes(item.status)),
    );
  }, [items, query, types, statuses]);

  const activeFilters = types.length + statuses.length;
  const titleError = tried !== 'none' && !draft.title.trim() ? copy.editor.titleError : undefined;
  const reviewerError = tried === 'send' && !draft.reviewer ? copy.editor.reviewerError : undefined;

  const closeEditor = () => {
    setEditorOpen(false);
    setDraft(emptyDraft);
    setTried('none');
  };

  const save = (send: boolean) => {
    setTried(send ? 'send' : 'draft');
    if (!draft.title.trim() || (send && !draft.reviewer)) return;
    const who = teamRoster.find((m) => m.id === draft.reviewer)?.name ?? '';
    setItems([
      { id: `new-${items.length}`, title: draft.title.trim(), type: draft.type, screen: 'content', status: send ? 'In review' : 'Draft', updated: 'Just now', partner: draft.type === 'Partner' },
      ...items,
    ]);
    setNotice(send ? copy.editor.sent(draft.title.trim(), who) : copy.editor.savedDraft(draft.title.trim()));
    closeEditor();
  };

  const rows = shown.map((item) => ({
    id: item.id,
    cells: {
      title:
        item.screen === 'content' ? (
          <strong>{item.title}</strong>
        ) : (
          <a className={styles.rowLink} href={`${base}${adminScreens[item.screen].path}`}>
            {item.title}
          </a>
        ),
      type: (
        <span className={styles.type}>
          {item.type}
          {item.partner && <span className={styles.partner}>{copy.partnerLabel}</span>}
        </span>
      ),
      status: <span className={styles.status}>{item.status}</span>,
      updated: item.updated,
    },
  }));

  return (
    <>
      {notice && <Toast tone="success" message={notice} />}

      <section className={styles.library} aria-labelledby="library-heading">
        <div>
          <h2 id="library-heading" className={styles.eyebrow}>
            {copy.libraryEyebrow}
          </h2>
          <p>{copy.libraryText}</p>
        </div>
        <Button variant="primary" onClick={() => setEditorOpen(true)} aria-haspopup="dialog">
          <span className={styles.buttonIcon}>
            <CuIcon name="plus" size={16} />
            {copy.newContent}
          </span>
        </Button>
      </section>

      <section className={styles.panel} aria-labelledby="workspace-heading">
        <div className={styles.panelHeader}>
          <h2 id="workspace-heading" className={styles.title}>
            {copy.workspaceTitle}
          </h2>
          <p className={styles.count} role="status">
            {copy.count(shown.length, items.length)}
          </p>
        </div>
        <div className={styles.tools}>
          <label className={styles.search}>
            <span className="visually-hidden">{copy.searchLabel}</span>
            <CuIcon name="search" size={18} />
            <input
              type="search"
              className={styles.searchInput}
              placeholder={copy.searchPlaceholder}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </label>
          <button
            type="button"
            className={styles.filterButton}
            aria-haspopup="dialog"
            onClick={() => {
              setPendingTypes(types);
              setPendingStatuses(statuses);
              setFilterOpen(true);
            }}
          >
            <CuIcon name="filter" size={18} />
            {activeFilters ? copy.filterCount(activeFilters) : copy.filter}
          </button>
        </div>
        {shown.length ? (
          <DataTable
            caption={copy.tableCaption}
            columns={[
              { key: 'title', header: copy.columns.title },
              { key: 'type', header: copy.columns.type },
              { key: 'status', header: copy.columns.status },
              { key: 'updated', header: copy.columns.updated },
            ]}
            rows={rows}
            flush
          />
        ) : (
          <div className={styles.empty}>
            <img src={emptyContent.src} width={120} height={Math.round((120 * emptyContent.height) / emptyContent.width)} alt="" />
            <p>{copy.noResults}</p>
            <Button
              onClick={() => {
                setQuery('');
                setTypes([]);
                setStatuses([]);
              }}
            >
              {copy.clearAll}
            </Button>
          </div>
        )}
      </section>

      <section className={styles.areasSection} aria-labelledby="areas-heading">
        <h2 id="areas-heading" className={styles.title}>
          {copy.areasTitle}
        </h2>
        <ul className={styles.areas}>
          {workspaceAreas.map((area) => (
            <li key={area.screen}>
              <a className={styles.area} href={`${base}${adminScreens[area.screen].path}`}>
                <img src={tiles[area.image].src} width={56} height={56} alt="" className={styles.areaArt} />
                <span className={styles.areaText}>
                  <span className={styles.areaName}>{adminScreens[area.screen].name}</span>
                  <span className={styles.areaNote}>{area.note}</span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </section>

      <Drawer
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        eyebrow={copy.filterDrawer.eyebrow}
        title={copy.filterDrawer.title}
        footer={
          <>
            <Button
              onClick={() => {
                setPendingTypes([]);
                setPendingStatuses([]);
              }}
            >
              {copy.filterDrawer.reset}
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                setTypes(pendingTypes);
                setStatuses(pendingStatuses);
                setFilterOpen(false);
              }}
            >
              {copy.filterDrawer.apply}
            </Button>
          </>
        }
      >
        <fieldset className={styles.chipGroup}>
          <legend className={styles.legend}>{copy.filterDrawer.type}</legend>
          {workspaceTypes.map((t) => (
            <Chip key={t} label={t} selected={pendingTypes.includes(t)} onClick={() => setPendingTypes(toggle(pendingTypes, t))} />
          ))}
        </fieldset>
        <fieldset className={styles.chipGroup}>
          <legend className={styles.legend}>{copy.filterDrawer.status}</legend>
          {workspaceStatuses.map((s) => (
            <Chip key={s} label={s} selected={pendingStatuses.includes(s)} onClick={() => setPendingStatuses(toggle(pendingStatuses, s))} />
          ))}
        </fieldset>
      </Drawer>

      <Drawer
        open={editorOpen}
        onClose={closeEditor}
        eyebrow={copy.editor.eyebrow}
        title={copy.editor.title}
        description={copy.editor.description}
        footer={
          <>
            <Button onClick={() => save(false)}>{copy.editor.saveDraft}</Button>
            <Button variant="primary" onClick={() => save(true)}>
              {copy.editor.send}
            </Button>
          </>
        }
      >
        <div className={styles.form}>
          <TextInput
            id="new-content-title"
            label={copy.editor.titleLabel}
            required
            error={titleError}
            value={draft.title}
            onChange={(event) => setDraft({ ...draft, title: event.target.value })}
          />
          <Select
            id="new-content-type"
            label={copy.editor.typeLabel}
            options={workspaceTypes.map((t) => ({ value: t, label: t }))}
            value={draft.type}
            onChange={(event) => setDraft({ ...draft, type: event.target.value as WorkspaceType })}
          />
          <Textarea
            id="new-content-body"
            label={copy.editor.bodyLabel}
            helper={copy.editor.bodyHelper}
            rows={6}
            value={draft.body}
            onChange={(event) => setDraft({ ...draft, body: event.target.value })}
          />
          <Select
            id="new-content-reviewer"
            label={copy.editor.reviewerLabel}
            helper={copy.editor.reviewerHelper(reviewerRoles)}
            error={reviewerError}
            options={[{ value: '', label: copy.editor.reviewerNone }, ...reviewers.map((r) => ({ value: r.id, label: `${r.name} · ${roleNames[r.role]}` }))]}
            value={draft.reviewer}
            onChange={(event) => setDraft({ ...draft, reviewer: event.target.value })}
          />
          <div className={styles.pair}>
            <Select
              id="new-content-priority"
              label={copy.editor.priorityLabel}
              options={['High', 'Medium', 'Low'].map((p) => ({ value: p, label: p }))}
              value={draft.priority}
              onChange={(event) => setDraft({ ...draft, priority: event.target.value })}
            />
            <TextInput
              id="new-content-due"
              type="date"
              label={copy.editor.dueLabel}
              value={draft.due}
              onChange={(event) => setDraft({ ...draft, due: event.target.value })}
            />
          </div>
        </div>
      </Drawer>
    </>
  );
}
