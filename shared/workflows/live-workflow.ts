/*
 * Live (Cuidance App and Brand Website) demo workflow (Phase 2 PR 2). Pure rules, tested in
 * shared/workflows/__tests__.
 *
 * PUBLISHING IS UNAVAILABLE: no App push or website publishing is connected. Publish is
 * listed for Super Admins and Admins on updates that are ready, but always as unavailable,
 * and applying it is refused.
 *
 * Roles (permissions.ts): everyone views previews, prepares updates and submits them;
 * Team Members edit only their own. Only Super Admins and Admins approve, request changes
 * and archive. No one approves their own update.
 */

import type { LiveStatus, LiveUpdate } from '../content/live';
import { can } from '../content/permissions';
import { WorkflowError, type Actor } from './product-workflow';

export type LiveAction = 'viewPreview' | 'edit' | 'submit' | 'approve' | 'requestChanges' | 'archive' | 'publish';

// Publishing is not connected in demo mode (or anywhere yet)
export const publishingAvailable = false;

export function canEditLive(actor: Actor, u: Pick<LiveUpdate, 'status' | 'ownerId'>) {
  const rights = can(actor.role);
  return !!rights && (u.status === 'draft' || u.status === 'changes') && (rights.liveApprove || u.ownerId === actor.id);
}

export function liveActions(actor: Actor, u: Pick<LiveUpdate, 'status' | 'ownerId'>): LiveAction[] {
  const rights = can(actor.role);
  if (!rights) return [];
  const actions: LiveAction[] = ['viewPreview'];
  const editable = canEditLive(actor, u);
  if (editable) actions.push('edit', 'submit');
  if (u.status === 'review' && rights.liveApprove && u.ownerId !== actor.id) actions.push('approve', 'requestChanges');
  if (u.status === 'ready' && rights.livePublish) actions.push('publish');
  if (rights.liveArchive && u.status !== 'archived' && u.status !== 'published') actions.push('archive');
  return actions;
}

const next: Record<Exclude<LiveAction, 'viewPreview' | 'edit' | 'publish'>, LiveStatus> = {
  submit: 'review',
  approve: 'ready',
  requestChanges: 'changes',
  archive: 'archived',
};
const historyLabel: Record<keyof typeof next, string> = {
  submit: 'Submitted for review',
  approve: 'Approved',
  requestChanges: 'Changes requested',
  archive: 'Archived',
};

export function applyLiveAction<T extends LiveUpdate>(actor: Actor, u: T, action: Exclude<LiveAction, 'viewPreview' | 'edit'>, note = ''): T {
  if (action === 'publish') throw new WorkflowError('Publishing is unavailable in demo mode.');
  if (!liveActions(actor, u).includes(action)) throw new WorkflowError(`"${action}" is not available for this update.`);
  if (action === 'requestChanges' && !note.trim()) throw new WorkflowError('A note is required to request changes.');
  return {
    ...u,
    status: next[action],
    updated: 'Just now',
    changeNote: action === 'requestChanges' ? note.trim() : action === 'submit' || action === 'approve' ? '' : u.changeNote,
    history: [{ what: historyLabel[action], whoId: actor.id, when: 'Just now' }, ...u.history],
  };
}

// Prepare or edit an update from the form, as a draft or straight into review
export function saveLiveUpdate<T extends LiveUpdate>(actor: Actor, u: T, to: 'draft' | 'review', isNew: boolean): T {
  if (!can(actor.role)) throw new WorkflowError('Sign in to prepare updates.');
  if (!isNew && !canEditLive(actor, u)) throw new WorkflowError('This update cannot be edited by you.');
  const what = to === 'review' ? 'Submitted for review' : isNew ? 'Draft created' : 'Draft saved';
  return {
    ...u,
    ownerId: isNew ? actor.id : u.ownerId,
    status: to,
    updated: 'Just now',
    changeNote: to === 'review' ? '' : u.changeNote,
    history: [{ what, whoId: actor.id, when: 'Just now' }, ...u.history],
  };
}

export function validateLiveUpdate(u: Pick<LiveUpdate, 'title' | 'summary'>, m: { title: string; summary: string }) {
  const e: Record<string, string> = {};
  if (!u.title.trim()) e['lv-title'] = m.title;
  if (!u.summary.trim()) e['lv-summary'] = m.summary;
  return e;
}

export const liveReadyCount = (updates: Pick<LiveUpdate, 'status' | 'surface'>[], surface: LiveUpdate['surface']) =>
  updates.filter((u) => u.surface === surface && u.status === 'ready').length;
