# Phase A3: invitations and onboarding completion

_Nov 12, 2026. Branch `feat/phase-a3-invitations`, from `main` `618b5bb` (after Phase A2, [esm3bobadilla/Cuidance_Admin#17](https://github.com/esm3bobadilla/Cuidance_Admin/pull/17)). Source: the Cuidance Admin Next Phases Package (Phase A3), and the approved plan's Phase 2.5 (`docs/Phase-2/supabase-integration-plan.md`)._

**Sample mode stays the default (D9).** The GitHub Pages site builds in sample mode, and nothing changes there. Everything below is Supabase mode, built and tested against the **local** Supabase stack only. **Nothing was deployed to the hosted project and no hosted data was changed.**

## 1. How it works

```
Owner / Admin (Settings, Team Access)                       Invited person
        │ Send invitation                                          │
        ▼                                                          │
invitations Edge Function ── service-role key (Edge Function only) │
  • checks the caller's role (D5)                                  │
  • saves the invitation (7 days, D7)                              │
  • Supabase Auth emails a single-use link ───────────────────────▶ │ opens the link
                                                                   ▼
                         Accept Invitation: reads the token once, removes it from the
                         address, verifies it with Supabase Auth (signs the person in),
                         then the function shows the invitation to this person only
                                                                   │ Accept
                                                                   ▼
                         invitations Edge Function: invitation → accepted (single use),
                         workspace member added with the invited role
                                                                   │
                                                                   ▼
                         Account Setup: name + password (12+, a letter, a number)
                                                                   │
                                                                   ▼
                                                             Review Tasks
```

- **One Edge Function, `invitations`** (`supabase/functions/invitations/index.ts`). Its actions are create, get, accept, decline, revoke (shown as "Withdraw") and resend. It is the only code that uses the service-role key, which Supabase provides to it at runtime. The key is never in the repository, the browser bundle, a response or a log.
- **Rules** (`supabase/functions/_shared/invitation-rules.ts`). The database checks them again: CHECK constraints, the unique pending index and the 7-day default from Phase 2.1.
  - **D5:** Owners invite and manage Admins and Reviewers. Admins invite and manage Reviewers. Reviewers can't invite. No one invites an Owner, and Content Editor is reserved (D3).
  - **D7:** an invitation lasts 7 days. When it expires, a new invitation for the same email can replace it.
  - **One pending invitation per email** per workspace.
  - **Accept is single use:** the invitation leaves "pending" in one guarded update. A second accept, or an accept after decline, withdraw or expiry, is refused.
  - **Resend** sends a fresh link while the invitation is pending and within its 7 days. It **never extends the 7 days**. There's a 60-second cooldown per invitation ("Please wait N seconds…"), and Supabase Auth also rate-limits emails.
  - **No leaks:** someone who isn't the invited person gets "not found", never "not yours". Password reset answers the same whether or not an email has an account.
- **Email links** (`supabase/templates/`) go straight to Admin Web with a single-use, expiring Supabase Auth token (`token_hash`):
  - **Invite** (a new person) → Accept Invitation, then Account Setup.
  - **Sign-in link** (someone who already has an account) → Accept Invitation, then Review Tasks.
  - **Reset** → Account Setup (`?mode=reset`).
  - **Page handling:** the page removes the token from the address before verifying it, so it isn't kept in history.
  - **Expiry:** links expire after the Auth email-link expiry (1 hour locally). The invitation stays open for 7 days, which is what **Resend invitation link** is for (plan section 8, note 2).
- **No new migration.** This uses the Phase 2.1 `invitations` table as it is.

## 2. Screens (Supabase mode)

| Screen | What's new |
| --- | --- |
| Settings / Team Access | Real members. **Owners and Admins:** an invite form (email and the roles they may invite) and the invitation list (Pending, Expired, Accepted, Declined, Withdrawn), with **Resend invitation link** and **Withdraw invitation** on pending ones. Admins see Reviewer invitations only (RLS). Reviewers see members only, with a note. One primary button. |
| Accept Invitation | Link checking, then: pending (details, Accept, Decline), accepted (Continue to account setup, or Go to Review Tasks), declined, withdrawn, expired, not found, "link expired or already used", and "open the link in your invitation email" (signed out, with Sign in and `?next=`) |
| Account Setup | **After accepting:** full name, the invited email (read-only), password and confirm, with the approved requirement checklist. **From a reset link:** the new password only. Errors use an icon and a message, and focus moves to the first problem. The password never stays on the page. |
| Sign In | **Forgot password?** sends a reset link. The answer is the same for any email. |
| Create Account | Accounts are by invitation only (no public sign-ups). |

Wording is in `shared/content/supabase-mode.ts`. It's PROVISIONAL, with no em dashes.

## 3. Hosted rollout (owner steps; NOT done)

These change the hosted project, so they need the owner's authorization:
1. **Deploy the function:** `supabase functions deploy invitations` to "Cuidance Admin Web — Development".
2. **Function setting:** set `ADMIN_SITE_URL` to the Admin Web address the links should open. Supabase provides the keys.
3. **Auth settings (dashboard):**
   - add the site's address to the redirect URLs;
   - copy the three templates from `supabase/templates/` (invite, magic link, reset);
   - confirm the email-link expiry.
4. **Email delivery:** Supabase's built-in email only sends to the project team's own addresses and is heavily rate-limited. Real delivery needs an SMTP provider, which is decision D6 and not chosen yet. Until then, hosted testing is limited to team-owned test inboxes.
5. **GitHub Pages:** stays in sample mode until the owner authorizes a Supabase-mode deployment.

## 4. Tests

All local. Users are `example.com` only. Tokens and keys are checked, never printed.

| Suite | Result |
| --- | --- |
| Edge Function (real HTTP as real users; emails from the local mail catcher) | **64 checks, 0 failures** |
| Browser flows (invite → email → accept → setup → Review Tasks; decline, withdraw, expired, reused link, signed out, forgot password, D5 per role, phone width) | **46 checks, 0 failures**, no console problems |
| Phase A2 Supabase-mode suite | **82 checks, 0 failures** (3 checks updated where A3 changes the behavior on purpose: Create Account, Accept Invitation signed out, and where the entry notice shows) |
| Responsive audit of the new screens (9 states × 7 widths × light and dark) | **No issues** (126 loads) |
| Bundle secret check | The built Supabase-mode site contains the public key only; the service-role key, secret key and JWT secret are in none of its files |

The function suite also confirmed:
- no key in any function response, the function logs or the emails;
- a superseded link no longer works after a resend;
- the 7-day expiry is unchanged by resend;
- direct inserts into invitations and memberships are refused (RLS).

Sample-mode regressions, hydration and database tests are listed in the pull request.

## 5. Still open
- **Email design:** the templates are PROVISIONAL. The approved Week 12 Invite and Welcome email concepts aren't in this repository, so the final design waits for Team 03 to supply them.
- **Hosted rollout:** section 3, for the owner.
- **SMTP provider:** D6.
- **Security Advisor:** the 4 intended warnings on the role helpers (from Phase A2). The follow-up migration is for Phase A4 to decide.
- **Local development in Claude Code cloud sessions:** the local Edge Functions runtime can't verify that sandbox's network certificate, so it can't download npm packages. The packages were pre-loaded into the runtime's cache for testing. This doesn't affect hosted Supabase or a normal computer.
