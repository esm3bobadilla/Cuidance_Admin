# Cuidance Logo Assets

## Universal Brand Asset Package

This logo package is the shared Cuidance brand-asset reference for:

- Cuidance Mobile
- Cuidance Admin Web
- Cuidance Brand Website

The same approved logo files may be used across all three Cuidance applications. Keep the filenames, color variants, proportions, and transparent-background treatments unchanged when copying assets between repositories.

## Recommended repository location

Place the logo files in each repository at:

```text
shared/brand/logo/
```

If a repository uses a different approved asset directory, keep the same logo filenames and preserve this README with the copied assets.

## Usage rules

- Use the approved Cuidance logo assets as supplied.
- Preserve the icon-to-wordmark alignment and proportions.
- Do not add shadows, gradients, outlines, or decorative effects.
- Use the correct light, dark, reversed, and one-color versions for their backgrounds.
- Use symbol-only files for compact spaces and favicon use.
- Do not treat the logo package as a source for new logo redesigns.
- Follow the Week 8 Cuidance Design System for color, contrast, spacing, and accessibility.

## Project boundaries

- Cuidance Mobile is the primary public product.
- Cuidance Admin Web is an internal support tool and is not part of public participant testing.
- Cuidance Brand Website is a public informational brand site and does not replace the Cuidance Mobile app.

## Naming history

Beauty Search and Tend are historical project names. Cuidance is the current product name.

---

## Admin Web notes

Everything above this line is the universal package README, copied unchanged from `Cuidance_LogoAssets_ClaudeCode_v03`. Everything below is specific to this repository.

### What's in this folder

All 26 files are copied unchanged from `Cuidance_LogoAssets_ClaudeCode_v03.zip` (folder `cuidance-logo-assets-v01/`), with the package's own filenames and its `png/` and `svg/` subfolders. **The package filenames are the authoritative Team 03 naming system.** The earlier 12-file list that used to be in this README is retired.

**Important:** the SVG files are not vector artwork. Each one is a small wrapper that displays the PNG with the same name from `../png/`. Keep `png/` and `svg/` side by side, or the SVGs show nothing.

| File (in `png/` and `svg/`) | PNG size | What it is | For Admin Web? |
| --- | --- | --- | --- |
| `cuidance-logo-primary-lockup` | 1271 × 289 | Mark + wordmark, Grounded Green, transparent | **Yes.** Main light-mode logo |
| `cuidance-logo-horizontal-lockup` | 1974 × 609 | Mark + wordmark, near-black `#181818`, transparent | **Yes, after the frame question below.** Board: website headers and desktop navigation |
| `cuidance-logo-stacked-lockup` | 1485 × 973 | Stacked mark over wordmark, near-black `#050505`, transparent | **Yes, after the frame question below.** Centered or compact vertical spaces |
| `cuidance-logo-reversed` | 1716 × 826 | Light mark + wordmark, `#F7F2E9`, transparent | **Yes, after the frame question below.** Dark mode and dark surfaces |
| `cuidance-logo-one-color` | 1902 × 712 | One-color lockup, near-black `#0B0B0A`, transparent | Not needed on screen. Board: print and low-color reproduction |
| `cuidance-logo-symbol-mark` | 642 × 549 | Symbol only, Grounded Green, transparent | **Yes, PNG only.** Compact spaces. See the SVG size question below |
| `cuidance-logo-app-icon-mark` | 1024 × 1024 | Symbol only, Grounded Green, centered on transparent | Optional. Square compact uses |
| `cuidance-app-icon-1024` | 1024 × 1024 | Quiet Paper symbol on a solid Grounded Green square | Optional for web (home-screen icon) |
| `cuidance-favicon-16x16` | 16 × 16 | Symbol only, transparent | **Yes.** Browser tab icon |
| `cuidance-favicon-32x32` | 32 × 32 | Symbol only, transparent | **Yes.** Browser tab icon |
| `cuidance-favicon-48x48` | 48 × 48 | Symbol only, transparent | **Yes.** Browser tab icon |
| `cuidance-logo-care-terracotta` | 1205 × 275 | Lockup in terracotta `#AA4729` | **No, until confirmed.** See below |
| `cuidance-logo-compass-blue` | 1175 × 291 | Lockup in blue `#0E34CE` | **No, until confirmed.** See below |

