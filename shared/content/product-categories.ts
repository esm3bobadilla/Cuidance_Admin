/*
 * Product categories, shared with the Cuidance app (Team 03, Nov 20, 2026).
 *
 * The same department > category > subcategory tree as the app's data/categories.ts, so a
 * product sorted here lands in the same place in the app's Explore. The app's list mirrors
 * Ulta's and Sephora's menus, minus shopping-only sections. Keep the two files the same:
 * change a category in both places in the same round of pull requests.
 *
 * A product's category is stored as one path of ids: "skin/moisturizers/mists-essences", or
 * "fragrance/mists" where a category has no subcategories.
 */

export type Subcategory = { id: string; label: string };
export type Category = { id: string; label: string; subs: Subcategory[] };
// `short` is the tab label on the Products page, where the full name would crowd the row
export type Department = { id: string; label: string; short: string; area?: 'hair' | 'skin' | 'makeup' | 'body'; categories: Category[] };

function subs(...labels: [string, string][]): Subcategory[] {
  return labels.map(([id, label]) => ({ id, label }));
}

export const departments: Department[] = [
  {
    id: 'makeup',
    short: 'Makeup',
    label: 'Makeup and nails',
    area: 'makeup',
    categories: [
      {
        id: 'face',
        label: 'Face',
        subs: subs(
          ['foundation', 'Foundation'],
          ['bb-cc', 'BB and CC creams'],
          ['tinted-moisturizer', 'Tinted moisturizer'],
          ['concealer', 'Concealer'],
          ['primer', 'Face primer'],
          ['blush', 'Blush'],
          ['bronzer', 'Bronzer'],
          ['highlighter', 'Highlighter'],
          ['contour', 'Contour'],
          ['color-correct', 'Color correcting'],
          ['setting', 'Setting spray and powder'],
          ['remover', 'Makeup remover'],
        ),
      },
      {
        id: 'eyes',
        label: 'Eyes',
        subs: subs(
          ['palettes', 'Eyeshadow palettes'],
          ['eyeshadow', 'Eyeshadow'],
          ['mascara', 'Mascara'],
          ['eyeliner', 'Eyeliner'],
          ['brows', 'Eyebrows'],
          ['eye-primer', 'Eye primer and base'],
          ['lashes', 'False eyelashes'],
          ['lash-serums', 'Lash primer and serums'],
        ),
      },
      {
        id: 'lips',
        label: 'Lips',
        subs: subs(
          ['lipstick', 'Lipstick'],
          ['liquid-lipstick', 'Liquid lipstick'],
          ['gloss', 'Lip gloss'],
          ['oil', 'Lip oil'],
          ['liner', 'Lip liner'],
          ['stain', 'Lip stain'],
          ['plumper', 'Lip plumper'],
          ['balm', 'Lip balms and treatments'],
        ),
      },
      {
        id: 'nails',
        label: 'Nails',
        subs: subs(
          ['polish', 'Nail polish'],
          ['gel', 'Gel nail polish'],
          ['base-top', 'Top and base coats'],
          ['press-on', 'Press-on nails'],
          ['nail-art', 'Nail art and design'],
          ['nail-care', 'Nail care'],
        ),
      },
      { id: 'body-makeup', label: 'Body makeup', subs: [] },
      { id: 'palettes', label: 'Makeup palettes', subs: [] },
    ],
  },
  {
    id: 'skin',
    short: 'Skin',
    label: 'Skin care',
    area: 'skin',
    categories: [
      {
        id: 'cleansers',
        label: 'Cleansers',
        subs: subs(
          ['face-wash', 'Face wash'],
          ['balms-oils', 'Cleansing balms and oils'],
          ['wipes', 'Face wipes'],
          ['exfoliators', 'Cleansing exfoliators'],
          ['toner', 'Toner'],
          ['remover', 'Makeup remover'],
        ),
      },
      {
        id: 'moisturizers',
        label: 'Moisturizers',
        subs: subs(
          ['face-moisturizer', 'Face moisturizer'],
          ['night-cream', 'Night cream'],
          ['face-oils', 'Face oils'],
          ['mists-essences', 'Face mists and essences'],
          ['neck', 'Neck cream'],
          ['tinted', 'Tinted moisturizer'],
        ),
      },
      {
        id: 'treatments',
        label: 'Treatments and serums',
        subs: subs(
          ['serums', 'Face serums'],
          ['peels', 'Face peels and exfoliators'],
          ['masks', 'Face masks'],
          ['sheet-masks', 'Sheet masks'],
          ['blemish', 'Acne and blemish treatments'],
        ),
      },
      { id: 'eyes', label: 'Eye care', subs: subs(['eye-cream', 'Eye cream'], ['eye-serums', 'Eye serums'], ['eye-masks', 'Eye masks']) },
      { id: 'lips', label: 'Lip care', subs: subs(['lip-balms', 'Lip balms'], ['lip-treatments', 'Lip treatments']) },
      {
        id: 'sun',
        label: 'Sun care',
        subs: subs(['sunscreen', 'Face sunscreen'], ['self-tan', 'Self-tanning and bronzing'], ['after-sun', 'After-sun care']),
      },
    ],
  },
  {
    id: 'hair',
    short: 'Hair',
    label: 'Hair care',
    area: 'hair',
    categories: [
      {
        id: 'wash',
        label: 'Shampoo and conditioner',
        subs: subs(
          ['shampoo', 'Shampoo'],
          ['dry-shampoo', 'Dry shampoo'],
          ['conditioner', 'Conditioner'],
          ['co-wash', 'Co-wash'],
          ['leave-in-conditioner', 'Leave-in conditioner'],
        ),
      },
      {
        id: 'treatment',
        label: 'Treatment',
        subs: subs(
          ['oils-serums', 'Oils and serums'],
          ['masks', 'Hair masks'],
          ['thinning', 'Hair thinning and hair loss'],
          ['leave-in', 'Leave-in treatment'],
          ['scalp', 'Scalp care'],
        ),
      },
      {
        id: 'styling',
        label: 'Styling products',
        subs: subs(
          ['hairspray', 'Hairspray'],
          ['volume', 'Volume and texture'],
          ['heat-protectant', 'Heat protectant'],
          ['shine', 'Gloss and shine'],
          ['smoothing', 'Smoothing'],
          ['curl', 'Curl enhancing'],
          ['wax', 'Wax and pomade'],
        ),
      },
      {
        id: 'color',
        label: 'Hair color',
        subs: subs(['root', 'Root touch-up'], ['color-bleach', 'Hair color and bleach'], ['trend', 'Trend color']),
      },
    ],
  },
  {
    id: 'fragrance',
    short: 'Fragrance',
    label: 'Fragrance',
    area: 'body',
    categories: [
      { id: 'perfume', label: 'Perfume', subs: [] },
      { id: 'cologne', label: 'Cologne', subs: [] },
      { id: 'oils', label: 'Perfume oils and rollerballs', subs: [] },
      { id: 'mists', label: 'Body and hair mist', subs: [] },
    ],
  },
  {
    id: 'body',
    short: 'Body',
    label: 'Bath and body',
    area: 'body',
    categories: [
      {
        id: 'bath',
        label: 'Bath and shower',
        subs: subs(
          ['body-wash', 'Body wash and shower gel'],
          ['scrubs', 'Scrubs and exfoliants'],
          ['soaks', 'Bubble bath and soaks'],
          ['bath-bombs', 'Bath bombs and shower steamers'],
        ),
      },
      {
        id: 'moisturizers',
        label: 'Body moisturizers',
        subs: subs(['lotions', 'Lotions and creams'], ['body-butters', 'Body butters'], ['serums-oils', 'Body serums and oils']),
      },
      { id: 'hand-foot', label: 'Hand and foot care', subs: subs(['hand-foot-cream', 'Hand and foot cream'], ['hand-soap', 'Hand soap']) },
      {
        id: 'sun',
        label: 'Sun care',
        subs: subs(['sunscreen', 'Body sunscreen'], ['self-tan', 'Self-tanning and bronzing'], ['after-sun', 'After-sun care']),
      },
      {
        id: 'personal',
        label: 'Personal care',
        subs: subs(
          ['deodorant', 'Deodorant and antiperspirant'],
          ['hair-removal', 'Shave and hair removal'],
          ['body-treatments', 'Body treatments'],
          ['oral', 'Oral care'],
        ),
      },
    ],
  },
  {
    id: 'tools',
    short: 'Tools',
    label: 'Tools and brushes',
    categories: [
      {
        id: 'makeup-tools',
        label: 'Makeup brushes and tools',
        subs: subs(
          ['brushes', 'Makeup brushes'],
          ['brush-sets', 'Brush sets'],
          ['sponges', 'Sponges and applicators'],
          ['brush-cleaner', 'Brush cleaner'],
          ['brow-lash', 'Brow and lash tools'],
          ['mirrors', 'Mirrors'],
        ),
      },
      {
        id: 'hair-tools',
        label: 'Hair styling tools',
        subs: subs(
          ['flat-irons', 'Flat irons'],
          ['dryers', 'Hair dryers'],
          ['curling', 'Curling irons and stylers'],
          ['hot-brushes', 'Hot brushes'],
          ['rollers', 'Hair rollers'],
        ),
      },
      { id: 'hair-brushes', label: 'Hair brushes and combs', subs: [] },
      {
        id: 'skin-tools',
        label: 'Skin care tools',
        subs: subs(
          ['cleansing-brushes', 'Cleansing brushes'],
          ['rollers', 'Facial rollers'],
          ['dermaplaning', 'Face razors and dermaplaning'],
          ['light', 'Light therapy'],
        ),
      },
      { id: 'removal-tools', label: 'Hair removal tools', subs: [] },
      { id: 'accessories', label: 'Hair accessories', subs: [] },
    ],
  },
];

