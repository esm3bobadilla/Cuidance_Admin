# Week 10 Step 2: Admin Web source reconciliation audit

An audit only. It compares the current Team 03 Admin Web hi-fi screen references with the route map on `feat/admin-web-route-map` (routes from commit `c195ada`). **No application code, routes, navigation, tokens, components or assets were changed.** No pull request has been opened.

- **Date:** Oct 27, 2026 (revised the same day)
- **Prepared by:** Claude Code for Team 03. **Needs review by Alyssa and Esme.**

## Source rules for this audit

1. **The five current hi-fi images are the visual source of truth** for the screens they show. Team 03 can supply only these five in this session.
2. **For every other screen**, only the approved screen-name list and current CLAUDE.md terminology are used. No layouts, labels, parent relationships or detail screens are taken from anywhere else.
3. **The older wireframe PDF** (`T03_CuidanceAdminWeb_HiFiScreens_v01_ART646.pdf`) **is not a source.** Nothing in this report depends on it.
4. **Older labels are not reintroduced:** Product Catalog, Accounts, Metrics and Review Queue don't become standalone navigation items without Team 03 confirmation.

**Approved screen names:** Dashboard, Content, Quiz Content, Guidance Content, Product Information, Knowledge Sources, Partner Highlights, Commercial Content (only if the current source confirms it), Guidance Rules Review, Claims & Safety Review, Content Metrics, Account Support, Review Tasks, Settings.

## Evidence labels

| Label | Meaning |
| --- | --- |
| **VERIFIED** | Visible in one of the five current hi-fi images |
| **STRUCTURAL ONLY** | The approved screen name exists, but no current hi-fi image was supplied |
| **NEEDS TEAM CONFIRMATION** | The current source is missing, or conflicts with the route map |

## The five current hi-fi images

| Image | Screen | Page title | Breadcrumb shown | Sidebar shown |
| --- | --- | --- | --- | --- |
| A1 | Dashboard | Cuidance Admin Web (eyebrow "INTERNAL TOOL") | None | Dashboard, Content, Sources, Guidance Rules, Claims & Safety, Metrics, Account Support, Review Tasks, Settings |
| A2 | Quiz Content | Quiz Content | Admin / Content / Quiz Content | Dashboard, Content (Quiz Content, Guidance Content, Care Areas, Resources), People, Settings |
| A3 | Guidance Content | Guidance Content | Admin / Content / Guidance Content | Home, Content (Guidance Content, Resource Topics, Collections, Media Library), Users, Settings, Help |
| A4 | Product Information | Product Information | Admin / Content / Product Information | Home, Content (Product Information, Articles, Topics, Collections), Users, Analytics, Settings |
| A5 | Claims & Safety Review | Claims & Safety Review | Admin / Claims & Safety | Home, Content, Claims & Safety, Partners, Insights, Settings |

Notes on the images:

- **Only the page titles and breadcrumbs are used as verified naming evidence.** The sidebars differ from image to image (Home or Dashboard; People or Users; Analytics or Insights; different Content children), so sidebar labels aren't treated as verified names. A1's sidebar is cited only where it supports a top-level placement, and its short labels (Sources, Guidance Rules, Metrics) aren't adopted.
- **"Review Queue" appears twice, and neither is a navigation item:** as a section on the Dashboard (A1), and as an in-page tab on Claims & Safety Review (A5, next to Approved, Needs Changes and All Items). It isn't treated as a route.
- **The detail panels** on A2 (Question Details), A3, A4 (Product details) and A5 (Review Details) are part of those screens, not separate detail screens. No detail routes are proposed.

## Reconciliation table

Existing breadcrumbs and back links are as built in `c195ada`. Breadcrumbs start with "Dashboard", and the last item is the current page, not a link.