Admin Web doesn't display any of these yet. Adding the logo and favicon to the app is a separate step.

### Needs Team 03 confirmation

1. **Care Terracotta and Compass Blue logos.** The v04 board only approves Grounded Green, Guidance Ink and Quiet Paper as logo colors, and says not to recolor the logo arbitrarily. Confirm whether these two are approved, and where they may be used.
2. **Thin frame around four PNGs.** `horizontal-lockup`, `one-color`, `reversed` and `stacked-lockup` have a 1 px light-gray line around the image edge (`reversed` also has a dark line), which looks like an export or crop leftover. On screen it would draw a box around the logo, which the board's clear-space rule doesn't allow. Please re-export without the frame, or confirm it's intended.
3. **`cuidance-logo-symbol-mark.svg` would stretch the mark.** The SVG says 1024 × 671, but its PNG is 642 × 549. Displayed through the SVG, the mark would be distorted. Use the PNG, or re-export the SVG at 642 × 549.
4. **Edge-to-edge crops.** `primary-lockup` and `symbol-mark` have artwork touching the image edge. Confirm nothing is clipped. The required clear space then has to come from the layout around them.
5. **No true vector files.** The package has no real SVG artwork, so the logo can't scale beyond the PNG sizes. Confirm whether vector exports exist.
6. **App icon sizes.** The package has one 1024 × 1024 app icon. The board lists a 512 × 512 export master. No 180, 192 or 512 px files are included, and none were created.
7. **Lockup roles.** The board calls the Grounded Green version the primary lockup and lists Ink as the secondary color. In this package the horizontal and stacked lockups are near-black. Confirm that's the intended default for those layouts.
8. **Exact colors.** Only the Grounded Green files (`primary-lockup`, `symbol-mark`, `app-icon-mark`, `app-icon-1024` and the favicons) use an exact palette value (`#21332B`, with `#F4F2EC` on the app icon). The others are close to, but not exactly, the board colors: `#181818`, `#0B0B0A` and `#050505` instead of Guidance Ink `#111111`, and `#F7F2E9` instead of Quiet Paper `#F4F2EC`. The terracotta (`#AA4729`) and blue (`#0E34CE`) versions don't match Care Terracotta `#A8432A` or Compass Blue `#1F3FD1` either. Confirm these exports are final.

### Usage rules from the v04 design system board

| Version | Use | Min | Max (digital) | Color |
| --- | --- | --- | --- | --- |
| Primary lockup | Large digital, presentation and key identity moments | 160 px wide | 480 px wide | Grounded Green `#21332B`, or Guidance Ink `#111111` |
| Horizontal lockup | Website headers, desktop navigation, horizontal layouts | 160 px wide | 360 px wide | Grounded Green, or Guidance Ink |
| Stacked lockup | Centered layouts and compact vertical spaces | 96 px wide | 240 px wide | Grounded Green, or Guidance Ink |
| Symbol-only mark | Favicon, compact navigation, small digital spaces | 24 px | 128 px | Grounded Green, or Guidance Ink, or Quiet Paper when reversed |
| App icon / compact mark | App icon, launcher icon, square compact uses | 24 px displayed | 96 px displayed (512 × 512 px export master) | Grounded Green with Quiet Paper, or Guidance Ink |
| Reversed version | Dark backgrounds, Grounded Green surfaces, dark mode | Matching lockup's min | Matching lockup's max | Quiet Paper `#F4F2EC`, or Grounded Green when contrast is sufficient |

- **Favicon:** use the symbol-only mark. Prepare 16, 32 and 48 px exports. Never use the wordmark at favicon size.
- **Clear space:** x = the height of the circular head in Logo Mark B. Keep text, borders, patterns, imagery, UI controls and other marks outside that area.
- **Backgrounds:** don't place the logo on Soft Clay, Warm Care tints, mid-tone colors, busy patterns, photos, or illustrations without a solid field and a contrast review.
- **Don't:** stretch or distort, rotate, outline the mark, recolor it arbitrarily, add shadows or effects, place it on low-contrast backgrounds, combine it with decorative patterns, or use it as a UI status icon.
- Maximum sizes are recommended digital sizes, not hard limits for print. Always keep the logo's proportions and clear space.
