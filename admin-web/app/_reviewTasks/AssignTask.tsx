'use client';

import { useState, type ReactNode } from 'react';
import { assignTaskCopy as copy, sampleAuthors, sampleSentTasks } from '../../../shared/content/assign-task';
import { workspaceItems } from '../../../shared/content/content-workspace';
import { assignableMembers, canReassign, roleNames } from '../../../shared/content/permissions';
import { memberName, teamRoster } from '../../../shared/content/team-roster';
import assignArt from '../../../shared/brand/illustrations/assign-drawer.webp';
import { DataTable } from '../../components/data/DataTable';
import { Toast } from '../../components/feedback/Toast';
import { Select } from '../../components/forms/Select';
import { TextInput } from '../../components/forms/TextInput';
import { Textarea } from '../../components/forms/Textarea';
import { Drawer } from '../../components/overlay/Drawer';
import { Button } from '../../components/ui/Button';
import { useIdentity } from '../_data/identity';
import { isSupabaseMode } from '../_data/config';
import styles from './assignTask.module.css';

type SentTask = (typeof sampleSentTasks)[number];
type Form = { task: string; contentId: string; reviewer: string; priority: string; due: string; instructions: string };
const emptyForm: Form = { task: '', contentId: '', reviewer: '', priority: 'Medium', due: '', instructions: '' };

