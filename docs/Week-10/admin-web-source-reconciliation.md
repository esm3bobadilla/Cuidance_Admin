# Week 10 Step 2: Admin Web source reconciliation audit

An audit only. It compares the current Team 03 Admin Web hi-fi screen references with the route map built on `feat/admin-web-route-map` (commit `c195ada`). **No application code, routes, navigation, tokens, components or assets were changed.** No pull request has been opened.

- **Date:** Oct 27, 2026
- **Prepared by:** Claude Code for Team 03. **Needs review by Alyssa and Esme.**
- **Superseded source:** the older wireframe PDF (`T03_CuidanceAdminWeb_HiFiScreens_v01_ART646.pdf`) is no longer authoritative. Nothing below is based on it alone.

## Sources compared

| # | Source | What it contributes |
| --- | --- | --- |
| A | **Current hi-fi screen references** (5 images supplied Oct 27, 2026) | Screen names, breadcrumbs, parents, sidebar labels |
| B | Existing route map (the 13 routes in `admin-web/app/`) | Routes and parents as built |
| C | `shared/content/admin-web-screens.ts` | Screen names, parents and scope notes as defined |
| D | Current Admin Web navigation | Dashboard links to each section. Breadcrumb plus "‹ Back to …" link on each page. No sidebar |
| E | `CLAUDE.md` | Approved scope: quiz content, guidance content, product information, sources, partner highlights, commercial labels, claims and safety notes. Limited Account Support and Content Metrics only |
| F | `docs/Week-10/route-map.md` | The route tree, mapping and open questions from the first pass |

### Which hi-fi references were supplied

Twelve screens were named, but **five images** were supplied:

| Image | Screen | Breadcrumb shown | Sidebar shown |
| --- | --- | --- | --- |
| A1 | Dashboard / Review Queue (page title "Cuidance Admin Web") | None | Dashboard, Content, Sources, Guidance Rules, Claims & Safety, Metrics, Account Support, Review Tasks, Settings |
| A2 | Quiz Content | Admin / Content / Quiz Content | Dashboard, Content (Quiz Content, Guidance Content, Care Areas, Resources), People, Settings |
| A3 | Guidance Content | Admin / Content / Guidance Content | Home, Content (Guidance Content, Resource Topics, Collections, Media Library), Users, Settings, Help |
| A4 | Product Information | Admin / Content / Product Information | Home, Content (Product Information, Articles, Topics, Collections), Users, Analytics, Settings |
| A5 | Claims & Safety Review | Admin / Claims & Safety | Home, Content, Claims & Safety, Partners, Insights, Settings |

**No image was supplied** for Knowledge Sources, Partner Highlights, Guidance Rules Review, Content Metrics, Account Support, Review Tasks or Settings / Team Access. For those, the only current evidence is the Dashboard (A1): its sidebar and its "Key Areas" cards (Quiz Content, Guidance Content, Product Information, Sources, Partner Highlights, Claims & Safety).

**The sidebars aren't consistent across the five images.** A1 has the full nine-item sidebar. The other four show shorter, different sets (Home or Dashboard; People or Users; Analytics or Insights; Partners; Help; different Content children). This audit treats **A1 as the navigation reference**, because it's the only complete one and it uses "Dashboard". That choice needs Team 03 confirmation (decision D1).

## Reconciliation table

Existing breadcrumbs and back links are as built in `c195ada`. Breadcrumbs start with "Dashboard", and the last item is the current page.