| Approved screen name | Evidence | Existing route | Existing parent | Current breadcrumb | Current back behavior | Match status | Recommended correction | Evidence source |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Dashboard | **VERIFIED** | `/` | (landing page) | None | None (landing page) | MATCH | None for routing. A1's layout (Review Queue section, Key Areas, Needs attention) belongs to the screen-build step | A1 |
| Content | **VERIFIED** (as the parent) | `/content/` | Dashboard | Dashboard / Content | ‹ Back to Dashboard | MATCH | Keep Content as the parent. No Content landing screen is shown, so keeping `/content/` as a page of links needs confirmation (C4) | A2, A3, A4 breadcrumbs |
| Quiz Content | **VERIFIED** | `/content/quiz-content/` | Content | Dashboard / Content / Quiz Content | ‹ Back to Content | MATCH (breadcrumb root differs) | Name, route and parent match. The verified breadcrumb starts with "Admin" (C2). A2 shows no back link (C3) | A2 |
| Guidance Content | **VERIFIED** | None | None | None | None | **MISSING** | Add `/content/guidance-content/` under Content, named "Guidance Content", with breadcrumb "… / Content / Guidance Content". Also in CLAUDE.md scope ("guidance content") | A3 (and A1 Key Areas) |
| Product Information | **VERIFIED** | `/content/product-information/` | Content | Dashboard / Content / Product Information | ‹ Back to Content | MATCH (breadcrumb root differs) | Name, route and parent match. Breadcrumb root as C2 | A4 |
| Claims & Safety Review | **VERIFIED** | `/claims-safety-review/` | Dashboard (top-level) | Dashboard / Claims & Safety Review | ‹ Back to Dashboard | **UPDATE** (breadcrumb only) | Title, route and top-level parent match. The verified breadcrumb is "Admin / Claims & Safety": a different root, and a short label as the last item. Change after C2 and C5 | A5 |
| Knowledge Sources | **NEEDS TEAM CONFIRMATION** | `/content/knowledge-sources/` | Content | Dashboard / Content / Knowledge Sources | ‹ Back to Content | Parent not confirmed | The name is approved, but no image shows it. Placing it under Content isn't shown anywhere, and A1 has a top-level "Sources" item. Keep the route unchanged until Team 03 confirms the parent (C6) | Approved name list; CLAUDE.md ("sources"); conflicting placement in A1 |
| Partner Highlights | **NEEDS TEAM CONFIRMATION** | `/content/partner-highlights/` | Content | Dashboard / Content / Partner Highlights | ‹ Back to Content | Parent not confirmed | The name is approved and appears as an A1 Key Areas card, but no screen and no parent are shown. Placing it under Content was never verified. Keep the route unchanged until Team 03 confirms the parent (C6) | Approved name list; CLAUDE.md; A1 card (name only) |
| Commercial Content | **NEEDS TEAM CONFIRMATION** | `/content/commercial-content/` | Content | Dashboard / Content / Commercial Content | ‹ Back to Content | Not confirmed by the current source | Approved "only if confirmed by the current source", and none of the five images show it. Recommend removing the route, unless Team 03 confirms it (C7) | Approved name list (conditional); CLAUDE.md ("commercial labels") |
| Guidance Rules Review | **STRUCTURAL ONLY** | `/guidance-rules-review/` | Dashboard (top-level) | Dashboard / Guidance Rules Review | ‹ Back to Dashboard | MATCH (structure) | Keep as is. No image shows the screen. Its top-level placement is consistent with A1's sidebar | Approved name list; A1 sidebar (placement only) |
| Content Metrics | **STRUCTURAL ONLY** | `/content-metrics/` | Dashboard (top-level) | Dashboard / Content Metrics | ‹ Back to Dashboard | MATCH (structure) | Keep "Content Metrics" (CLAUDE.md wording). Don't change it to "Metrics" | Approved name list; CLAUDE.md; A1 sidebar (placement only) |
| Account Support | **STRUCTURAL ONLY** | `/account-support/` | Dashboard (top-level) | Dashboard / Account Support | ‹ Back to Dashboard | MATCH (structure) | Keep as is. Don't use "Accounts" | Approved name list; CLAUDE.md; A1 sidebar |
| Review Tasks | **STRUCTURAL ONLY** | `/review-tasks/` | Dashboard (top-level) | Dashboard / Review Tasks | ‹ Back to Dashboard | MATCH (structure) | Keep as is. A1's "View review tasks" and "View all review tasks" actions support the Quiz Content to Review Tasks path | Approved name list; A1 sidebar and actions |
| Settings | **STRUCTURAL ONLY** | `/settings/` | Dashboard (top-level) | Dashboard / Settings | ‹ Back to Dashboard | MATCH (structure) | Keep as is. Settings appears in every sidebar, but no Settings screen was supplied. **No Team Access route**: no current image shows Team Access (C8) | Approved name list; A1 to A5 sidebars (placement only) |

## Patterns across every screen

