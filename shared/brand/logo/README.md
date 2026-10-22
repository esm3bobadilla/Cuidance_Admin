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

The folder holds two kinds of files:

1. **Original package assets:** the 26 files in `png/` and `svg/` from `Cuidance_LogoAssets_ClaudeCode_v03`, kept exactly as supplied. Their statuses are in the table directly below.
2. **Team 03 additions:** the approved 512 px app icon in `png/`, plus five corrected derived exports and three derived raster lockups in `png/derived/`. See "Derived Team 03 exports" and "Derived raster lockups" below.

All 26 package files are copied unchanged from `Cuidance_LogoAssets_ClaudeCode_v03.zip` (folder `cuidance-logo-assets-v01/`), with the package's own filenames and its `png/` and `svg/` subfolders. **The package filenames are the authoritative Team 03 naming system.** The earlier 12-file list that used to be in this README is retired.

One file was added later, outside the package: `png/cuidance-app-icon-512.png`, the Team 03 approved 512 px app-icon export (Oct 22, 2026). It was supplied separately and copied in unchanged. The original package files were not modified.

**Important:** the SVG files are not vector artwork. Each one is a small wrapper that displays the PNG with the same name from `../png/`. Keep `png/` and `svg/` side by side, or the SVGs show nothing.

| File (in `png/` and `svg/` unless a folder is named) | PNG size | What it is | For Admin Web? |
| --- | --- | --- | --- |
| `svg/cuidance-logo-primary-lockup.svg` | 1271 × 289 (wrapper) | SVG wrapper for the primary lockup | **Do not use — clipped artwork** (decision 8) |
| `png/cuidance-logo-primary-lockup.png` | 1271 × 289 | Mark + wordmark, Grounded Green, transparent | **Do not use — clipped artwork.** Top of the head is cut off (see PNG inspection) |
| `cuidance-logo-horizontal-lockup` | 1974 × 609 | Mark + wordmark, near-black `#181818`, transparent | **Do not use.** Frame artifact (decision 4) |
| `cuidance-logo-stacked-lockup` | 1485 × 973 | Stacked mark over wordmark, near-black `#050505`, transparent | **Do not use.** Frame artifact (decision 4) |
| `cuidance-logo-reversed` | 1716 × 826 | Light mark + wordmark, `#F7F2E9`, transparent | **Do not use.** Frame artifact (decision 4) |
| `cuidance-logo-one-color` | 1902 × 712 | One-color lockup, near-black `#0B0B0A`, transparent | **Do not use.** Frame artifact (decision 4) |
| `svg/cuidance-logo-symbol-mark.svg` | 1024 × 671 (wrapper) | SVG wrapper for the symbol mark | **Do not use — clipped artwork** (decision 8) |
| `png/cuidance-logo-symbol-mark.png` | 642 × 549 | Symbol only, Grounded Green, transparent | **Candidate — clean, pending Team 03 approval.** Not clipped. No built-in clear space (see PNG inspection) |
| `png/cuidance-logo-app-icon-mark.png` | 1024 × 1024 | Complete symbol, Grounded Green, centered on transparent | **Candidate — clean, pending Team 03 approval** (see icon and favicon inspection) |
| `png/cuidance-app-icon-512.png` | 512 × 512 | Complete Quiet Paper symbol, centered on a solid Grounded Green square. Added separately, not part of the v03 package. PNG only, no SVG wrapper | **Approved — Team 03 approved 512 px app-icon export** |
| `png/cuidance-app-icon-1024.png` | 1024 × 1024 | Complete Quiet Paper symbol, centered on a solid Grounded Green square | **Candidate — clean, pending Team 03 approval.** Separate from the approved 512 px export |
| `png/cuidance-favicon-16x16.png` | 16 × 16 | Symbol, Grounded Green, stretched to fill the square | **Do not use — insufficient clear space.** Mark is also distorted (see icon and favicon inspection) |
| `png/cuidance-favicon-32x32.png` | 32 × 32 | Symbol, Grounded Green, stretched to fill the square | **Do not use — insufficient clear space.** Mark is also distorted |
| `png/cuidance-favicon-48x48.png` | 48 × 48 | Symbol, Grounded Green, stretched to fill the square | **Do not use — insufficient clear space.** Mark is also distorted |
| `svg/` versions of the app icons and favicons | — | Raster-reference wrappers for the PNGs above (decision 5) | Follow the PNG's status. Not vector artwork |
| `cuidance-logo-care-terracotta` | 1205 × 275 | Lockup in terracotta `#AA4729` | **Reference only.** Never in the Admin Web interface (decision 2) |
| `cuidance-logo-compass-blue` | 1175 × 291 | Lockup in blue `#0E34CE` | **Reference only.** Never in the Admin Web interface (decision 2) |

