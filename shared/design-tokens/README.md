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

## Open items for team review

These are documented on the board but have no exact implementation value, or need a team decision. They are **not** in `tokens.css`. Don't guess them.

| Item | What the board says | What's missing |
| --- | --- | --- |
| Shadow / elevation | "Restrained elevation. Sheets, dialogs, overlays only." Marked **"Shadow value requires team confirmation."** | The actual shadow value. No shadow token exists yet, so don't use shadows. |
| Logo files | Logo Version 4 rules: sizes, clear space, colors, reversed use | The logo artwork itself (SVG or PNG exports, including favicon sizes 16, 32 and 48 px). Admin Web shows no logo until Esme supplies approved files. |
| Gradients | "Introduce gradients only when a defined gradient token and application rule exist." | No gradient tokens are defined, so don't use gradients. |
| Expanded tone scales | Nine tones per color family, with a Tone Legibility Guide | Only the semantic roles are tokenized. Other tones need separate contrast testing before use. |
| Font delivery | Font families and weights | How fonts are hosted isn't specified. Admin Web loads them with Next.js's built-in font loader (`next/font/google`), which serves them from the app. Confirm this is acceptable. |
| Admin Web column counts | Desktop is "multi-column," mobile is "single column" | Exact column counts aren't specified. Admin Web currently uses 3 columns on desktop, 2 on tablet and 1 on mobile for the placeholder cards. Confirm or adjust. |
| Provisional states | Empty and Loading states are marked "Provisional · designed in Step 3" | Final approval of those states before they're built. |