| Pattern | Current hi-fi (A1 to A5) | Existing build | Evidence | Status |
| --- | --- | --- | --- | --- |
| Breadcrumb root | "Admin" on A2, A3, A4 and A5 | "Dashboard" (`/dev/` uses "Admin") | VERIFIED | NEEDS TEAM CONFIRMATION (C2). The images show "Admin", while "Dashboard" is the approved label for the landing page |
| Last breadcrumb item | The page title on A2 to A4. A short label on A5 ("Claims & Safety") | Always the full page title | VERIFIED | NEEDS TEAM CONFIRMATION (C5) |
| Eyebrow | "INTERNAL TOOL" on all five | "Internal tool" on the Dashboard. "Content" on Content child pages. None elsewhere | VERIFIED | UPDATE, at the screen-build step |
| Back link | None visible | "‹ Back to …" on every page except the Dashboard | VERIFIED (absence) | NEEDS TEAM CONFIRMATION (C3). Keep them until a sidebar exists |
| Persistent sidebar | On all five, with different items | Not built (not in the component inventory) | VERIFIED (presence); items inconsistent | Expected gap. Needs an approved navigation component and a confirmed item list (C1) |

## Decisions for Team 03

1. **C1. Sidebar items.** The five images show five different sidebars. Which list is approved? Until then, navigation stays Dashboard links plus breadcrumbs and back links.
2. **C2. Breadcrumb root.** Verified images use "Admin". The build uses "Dashboard". Which one?
3. **C3. Back links.** Keep "‹ Back to …", or rely on the breadcrumb and a future sidebar, as the images do?
4. **C4. Content landing page.** Keep `/content/` as a page of links to its children, or make Content only a navigation group?
5. **C5. Short breadcrumb labels.** A5 ends its breadcrumb with "Claims & Safety", not the page title. Is that the rule for every screen?
6. **C6. Knowledge Sources and Partner Highlights parents.** Both are currently under Content, which isn't shown in any image. Confirm or move them.
7. **C7. Commercial Content.** Not in the current source. Keep, fold into Partner Highlights, or remove?
8. **C8. Team Access.** Not in the current source. No route until confirmed.
9. **C9. Other Content children in the sidebars.** Care Areas, Resources, Resource Topics, Collections, Media Library, Articles and Topics aren't in the approved list. They aren't routed, and they need confirmation before they are.

## Content-rule flags in the five images

Not routing issues, but they'll matter when these screens are built. Each needs a Team 03 check against CLAUDE.md:

- **A3 Guidance Content:** "Based on dermatology-reviewed educational resources and expert input" and "Reviewed by clinical content lead" may read as a medical-review workflow, which is out of scope.
- **A2 Quiz Content:** the answers "Understanding a condition or topic" and "Finding care and next steps", and the "Emotional Wellbeing" care area, go beyond hair, skin, makeup and body care.
- **A4 Product Information:** brand names (Rivermere, Solara, Willow & Oak, Luma) appear. They look like sample names, but CLAUDE.md says no real brand names in guidance. "A good option for those looking for…" is close to recommendation wording.
- **A1 to A4:** each has one primary action (View review tasks, Add question, Add guidance, Add product information). "Add …" actions are editing features, and they aren't built yet.

## Summary

| Evidence | Screens |
| --- | --- |
| VERIFIED (5 images) | Dashboard, Quiz Content, Guidance Content, Product Information, Claims & Safety Review. Content is verified as the parent through the A2 to A4 breadcrumbs |
| STRUCTURAL ONLY | Guidance Rules Review, Content Metrics, Account Support, Review Tasks, Settings |
| NEEDS TEAM CONFIRMATION | Knowledge Sources (parent), Partner Highlights (parent), Commercial Content (not in source), Team Access (no route) |

| Route status | Screens |
| --- | --- |
| MATCH | Dashboard, Content, Quiz Content, Product Information, and the five STRUCTURAL ONLY screens |
| UPDATE | Claims & Safety Review (breadcrumb, after C2 and C5) |
| MISSING | Guidance Content |

## Should the route implementation be revised?

Yes, in two stages.

**Stage 1. Supported by the current source; can go ahead once approved:**

1. Add **Guidance Content** at `/content/guidance-content/` under Content (VERIFIED in A3).
2. Update `shared/content/admin-web-screens.ts` and `docs/Week-10/route-map.md` to match. The route map should drop its older-PDF citations and its old open questions, and point to this report.

**Stage 2. Waits for Team 03 decisions C1 to C9:**

- Remove or keep **Commercial Content** (C7).
- Confirm or move **Knowledge Sources** and **Partner Highlights** (C6).
- Breadcrumb root and labels (C2, C5), back links (C3), the Content landing page (C4), the sidebar (C1).
- Team Access (C8) and any other Content children (C9).

The routes are structural only, with no data, so these revisions are low risk. No detail screens should be added yet.