**Admin Web logo integration: Pending clean approved asset.** Admin Web shows no logo and no favicon yet. **Full lockup integration stays pending until a clean full lockup is supplied:** every lockup in the package is clipped, framed or a reference-only color. "Candidate" means the file is Grounded Green and frame-free, but it isn't approved for display until its open question is resolved. 

### PNG inspection (Oct 22, 2026)

Both files were inspected read-only. Nothing was edited, cropped, converted or renamed. "Clipped" means pixels are actually cut off, not just that the artwork touches the edge.

| Check | `png/cuidance-logo-primary-lockup.png` | `png/cuidance-logo-symbol-mark.png` |
| --- | --- | --- |
| 1. Pixel size | 1271 × 289 | 642 × 549 |
| 2. Transparency | Palette PNG with on/off transparency only (alpha 0 or 255, no soft edges). Visible artwork fills the whole canvas: bounds (0, 0) to (1271, 289) | Same type. Visible artwork fills the whole canvas: bounds (0, 0) to (642, 549) |
| 3. Clipped? | **Yes, at the top of the head.** The head is 124 × 118 (width ÷ height 1.051). Every other copy of the mark in the package is 1.018 to 1.026, so the head is about 3 px short, and it touches only the top edge. Its first row is 23 px wide. The Compass Blue lockup's head, nearly the same size, starts with a 6 px row and then a 23 px row, so at least the rounded top row is missing here. The bowl's bottom and left edges and the wordmark's right edge match the other lockups and show no cut. | **No.** Its transparency is identical, pixel for pixel, to the artwork inside `png/cuidance-logo-app-icon-mark.png`, where the same mark sits on a 1024 × 1024 canvas with 191 to 238 px of empty space on every side. So this file is a tight crop of the complete mark. |
| 4. Touches the edge? | Yes, all four sides: top (head, 23 px), bottom (bowl, 35 px), left (bowl, 23 px), right (the "e", 22 px) | Yes, all four sides: top (head, 20 px), bottom (bowl, 44 px), left (29 px), right (34 px) |
| 5. Clear space in the file? | None | None. The board's clear space is x = the head's height (230 px at this file's size), so it has to come from the layout around the image |
| 6. Approved color? | Yes. One color only, `#21332B` Grounded Green | Yes. One color only, `#21332B` Grounded Green |
| 7. Fit at native size? | No. 1271 px is wider than the board's 480 px maximum for the primary lockup, and the hard on/off edges look stair-stepped at 1:1 | Not at native size. 642 px is wider than the board's 128 px maximum for the symbol mark, and the edges look stair-stepped at 1:1. Shown smaller (24 to 128 px), the browser smooths the edges, so the file is usable when scaled down |
| **Status** | **Do not use — clipped artwork** | **Candidate — clean, pending Team 03 approval** |

The symbol mark is a Candidate and not "insufficient clear space" because the board's clear-space rule is about placement ("keep text, borders … outside this area"), and the artwork itself is complete. If Team 03 wants clear space built into the file, change its status to **Do not use — insufficient clear space**.

### Icon and favicon inspection (Oct 22, 2026)

All five files were inspected read-only. Nothing was edited, cropped, converted or renamed. The reference for "complete" is `png/cuidance-logo-symbol-mark.png`, which the earlier inspection showed to be the whole, uncut mark (642 × 549, so about 1.17 times wider than tall). Clear space is measured against the board's rule: x = the height of the circular head.

| Check | `cuidance-logo-app-icon-mark.png` | `cuidance-app-icon-1024.png` |
| --- | --- | --- |
| 1. Pixel size | 1024 × 1024 | 1024 × 1024 |
| 2. Transparency | Palette PNG, on/off transparency only (alpha 0 or 255). Artwork bounds (191, 237) to (833, 786) | Fully opaque, no transparency. The Quiet Paper mark sits at (191, 237) to (833, 786) |
| 3. Clipped? | **No.** The artwork is identical, pixel for pixel, to the complete symbol mark, and it doesn't touch any edge | **No.** The Quiet Paper mark has exactly the same shape as `app-icon-mark` (0 differing pixels) |
| 4. Centered? | Yes. 191 px left and right, 237 px top, 238 px bottom (within 1 px) | Yes. Same position: 191 / 191 / 237 / 238 px |
| 5. Clear space | Present. Top and bottom (237 / 238 px) exceed x (230 px). Left and right (191 px) are 39 px short of x | Present, same as `app-icon-mark`. Inside an app icon the Grounded Green square is the solid field the board asks for. Whether the x rule applies inside an icon tile is a Team 03 call |
| 6. Approved color? | Yes. One color only, `#21332B` | Yes. Only `#21332B` (field) and `#F4F2EC` Quiet Paper (mark), which matches the board's app icon spec |
| 7. Fit for intended use? | Yes for square compact uses, shown at 24 to 128 px. Hard on/off edges look stair-stepped at 1:1 but smooth when scaled down | Fit as an app icon master. The board asks for a 512 × 512 master, and no 180, 192 or 512 px exports exist (none generated, decision 6). Admin Web is a browser tool, so it doesn't need an app icon yet |
| **Status** | **Candidate — clean, pending Team 03 approval** | **Candidate — clean, pending Team 03 approval** |

| Check | `cuidance-favicon-16x16.png` | `cuidance-favicon-32x32.png` | `cuidance-favicon-48x48.png` |
| --- | --- | --- | --- |
| 1. Pixel size | 16 × 16 | 32 × 32 | 48 × 48 |
| 2. Transparency | Palette PNG with soft (anti-aliased) edges: 99 alpha levels. Artwork bounds fill the whole canvas | Same, 153 alpha levels. Fills the canvas | Same, 194 alpha levels. Fills the canvas |
| 3. Clipped? | **No pixels are cut off, but the mark is distorted.** The favicon matches the complete mark squashed into a square (2.2% mean difference). The alternatives are a proportional fit (10.7%) or a side crop (10.5%) | Not clipped, same distortion (1.2% stretched vs 14.2% proportional and 8.9% cropped) | Not clipped, same distortion (0.8% stretched vs 12.7% proportional and 9.0% cropped) |
| 4. Centered? | Fills the canvas edge to edge, so centered only by stretching | Same | Same |
| 5. Clear space | **None.** The mark touches all four edges. A favicon is shown as-is, so layout can't add space | **None.** Touches all four edges | **None.** Touches all four edges |
| 6. Approved color? | Yes. Only `#21332B` (solid and soft-edge pixels) | Yes. Only `#21332B` | Yes. Only `#21332B` |
| 7. Fit for intended use? | **No.** The board says not to stretch or distort the logo. The mark's width is squeezed by about 15%, so the round head becomes a tall oval | **No**, same distortion | **No**, same distortion |
| **Status** | **Do not use — insufficient clear space** | **Do not use — insufficient clear space** | **Do not use — insufficient clear space** |

The favicons carry **Do not use — insufficient clear space** because that's the closest allowed status: the mark fills the square edge to edge with no space around it. **The distortion is a second, separate problem:** it would still need fixing even if clear space were added. Correct favicons need a new export of the complete mark at its true proportions, centered in the square. They must not be generated here (decisions 3 and 6).

### Approved 512 px app icon (Oct 22, 2026)

Team 03 approved `png/cuidance-app-icon-512.png` as the 512 px app-icon export, which is the 512 × 512 master size the board lists. Checked read-only when it was added:

- **Size:** 512 × 512, opaque PNG with no transparency.
- **Color:** Grounded Green `#21332B` field and Quiet Paper `#F4F2EC` mark, matching the board's app icon spec. The only other pixels are a few hundred soft in-between edge pixels.
- **Artwork:** the same artwork as `png/cuidance-app-icon-1024.png` at half size (0.07% mean difference from the 1024 file scaled down), so the mark is complete and centered the same way.
- **Use:** approved as the app-icon export. Admin Web doesn't display it yet. No sizes were generated in this repository (decisions 3 and 6). The 180 and 192 px exports below were made by Team 03.

The approved 512 px app icon remains the **current Team 03-approved master**.

### Derived Team 03 exports (Oct 22, 2026)

Five corrected PNG exports from Team 03, derived from the approved Cuidance symbol and app-icon artwork. They're in **`png/derived/`**, with their exact filenames, because three of them share names with the original package favicons in `png/`. Putting them in a separate folder keeps both sets intact. They were copied in unchanged. Nothing in `png/` or `svg/` was overwritten, renamed or edited, and the package's favicon SVG wrappers still point at the original files in `png/`.

| File | Size | Checked (read-only) | Status |
| --- | --- | --- | --- |
| `png/derived/cuidance-favicon-16x16.png` | 16 × 16 | Transparent PNG. Mark 12 × 10 (about 1.2 : 1, true mark 1.17 : 1). Transparent space: 2 px each side, 3 px top and bottom. Only `#21332B` | **Candidate — corrected derived export, pending Team 03 approval** |
| `png/derived/cuidance-favicon-32x32.png` | 32 × 32 | Transparent PNG. Mark 25 × 21 (1.19 : 1). Transparent space: 3 / 4 px at the sides, 5 / 6 px top and bottom. Only `#21332B` | **Candidate — corrected derived export, pending Team 03 approval** |
| `png/derived/cuidance-favicon-48x48.png` | 48 × 48 | Transparent PNG. Mark 38 × 32 (1.19 : 1). Transparent space: 5 px each side, 8 px top and bottom. Only `#21332B` | **Candidate — corrected derived export, pending Team 03 approval** |
| `png/derived/cuidance-app-icon-180.png` | 180 × 180 | Opaque PNG. `#21332B` field, `#F4F2EC` mark. Matches the approved 512 px icon scaled down (0.24% mean difference) | **Candidate — corrected derived export, pending Team 03 approval** |
| `png/derived/cuidance-app-icon-192.png` | 192 × 192 | Opaque PNG. `#21332B` field, `#F4F2EC` mark. Matches the approved 512 px icon scaled down (0.20% mean difference) | **Candidate — corrected derived export, pending Team 03 approval** |

- **Favicons:** the derived favicons keep the symbol mark's proportions (within a pixel of rounding at these sizes) and include transparent space around the mark. They replace nothing. The **original stretched favicons in `png/` stay marked Do not use**.
- **App icons:** the 180 and 192 px icons are derived from the approved 512 px app icon, which remains the current Team 03-approved master.
- **Not integrated:** none of these files are used in Admin Web yet.
- **Still pending:** a clean approved full lockup export, and true vector SVG masters made from original vector artwork. No lockup or SVG was created from raster artwork.
- **Still excluded:** every clipped, framed, distorted or raster-wrapper asset listed above.

### Derived raster lockups (Oct 22, 2026)

Three derived raster lockups from Team 03, copied unchanged into `png/derived/`. Their names don't clash with any package file, and nothing in `png/` or `svg/` was overwritten. **These are raster PNGs, not vector SVG masters.** No SVG was made from them.

| File | Use | Checked (read-only) | Status |
| --- | --- | --- | --- |
| `png/derived/cuidance-logo-primary-lockup.png` | Light backgrounds | 1247 × 341 transparent PNG. Only Grounded Green `#21332B` | **Derived raster export — pending Team 03 approval** |
| `png/derived/cuidance-logo-primary-lockup-reversed.png` | Dark backgrounds | 1247 × 341 transparent PNG. Only Quiet Paper `#F4F2EC` | **Derived raster export — pending Team 03 approval** |
| `png/derived/cuidance-logo-primary-lockup-one-color.png` | Monochrome use | 1247 × 341 transparent PNG. Only Guidance Ink `#111111` | **Derived raster export — pending Team 03 approval** |

What checks out:

- **Colors:** each file uses exactly one board color, with no stray tints.
- **No frame:** 32 px of transparent space on all four sides, and no visible pixel on any image edge.
- **Same artwork:** all three have the identical shape, pixel for pixel. Only the color differs.
- **Hard edges:** on/off transparency only (no soft edges), like the original package files. Best shown scaled down to the board's 160 to 480 px width.

**Check before approving: the head looks flattened at the top.** The head is 118 × 112, a width ÷ height ratio of 1.054. The clipped original `png/cuidance-logo-primary-lockup.png` measures 1.051, and every complete copy of the mark in the package is 1.018 to 1.026. The head's top row is 20 px wide with no narrow cap row (the complete Compass Blue head starts at 6 px), and up close the top edge is visibly flat where the complete mark is round. That suggests these lockups were built from the clipped primary-lockup artwork, with space added around it. The cut no longer touches the image edge, but it may still be in the drawing. Team 03 should compare the head with the complete symbol before approving.

The full lockup integration stays pending until a lockup is approved. True vector SVG masters still need a new export from the original design file.

**Corrected lockups v02 reviewed, not copied (Oct 22, 2026).** `Cuidance_Corrected_Lockups_v02_upload.zip` held corrected versions of all three files. They fix the head: 120 × 117 (ratio 1.026), with a curve that matches the complete symbol. Each is one exact color, on a transparent background with no frame. Team 03 chose to wait for a re-export because of two problems:

1. **Uneven margins:** 32 px on the left, top and bottom, but 41 px on the right. The canvas stayed 1247 px wide while the artwork got 9 px narrower.
2. **Stray specks:** 405 isolated specks (561 px in all, the largest 15 px) sit just outside the letter and mark outlines in all three files.

**The next export needs:** the complete round head (as in v02), even transparent margins on all four sides, and no stray pixels. Until then, the files above stay in place with their flattened-head warning, pending Team 03 approval.

**Corrected lockups v03 reviewed, not copied (Oct 22, 2026).** `Cuidance_Corrected_Lockups_v03_upload.zip` fixes the margins: the canvas is now 1238 × 341, with exactly 32 px of transparent space on every side. The round head (120 × 117, ratio 1.026), the transparent background, the absence of a frame and the single exact color per file all still pass. **The 405 stray specks (561 px) are unchanged from v02**, in all three files, so v03 fails the no-stray-pixels check and wasn't copied. The next export only needs those specks removed.

### Vector source search (Oct 22, 2026)

The supplied package (`Cuidance_LogoAssets_ClaudeCode_v03.zip`, folder `cuidance-logo-assets-v01/`) was searched recursively, read-only.

- **Contents:** 27 files: 13 PNG, 13 SVG, 1 README. There are **no** `.ai`, `.eps`, `.pdf`, `.fig`, `.figma`, `.sketch`, `.afdesign`, `.cdr` or nested `.zip` files.
- **SVGs:** all 13 were parsed. **None** contains vector shapes (`<path>`, `<circle>`, `<rect>`, `<polygon>`, `<polyline>`, `<ellipse>` or `<line>`). Each holds a single `<image>` that points to the matching file in `../png/`. They're PNG wrappers, not vector artwork. The copies in `svg/` are identical to the package.
- **True vector artwork:** none in the package.
- **Clean, uncut full lockup:** none. Every lockup PNG is clipped (`primary-lockup`), framed (`horizontal`, `stacked`, `reversed`, `one-color`) or a reference-only color (`compass-blue`, `care-terracotta`).
- **Uncut symbol-mark vector:** none. The complete symbol exists only as raster (`png/cuidance-logo-symbol-mark.png`, and the mark inside `png/cuidance-logo-app-icon-mark.png`).
- **Can anything here safely produce a clean full lockup, a true vector symbol mark, or Grounded Green and reversed variants?** No. Tracing or converting the PNGs would be redrawing the logo, which decision 3 forbids. The design-system board PDF isn't part of the package. Its logo images appear to be placed raster images, and it's a presentation board rather than an approved master, so it isn't a source either.

**No editable vector master is present in the supplied package. A new export from the original design file is required.** That export should include a clean Grounded Green full lockup, a true vector symbol mark, and the reversed (Quiet Paper) variants.

### Team 03 decisions (Oct 22, 2026)

1. **Grounded Green is the only approved active Cuidance logo color for Admin Web.**
2. **Compass Blue and Care Terracotta are reference variants only.** Never use them in the Admin Web interface.
3. **Don't edit, redraw, recolor, rename or regenerate any supplied logo asset.** The package is read-only source material.
4. **Don't use the horizontal, one-color, reversed or stacked files** until their frame artifacts are corrected by hand.
5. **The SVG files are raster-reference SVG wrappers**, not true vector masters.
6. **Don't generate missing app-icon sizes.**
7. **Don't add a logo to the Admin Web shell** unless the selected asset is visibly clean and has no border artifact.
8. **`svg/cuidance-logo-primary-lockup.svg` and `svg/cuidance-logo-symbol-mark.svg` are clipped and must not be used in Admin Web.** Don't edit, regenerate, convert or integrate them. Their PNG files are listed separately and stay pending independent inspection.

### Open asset questions

Questions 1, 3, 4 and 7 are settled, and question 5 is partly settled. Questions 9 and 10 come from the icon and favicon inspection. The rest stay open. Question 8 matters only for the Grounded Green files Admin Web may use, and those already match `#21332B` exactly.

1. **Care Terracotta and Compass Blue logos.** *Settled by decisions 1 and 2:* reference only, never in the Admin Web interface.
2. **Thin frame around four PNGs.** `horizontal-lockup`, `one-color`, `reversed` and `stacked-lockup` have a 1 px light-gray line around the image edge (`reversed` also has a dark line), which looks like an export or crop leftover. On screen it would draw a box around the logo, which the board's clear-space rule doesn't allow. **Open:** these files wait for a manual correction (decision 4).
3. **`cuidance-logo-symbol-mark.svg` would stretch the mark.** The SVG says 1024 × 671, but its PNG is 642 × 549. Displayed through the SVG, the mark would be distorted. *Settled by decision 8:* this SVG is marked Do not use (clipped artwork).
4. **Edge-to-edge crops.** `primary-lockup` and `symbol-mark` have artwork touching the image edge. *Settled by decision 8 and the PNG inspection:* both SVG files and `png/cuidance-logo-primary-lockup.png` are clipped and must not be used. `png/cuidance-logo-symbol-mark.png` isn't clipped and is a Candidate, pending Team 03 approval. If it's approved, its clear space has to come from the layout around it.
5. **No true vector files.** The package has no real SVG artwork, so the logo can't scale beyond the PNG sizes. *Settled by decision 5:* treated as raster-reference wrappers. **Open:** true vector SVG masters, pending original vector artwork. None are made from raster artwork.
6. **App icon sizes.** The package has one 1024 × 1024 app icon. *Partly settled:* Team 03 supplied and approved `png/cuidance-app-icon-512.png`, the 512 × 512 master the board lists. Team 03 also supplied 180 and 192 px exports, derived from the 512 px master. They're in `png/derived/` as candidates. None were created in this repository (decision 6). **Open:** Team 03 approval of the 180 and 192 px exports.
7. **Lockup roles.** *Settled by decision 1:* only Grounded Green is active for Admin Web. The near-black horizontal and stacked lockups aren't used.
8. **Exact colors.** Only the Grounded Green files (`primary-lockup`, `symbol-mark`, `app-icon-mark`, `app-icon-1024` and the favicons) use an exact palette value (`#21332B`, with `#F4F2EC` on the app icon). The others are close to, but not exactly, the board colors: `#181818`, `#0B0B0A` and `#050505` instead of Guidance Ink `#111111`, and `#F7F2E9` instead of Quiet Paper `#F4F2EC`. The terracotta (`#AA4729`) and blue (`#0E34CE`) versions don't match Care Terracotta `#A8432A` or Compass Blue `#1F3FD1` either. Confirm these exports are final.
9. **Favicons are stretched.** All three favicons squeeze the mark into a square, about 15% narrower than its true proportions, with no clear space. *Partly settled:* Team 03 supplied corrected 16, 32 and 48 px favicon exports in `png/derived/`. They keep the mark's proportions and have transparent space around it, and they're candidates. The original stretched favicons in `png/` stay Do not use. **Open:** Team 03 approval of the derived favicons. Until then Admin Web has no favicon.
10. **No clean full lockup.** Every lockup in the package is clipped (`primary-lockup`), framed (`horizontal`, `stacked`, `reversed`, `one-color`) or a reference-only color (`compass-blue`, `care-terracotta`). *Partly addressed:* Team 03 supplied three derived raster lockups in `png/derived/` (Grounded Green, reversed, one-color), pending approval. They have clean margins and exact colors, but the head may still be flattened at the top (see "Derived raster lockups"). **Open:** Team 03 approval, and a true vector master. Full lockup integration stays pending.

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
