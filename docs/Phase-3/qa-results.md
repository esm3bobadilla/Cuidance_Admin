# Phase 3: QA results

_Static build, sample mode, Chromium (Playwright). Run on Nov 20, 2026 on `claude/clever-goldberg-vgmhex`. Team Member results come from a temporary local build with the sample role set to Team Member; that change was reverted and is not committed._

## Re-run after merging `main` (Nov 23, 2026)

`main` gained PR #26 (Product Library reference products), so it was merged into this branch (merge commit, no rebase; only `README.md` overlapped and merged on its own). Every PR #26 file is identical to `main`. Every check below was run again on the merged branch:

| Check | Result |
| --- | --- |
| Type check | Pass |
| `npm test` | 42 of 42 (PR #26 added 4) |
| Production build; GitHub Pages build with the sample-mode check | Pass; Pass |
| Phase 3 checks | 20 of 20 |
| Full page pass (26 pages, widths, modes) | 312 page loads, 0 failures |
| Product Library 17, Email 20, Live 15, Demo 18, Keyboard and touch 21 | All pass |
| Roles (Team Member) | 37 of 37 |
| Accessibility scan, 33 routes | Only the known Product Library "View" wording (protected product file) |

Test-script note: the browser scripts named the old sample products ("Barrier support serum" and others). They now use PR #26 records. The "archived filter" step archives a record first, because the new data starts with none archived. The Team Member steps open their own draft instead of a fixed name and check that the Dashboard count goes up by one. No app code changed for this.

## Builds and unit tests

| Check | Result |
| --- | --- |
| Type check (`npx tsc --noEmit`) | Pass |
| Production build | Pass |
| GitHub Pages build (`GITHUB_PAGES=true`, sample mode) | Pass; the deploy workflow's sample-mode check passes (no Supabase address or key) |
| `npm test` (demo workflow and role rules) | 38 of 38 |

## Phase 3 checks: 20 of 20

- Authentication: the illustration is decorative (`alt=""` inside an `aria-hidden` layer) and uses cover (never stretched); headings in Newsreader, labels in Archivo; Forgot password opens its own screen; empty and invalid emails are rejected with focus on the field; sample mode says nothing is sent; Back to sign in works; Create account stays invitation-aware.
- Account area: Sign out visible in the lower-left with the role label, at least 44 px tall.
- No image stretched or squashed on 17 pages at 1440, 834 and 390 px.
- Banners: 5 banners at 320, 390, 600, 768, 834, 1024, 1279, 1280, 1440 and 1920 px: artwork cropped at most 25% at the sides (plain paper only) and the text never clipped.
- Forced colors (with reduced motion): no overflow and decorative backgrounds hidden on Sign in, Content and Metrics; panel outlines come back. High contrast setting: panel outlines come back.

## Full page pass: 312 page loads, 0 failures

**Correction (Nov 24, 2026):** the Phase 3 run of this pass loaded every page at the default 1280 px width: the test script asked for the widths below in a way the browser ignored. The other Phase 3 checks (banners, image proportions, roles, keyboard) set their widths correctly. The pass was fixed to confirm the real width of every load and run again on the polish branch (Phase 3 plus the polish changes): 312 loads at the listed widths, 0 failures. See `polish/admin-web-polish.md`.

26 pages (every route, including Forgot password) at 1440, 834, 390, 720 (1440 at 200% zoom), 640 (1280 at 200% zoom) and 320 px, in light, dark, and high contrast with larger text and reduced motion. On every load: no horizontal scrolling, exactly one main heading, no console or page errors, no em dashes in app text.

## Interaction suites (existing, re-run)

| Suite | Result |
| --- | --- |
| Product Library (alt text, archive, restore, request changes, filters, states) | 17 of 17 |
| Email (filters, editor, alt text, validation, schedule, send, cancel, delete, archive) | 20 of 20 |
| Live (previews, approve, request changes, Publish off, archive, prepare) | 15 of 15 |
| PR 2 demo walkthrough (persistence, Dashboard counts, reset, full-size preview) | 18 of 18 |
| Keyboard and focus (drawers and dialogs keep focus, Escape returns it, visible outlines, arrow-key tabs, 44 px targets) | 21 of 21 |

## Roles: 36 of 36

Team Member: no Approve, Request changes, Archive or Restore on products; no Send, Schedule, Archive template or Cancel scheduled; no Approve, Request changes, Publish or Archive on Live updates; Manage Team hidden; the account area shows Team Member with Sign out; Review Tasks filters available. Super Admin: Sign out with "Super Admin (sample)".

## Automated accessibility (axe-core, WCAG 2.0 / 2.1 / 2.2 AA plus best practice)

No new findings on 16 key pages (including Sign in, Create account and Forgot password), the Product drawer and form, and the Email editor, in light and dark.

**Accessibility fixes (Nov 21, 2026):** every page (33 routes) re-scanned for `landmark-unique` and `label-content-name-mismatch`.

| Finding | Before | After |
| --- | --- | --- |
| Repeated region names (`landmark-unique`) | 9 pages: the eight list-and-detail pages (the page section and the table's scroll area shared one name) and Profile (the sidebar card and the page were both "Profile") | 0. The table's scroll area is now "[table name], scrollable table" (one change in the shared `DataTable`); the sidebar card is "Your account" |
| Spoken name differs from visible text (`label-content-name-mismatch`) | Theme button, profile button on every page; Email "Use template" buttons; Product Library "View" buttons | Theme: "Light mode. Switch to dark mode" (or the dark version). Profile: "TM, Profile and notifications" plus the unread count. Email: "Use template: write an email from the [name] template". **Product Library "View" buttons not changed:** their wording is in `shared/content/product-library.ts`, a protected product file |

After the fixes: type check, `npm test` 38/38, production build, interaction suites (Product Library 17, Email 20, Live 15, Demo 18, Keyboard and touch 21, Phase 3 20) and roles 36/36 all pass.

## Not run

Database tests (`npm run db:test`): nothing under `supabase/` changed.
