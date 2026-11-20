# Phase 2 PR 1: Content, Product Library, Email, Live and role wording

_Branch `claude/clever-goldberg-vgmhex`, from `main` at `9ef8516`. Frontend only, sample data only._

## What this pull request does

1. **Content stays one workspace.** The sidebar's Content item lists only **Content Workspace** and **Product Library**. Quiz, Guidance, Product, Claims and safety, Sources, Partners and Media are content types and filters inside the workspace (quick type chips plus the filter drawer), not sidebar pages. The area pages are still reachable from "Browse by area". A contextual control near the page heading switches between Content Workspace and Product Library.
2. **Product Library** (`/content/product-library/`, Admin / Content / Product Library). Product cards (Team 03 visual correction: cards, not a table) with image, name, brand, category, description, status, linked guidance and last update. Search, brand, category, approval status, linked guidance and sort. Detail drawer with overview, ingredients, claims and safety, media and links, related guidance and review status. Create and edit forms.
3. **Email** (`/email/`, Communication / Email). Templates, Drafts, Scheduled and Sent tabs, search and category, template cards, New email, editor with Edit and Preview, image upload with required alt text, save draft, simulated send and schedule with confirmations, duplicate, delete draft, archive template, cancel scheduled.
4. **Live** (`/live/app/` and `/live/website/`, Communication / Live). Static App preview in the approved phone frame and Brand Website preview in a browser frame, preview states (current, with updates ready to publish, unavailable, or one update's preview), update history and an update detail drawer with Draft, In review, Needs changes, Ready to publish, Published and Archived.
5. **Role wording.** Super Admin, Admin and Team Member everywhere the app shows a role: role summaries and the roles card on Manage Team, invitation acceptance, account setup, create account, sample team data and review-task wording. Stored database values are unchanged.
6. **Dashboard.** Quick work adds Create an email, Preview Cuidance App and Preview Brand Website; Live status rows link to the previews.

## Permissions (shared/content/permissions.ts)

| Action | Super Admin | Admin | Team Member |
| --- | --- | --- | --- |
| Create product records | Yes | Yes | Yes |
| Edit product records | Any | Any | Only records assigned to them |
| Approve or request changes (products, Live updates) | Yes, never their own | Yes, never their own | No (not shown) |
| Archive and restore products | Yes | Yes | No (not shown) |
| Draft and preview email | Yes | Yes | Yes (edit and delete their own drafts) |
| Send and schedule email | Yes (simulated) | Yes (simulated) | No (not shown) |
| Archive templates, cancel scheduled email | Yes | Yes | No (not shown) |
| Prepare and submit Live updates | Yes | Yes | Yes (edit their own) |
| Publish Live updates | Shown, turned off: publishing not connected | Same | No (not shown) |
| Archive Live updates | Yes | Yes | No (not shown) |

These checks only shape the screens. When the data moves to Supabase (PR 2), the database rules and Edge Functions must enforce every row (prototype handoff notes).

## Decisions made in this pull request (please confirm)

- **No region or availability field** in Product Library: CLAUDE.md keeps product availability and retailer information as future scope (VERIFY).
- **Placeholders:** brands are "Brand A" to "Brand D"; people are "Team member A" to "F"; links use example.com.
- **Reviewer separation:** no one approves a product or Live update they own.
- **Publish** appears for Super Admins and Admins on Ready to publish updates, turned off with a note, because publishing is not connected.
- **Brand Website prototype link:** kept as "link not set yet" (Team 03, Nov 20, 2026). `brandWebsitePrototypeUrl` in `shared/content/live.ts` is empty until the address is confirmed (VERIFY).
- **Product Library is the approved product-management screen** (Team 03, Nov 20, 2026). Product Information (Barcode / Label Lookup types) stays as its own area page in this pull request; it is not removed.
- **App preview image** is the prototype's welcome-screen fallback, not the PR22 build (open dependency in the prototype handoff notes).

## Sample states for review

Add `?state=loading`, `?state=empty` or `?state=error` to Product Library, Email or Live (`?state=unavailable` also on Live).

## Not changed

Supabase schema, migrations, RLS, Edge Functions, stored role values, email provider, real sending or scheduling, image storage, App or Website publishing, analytics, credentials, and the GitHub Pages sample mode. No prototype toolbar, View as control or real staff names.

## Checks

See the pull request description for the full results (type check, builds, browser checks at 1440, 834 and 390 px, 200% zoom, dark mode, high contrast, keyboard and automated accessibility).
