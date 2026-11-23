/*
 * Product Library demo workflow (Phase 2 PR 2). Pure rules, no screen code, so they can
 * be tested on their own (shared/workflows/__tests__) and reused by the Supabase version
 * in a later phase.
 *
 * Who may do what follows the permission matrix (permissions.ts):
 * - Everyone creates records; Super Admins and Admins edit any, Team Members only their own.
 * - Only Super Admins and Admins approve, request changes, archive and restore.
 * - No one approves or requests changes on a record they own (reviewer separation).
 * These checks shape the demo. In production the database must enforce them too.
 */

import { can, type AdminRoleId } from '../content/permissions';
import { categoryMatches } from '../content/product-categories';
import type { ProductRecord, ProductStatus } from '../content/product-library';

export type Actor = { id: string; role: AdminRoleId | null };

export type ProductAction = 'edit' | 'submit' | 'approve' | 'requestChanges' | 'archive' | 'restore';

export class WorkflowError extends Error {}

export function canEditProduct(actor: Actor, r: Pick<ProductRecord, 'status' | 'ownerId'>) {
  const rights = can(actor.role);
  return !!rights && r.status !== 'archived' && (rights.productEditAny || r.ownerId === actor.id);
}

// The actions this person can take on a record right now, in the order the drawer shows them
export function productActions(actor: Actor, r: Pick<ProductRecord, 'status' | 'ownerId'>): ProductAction[] {
  const rights = can(actor.role);
  if (!rights) return [];
  const actions: ProductAction[] = [];
  const editable = canEditProduct(actor, r);
  const own = r.ownerId === actor.id;
  if (editable) actions.push('edit');
  if ((r.status === 'draft' || r.status === 'changes') && editable) actions.push('submit');
  if (r.status === 'review' && rights.productReview && !own) actions.push('approve', 'requestChanges');
  if (r.status !== 'archived' && rights.productArchive) actions.push('archive');
  if (r.status === 'archived' && rights.productArchive) actions.push('restore');
  return actions;
}

const next: Record<ProductAction, ProductStatus | null> = {
  edit: null,
  submit: 'review',
  approve: 'approved',
  requestChanges: 'changes',
  archive: 'archived',
  restore: 'draft',
};

// Applies one action, after checking it is allowed. Request changes needs a written note.
export function applyProductAction<T extends ProductRecord>(actor: Actor, r: T, action: Exclude<ProductAction, 'edit'>, note = ''): T {
  if (!productActions(actor, r).includes(action)) throw new WorkflowError(`"${action}" is not available for this record.`);
  if (action === 'requestChanges' && !note.trim()) throw new WorkflowError('A note is required to request changes.');
  const status = next[action]!;
  return {
    ...r,
    status,
    updatedDaysAgo: 0,
    reviewerId: action === 'approve' || action === 'requestChanges' ? actor.id : r.reviewerId,
    changeNote: action === 'requestChanges' ? note.trim() : action === 'submit' || action === 'approve' ? '' : r.changeNote,
  };
}

// Saving from the form: a draft, or straight into review. Saving an approved or in-review
// record as a draft puts it back to Draft until it is approved again.
export function saveProduct<T extends ProductRecord>(actor: Actor, r: T, to: 'draft' | 'review', isNew: boolean): T {
  if (!isNew && !canEditProduct(actor, r)) throw new WorkflowError('This record cannot be edited by you.');
  if (isNew && !can(actor.role)) throw new WorkflowError('Sign in to create records.');
  return { ...r, ownerId: isNew ? actor.id : r.ownerId, status: to, updatedDaysAgo: 0, changeNote: to === 'review' ? '' : r.changeNote };
}

// ---------- validation

export type ProductFields = {
  name: string;
  brand: string;
  category: string;
  description: string;
  url: string;
  image: { alt: string } | null;
  extraImages: { alt: string }[];
};

export const productFieldIds = {
  name: 'pl-name',
  brand: 'pl-brand',
  category: 'pl-category',
  description: 'pl-description',
  url: 'pl-url',
  imageAlt: 'pl-image-alt',
  extraAlt: (i: number) => `pl-extra-${i}-alt`,
};

export type ProductMessages = {
  name: string;
  brand: string;
  category: string;
  description: string;
  descriptionLong: string;
  url: string;
  urlFormat: string;
  alt: string;
  altExtra: (n: number) => string;
};

export const productUrlOk = (value: string) => /^https?:\/\/[^\s/.]+\.[^\s]+$/i.test(value.trim());

// Alt text is required for every uploaded image; spaces alone don't count
export function productAltMissing(f: Pick<ProductFields, 'image' | 'extraImages'>) {
  return (!!f.image && !f.image.alt.trim()) || f.extraImages.some((im) => !im.alt.trim());
}

export function validateProduct(f: ProductFields, m: ProductMessages): Record<string, string> {
  const e: Record<string, string> = {};
  const id = productFieldIds;
  if (!f.name.trim()) e[id.name] = m.name;
  if (!f.brand.trim()) e[id.brand] = m.brand;
  if (!f.category) e[id.category] = m.category;
  if (!f.description.trim()) e[id.description] = m.description;
  else if (f.description.length > 200) e[id.description] = m.descriptionLong;
  if (!f.url.trim()) e[id.url] = m.url;
  else if (!productUrlOk(f.url)) e[id.url] = m.urlFormat;
  if (f.image && !f.image.alt.trim()) e[id.imageAlt] = m.alt;
  f.extraImages.forEach((im, i) => {
    if (!im.alt.trim()) e[id.extraAlt(i)] = m.altExtra(i + 1);
  });
  return e;
}

// ---------- search, filters and sort

export type ProductFilters = { query: string; brand: string; category: string; status: string; link: string; sort: 'new' | 'old' | 'name' };

export function filterProducts<T extends ProductRecord>(records: T[], f: ProductFilters): T[] {
  const q = f.query.trim().toLowerCase();
  return records
    .filter((r) => f.brand === 'all' || r.brand === f.brand)
    // A department or category filter also matches everything under it
    .filter((r) => f.category === 'all' || categoryMatches(r.category, f.category))
    .filter((r) => (f.status === 'all' ? true : f.status === 'active' ? r.status !== 'archived' : r.status === f.status))
    .filter((r) => (f.link === 'all' ? true : f.link === 'any' ? r.links.length > 0 : f.link === 'none' ? r.links.length === 0 : r.links.includes(f.link)))
    .filter((r) => !q || `${r.name} ${r.brand} ${r.ingredients.map((i) => i.name).join(' ')}`.toLowerCase().includes(q))
    .sort((a, b) => (f.sort === 'new' ? a.updatedDaysAgo - b.updatedDaysAgo : f.sort === 'old' ? b.updatedDaysAgo - a.updatedDaysAgo : a.name.localeCompare(b.name)));
}

export const productsAwaitingApproval = (records: Pick<ProductRecord, 'status'>[]) => records.filter((r) => r.status === 'review').length;
