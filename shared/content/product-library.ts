/*
 * Product Library (Content / Product Library), Phase 2 PR 1.
 *
 * From the approved Admin Web prototype (Product Library design and handoff notes).
 * SAMPLE DATA ONLY: records, links and images stay on this page and are never saved,
 * uploaded or sent anywhere. Production storage, review and permissions arrive in PR 2,
 * and must be enforced by the database, not only by these screens.
 *
 * Changes from the prototype for this repository:
 * - Brand names are "Brand A" to "Brand D" (CLAUDE.md: no real brand names).
 * - People are placeholders from the sample roster ("Team member A" and so on).
 * - The prototype's region / availability field is left out: product availability and
 *   retailer information are future scope (CLAUDE.md, VERIFY).
 * - Product information only: no pricing, checkout, orders, inventory or carts.
 * - Links use example.com, which is reserved for samples.
 */

import { guidanceSeed } from './guidance-content';
import { quizQuestionSeed } from './quiz-content';

export type ProductStatus = 'draft' | 'review' | 'changes' | 'approved' | 'archived';

export type ProductIngredient = { name: string; role: string; notes: string; source: string };
export type ProductClaim = { text: string; source: string };

export type ProductRecord = {
  id: string;
  name: string;
  brand: string;
  category: string;
  description: string;
  url: string;
  ingredients: ProductIngredient[];
  claims: ProductClaim[];
  safety: string;
  status: ProductStatus;
  // Sample roster ids (team-roster.ts). The owner edits the record; the reviewer decides.
  ownerId: string;
  reviewerId: string;
  // Ids of linked guidance, quiz and educational content (productGuidanceOptions)
  links: string[];
  // Days since the last update (sample clock)
  updatedDaysAgo: number;
  // Note left with Request changes
  changeNote: string;
};

export const productCategories = ['Cleanser', 'Toner', 'Serum', 'Moisturizer', 'Sunscreen', 'Hair care', 'Body care'];

// Status label and icon: every status shows text and an icon, never color alone
export const productStatusMeta: Record<ProductStatus, { label: string; icon: 'doc' | 'review' | 'alert' | 'check' | 'lock' }> = {
  draft: { label: 'Draft', icon: 'doc' },
  review: { label: 'In review', icon: 'review' },
  changes: { label: 'Needs changes', icon: 'alert' },
  approved: { label: 'Approved', icon: 'check' },
  archived: { label: 'Archived', icon: 'lock' },
};

export type GuidanceGroup = 'guide' | 'quiz' | 'edu';

export const productGuidanceGroups: { id: GuidanceGroup; label: string }[] = [
  { id: 'guide', label: 'Connected guidance articles' },
  { id: 'quiz', label: 'Related quiz content' },
  { id: 'edu', label: 'Related educational content' },
];

export const productGuidanceOptions: { id: string; title: string; group: GuidanceGroup }[] = [
  ...guidanceSeed.slice(0, 5).map((g) => ({ id: g.id, title: g.title, group: 'guide' as const })),
  ...quizQuestionSeed.slice(0, 3).map((q) => ({ id: q.id, title: q.question, group: 'quiz' as const })),
  { id: 'e1', title: 'How to read an ingredient list', group: 'edu' },
  { id: 'e2', title: 'What "fragrance-free" means on a label', group: 'edu' },
];

const ex = 'https://example.com/';

