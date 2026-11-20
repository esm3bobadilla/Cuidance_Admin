// Email demo workflow and role rules (Phase 2 PR 2). Run with `npm test` in admin-web.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { emailCopy, emailSeed } from '../../content/email';
import {
  cancelScheduledEmail,
  deleteEmail,
  duplicateEmail,
  emailActions,
  emailAltMissing,
  formatScheduleTime,
  saveEmailDraft,
  scheduledEmailCount,
  scheduleEmail,
  scheduleTimeOk,
  sendEmail,
  templateActions,
  validateEmail,
} from '../email-workflow';
import { WorkflowError, type Actor } from '../product-workflow';

const admin: Actor = { id: 'm-b', role: 'admin' };
const superAdmin: Actor = { id: 'm-a', role: 'super_admin' };
const teamMember: Actor = { id: 'm-d', role: 'team_member' };
const doc = (id: string) => emailSeed.find((d) => d.id === id)!;
const ownDraft = doc('e1'); // owned by m-d
const otherDraft = doc('e2'); // owned by m-b
const scheduled = doc('e3');

describe('Email: roles', () => {
  it('never offers Send, Schedule or Cancel scheduled to a Team Member', () => {
    for (const d of emailSeed) {
      const a = emailActions(teamMember, d);
      for (const x of ['send', 'schedule', 'cancelScheduled'] as const) assert.ok(!a.includes(x), `${x} on ${d.id}`);
    }
    assert.throws(() => sendEmail(teamMember, ownDraft), WorkflowError);
    assert.throws(() => scheduleEmail(teamMember, ownDraft, 'Jan 1, 9:00 AM'), WorkflowError);
    assert.throws(() => cancelScheduledEmail(teamMember, scheduled), WorkflowError);
  });

  it('lets a Team Member edit, save and delete only their own drafts', () => {
    assert.ok(emailActions(teamMember, ownDraft).includes('edit'));
    assert.ok(emailActions(teamMember, ownDraft).includes('delete'));
    assert.ok(!emailActions(teamMember, otherDraft).includes('edit'));
    assert.throws(() => deleteEmail(teamMember, emailSeed, otherDraft.id), WorkflowError);
    assert.equal(saveEmailDraft(teamMember, ownDraft).status, 'draft');
  });

  it('lets everyone preview and duplicate; a copy belongs to whoever made it', () => {
    const copy = duplicateEmail(teamMember, doc('e6'), 'new-1', ' (copy)');
    assert.equal(copy.status, 'draft');
    assert.equal(copy.ownerId, teamMember.id);
    assert.equal(copy.name, 'Invite · Team member E (copy)');
  });

  it('keeps template archive and restore for Admins and Super Admins', () => {
    assert.ok(!templateActions(teamMember, false).includes('archive'));
    assert.deepEqual(templateActions(teamMember, true), []);
    assert.ok(templateActions(admin, false).includes('archive'));
    assert.deepEqual(templateActions(superAdmin, true), ['restore']);
  });
});

describe('Email: demo send and schedule', () => {
  it('marks a sent email as not delivered, and makes it read-only', () => {
    const sent = sendEmail(admin, otherDraft);
    assert.equal(sent.status, 'sent');
    assert.match(sent.when, /not delivered/);
    assert.ok(!emailActions(admin, sent).includes('edit'));
  });

  it('schedules and cancels back to a draft', () => {
    const s = scheduleEmail(admin, otherDraft, formatScheduleTime('2027-01-15T09:30'));
    assert.equal(s.status, 'scheduled');
    assert.equal(s.when, 'Jan 15, 9:30 AM');
    const c = cancelScheduledEmail(admin, s);
    assert.equal(c.status, 'draft');
    assert.equal(c.when, '');
  });

  it('only accepts a schedule time in the future', () => {
    const now = new Date('2026-11-20T12:00').getTime();
    assert.ok(!scheduleTimeOk('', now));
    assert.ok(!scheduleTimeOk('2026-11-19T09:00', now));
    assert.ok(scheduleTimeOk('2026-11-21T09:00', now));
  });

  it('counts scheduled email for the Dashboard', () => {
    assert.equal(scheduledEmailCount(emailSeed), 3);
    assert.equal(scheduledEmailCount([...emailSeed, scheduleEmail(admin, otherDraft, 'x')]), 4);
  });

  it('removes a deleted draft', () => {
    assert.ok(!deleteEmail(admin, emailSeed, otherDraft.id).some((d) => d.id === otherDraft.id));
  });
});

describe('Email: validation', () => {
  const m = emailCopy.errors;
  const base = { name: 'N', subject: 'S', link: 'https://example.com/x', image: null, templateAlt: 'Illustration of a bell' };
  it('requires alt text for an uploaded image or the template image', () => {
    assert.ok(emailAltMissing({ image: { alt: '  ' }, templateAlt: 'x' }));
    assert.ok(emailAltMissing({ image: null, templateAlt: ' ' }));
    assert.ok(!emailAltMissing({ image: { alt: 'A bell' }, templateAlt: '' }));
  });
  it('checks name, subject and an https link', () => {
    assert.deepEqual(validateEmail(base, m), {});
    assert.deepEqual(Object.keys(validateEmail({ ...base, name: '', subject: ' ', link: 'http://example.com' }, m)).sort(), ['em-link', 'em-name', 'em-subject']);
  });
});