export type CategoryOption = { value: string; label: string };

const sep = ' › ';

// Every place a product can sit, in menu order: subcategories, or the category itself when it has none
export const productCategoryOptions: CategoryOption[] = departments.flatMap((d) =>
  d.categories.flatMap((c) =>
    c.subs.length
      ? c.subs.map((s) => ({ value: `${d.id}/${c.id}/${s.id}`, label: [d.label, c.label, s.label].join(sep) }))
      : [{ value: `${d.id}/${c.id}`, label: [d.label, c.label].join(sep) }],
  ),
);

// Filter choices: each department, then its categories, so a filter can be broad or narrow
export const productCategoryFilterOptions: CategoryOption[] = departments.flatMap((d) => [
  { value: d.id, label: d.label },
  ...d.categories.map((c) => ({ value: `${d.id}/${c.id}`, label: `${d.label}${sep}${c.label}` })),
]);

export function splitCategory(path: string) {
  const [department = '', category = '', sub = ''] = path.split('/');
  return { department, category, sub };
}

// "Skin care › Moisturizers › Face mists and essences", or the path itself if it isn't in the tree
export function categoryLabel(path: string): string {
  const { department, category, sub } = splitCategory(path);
  const d = departments.find((x) => x.id === department);
  const c = d?.categories.find((x) => x.id === category);
  const s = c?.subs.find((x) => x.id === sub);
  if (!d || !c || (sub && !s)) return path;
  return [d.label, c.label, s?.label].filter(Boolean).join(sep);
}

// The most specific name, for cards: "Face mists and essences"
export function categoryShortLabel(path: string): string {
  const full = categoryLabel(path);
  return full === path ? path : full.split(sep).pop()!;
}

// A filter value matches its own path and everything under it
export const categoryMatches = (path: string, filter: string) => path === filter || path.startsWith(`${filter}/`);

export const isKnownCategory = (path: string) => productCategoryOptions.some((o) => o.value === path);