export const productSeed: ProductRecord[] = [
  {
    id: 'pl1',
    name: 'Gentle daily cleanser',
    brand: 'Brand A',
    category: 'Cleanser',
    description: 'A low-foam, fragrance-free gel cleanser for everyday use on sensitive or easily irritated skin.',
    url: `${ex}brand-a/gentle-daily-cleanser`,
    ingredients: [
      { name: 'Glycerin', role: 'Humectant', notes: 'Helps the skin hold on to water.', source: `${ex}brand-a/gentle-daily-cleanser/ingredients` },
      { name: 'Coco-glucoside', role: 'Mild cleansing agent', notes: 'Sugar-derived surfactant often used in gentle cleansers.', source: `${ex}brand-a/gentle-daily-cleanser/ingredients` },
      { name: 'Panthenol', role: 'Skin conditioning', notes: 'Provitamin B5.', source: '' },
    ],
    claims: [
      { text: 'Fragrance-free formula', source: `${ex}brand-a/gentle-daily-cleanser/ingredients` },
      { text: 'Suitable for daily use', source: `${ex}brand-a/gentle-daily-cleanser` },
    ],
    safety: 'Patch test before first use. Avoid direct contact with eyes.',
    status: 'approved',
    ownerId: 'm-d',
    reviewerId: 'm-b',
    links: ['g1', 'e1', 'q3'],
    updatedDaysAgo: 2,
    changeNote: '',
  },
  {
    id: 'pl2',
    name: 'Barrier support serum',
    brand: 'Brand B',
    category: 'Serum',
    description: 'A lightweight serum with ceramides and niacinamide, for people building a simple barrier-focused routine.',
    url: `${ex}brand-b/barrier-support-serum`,
    ingredients: [
      { name: 'Ceramide NP', role: 'Barrier lipid', notes: 'One of the lipids naturally found in the outer layer of skin.', source: `${ex}brand-b/barrier-support-serum/ingredients` },
      { name: 'Niacinamide', role: 'Skin conditioning', notes: 'Can cause temporary flushing for some people.', source: `${ex}brand-b/barrier-support-serum/ingredients` },
    ],
    claims: [{ text: 'Helps support the skin barrier', source: '' }],
    safety: 'Introduce slowly if you are new to niacinamide.',
    status: 'review',
    ownerId: 'm-d',
    reviewerId: 'm-b',
    links: ['g1', 'g5'],
    updatedDaysAgo: 0,
    changeNote: '',
  },
  {
    id: 'pl3',
    name: 'Calming mineral sunscreen',
    brand: 'Brand C',
    category: 'Sunscreen',
    description: 'A tinted mineral sunscreen with zinc oxide, described by the brand as made for sensitive skin.',
    url: `${ex}brand-c/calming-mineral-sunscreen`,
    ingredients: [
      { name: 'Zinc oxide', role: 'Mineral UV filter', notes: 'Active ingredient.', source: `${ex}brand-c/calming-mineral-sunscreen/drug-facts` },
      { name: 'Bisabolol', role: 'Skin conditioning', notes: '', source: '' },
    ],
    claims: [
      { text: 'Broad spectrum SPF 30', source: `${ex}brand-c/calming-mineral-sunscreen/drug-facts` },
      { text: 'All-day protection', source: '' },
    ],
    safety: 'Reapply at least every 2 hours, and after swimming or sweating.',
    status: 'changes',
    ownerId: 'm-e',
    reviewerId: 'm-c',
    links: ['g1'],
    updatedDaysAgo: 1,
    changeNote: 'Add the SPF test reference and remove "All-day protection".',
  },
  {
    id: 'pl4',
    name: 'Hydrating gel moisturizer',
    brand: 'Brand A',
    category: 'Moisturizer',
    description: 'An oil-free gel moisturizer for normal to combination skin.',
    url: `${ex}brand-a/hydrating-gel-moisturizer`,
    ingredients: [
      { name: 'Glycerin', role: 'Humectant', notes: '', source: '' },
      { name: 'Sodium hyaluronate', role: 'Humectant', notes: '', source: '' },
    ],
    claims: [{ text: 'Oil-free', source: '' }],
    safety: '',
    status: 'draft',
    ownerId: 'm-e',
    reviewerId: '',
    links: [],
    updatedDaysAgo: 5,
    changeNote: '',
  },
  {
    id: 'pl5',
    name: 'Leave-in curl cream',
    brand: 'Brand D',
    category: 'Hair care',
    description: 'A leave-in cream for wavy, curly and coily hair that helps define curls without a stiff hold.',
    url: `${ex}brand-d/leave-in-curl-cream`,
    ingredients: [
      { name: 'Shea butter', role: 'Emollient', notes: 'Butyrospermum parkii.', source: `${ex}brand-d/leave-in-curl-cream/ingredients` },
      { name: 'Behentrimonium methosulfate', role: 'Conditioning agent', notes: '', source: '' },
    ],
    claims: [{ text: 'Defines curls without a stiff hold', source: '' }],
    safety: 'For external use only.',
    status: 'draft',
    ownerId: 'm-d',
    reviewerId: '',
    links: ['g2', 'q1'],
    updatedDaysAgo: 3,
    changeNote: '',
  },
  {
    id: 'pl6',
    name: 'Soothing rose toner',
    brand: 'Brand B',
    category: 'Toner',
    description: 'An alcohol-free toner. Archived after the brand discontinued it (sample).',
    url: `${ex}brand-b/soothing-rose-toner`,
    ingredients: [{ name: 'Rosa damascena flower water', role: 'Fragrance and skin conditioning', notes: 'Contains natural fragrance compounds.', source: '' }],
    claims: [{ text: 'Alcohol-free', source: '' }],
    safety: '',
    status: 'archived',
    ownerId: 'm-e',
    reviewerId: 'm-a',
    links: [],
    updatedDaysAgo: 21,
    changeNote: '',
  },
];

