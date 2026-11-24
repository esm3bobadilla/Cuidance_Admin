# Admin Web polish pass

_Branch `claude/clever-goldberg-vgmhex`, started again from `main` at `31fef45` (Phase 3 merged). Frontend only. No product files or product data, Supabase data, roles, RLS, credentials, external services or teammate-owned product work changed. Main navigation labels unchanged._

Layout reference: the Team 03 Content workspace visual reference (Nov 24, 2026). It's a structural reference only; the page uses the existing components, illustrations and Cuidance tokens. The separate sketch didn't reach the build session.

## What changed

| Area | Before | After |
| --- | --- | --- |
| Dashboard, Today at a glance | 48 px illustrations beside the whole text column | 72 px illustrations (64 px in narrow cards, four across on smaller laptops) in the upper-right, beside the label and number; the supporting lines run full width underneath. Proportions kept (square field, `object-fit: contain`), card heights within a few pixels of before, the number stays the largest text. Long label words wrap instead of meeting the artwork |
| Content | A Content library panel, then a separate Browse by area section (9 compact links), then the Content workspace panel with type chips | Content library introduction (Newsreader heading, one line, New content) without a panel. Then one Content workspace surface: **Browse by area** as an illustrated left column (Guidance, Products, App content, Website, Partner content) and **search, Filter and results** on the right. Stacks on tablets (areas two across) and phones (compact cards) |
| Email, Invite template | Plain invite copy, one preview size | The Week 12 sample invitation: subject, preview text, eyebrow, headline, two-paragraph body, one Accept invitation button, the approved invite illustration, and a support and footer band. The preview has a Desktop / Mobile switch and a "Sample email · not sent" tag. Nothing is sent or scheduled |
| Supporting wording | A few internal phrases ("parent section", "require", "are deferred") | Plainer wording on the Content and Guidance Rules screen notes, Dashboard descriptions and the roles card. No labels renamed |
| Docs | Branch inventory said cleanup was pending | `../branch-inventory.md`: Phase 3 merged, Pages deploy succeeded, 20 branches deleted, three kept |

### Browse by area

| Area | Opens | Illustration (approved, existing) |
| --- | --- | --- |
| Guidance | Guidance Content | Document (content categories) |
| Products | Product Library | Product set (content categories) |
| App content | Live, App | Phone (Dashboard glance set) |
| Website | Live, Website | Browser window (Dashboard glance set) |
| Partner content | Partner Highlights | Group of people (content categories) |

The illustrations are decorative (`alt=""`); each link is named by its area and note. Copy follows the visual reference, with two changes: "expert guidance" became "guidance" (Cuidance doesn't present expert judgment), and the reference's workspace line "Most recent updates and priority work" became "Every content item, with its type, status and last update", because the list isn't sorted by date.

## Decisions to confirm

1. **Areas no longer on the Content page:** Quiz Content, Knowledge Sources, Product Information, Claims & Safety Review, Commercial Content and Guidance Rules Review. The first four still open from their rows in the results. **Commercial Content and Guidance Rules Review are now reachable only from the top-bar workspace search.**
2. **The content type chips** (All types, Guidance, Quiz and so on) were removed to match the reference. Type filtering stays in the Filter drawer.

## Checks

| Check | Result |
| --- | --- |
| Type check | Pass |
| `npm test` | 42 of 42 |
| Production build; GitHub Pages build with the sample-mode check | Pass; Pass |
| Full page pass: 26 pages at 1440, 834, 390, 720 (200% zoom), 640 (200% zoom) and 320 px, in light, dark, and high contrast with larger text and reduced motion; the real width of every load is confirmed | 312 loads, 0 failures (no horizontal scrolling, one main heading, no console errors, no em dashes) |
| Polish checks (below) | 22 of 22 |
| Phase 3 checks | 20 of 20 |
| Product Library, Email, Live, Demo, Keyboard and touch | 17, 20, 15, 18, 21: all pass |
| Roles (Super Admin and Team Member) | 37 of 37 |
| axe-core, 33 routes plus drawers and dialogs, light and dark | 0 findings except the known Product Library "View" wording (protected product file) |

**Polish checks (22):**
- **Dashboard glance:** light, dark, high contrast with larger text and forced colors, each at 10 widths from 1920 to 320 px. The art is at least 64 px and square, never overlaps or clips text, and the number stays the largest text.
- **Content:** light, dark and high contrast at 10 widths.
  - The structure order is right, and the areas sit beside the results from 1280 px up and above them on smaller screens.
  - The five area cards are readable (no clipped text, notes at least 13 px), links are at least 44 px tall, and nothing overflows.
  - Areas form one named navigation region, link names come from the visible text, and the illustrations are decorative.
  - Tab order runs New content, then the five areas, then search and Filter, and every focused control shows a visible focus ring.
  - The empty search state works, and Clear restores all 41 items.
- **Email invitation:** light, dark and high contrast at 6 widths.
  - Desktop and Mobile switch with the keyboard, and every Week 12 part shows.
  - The mobile frame is 320 px (larger with the larger-text setting), and nothing overflows.
  - The illustration has alt text.
  - There is one call to action, and it's a picture of a button, not a link.
- **Alt text:** every image on 16 routes has alt text, or `alt=""` when decorative.
- **States:** empty, loading and error states show on Email, Review Tasks, Live and Quiz (12 states).

Three issues found by these checks were fixed before this report:
- a long Dashboard label with larger text;
- the Content layout stacking at 1280 px;
- the Content search field 14 px too wide at 320 px with larger text.

**Test-script fix:** the full page pass from Phase 3 loaded every page at 1280 px (the browser ignored the requested width). It now sets and confirms each width, and the Phase 3 QA note carries a correction.

## Evidence

`evidence/`:
- `compare-dashboard-glance-1440.png`, `compare-dashboard-glance-390.png`
- `compare-content-1440.png`, `compare-content-390.png` (before is `main` at `31fef45`)
- `email-invitation-preview.png` (desktop and mobile)