| Current hi-fi screen name | Existing route | Existing parent | Current breadcrumb | Current back behavior | Match status | Recommended correction | Evidence source |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Dashboard (Review Queue is a section on it) | `/` | (landing page) | None | None (landing page) | **MATCH** | None for routing. Review Queue stays a section of the Dashboard, not its own route. The hi-fi layout (Review Queue summary, Key Areas, Needs attention) is screen design for a later step | A1; B; C; D |
| Content (parent) | `/content/` | Dashboard | Dashboard / Content | ‹ Back to Dashboard | **MATCH** (parent) | Keep Content as the parent. The hi-fi shows no Content landing screen, so whether `/content/` stays a page of links needs confirming (D4) | A1 to A4 sidebars; A2 to A4 breadcrumbs; B; C |
| Quiz Content | `/content/quiz-content/` | Content | Dashboard / Content / Quiz Content | ‹ Back to Content | **MATCH** | Name, route and parent match. Breadcrumb root differs ("Admin" in the hi-fi, see D2). The hi-fi has no back link (see D3) | A2; B; C; E |
| Guidance Content | None | None | None | None | **MISSING** | Add `/content/guidance-content/` as a Content child, named "Guidance Content". It's in the hi-fi (A1 Key Areas, A2 and A3 sidebars, A3 screen) and in CLAUDE.md scope | A1; A2; A3; E |
| Product Information | `/content/product-information/` | Content | Dashboard / Content / Product Information | ‹ Back to Content | **MATCH** | Name, route and parent match. Breadcrumb root differs (D2). Don't use "Product Catalog" | A1 Key Areas; A4; B; C; E |
| Knowledge Sources | `/content/knowledge-sources/` | Content | Dashboard / Content / Knowledge Sources | ‹ Back to Content | **NEEDS TEAM CONFIRMATION** | A1 shows **"Sources" as a top-level sidebar item** and a "Sources" Key Areas card, not "Knowledge Sources" under Content. No Knowledge Sources screen was supplied. Keep the route as is until Team 03 confirms the name and parent (D5) | A1 sidebar and Key Areas; B; C; E ("sources") |
| Partner Highlights | `/content/partner-highlights/` | Content | Dashboard / Content / Partner Highlights | ‹ Back to Content | **NEEDS TEAM CONFIRMATION** | Name matches the A1 Key Areas card. Its place isn't shown: it's not in A1's sidebar, A5's sidebar has "Partners" instead, and no screen was supplied. Keep as is until its parent is confirmed (D6) | A1 Key Areas; A5 sidebar; B; C; E |
| Guidance Rules Review | `/guidance-rules-review/` | Dashboard (top-level) | Dashboard / Guidance Rules Review | ‹ Back to Dashboard | **MATCH** (route and parent) | Top-level placement matches A1's sidebar ("Guidance Rules"). No screen was supplied to confirm the page title. Keep "Guidance Rules Review" as the page title. The shorter sidebar label is a navigation question (D7) | A1 sidebar; B; C |
| Claims & Safety Review | `/claims-safety-review/` | Dashboard (top-level) | Dashboard / Claims & Safety Review | ‹ Back to Dashboard | **UPDATE** (breadcrumb only) | Title, route and top-level parent match A5. Only the breadcrumb differs: the hi-fi shows "Admin / Claims & Safety", with the short label as the last item and "Admin" as the root. Change only after D2 and D7 are decided | A5; A1 sidebar; B; C |
| Content Metrics | `/content-metrics/` | Dashboard (top-level) | Dashboard / Content Metrics | ‹ Back to Dashboard | **MATCH** (route and parent) | Top-level placement matches A1's sidebar, where the label is **"Metrics"**. No screen was supplied. Keep "Content Metrics" (CLAUDE.md wording). Don't change it to "Metrics" without Team 03 (D7) | A1 sidebar; B; C; E |
| Account Support | `/account-support/` | Dashboard (top-level) | Dashboard / Account Support | ‹ Back to Dashboard | **MATCH** | Name and top-level placement match A1's sidebar. Don't use "Accounts". (A2 to A4 show "People" or "Users". Those are older or inconsistent labels, not adopted) | A1 sidebar; B; C; E |
| Review Tasks | `/review-tasks/` | Dashboard (top-level) | Dashboard / Review Tasks | ‹ Back to Dashboard | **MATCH** | Name and placement match A1's sidebar. A1 also links to it from the Review Queue ("View review tasks") and Needs attention ("View all review tasks"), which supports the critical path | A1; B; C |
| Settings | `/settings/` | Dashboard (top-level) | Dashboard / Settings | ‹ Back to Dashboard | **MATCH** | Name and placement match A1 to A5 | A1 to A5 sidebars; B; C |
| Team Access (Settings content or subpage) | None | None | None | None | **NEEDS TEAM CONFIRMATION** | No current reference shows Team Access. Don't add a route. If Team 03 confirms it, add it as Settings content (or a Settings subpage), internal team access only (D8) | Named in the request only. Not in A1 to A5 |
| Commercial Content (existing route, not a current hi-fi screen) | `/content/commercial-content/` | Content | Dashboard / Content / Commercial Content | ‹ Back to Content | **NEEDS TEAM CONFIRMATION** | Not in the current hi-fi list or any image. A1's Partner Highlights card says "Manage partner and sponsored educational content", which may cover it. CLAUDE.md lists "commercial labels" as scope. Keep the route until Team 03 decides whether to keep it, fold it into Partner Highlights, or remove it (D6) | A1 Key Areas; B; C; E |

## Patterns across every screen

