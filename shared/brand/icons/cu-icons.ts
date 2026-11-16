/*
 * Cuidance "cu-icons": the Admin Web icon set from the approved Admin Web prototype
 * (Team 03, Nov 2026). Each icon is drawn in a 24 x 24 box centered on 0,0:
 *   f = filled shape, s = stroked line, c = cut-out (shape), k = cut-out (line).
 * Rendered by admin-web/components/ui/CuIcon.tsx. Do not hand-edit path data;
 * add new icons only from approved artwork.
 */

export type CuIconShape = {
  f?: string;
  s?: string;
  c?: string;
  k?: string;
  // Outline width around the filled shape (default 1.2)
  sw?: number;
};

const gear = (() => {
  let d = 'M-5.4 0a5.4 5.4 0 1 0 10.8 0a5.4 5.4 0 1 0-10.8 0Z';
  for (let i = 0; i < 8; i++) {
    const a = (i * Math.PI) / 4 + Math.PI / 8;
    const c = Math.cos(a);
    const s = Math.sin(a);
    const pt = (r: number, w: number) => `${(r * c - w * s).toFixed(2)} ${(r * s + w * c).toFixed(2)}`;
    d += `M${pt(4, -1.3)}L${pt(7.2, -1.1)}L${pt(7.2, 1.1)}L${pt(4, 1.3)}Z`;
  }
  return d;
})();

const eye = {
  f: 'M-8 0C-5.4-4.8 5.4-4.8 8 0C5.4 4.8-5.4 4.8-8 0Z',
  c: 'M-2.6 0a2.6 2.6 0 1 0 5.2 0a2.6 2.6 0 1 0-5.2 0Z',
};

