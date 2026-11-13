# Phase A4: production hardening and release readiness

_Nov 12, 2026. Branch `feat/phase-a4-release-readiness`, from `main` `1b119a7` (after Phase A3, [esm3bobadilla/Cuidance_Admin#18](https://github.com/esm3bobadilla/Cuidance_Admin/pull/18)). Source: the Cuidance Admin Next Phases Package (Phase A4)._

## 1. Verdict

| Area | Ready? | Notes |
| --- | --- | --- |
| **Public GitHub Pages site (sample mode)** | **Yes** | Every screen is reachable, passes accessibility, responsive and hydration checks, and is now **guaranteed** to build in sample mode (section 5) |
| **Supabase mode on the development project** | **Ready for staging, after owner steps** | Sign-in, review data, decisions, invitations, account setup and password reset all pass end to end on a local copy of the stack. The hosted project still needs the owner's rollout steps (section 7) |
| **Production (real staff, real email)** | **Not yet** | Needs an SMTP provider (D6), the final email design (Week 12 concepts), a production project decision, and Team 03's sign-off on PROVISIONAL wording and states |

**Nothing was deployed, no hosted data changed, GitHub Pages stays in sample mode, and no PR was opened or merged.**

## 2. Screens and reachability

Every Admin Web screen is present. A crawl from the Dashboard followed every internal link, and each one opened a real page (none went to "Page not found").

| Group | Screens |
| --- | --- |
| Dashboard | Dashboard (top banner, Review Queue, Needs attention, Key Areas) |
| Content | Content, Quiz Content, Guidance Content, Product Information, Knowledge Sources, Partner Highlights, Commercial Content |
| Review Tasks | Review Tasks, Review Task Detail (sample `seed-1` to `seed-5`; Supabase `/review-tasks/task/?id=`), Guidance Rules Review, Claims & Safety Review |
| Metrics | Content Metrics |
| Profile | Profile card and panel (Account Support, Notifications, Sign out) |
| Settings | Settings / Team Access (Supabase mode: members, invite, resend, withdraw) |
| Entry and onboarding | Sign In (with Forgot password), Create Account, Accept Invitation, Account Setup (setup and reset) |
| Other | Page not found, `/dev` component preview (URL only) |

**Navigation:** the Phase A1 consolidation is unchanged:
- four groups: Dashboard, Content, Review Tasks, Metrics;
- the Profile card above Settings, with Settings last;
- icon-only Light / Dark / System controls;
- the Profile button opens the Notifications panel.

## 3. What Phase A4 changed

| Commit | Change | Why |
| --- | --- | --- |
| `f5b2ba2` | Sidebar **Notifications** button now has `aria-expanded` | The new structural accessibility audit's only finding (on every route, both modes). Screen readers now hear whether the panel is open, as for the Profile button |
| `f5b2ba2` | Team Access on phones: invitations show as a **stacked list** | At 390 px the table pushed status and **Resend / Withdraw** off-screen |
| `f5b2ba2` | Accept Invitation and Account Setup **don't move focus on first load** | It drew a focus box around the heading before any action. Focus still moves after Accept, Decline or saving the password |
| `a0ba3d6` | Deploy workflow **pins sample mode** and **fails if the built site contains a Supabase address or key** | Before, sample mode relied on a setting being absent; a repository variable could have changed it silently |

## 4. Quality checks (both data modes)

| Check | Result |
| --- | --- |
| Structural accessibility (new `a4-a11y`): names on every control, aria references, unique IDs, labelled fields, image alt, one h1, heading order, landmarks, nothing focusable inside `aria-hidden`, radios in groups, toggles with `aria-expanded`, real link addresses, `lang` and title. Light and dark, every route and `?state=` preview, plus open panels | **No problems**: 164 page states in sample mode (both builds), 40 in Supabase mode (signed in and signed out). The one finding, fixed in `f5b2ba2`, was the sidebar Notifications `aria-expanded` |
| Keyboard, focus rings, 44 px targets, no-JS (Week 10 shell suite and screen suites) | **352 loads, 0 problems**. Screen suites (b1, quiz, product, claims, b2, metrics), the landing and detail suite, Week 11 loop (80 / 96 / 16), Feature 2 (32 / 192 / 16) and Phase A1 (288 loads, 16 flows): **0 failures** |
| Responsive audits (12 widths, sample mode, both builds, 3 data states) | **No issues** (local and GitHub Pages builds; plain, decided and account-created states) |
| Responsive audit of the Supabase-mode invitation and setup screens (9 states × 7 widths × light and dark) | **No issues** (126 loads), including the new phone invitations list |
| Contrast, light and dark | **Pass** in light and dark (36 views): lowest text 4.8:1, icons 7.8:1, group borders 4.0:1 |
| Reduced motion | `prefers-reduced-motion` turns transitions and animations off (Phase A1 test) |
| Hydration (dev server at `localhost`; React confirmed attached on every page) | **0 warnings**: sample A1 pages 400 loads, Week 11 pages 104 loads, Supabase mode 28 loads; React attached on every page |
| Loading, empty and error states | Every sample `?state=` preview (screen suites). Supabase mode: 7 intercepted-request checks: Review Tasks empty, Dashboard nothing needs attention, Review Tasks, task detail and Team Access load errors, no invitations, sign-in check error. **All pass** |
| Functional suites | Phase A2 Supabase-mode suite **82 / 0**; invitations Edge Function **64 / 0**; invitation and setup browser flows **46 / 0**; reachability crawl: sample 21, GitHub Pages 21 and Supabase mode 19 pages, every link a real page. No unexpected console messages |
| Database | `supabase db lint`: no schema errors. Database tests after a reset to the seed: **114, pass** |

## 5. Security and hardening

| Item | Status |
| --- | --- |
| **Security boundary** | Row Level Security on all six tables. Signed-out visitors get nothing. Screens only decide what is *shown*; the database refuses anything the rules don't allow (D4, D5, D12; append-only decisions; status changes only through decisions) |
| **Service-role key** | Only inside the `invitations` Edge Function, provided by Supabase at runtime. Not in the repo, any build, any response, log or email (checked) |
| **Browser keys** | Supabase mode uses only the project URL and the public key. The app refuses to start with a secret key |
| **Public site stays sample mode** | Pinned in the deploy workflow, and the deploy fails if a Supabase address or key appears in the build. Local test: passes on the sample build, fails on a Supabase-mode build |
| **Email links** | Single-use, expiring tokens, removed from the address before they're checked. Errors never say whether an email has an account |
| **Redirects** | Sign In only returns to pages on this site (`?next=` checked; other sites refused, tested) |
| **Dependencies** | `npm audit`: **0 vulnerabilities** (app production and development dependencies, and the repo-root tooling). Patch updates available: Next.js 16.4.2 → 16.4.6, supabase-js 2.118.0 → 2.119.0. **Recommended**, but version changes need Team 03's approval (CLAUDE.md), so they weren't applied |
| **Secrets in the repository** | Secret scan of the branch: clean |

### Security Advisor: the four role-helper warnings
The hosted Security Advisor (checked again on Nov 12) shows **no errors** and **4 warnings**, one each for `member_role`, `is_member`, `has_role` and `shares_workspace`: "Signed-in users can execute a SECURITY DEFINER function".

- **What they are:** the helpers the RLS policies use to check workspace roles. A signed-in person can call them directly (`/rest/v1/rpc/…`), but each one only answers about **that person's own** memberships. Signed-out visitors can't call them at all.
- **Risk:** low. Calling them tells a person nothing they couldn't already read through RLS (their own workspace and role, and whether they share a workspace with someone).
- **Recommendation:** **accept for now** and record the decision. As a **follow-up**, move the four helpers into a private schema that the API doesn't expose, and update the policies to call them there. That clears the warnings without changing behavior. It's a **schema change**, so under CLAUDE.md it needs its own migration, database tests and a separate reviewed PR, plus the owner's authorization to apply it to the hosted project. **It wasn't done in this phase.**

## 6. Known limitations

| Limitation | Effect | Next step |
| --- | --- | --- |
| No production SMTP (D6) | Supabase's built-in email reaches only the project team's addresses and is rate-limited | Team 03 picks a provider |
| Email templates PROVISIONAL | Invite, sign-in link and reset emails use a simple token-colored design | Supply the Week 12 Invite and Welcome concepts |
| Edge Function not deployed to the hosted project | Invitations work locally only | Owner rollout, section 7 |
| Notifications are sample items in both modes | Nothing is sent or tracked | A later phase |
| Content screens use sample data in both modes | Only review tasks, decisions, members and invitations are real in Supabase mode | A later phase |
| Static hosting (GitHub Pages) | No custom security headers (for example a Content Security Policy) and client-side route protection only. RLS protects the data either way | Revisit if hosting changes |
| Session kept in the browser's local storage (Supabase default) | Standard for static sites; a cross-site scripting bug could expose a session. No such bug is known, and the site loads no third-party scripts | Keep dependencies patched |
| Invitation look-up scans Auth users in pages (Edge Function) | Fine at internal-team scale (up to about 10,000 accounts) | Revisit if the team grows a lot |
| The `invitations` table has no "last sent" column | The resend cooldown uses the row's update time, so withdrawing or answering also counts as a send. Harmless | A column, if Team 03 wants send counts |
| Empty and Loading states, and much wording, PROVISIONAL | As marked in the code | Team 03 confirms |
| CLAUDE.md says migrations never reach the hosted database from an AI session | Phase A2 applied the reviewed Phase 2.1 migrations through the Supabase connector, on explicit instruction | Team 03 confirms or updates the rule |

## 7. Go-live checklist for the owner (none of this was done)

1. **Approve and merge** this phase's PR. The owner opens or authorizes it.
2. **Deploy the Edge Function** to "Cuidance Admin Web — Development": `supabase functions deploy invitations`.
3. **Set `ADMIN_SITE_URL`** for the function: the address the email links should open.
4. **In the Supabase dashboard (Auth):**
   - add the site's address to the redirect URLs;
   - copy the three templates from `supabase/templates/`;
   - confirm the email-link expiry.
5. **Create `example.com` test accounts** (D13) and a workspace membership for staging.
6. **Staging check:** build Supabase mode locally against the hosted project with the public key (`admin-web/.env.example`), and repeat the Supabase-mode flows.
7. **Only then** decide whether any hosted site should run in Supabase mode. The public GitHub Pages site stays in sample mode until the owner authorizes otherwise (D9). The deploy workflow enforces this.
8. **Pick an SMTP provider** (D6) before inviting anyone outside the team.

## 8. How this was tested

All tests ran in this cloud session against local builds and a **local** copy of the Supabase stack (the same migrations and seed, `example.com` users). They never touched the hosted project, except read-only checks of its identity, migrations, tables, Edge Functions and advisors. Test scripts live in the session scratchpad, as in earlier phases, and their results are recorded here and in the progress file (`.claude/progress/phase-a3-a4-status.md`).