| Pattern | Current hi-fi | Existing build | Status |
| --- | --- | --- | --- |
| Breadcrumb root | "Admin" on A2 to A5 | "Dashboard" (`/dev/` uses "Admin") | NEEDS TEAM CONFIRMATION (D2) |
| Last breadcrumb item | Short nav label on A5 ("Claims & Safety"); page name on A2 to A4 | Always the full page name | NEEDS TEAM CONFIRMATION (D7) |
| Eyebrow | "INTERNAL TOOL" on every screen | "Content" on Content child pages, none elsewhere (the Dashboard has "Internal tool") | UPDATE, recommended with the page-layout step, not the route step |
| Back link | None. Navigation is by sidebar and breadcrumb | "‹ Back to …" ghost link on every page | NEEDS TEAM CONFIRMATION (D3). Keep the back links until a sidebar exists |
| Persistent sidebar | Shown on every screen | Not built (not in the component inventory) | Missing, expected. Needs an approved navigation component first |
| Header search and user menu | Shown on A1, A5 and others | Not built | Out of scope for routes |

## Decisions that need Team 03 confirmation

1. **D1. Navigation reference.** Confirm A1's nine-item sidebar is the approved navigation: Dashboard, Content, Sources, Guidance Rules, Claims & Safety, Metrics, Account Support, Review Tasks, Settings. The other images show different sidebars.
2. **D2. Breadcrumb root.** "Admin" (hi-fi) or "Dashboard" (current build)?
3. **D3. Back links.** Keep the "‹ Back to …" links, or rely on the breadcrumb and a future sidebar, as the hi-fi does?
4. **D4. Content landing page.** Keep `/content/` as a page that links to its children, or make Content only a sidebar group?
5. **D5. Sources.** "Sources" as a top-level item (A1), or "Knowledge Sources" under Content (current route)? Which name?
6. **D6. Partner pages.** Where does Partner Highlights sit (under Content, top-level, or a "Partners" group)? Is Commercial Content a separate page, part of Partner Highlights, or removed?
7. **D7. Short nav labels against page titles.** A1 uses "Guidance Rules", "Claims & Safety" and "Metrics" in the sidebar. A5 uses "Claims & Safety Review" as the page title but "Claims & Safety" in the breadcrumb. Confirm the rule: short labels in navigation and breadcrumbs, full names as page titles? "Metrics" isn't adopted until this is confirmed.
8. **D8. Team Access.** Is it in scope? If so, as Settings content or a Settings subpage?
9. **D9. Other Content children.** The images show more children that aren't in the requested list and weren't routed: Care Areas, Resources (A2); Resource Topics, Collections, Media Library (A3); Articles, Topics, Collections (A4). They differ between images. Confirm which, if any, are approved.

## Content-rule flags in the hi-fi references

Not routing issues, but they'll matter when these screens are built. Each needs a Team 03 check against CLAUDE.md:

- **A3 Guidance Content:** "Based on dermatology-reviewed educational resources and expert input" and "Reviewed by clinical content lead" may read as a medical-review workflow, which is out of scope.
- **A2 Quiz Content:** answer options "Understanding a condition or topic" and "Finding care and next steps", and the "Emotional Wellbeing" care area, go beyond hair, skin, makeup and body care.
- **A4 Product Information:** brand names (Rivermere, Solara, Willow & Oak, Luma). They look like sample names, but CLAUDE.md says no real brand names in guidance. Also "A good option for those looking for…" is close to recommendation wording.
- **A1, A2, A3, A4:** each screen has a primary action (View review tasks, Add question, Add guidance, Add product information). That's consistent with one primary per screen, but "Add …" actions are editing features, and they aren't built yet.

## Summary

| Status | Screens |
| --- | --- |
| MATCH | Dashboard, Content (parent), Quiz Content, Product Information, Guidance Rules Review (route and parent), Content Metrics (route and parent), Account Support, Review Tasks, Settings |
| UPDATE | Claims & Safety Review (breadcrumb only, after D2 and D7) |
| MISSING | Guidance Content |
| NEEDS TEAM CONFIRMATION | Knowledge Sources, Partner Highlights, Commercial Content, Team Access |

**Is the route map safe to revise?** Yes, with limits:

- Adding **Guidance Content** under Content is supported by the current hi-fi and CLAUDE.md. It can be done without waiting.
- Every other change (Sources, the partner pages, Team Access, breadcrumb root and labels, back links) depends on decisions D1 to D9. It should wait for Team 03.
- No existing route conflicts with the current hi-fi badly enough to need removal now. The structural pages carry no data, so revising them later is low risk.
- `docs/Week-10/route-map.md` still cites the older PDF and should be updated in the same revision.