export const cuIcons = {
  home: { f: 'M0-7.2L6.8-1.4V6.8H-6.8V-1.4Z', c: 'M-1.9 7.4V2.8a1.9 1.9 0 0 1 3.8 0V7.4Z' },
  doc: {
    f: 'M-5.6-7.6H2.4L5.6-4.4V7.6H-5.6Z',
    c: 'M-3.6-4.9h4.4a.75 .75 0 0 1 0 1.5h-4.4a.75 .75 0 0 1 0-1.5ZM-3.6-1.9h6.4a.75 .75 0 0 1 0 1.5h-6.4a.75 .75 0 0 1 0-1.5ZM-.6 6.2C-.9 3 1.2.9 4.4.9C4.6 4 2.6 6.2-.6 6.2Z',
  },
  review: { s: 'M-6-4.6l1.2 1.2 2.2-2.4M-6 .2l1.2 1.2 2.2-2.4M-6 5l1.2 1.2 2.2-2.4M.8-4.4h5M.8.4h5M.8 5.2h5' },
  bars: { f: 'M-7 1.6h3.4V6.8H-7ZM-1.7-2.6h3.4v9.4h-3.4ZM3.6-7h3.4V6.8H3.6Z' },
  mail: { f: 'M-7.6-5.4H7.6V5.4H-7.6Z', k: 'M-6.6-4.2L0 .9 6.6-4.2' },
  phone: {
    f: 'M-4.4-8h8.8V8h-8.8Z',
    c: 'M-1.8-6h3.6a.7 .7 0 0 1 0 1.4h-3.6a.7 .7 0 0 1 0-1.4ZM-1.2 5a1.2 1.2 0 1 0 2.4 0a1.2 1.2 0 1 0-2.4 0Z',
  },
  web: {
    f: 'M-7.6-6H7.6V6H-7.6Z',
    k: 'M-7-2.6H7',
    c: 'M-5.6-4.3a.9 .9 0 1 0 1.8 0a.9 .9 0 1 0-1.8 0ZM-3-4.3a.9 .9 0 1 0 1.8 0a.9 .9 0 1 0-1.8 0ZM-.4-4.3a.9 .9 0 1 0 1.8 0a.9 .9 0 1 0-1.8 0Z',
  },
  person: { f: 'M-3-4.2a3 3 0 1 0 6 0a3 3 0 1 0-6 0ZM-6.6 7.2c0-3.8 2.8-5.6 6.6-5.6S6.6 3.4 6.6 7.2Z' },
  team: {
    sw: 0,
    f: 'M-4-3.4a4 4 0 1 0 8 0a4 4 0 1 0-8 0ZM-7.9 2.9a4 4 0 1 0 8 0a4 4 0 1 0-8 0ZM-.1 2.9a4 4 0 1 0 8 0a4 4 0 1 0-8 0Z',
    c: 'M-1.7-3.4a1.7 1.7 0 1 0 3.4 0a1.7 1.7 0 1 0-3.4 0ZM-5.6 2.9a1.7 1.7 0 1 0 3.4 0a1.7 1.7 0 1 0-3.4 0ZM2.2 2.9a1.7 1.7 0 1 0 3.4 0a1.7 1.7 0 1 0-3.4 0Z',
  },
  gear: { f: gear, c: 'M-2.5 0a2.5 2.5 0 1 0 5 0a2.5 2.5 0 1 0-5 0Z' },
  bell: {
    f: 'M-5.4 3.4V-.6a5.4 5.4 0 0 1 10.8 0v4l1.6 2.2H-7ZM-1.3-6.6a1.3 1.3 0 1 0 2.6 0a1.3 1.3 0 1 0-2.6 0ZM-2.2 7.6a2.2 2.2 0 0 0 4.4 0Z',
  },
  search: { s: 'M-6.6-1.6a4.6 4.6 0 1 0 9.2 0a4.6 4.6 0 1 0-9.2 0M1.9 3.1L6.4 7.6' },
  filter: { f: 'M-7.4-6.4H7.4L1.8.6v5.6L-1.8 4.4V.6Z' },
  bookmark: { f: 'M-5-7.4H5V7.4L0 3.6-5 7.4Z' },
  check: { s: 'M-6 .4l3.8 3.8L6.4-4.6' },
  alert: { f: 'M-1.4-7h2.8L1 2.4h-2ZM-1.6 5.6a1.6 1.6 0 1 0 3.2 0a1.6 1.6 0 1 0-3.2 0Z' },
  plus: { s: 'M0-6.2v12.4M-6.2 0h12.4' },
  close: { s: 'M-5.2-5.2l10.4 10.4M5.2-5.2L-5.2 5.2' },
  arrowR: { s: 'M-6.4 0h11.6M.8-4.6L5.4 0 .8 4.6' },
  arrowL: { s: 'M6.4 0H-5.2M-.8-4.6L-5.4 0-.8 4.6' },
  lock: { f: 'M-5.6-1.2H5.6V7.4H-5.6Z', s: 'M-3.2-1.2v-2.4a3.2 3.2 0 0 1 6.4 0v2.4', c: 'M-1 1.6h2v3.4h-2Z' },
  eye,
  eyeOff: { ...eye, k: 'M-7.6-6.4L7.6 6.4', s: 'M-6.4-7.4L6.4 7.4' },
  restart: { s: 'M-5.6 2.2A6 6 0 1 0-4.4-4.2', f: 'M-7.2-7.4V-2.2H-2Z' },
  live: { f: 'M-2.2 0a2.2 2.2 0 1 0 4.4 0a2.2 2.2 0 1 0-4.4 0Z', s: 'M-5-4.6a6.5 6.5 0 0 0 0 9.2M5-4.6a6.5 6.5 0 0 1 0 9.2' },
  upload: { f: 'M0-7.6L6.2-1.4H2.4v4.6h-4.8v-4.6H-6.2ZM-6.6 5.2H6.6V7.4H-6.6Z' },
  desktop: { f: 'M-8-6.6H8V3.4H-8ZM-1.4 3.4h2.8V6h-2.8ZM-4.6 5.6h9.2v1.8h-9.2Z' },
  tablet: { f: 'M-5.6-7.6H5.6V7.6H-5.6Z', c: 'M-1.1 5.1a1.1 1.1 0 1 0 2.2 0a1.1 1.1 0 1 0-2.2 0Z' },
  logout: { f: 'M-8-7.4H-.2V7.4H-8Z', c: 'M-3.4-1h1.6v2h-1.6Z', s: 'M2.6 0h6M6-3.2L9.2 0 6 3.2' },
  clipboard: { f: 'M-5.8-6H-3V-7.6H3V-6H5.8V7.8H-5.8Z', k: 'M-3 1.2l2.1 2.1L3.4-1.2' },
  calendar: { f: 'M-7-5.4H7V7H-7Z', s: 'M-3.6-7.4v3M3.6-7.4v3', c: 'M-4.6-1.6h9.2V-.4h-9.2Z' },
  // Shell controls
  collapse: { s: 'M-.6-6l-6 6 6 6M6.4-6l-6 6 6 6' },
  expand: { s: 'M.6-6l6 6-6 6M-6.4-6l6 6-6 6' },
  chevronDown: { s: 'M-5-2.5L0 2.5 5-2.5' },
  menu: { s: 'M-6-4.5h12M-6 0h12M-6 4.5h12' },
  sun: {
    f: 'M-3.4 0a3.4 3.4 0 1 0 6.8 0a3.4 3.4 0 1 0-6.8 0Z',
    s: 'M0-8.2v1.4M0 6.8v1.4M-8.2 0h1.4M6.8 0h1.4M-5.8-5.8l1 1M4.8 4.8l1 1M-5.8 5.8l1-1M4.8-4.8l1-1',
  },
  moon: { f: 'M-6.4 0a6.4 6.4 0 1 0 12.8 0a6.4 6.4 0 1 0-12.8 0Z', c: 'M-.6-3.4a5 5 0 1 0 10 0a5 5 0 1 0-10 0Z' },
} satisfies Record<string, CuIconShape>;

export type CuIconName = keyof typeof cuIcons;

// Default solid-badge color for each icon (token names from tokens.css)
export const cuIconBadge: Partial<Record<CuIconName, string>> = {
  home: 'var(--color-badge-neutral)',
  doc: 'var(--color-badge-green-700)',
  review: 'var(--color-badge-terracotta)',
  bars: 'var(--color-badge-blue)',
  mail: 'var(--color-badge-terracotta)',
  phone: 'var(--color-badge-olive)',
  web: 'var(--color-badge-blue)',
  person: 'var(--color-badge-terracotta)',
  team: 'var(--color-badge-olive)',
  gear: 'var(--color-badge-neutral)',
  bell: 'var(--color-badge-green)',
  search: 'var(--color-badge-terracotta)',
  check: 'var(--color-badge-olive)',
  alert: 'var(--color-badge-terracotta)',
  logout: 'var(--color-badge-olive)',
  collapse: 'var(--color-badge-neutral)',
  expand: 'var(--color-badge-neutral)',
  menu: 'var(--color-badge-green)',
  close: 'var(--color-badge-green)',
  live: 'var(--color-badge-olive)',
  upload: 'var(--color-badge-green)',
  lock: 'var(--color-badge-green)',
  calendar: 'var(--color-badge-olive)',
  filter: 'var(--color-badge-green)',
};
