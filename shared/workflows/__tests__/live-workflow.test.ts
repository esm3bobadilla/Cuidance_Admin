// Live (App and Brand Website) demo workflow and role rules (Phase 2 PR 2). Run with `npm test`.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { liveUpdatesSeed, type LiveHistoryEntry } from '../../content/live';
import { applyLiveAction, canEditLive, liveActions, liveReadyCount, publishingAvailable, saveLiveUpdate, validateLiveUpdate } from '../live-workflow';
import { WorkflowError, type Actor } from '../product-workflow';

const admin: Actor = { id: 'm-b', role: 'admin' };
const superAdmin: Actor = { id: 'm-a', role: 'super_admin' };
const teamMember: Actor = { id: 'm-d', role: 'team_member' };
const update = (id: string) => liveUpdatesSeed.find((u) => u.id === id)!;

describe('Live: roles', () => {
  it('never offers Approve, Request changes, Publish or Archive to a Team Member', () => {
    for (const u of liveUpdatesSeed) {
      const a = liveActions(teamMember, u);
      for (const x of ['approve', 'requestChanges', 'publish', 'archive'] as const) assert.ok(!a.includes(x), `${x} on ${u.id}`);
      assert.ok(a.includes('viewPreview'));
    }
  });

  it('lets a Team Member edit and submit only their own updates', () => {
    assert.ok(canEditLive(teamMember, update('a4'))); // m-d draft
    assert.ok(!canEditLive(teamMember, { ...update('a4'), ownerId: 'm-e' }));
    assert.equal(applyLiveAction(teamMember, update('a4'), 'submit').status, 'review');
  });

  it('keeps reviewer separation for approvals', () => {
    assert.ok(liveActions(admin, update('a1')).includes('approve'));
    assert.ok(!liveActions(admin, { ...update('a1'), ownerId: admin.id }).includes('approve'));
  });
});

describe('Live: publishing stays unavailable', () => {
  it('is turned off everywhere', () => {
    assert.equal(publishingAvailable, false);
  });
  it('is listed for Admins on ready updates but always refused', () => {
    assert.ok(liveActions(superAdmin, update('a2')).includes('publish'));
    assert.throws(() => applyLiveAction(superAdmin, update('a2'), 'publish'), /unavailable in demo mode/);
  });
});

describe('Live: status changes', () => {
  it('approves into Ready to publish and records history', () => {
    const u = applyLiveAction(admin, update('a1'), 'approve');
    assert.equal(u.status, 'ready');
    assert.equal(u.history[0].what, 'Approved');
  });
  it('requires a note to request changes', () => {
    assert.throws(() => applyLiveAction(admin, update('w1'), 'requestChanges', ''), WorkflowError);
    assert.equal(applyLiveAction(admin, update('w1'), 'requestChanges', 'Shorter headline.').changeNote, 'Shorter headline.');
  });
  it('archives (Admins), and never archives published updates', () => {
    assert.equal(applyLiveAction(admin, update('a4'), 'archive').status, 'archived');
    assert.ok(!liveActions(admin, update('a5')).includes('archive'));
  });
  it('saves a prepared update as a draft owned by its author', () => {
    const u = saveLiveUpdate(teamMember, { ...update('a4'), id: 'n', ownerId: '', history: [] as LiveHistoryEntry[] }, 'draft', true);
    assert.equal(u.ownerId, teamMember.id);
    assert.equal(u.history[0].what, 'Draft created');
    assert.deepEqual(Object.keys(validateLiveUpdate({ title: ' ', summary: '' }, { title: 't', summary: 's' })), ['lv-title', 'lv-summary']);
  });
  it('counts updates ready to publish for the Dashboard', () => {
    assert.equal(liveReadyCount(liveUpdatesSeed, 'app'), 1);
    assert.equal(liveReadyCount(liveUpdatesSeed, 'website'), 1);
  });
});
