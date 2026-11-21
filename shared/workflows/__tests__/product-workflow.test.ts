// Product Library demo workflow and role rules (Phase 2 PR 2). Run with `npm test` in admin-web.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { productLibraryCopy, productSeed, type ProductRecord } from '../../content/product-library';
import {
  applyProductAction,
  canEditProduct,
  filterProducts,
  productActions,
  productAltMissing,
  productsAwaitingApproval,
  saveProduct,
  validateProduct,
  WorkflowError,
  type Actor,
} from '../product-workflow';

const superAdmin: Actor = { id: 'm-a', role: 'super_admin' };
const admin: Actor = { id: 'm-b', role: 'admin' };
const teamMember: Actor = { id: 'm-d', role: 'team_member' };
const noAccess: Actor = { id: 'x', role: null };
const record = (id: string) => productSeed.find((p) => p.id === id)!;
const inReview = record('pl2'); // owned by m-d, the only record in review
// The reference products have no archived record, so the tests archive one themselves
const archived: ProductRecord = { ...record('pl4'), id: 'archived-sample', status: 'archived' }; // owned by m-e
const restricted = ['approve', 'requestChanges', 'archive', 'restore'] as const;

describe('Product Library: roles', () => {
  it('never offers Approve, Request changes, Archive or Restore to a Team Member', () => {
    for (const r of productSeed) {
      const actions = productActions(teamMember, r);
      for (const a of restricted) assert.ok(!actions.includes(a), `${a} offered on ${r.id}`);
    }
  });

  it('lets Admins and Super Admins approve a record they do not own', () => {
    assert.deepEqual(productActions(admin, inReview).filter((a) => a === 'approve' || a === 'requestChanges'), ['approve', 'requestChanges']);
    assert.ok(productActions(superAdmin, inReview).includes('approve'));
  });

  it('keeps reviewer separation: no one approves a record they own', () => {
    const own = { ...inReview, ownerId: admin.id };
    assert.ok(!productActions(admin, own).includes('approve'));
    assert.throws(() => applyProductAction(admin, own, 'approve'), WorkflowError);
  });

  it('lets Team Members edit only records assigned to them', () => {
    assert.ok(canEditProduct(teamMember, record('pl5'))); // m-d, draft
    assert.ok(!canEditProduct(teamMember, record('pl4'))); // m-e, draft
    assert.ok(canEditProduct(admin, record('pl4')));
  });

  it('gives no actions to someone without workspace access', () => {
    assert.deepEqual(productActions(noAccess, inReview), []);
  });

  it('refuses a restricted action even if a screen asks for it', () => {
    assert.throws(() => applyProductAction(teamMember, inReview, 'approve'), WorkflowError);
    assert.throws(() => applyProductAction(teamMember, record('pl5'), 'archive'), WorkflowError);
    assert.throws(() => applyProductAction(teamMember, archived, 'restore'), WorkflowError);
  });
});

describe('Product Library: status changes', () => {
  it('moves draft -> in review -> approved', () => {
    const submitted = applyProductAction(teamMember, record('pl5'), 'submit');
    assert.equal(submitted.status, 'review');
    const approved = applyProductAction(admin, submitted, 'approve');
    assert.equal(approved.status, 'approved');
    assert.equal(approved.reviewerId, admin.id);
  });

  it('requires a written note to request changes, and keeps it', () => {
    assert.throws(() => applyProductAction(admin, inReview, 'requestChanges', '   '), WorkflowError);
    const changed = applyProductAction(admin, inReview, 'requestChanges', ' Add a source. ');
    assert.equal(changed.status, 'changes');
    assert.equal(changed.changeNote, 'Add a source.');
  });

  it('archives and restores as a draft (Admins and Super Admins)', () => {
    const a = applyProductAction(superAdmin, record('pl1'), 'archive');
    assert.equal(a.status, 'archived');
    assert.ok(!canEditProduct(superAdmin, a), 'archived records are read-only');
    assert.equal(applyProductAction(admin, a, 'restore').status, 'draft');
  });

  it('saves a new record owned by its creator, and blocks editing others', () => {
    const created = saveProduct(teamMember, { ...record('pl4'), id: 'new', ownerId: '' }, 'draft', true);
    assert.equal(created.ownerId, teamMember.id);
    assert.throws(() => saveProduct(teamMember, record('pl4'), 'draft', false), WorkflowError);
  });

  it('counts records awaiting approval for the Dashboard', () => {
    assert.equal(productsAwaitingApproval(productSeed), 1);
    assert.equal(productsAwaitingApproval([...productSeed, { ...record('pl5'), status: 'review' } as ProductRecord]), 2);
  });
});

describe('Product Library: validation', () => {
  const base = { name: 'A', brand: 'Brand A', category: 'Serum', description: 'Short.', url: 'https://example.com/a', image: null, extraImages: [] };
  const m = productLibraryCopy.errors;

  it('accepts a complete record with no images', () => {
    assert.deepEqual(validateProduct(base, m), {});
  });

  it('requires alt text for an uploaded image, and rejects spaces only', () => {
    assert.ok(productAltMissing({ image: { alt: '' }, extraImages: [] }));
    assert.ok(productAltMissing({ image: { alt: '   ' }, extraImages: [] }));
    assert.ok(!productAltMissing({ image: { alt: 'A serum bottle' }, extraImages: [] }));
    assert.equal(validateProduct({ ...base, image: { alt: ' ' } }, m)['pl-image-alt'], 'Add alt text before saving this product image.');
  });

  it('requires its own alt text for each additional image', () => {
    const e = validateProduct({ ...base, image: { alt: 'Front' }, extraImages: [{ alt: 'Side' }, { alt: '' }] }, m);
    assert.equal(e['pl-extra-1-alt'], 'Add alt text before saving additional image 2.');
    assert.equal(e['pl-extra-0-alt'], undefined);
  });

  it('checks required fields, description length and the URL', () => {
    const e = validateProduct({ ...base, name: ' ', category: '', description: 'x'.repeat(201), url: 'example.com' }, m);
    assert.deepEqual(Object.keys(e).sort(), ['pl-category', 'pl-description', 'pl-name', 'pl-url']);
  });
});

describe('Product Library: filters', () => {
  const f = { query: '', brand: 'all', category: 'all', status: 'active', link: 'all', sort: 'name' as const };
  it('hides archived records by default and shows them on request', () => {
    const all = [...productSeed, archived];
    assert.ok(!filterProducts(all, f).some((r) => r.status === 'archived'));
    assert.deepEqual(filterProducts(all, { ...f, status: 'archived' }).map((r) => r.id), ['archived-sample']);
  });
  it('searches ingredients and filters by linked guidance', () => {
    assert.deepEqual(filterProducts(productSeed, { ...f, query: 'zinc' }).map((r) => r.id), ['pl18']);
    assert.ok(filterProducts(productSeed, { ...f, link: 'none' }).every((r) => r.links.length === 0));
  });
});
