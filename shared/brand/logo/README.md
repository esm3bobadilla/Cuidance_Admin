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
| `cuidance-logo-primary-lockup` | 1271 × 289 | Mark + wordmark, Grounded Green, transparent | **Candidate.** Grounded Green, no frame. Pending the edge-crop check (question 4) |
| `cuidance-logo-horizontal-lockup` | 1974 × 609 | Mark + wordmark, near-black `#181818`, transparent | **Do not use.** Frame artifact (decision 4) |
| `cuidance-logo-stacked-lockup` | 1485 × 973 | Stacked mark over wordmark, near-black `#050505`, transparent | **Do not use.** Frame artifact (decision 4) |
| `cuidance-logo-reversed` | 1716 × 826 | Light mark + wordmark, `#F7F2E9`, transparent | **Do not use.** Frame artifact (decision 4) |
| `cuidance-logo-one-color` | 1902 × 712 | One-color lockup, near-black `#0B0B0A`, transparent | **Do not use.** Frame artifact (decision 4) |
| `cuidance-logo-symbol-mark` | 642 × 549 | Symbol only, Grounded Green, transparent | **Candidate, PNG only.** Grounded Green. SVG wrapper stretches the mark (question 3) |
| `cuidance-logo-app-icon-mark` | 1024 × 1024 | Symbol only, Grounded Green, centered on transparent | **Candidate.** Grounded Green. Square compact uses |
| `cuidance-app-icon-1024` | 1024 × 1024 | Quiet Paper symbol on a solid Grounded Green square | **Candidate.** Grounded Green. Only 1024 px exists (decision 6) |
| `cuidance-favicon-16x16` | 16 × 16 | Symbol only, Grounded Green, transparent | **Candidate.** Browser tab icon |
| `cuidance-favicon-32x32` | 32 × 32 | Symbol only, Grounded Green, transparent | **Candidate.** Browser tab icon |
| `cuidance-favicon-48x48` | 48 × 48 | Symbol only, Grounded Green, transparent | **Candidate.** Browser tab icon |
| `cuidance-logo-care-terracotta` | 1205 × 275 | Lockup in terracotta `#AA4729` | **Reference only.** Never in the Admin Web interface (decision 2) |
| `cuidance-logo-compass-blue` | 1175 × 291 | Lockup in blue `#0E34CE` | **Reference only.** Never in the Admin Web interface (decision 2) |

**Admin Web logo integration: Pending clean approved asset.** Admin Web shows no logo and no favicon yet. "Candidate" means the file is Grounded Green and frame-free, but it isn't approved for display until its open question is resolved.

### Team 03 decisions (Oct 22, 2026)

1. **Grounded Green is the only approved active Cuidance logo color for Admin Web.**
2. **Compass Blue and Care Terracotta are reference variants only.** Never use them in the Admin Web interface.
3. **Don't edit, redraw, recolor, rename or regenerate any supplied logo asset.** The package is read-only source material.
4. **Don't use the horizontal, one-color, reversed or stacked files** until their frame artifacts are corrected by hand.
5. **The SVG files are raster-reference SVG wrappers**, not true vector masters.
6. **Don't generate missing app-icon sizes.**
7. **Don't add a logo to the Admin Web shell** unless the selected asset is visibly clean and has no border artifact.

### Open asset questions

Questions 1 and 7 are settled and question 5 is partly settled. The rest stay open. Question 8 matters only for the Grounded Green files Admin Web may use, and those already match `#21332B` exactly.

1. **Care Terracotta and Compass Blue logos.** *Settled by decisions 1 and 2:* reference only, never in the Admin Web interface.
2. **Thin frame around four PNGs.** `horizontal-lockup`, `one-color`, `reversed` and `stacked-lockup` have a 1 px light-gray line around the image edge (`reversed` also has a dark line), which looks like an export or crop leftover. On screen it would draw a box around the logo, which the board's clear-space rule doesn't allow. **Open:** these files wait for a manual correction (decision 4).
3. **`cuidance-logo-symbol-mark.svg` would stretch the mark.** The SVG says 1024 × 671, but its PNG is 642 × 549. Displayed through the SVG, the mark would be distorted. Use the PNG, or re-export the SVG at 642 × 549.
4. **Edge-to-edge crops.** `primary-lockup` and `symbol-mark` have artwork touching the image edge. Confirm nothing is clipped. The required clear space then has to come from the layout around them.
5. **No true vector files.** The package has no real SVG artwork, so the logo can't scale beyond the PNG sizes. *Settled by decision 5:* treated as raster-reference wrappers. **Open:** whether true vector masters will be supplied.
6. **App icon sizes.** The package has one 1024 × 1024 app icon. The board lists a 512 × 512 export master. No 180, 192 or 512 px files are included, and none were created (decision 6). **Open:** whether more sizes will be supplied.
7. **Lockup roles.** *Settled by decision 1:* only Grounded Green is active for Admin Web. The near-black horizontal and stacked lockups aren't used.
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
