# Phase 2 PR 2: Functional demo workflows

_Branch `claude/clever-goldberg-vgmhex`, restarted from `main` at `3478a3f` (merge of PR #24). Frontend only. No new packages, services or credentials._

## What this pull request does

1. **A working demo that lasts the browser session.** Product Library, Email and Live changes are kept in session storage (`admin-web/app/_data/demoStore.ts`, the same pattern as the Week 11 review decisions). They survive moving between pages, the Dashboard reads them, and everything clears when the tab closes. Nothing leaves the browser. Uploaded images stay on the page only (too large to keep).
2. **One Demo mode banner** on the Dashboard, Product Library, Email and both Live pages: "Changes stay in this browser session and are not sent or published." **Reset demo data** asks for confirmation, then returns every demo area to the sample data and announces it.
3. **Shared workflow rules** in `shared/workflows/` (product, email, live): which actions each role can take on each item, the status that follows, validation and counts. The screens call these rules instead of holding their own copies, and the rules refuse an action a role may not take, even if a screen asked for it.
4. **Product Library:** status changes, review actions, archive and restore, and validation run through the rules and persist. The approved card layout is unchanged.
5. **Email:** edit draft, save draft, duplicate (template or email), simulated send, and simulated schedule and cancel run through the rules and persist. Every result says "Demo mode: not delivered" or "Demo mode: not scheduled for real". Sent email shows "Sent (demo)".
6. **Live:** a **full-size preview** opens inside Admin Web (a wide dialog): the App in its phone frame, the Brand Website at Desktop, Tablet or Mobile width. Publish reads **"Publish (unavailable in demo mode)"** and stays turned off; the rules refuse it. The Brand Website prototype link stays "link not set yet".
7. **Dashboard:** Scheduled communication, App updates ready and Website updates ready come from the demo, labeled "Demo data", and Items for review adds "Plus N product records awaiting approval (demo)". Live status rows follow the demo too.
8. **Tests:** 38 unit tests for the workflow rules and role permissions (`shared/workflows/__tests__/`), run with Node's built-in test runner after TypeScript compiles them: `npm test` in `admin-web`. No test packages. A new GitHub Actions workflow (`.github/workflows/admin-web-tests.yml`) runs the type check and `npm test` on pull requests that touch Admin Web or `shared/`.

## Role rules (tested)

| Rule | Test file |
| --- | --- |
| Team Members never get Approve, Request changes, Archive or Restore on products, and edit only records assigned to them | `product-workflow.test.ts` |
| No one approves their own product or Live update | `product-workflow.test.ts`, `live-workflow.test.ts` |
| Team Members never get Send, Schedule or Cancel scheduled; they edit and delete only their own drafts | `email-workflow.test.ts` |
| Only Super Admins and Admins archive and restore templates | `email-workflow.test.ts` |
| Team Members never get Approve, Request changes, Publish or Archive on Live updates | `live-workflow.test.ts` |
| Publishing is unavailable for everyone, and applying it is refused | `live-workflow.test.ts` |
| Request changes needs a written note; alt text is required for every image (spaces alone don't count) | product, email and live tests |

These rules shape the demo. When the data moves to Supabase, the database rules and Edge Functions must enforce the same table; the rule files are written so that work can reuse them.

## Not changed

Supabase schema, migrations, RLS, roles, Edge Functions, the hosted database, email providers, real sending or scheduling, App or Website publishing, analytics (Metrics stays labeled sample data), credentials, the GitHub Pages sample mode and the visual design (no Phase 3 redesign).

## Small accessibility fixes

Empty status messages now stay in the accessibility tree while empty (instead of `display: none`), so their first message is always announced.