// children: the review queue, shown between the Assign bar and the session list
export function AssignTask({ children }: { children: ReactNode }) {
  const me = useIdentity();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Form>(emptyForm);
  const [tried, setTried] = useState(false);
  const [sent, setSent] = useState<SentTask[]>(sampleSentTasks);
  const [notice, setNotice] = useState('');
  const [reassigning, setReassigning] = useState<string | null>(null);

  const author = form.contentId ? sampleAuthors[form.contentId] : undefined;
  const reviewers = assignableMembers(me.adminRole, teamRoster, author);
  const roles = Array.from(new Set(reviewers.map((r) => r.role))).map((r) => `${roleNames[r]}s`).join(' and ');
  const options = (list: typeof reviewers, none: string) => [{ value: '', label: none }, ...list.map((r) => ({ value: r.id, label: `${r.name} · ${roleNames[r.role]}` }))];
  const errors = {
    task: tried && !form.task.trim() ? copy.drawer.taskNameError : undefined,
    content: tried && !form.contentId ? copy.drawer.contentItemError : undefined,
    reviewer: tried && !form.reviewer ? copy.drawer.assignToError : undefined,
  };

  const close = () => {
    setOpen(false);
    setForm(emptyForm);
    setTried(false);
  };

  const submit = () => {
    setTried(true);
    if (!form.task.trim() || !form.contentId || !form.reviewer) return;
    setSent([{ id: `t-${sent.length}`, task: form.task.trim(), contentId: form.contentId, reviewer: form.reviewer, sentBy: me.id, priority: form.priority }, ...sent]);
    setNotice(copy.sent.assigned(form.task.trim(), memberName(form.reviewer)));
    close();
  };

  if (isSupabaseMode)
    return (
      <>
        <p className="note">{copy.supabaseNote}</p>
        {children}
      </>
    );

  return (
    <>
      {notice && <Toast tone="success" message={notice} />}
      <section className={styles.bar} aria-labelledby="assign-bar-heading">
        <div>
          <h2 id="assign-bar-heading" className={styles.eyebrow}>
            {copy.barEyebrow}
          </h2>
          <p>{copy.barText}</p>
        </div>
        <Button variant="primary" aria-haspopup="dialog" onClick={() => setOpen(true)}>
          {copy.assign}
        </Button>
      </section>

      {children}

      <section className={styles.panel} aria-labelledby="sent-heading">
        <div className={styles.panelHeader}>
          <h2 id="sent-heading" className={styles.title}>
            {copy.sent.title}
          </h2>
          <p className="note">{copy.sent.note}</p>
        </div>
        <DataTable
          caption={copy.sent.caption}
          flush
          columns={[
            { key: 'task', header: copy.sent.columns.task },
            { key: 'reviewer', header: copy.sent.columns.reviewer },
            { key: 'sentBy', header: copy.sent.columns.sentBy },
            { key: 'priority', header: copy.sent.columns.priority },
            { key: 'action', header: copy.sent.reassign },
          ]}
          rows={sent.map((t) => {
            const allowed = canReassign(me.adminRole, me.id, t);
            const contentAuthor = sampleAuthors[t.contentId];
            const pool = assignableMembers(me.adminRole, teamRoster, contentAuthor);
            return {
              id: t.id,
              cells: {
                task: t.task,
                reviewer: memberName(t.reviewer),
                sentBy: memberName(t.sentBy),
                priority: t.priority,
                action: !allowed ? (
                  <span className="note">{copy.sent.cannotReassign}</span>
                ) : reassigning === t.id ? (
                  <select
                    className={styles.inlineSelect}
                    aria-label={copy.sent.reassignTo(t.task)}
                    defaultValue=""
                    onChange={(event) => {
                      const next = event.target.value;
                      if (!next) return;
                      setSent(sent.map((s) => (s.id === t.id ? { ...s, reviewer: next } : s)));
                      setNotice(copy.sent.reassigned(t.task, memberName(next)));
                      setReassigning(null);
                    }}
                    onBlur={() => setReassigning(null)}
                    autoFocus
                  >
                    {options(pool.filter((m) => m.id !== t.reviewer), copy.drawer.assignToNone).map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <Button onClick={() => setReassigning(t.id)}>{copy.sent.reassign}</Button>
                ),
              },
            };
          })}
        />
      </section>

      <Drawer
        open={open}
        onClose={close}
        eyebrow={copy.drawer.eyebrow}
        title={copy.drawer.title}
        description={copy.drawer.description}
        footer={
          <>
            <Button onClick={close}>{copy.drawer.cancel}</Button>
            <Button variant="primary" onClick={submit}>
              {copy.drawer.submit}
            </Button>
          </>
        }
      >
        <div className={styles.form}>
          <img className={styles.art} src={assignArt.src} width={assignArt.width} height={assignArt.height} alt="" />
          <TextInput id="assign-task-name" label={copy.drawer.taskName} required error={errors.task} value={form.task} onChange={(e) => setForm({ ...form, task: e.target.value })} />
          <Select
            id="assign-content"
            label={copy.drawer.contentItem}
            error={errors.content}
            helper={author ? copy.drawer.authorNote(memberName(author)) : undefined}
            options={[{ value: '', label: copy.drawer.contentItemNone }, ...workspaceItems.map((i) => ({ value: i.id, label: `${i.title} (${i.type})` }))]}
            value={form.contentId}
            // A new item can change who may review, so the reviewer is chosen again
            onChange={(e) => setForm({ ...form, contentId: e.target.value, reviewer: '' })}
          />
          <Select
            id="assign-reviewer"
            label={copy.drawer.assignTo}
            error={errors.reviewer}
            helper={copy.drawer.assignToHelper(roles)}
            options={options(reviewers, copy.drawer.assignToNone)}
            value={form.reviewer}
            onChange={(e) => setForm({ ...form, reviewer: e.target.value })}
          />
          <div className={styles.pair}>
            <Select id="assign-priority" label={copy.drawer.priority} options={['High', 'Medium', 'Low'].map((p) => ({ value: p, label: p }))} value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })} />
            <TextInput id="assign-due" type="date" label={copy.drawer.due} value={form.due} onChange={(e) => setForm({ ...form, due: e.target.value })} />
          </div>
          <Textarea id="assign-instructions" label={copy.drawer.instructions} helper={copy.drawer.instructionsHelper} rows={4} value={form.instructions} onChange={(e) => setForm({ ...form, instructions: e.target.value })} />
        </div>
      </Drawer>
    </>
  );
}