export const productLibraryCopy = {
  eyebrow: 'Content',
  title: 'Product Library',
  description:
    'Keep product records accurate: ingredients, claims, safety notes, images and the guidance they support. Product information only, with no pricing or orders.',
  sampleNote: 'Sample data. Records, images and links stay on this page and are not saved.',
  newProduct: 'New product',
  accessLabel: 'Your access to product records',
  recordsTitle: 'Product records',
  count: (active: number, archived: number) => `${active} active · ${archived} archived`,
  searchLabel: 'Search products',
  searchPlaceholder: 'Search by product, brand or ingredient',
  filtersLabel: 'Filter and sort products',
  filters: {
    brand: 'Brand',
    allBrands: 'All brands',
    category: 'Category',
    allCategories: 'All categories',
    status: 'Approval status',
    activeStatuses: 'Active products',
    allStatuses: 'All, including archived',
    link: 'Linked guidance',
    anyLink: 'Any guidance',
    allLinks: 'All products',
    noLink: 'Not linked yet',
    sort: 'Sort by',
    newest: 'Recently updated',
    oldest: 'Least recently updated',
    name: 'Product name (A to Z)',
  },
  summary: (shown: number, total: number) => `Showing ${shown} of ${total} products`,
  reset: 'Reset search and filters',
  cardsLabel: 'Product records (sample data)',
  card: {
    view: 'View',
    noImage: 'No image yet',
    selected: '(open)',
    linked: (n: number) => (n === 0 ? 'Not linked yet' : n === 1 ? '1 linked item' : `${n} linked items`),
  },
  columns: { product: 'Product', brand: 'Brand', category: 'Category', link: 'Linked guidance', status: 'Status', updated: 'Updated', actions: 'Actions' },
  open: (name: string) => `Open ${name}`,
  edit: (name: string) => `Edit ${name}`,
  openShort: 'Open',
  editShort: 'Edit',
  notLinked: 'Not linked yet',
  moreLinks: (n: number) => ` · +${n} more`,
  updated: (days: number) => (days === 0 ? 'Today' : days === 1 ? 'Yesterday' : `${days} days ago`),
  states: {
    loading: 'Loading product records…',
    emptyTitle: 'No product records yet',
    emptyBody: 'Add a product to connect its ingredients, sources and images to Cuidance guidance.',
    noMatchTitle: 'No products match this view.',
    noMatchBody: 'Try a different search or filter, or add a new product record.',
    errorTitle: 'Product records could not load.',
    errorBody: 'Nothing was changed. Try again in a moment.',
    retry: 'Try again',
  },
  roleNote: {
    super_admin: 'As a Super Admin, you have full access to product records.',
    admin: 'As an Admin, you can create, edit, review, approve and archive product records.',
    team_member: 'As a Team Member, you can create records, edit records assigned to you, save drafts and submit them for review.',
  },
  drawer: {
    close: 'Close product record',
    newTitle: 'New product',
    editTitle: 'Edit product',
    fallbackEyebrow: 'Product Library',
    statusLabel: 'Status',
  },
  view: {
    overview: 'Product overview',
    name: 'Product name',
    brand: 'Brand',
    category: 'Category',
    url: 'Product URL',
    ingredients: 'Ingredients',
    ingredientSource: 'Source',
    noIngredientSource: 'Source needed',
    claims: 'Claims and safety',
    claim: 'Product claim',
    claimSource: 'Source',
    claimNoSource: 'Source needed before approval',
    safety: 'Safety note',
    noSafety: 'No safety note yet.',
    media: 'Media and links',
    noImage: 'No product image yet.',
    altCaption: (alt: string) => `Alt text: ${alt}`,
    additionalImages: 'Additional images',
    sources: 'Sources and links',
    guidance: 'Related guidance',
    noGuidance: 'Not linked yet.',
    review: 'Review status',
    owner: 'Assigned to',
    reviewer: 'Reviewer',
    noReviewer: 'Not assigned yet',
    updated: 'Last updated',
    changeNote: 'Requested changes',
  },
  form: {
    errorSummary: (n: number) => (n === 1 ? 'Check 1 field before saving.' : `Check ${n} fields before saving.`),
    overview: 'Product overview',
    name: 'Product name (required)',
    brand: 'Brand (required)',
    category: 'Category (required)',
    chooseCategory: 'Choose a category',
    description: 'Short description (required)',
    descriptionHelper: (n: number) => `${n} of 200 characters. Educational and neutral: say "may fit", never "best" or "fix".`,
    url: 'Product URL (required)',
    urlHelper: 'The brand or label page this record is based on. Starts with https://',
    ingredients: 'Ingredients',
    ingredient: (n: number) => `Ingredient ${n}`,
    ingredientName: 'Ingredient name',
    ingredientRole: 'Role',
    ingredientNotes: 'Notes',
    ingredientSource: 'Source URL',
    addIngredient: 'Add ingredient',
    removeIngredient: (n: number, name: string) => `Remove ingredient ${n}${name ? `, ${name}` : ''}`,
    claims: 'Claims and safety',
    claim: (n: number) => `Claim ${n}`,
    claimText: 'Claim wording',
    claimSource: 'Source URL',
    claimHelper: 'Every claim needs a source before it can be approved.',
    addClaim: 'Add claim',
    removeClaim: (n: number) => `Remove claim ${n}`,
    safety: 'Safety note',
    safetyHelper: 'Plain safety guidance only. No diagnosis or medical advice.',
    media: 'Media and links',
    mainImage: 'Product image (optional)',
    additionalImages: 'Additional images (optional, up to 4)',
    additionalImage: (n: number) => `Additional image ${n}`,
    addImage: 'Add another image',
    removeImage: (n: number) => `Remove additional image ${n}`,
    imagesFull: 'You have added the most additional images (4).',
    guidance: 'Related guidance',
    reviewStatus: 'Review status',
    reviewerOnSubmit: 'Assigned when submitted',
  },
  errors: {
    name: 'Enter a product name.',
    brand: 'Enter the brand name.',
    category: 'Choose a product category.',
    description: 'Write a short description.',
    descriptionLong: 'Keep the description to 200 characters or fewer.',
    url: 'Enter the product URL.',
    urlFormat: 'Enter a full URL that starts with https://',
    alt: 'Add alt text before saving this product image.',
    altExtra: (n: number) => `Add alt text before saving additional image ${n}.`,
    note: 'Add a short note explaining what needs to change.',
  },
  actions: {
    create: 'Create product',
    saveDraft: 'Save draft',
    submit: 'Submit for review',
    approve: 'Approve',
    requestChanges: 'Request changes',
    edit: 'Edit',
    archive: 'Archive',
    restore: 'Restore as draft',
    cancel: 'Cancel',
  },
  busy: {
    saving: 'Saving draft…',
    submitting: 'Submitting for review…',
    approving: 'Approving…',
    requesting: 'Requesting changes…',
    archiving: 'Archiving…',
    restoring: 'Restoring…',
  },
  done: {
    created: (name: string) => `${name} created as a draft.`,
    createdSubmitted: (name: string) => `${name} created and submitted for review.`,
    saved: 'Draft saved.',
    savedReset: 'Draft saved. This record stays in Draft until it is submitted and approved again.',
    submitted: 'Submitted for review. An Admin will approve it or request changes.',
    approved: (name: string) => `${name} approved. It can now support guidance and claims review.`,
    changes: (owner: string) => `Changes requested. ${owner} can update the record and resubmit.`,
    archived: (name: string) => `${name} archived. It is no longer in active results and can be restored later.`,
    restored: (name: string) => `${name} restored as a draft. It is back in active results.`,
  },
  notes: {
    approvalRoles: 'Approval is available to Admins and Super Admins.',
    submitted: 'Submitted for review. Approval is available to Admins and Super Admins.',
    archivedTeam: 'Archived records are read-only. Approval is available to Admins and Super Admins.',
    archived: 'Archived records are read-only. Restore the record to edit it.',
    notAssigned: (owner: string) => `Team Members can edit records assigned to them. This record is assigned to ${owner}.`,
    ownContent: 'You created or own this record, so another Admin or Super Admin approves it.',
    altBlocked: 'Add alt text before saving this product image.',
  },
  archiveDialog: {
    title: (name: string) => `Archive ${name}?`,
    body: 'It leaves active results and its guidance links stay as they are. An Admin or Super Admin can restore it as a draft later.',
    confirm: 'Archive product',
    cancel: 'Keep product',
  },
  changesDialog: {
    title: (name: string) => `Request changes to ${name}`,
    body: (owner: string) => `${owner} will see your note and can update the record and resubmit.`,
    noteLabel: 'What needs to change (required)',
    noteHelper: 'Be specific, for example a claim that needs a source.',
    confirm: 'Request changes',
    cancel: 'Cancel',
  },
};
