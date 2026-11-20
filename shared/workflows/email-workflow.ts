/*
 * Email demo workflow (Phase 2 PR 2). Pure rules, tested in shared/workflows/__tests__.
 *
 * DEMO MODE: no email provider is connected (D6, Option C). "Send" and "Schedule" only
 * change the demo status; nothing is delivered or queued anywhere.
 *
 * Roles (permissions.ts): everyone drafts, previews and duplicates. Team Members edit and
 * delete only their own drafts. Only Super Admins and Admins send, schedule, cancel
 * scheduled email and archive or restore templates.
 */

import type { EmailDoc } from '../content/email';
import { can } from '../content/permissions';
import { WorkflowError, type Actor } from './product-workflow';

export type EmailAction = 'edit' | 'saveDraft' | 'send' | 'schedule' | 'cancelScheduled' | 'delete' | 'duplicate' | 'preview';
export type TemplateAction = 'preview' | 'use' | 'duplicate' | 'archive' | 'restore';

// A draft not yet saved (id '') belongs to the person writing it
export function canEditEmail(actor: Actor, d: Pick<EmailDoc, 'id' | 'status' | 'ownerId'>) {
  const rights = can(actor.role);
  return !!rights && d.status === 'draft' && (d.id === '' || rights.emailManageTemplates || d.ownerId === actor.id);
}

export function emailActions(actor: Actor, d: Pick<EmailDoc, 'id' | 'status' | 'ownerId'>): EmailAction[] {
  const rights = can(actor.role);
  if (!rights) return [];
  const actions: EmailAction[] = ['preview', 'duplicate'];
  const editable = canEditEmail(actor, d);
  if (editable) actions.push('edit', 'saveDraft');
  if (editable && d.id !== '') actions.push('delete');
  if (editable && rights.emailSchedule) actions.push('schedule');
  if (editable && rights.emailSend) actions.push('send');
  if (d.status === 'scheduled' && rights.emailManageTemplates) actions.push('cancelScheduled');
  return actions;
}

export function templateActions(actor: Actor, archived: boolean): TemplateAction[] {
  const rights = can(actor.role);
  if (!rights) return [];
  if (archived) return rights.emailManageTemplates ? ['restore'] : [];
  return rights.emailManageTemplates ? ['preview', 'use', 'duplicate', 'archive'] : ['preview', 'use', 'duplicate'];
}

const allow = (ok: boolean, action: string) => {
  if (!ok) throw new WorkflowError(`"${action}" is not available for this email.`);
};

export function sendEmail<T extends EmailDoc>(actor: Actor, d: T): T {
  allow(emailActions(actor, d).includes('send'), 'send');
  return { ...d, status: 'sent', when: 'Sent just now (demo, not delivered)' };
}

export function scheduleEmail<T extends EmailDoc>(actor: Actor, d: T, whenLabel: string): T {
  allow(emailActions(actor, d).includes('schedule'), 'schedule');
  return { ...d, status: 'scheduled', when: whenLabel };
}

export function cancelScheduledEmail<T extends EmailDoc>(actor: Actor, d: T): T {
  allow(emailActions(actor, d).includes('cancelScheduled'), 'cancelScheduled');
  return { ...d, status: 'draft', when: '' };
}

export function saveEmailDraft<T extends EmailDoc>(actor: Actor, d: T): T {
  allow(emailActions(actor, d).includes('saveDraft'), 'saveDraft');
  return { ...d, status: 'draft', when: '' };
}

// A copy is always a new draft owned by the person who made it
export function duplicateEmail<T extends EmailDoc>(actor: Actor, d: T, newId: string, suffix: string): T {
  allow(emailActions(actor, d).includes('duplicate'), 'duplicate');
  return { ...d, id: newId, name: `${d.name}${suffix}`, status: 'draft', when: '', ownerId: actor.id };
}

export function deleteEmail<T extends EmailDoc>(actor: Actor, all: T[], id: string): T[] {
  const d = all.find((x) => x.id === id);
  allow(!!d && emailActions(actor, d).includes('delete'), 'delete');
  return all.filter((x) => x.id !== id);
}

// ---------- validation

export type EmailFields = { name: string; subject: string; link: string; image: { alt: string } | null; templateAlt: string };
export type EmailMessages = { name: string; subject: string; link: string; alt: string; templateAlt: string };

export const emailLinkOk = (v: string) => !v.trim() || /^https:\/\/[^\s/.]+\.[^\s]+$/i.test(v.trim());

// The uploaded image, or the template illustration when nothing is uploaded, needs alt text
export const emailAltMissing = (f: Pick<EmailFields, 'image' | 'templateAlt'>) => (f.image ? !f.image.alt.trim() : !f.templateAlt.trim());

export function validateEmail(f: EmailFields, m: EmailMessages): Record<string, string> {
  const e: Record<string, string> = {};
  if (!f.name.trim()) e['em-name'] = m.name;
  if (!f.subject.trim()) e['em-subject'] = m.subject;
  if (!emailLinkOk(f.link)) e['em-link'] = m.link;
  if (f.image && !f.image.alt.trim()) e['em-image-alt'] = m.alt;
  if (!f.image && !f.templateAlt.trim()) e['em-template-alt'] = m.templateAlt;
  return e;
}

// A schedule time must be a real date and time in the future
export function scheduleTimeOk(value: string, now: number) {
  const t = new Date(value).getTime();
  return !!value && !Number.isNaN(t) && t > now;
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
// "2027-01-15T09:30" -> "Jan 15, 9:30 AM"
export function formatScheduleTime(value: string) {
  const [d, t] = value.split('T');
  const [, mo, da] = d.split('-').map(Number);
  const [h24, mi] = t.split(':').map(Number);
  return `${MONTHS[mo - 1]} ${da}, ${h24 % 12 || 12}:${String(mi).padStart(2, '0')} ${h24 >= 12 ? 'PM' : 'AM'}`;
}

export const scheduledEmailCount = (docs: Pick<EmailDoc, 'status'>[]) => docs.filter((d) => d.status === 'scheduled').length;
