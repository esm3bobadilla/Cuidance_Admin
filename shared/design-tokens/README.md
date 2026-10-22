# Cuidance design tokens

Shared implementation tokens for Cuidance coded artifacts. Admin Web uses them today.

**Source of truth:** `T03_W08_S03_Board_DesignSystem_Cuidance_v04_ART646` (Week 8 Step 3 design system board). Every value in `tokens.css` is copied from that board. Don't add, rename or change a token without Team 03 review, and check with Esme before changing any color role.

## What's here

| File | What it holds |
| --- | --- |
| `tokens.css` | CSS custom properties for color (light and dark), typography, spacing, radius, stroke, sizing and layout |

## How to use

1. Import `tokens.css` once at the app root.
2. Load **Newsreader** (weight 400) and **Archivo** (weights 400, 500, 600), and set `--font-newsreader` and `--font-archivo` to them.
3. Use semantic tokens only, the way the board's handoff section shows:

```css
color: var(--color-ink);
background: var(--color-surface);
font: var(--type-body);
padding: var(--space-16);
border-radius: var(--radius-medium);
outline: var(--stroke-strong) solid var(--color-accent);
```

- **Color:** semantic roles only (for example `--color-accent`, not a Compass Blue tone). Dark mode follows the browser's `prefers-color-scheme` setting.
- **Type:** each `--type-*` token is a `font` shorthand. Tablet (768 to 1279 px) and mobile (below 768 px) sizes switch automatically. Eyebrows also need `text-transform: uppercase` and `letter-spacing: var(--type-eyebrow-tracking)`.
- **Contrast:** only use the foreground and background pairings verified in the board's Color Contrast Sheet. Never use color as the only signal. Pair it with text, an icon, a border or a shape change.
- Breakpoints can't be CSS variables. Use `max-width: 1279px` for tablet and `max-width: 767px` for mobile in media queries.

## Status of open decisions

Reviewed against the v04 board. "Unresolved" means the board doesn't give a final value, so Admin Web uses the most conservative option and nothing new was added to `tokens.css`.

| Item | What the board says | Status | What Admin Web does now |
| --- | --- | --- | --- |
| Desktop card-column count | Admin Web desktop is "persistent sidebar · multi-column · table rows ≥ 56 · main + secondary panel." Mobile is "single column." "Multi-column → one column" when space shrinks. Responsive behavior is marked **"Confirm after coded testing."** No card-column count is given. | **Unresolved** | Placeholder cards are a single column at every width, the one layout the board explicitly allows. Card gap is 24 px on desktop and tablet and 12 px on mobile (both documented). |
| Font hosting method | Names the fonts (Newsreader 400, Archivo 400 / 500 / 600) but says nothing about how they're hosted. | **Unresolved** | Fonts load through Next.js's built-in font loader (`next/font/google`). It downloads the files at build time and serves them from the app, so browsers make no requests to Google. Team 03 to confirm. |
| Shadow token / value | "Restrained elevation. Sheets, dialogs, overlays only." Marked **"Shadow value requires team confirmation."** Rules: border before shadow, surface contrast before shadow, no heavy decorative shadows. | **Unresolved** | No shadow token exists and nothing uses a shadow. Cards separate from the page with a border and surface color, as the board prefers. |
| Empty state | "Message + one next step," shown as a dashed outline with an icon, a message and a link. Marked **"Provisional"**, and provisional on result and product cards in the component matrix. | **Unresolved** | Not implemented. The "Not built yet" line on each placeholder card is plain caption text, not the Empty-state component. |
| Loading state | "Text status · reduced motion," shown with skeleton bars and "Loading guidance…". Marked **"Provisional"**, and provisional on result and product cards in the component matrix. | **Unresolved** | Not implemented. The shell loads no data, so it has no loading state. |

## Other open items

These are documented on the board but have no exact implementation value, or need a team decision. They are **not** in `tokens.css`. Don't guess them.

| Item | What the board says | What's missing |
| --- | --- | --- |
| Logo files | Logo Version 4 rules: sizes, clear space, colors, reversed use | Files are in `shared/brand/logo/` (package v03, read-only). Team 03 approved Grounded Green as the only active logo color for Admin Web. **Admin Web logo integration: Pending clean approved asset.** See "Team 03 decisions" and "Open asset questions" in `shared/brand/logo/README.md`. |
| Gradients | "Introduce gradients only when a defined gradient token and application rule exist." | No gradient tokens are defined, so don't use gradients. |
| Expanded tone scales | Nine tones per color family, with a Tone Legibility Guide | Only the semantic roles are tokenized. Other tones need separate contrast testing before use. |
