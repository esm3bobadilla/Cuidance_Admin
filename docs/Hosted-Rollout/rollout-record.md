# Hosted rollout record: Cuidance Admin Web — Development

Project: "Cuidance Admin Web — Development". The public GitHub Pages site stays in sample mode (D9) throughout.

## Hosted Rollout 1: invitations Edge Function. VERIFIED (Nov 13, 2026)
- **Deployed:** `invitations` from `main` `ff3daed`, version 1, status ACTIVE, gateway sign-in check on (`verify_jwt: true`), at 2026-11-13 02:17:43 UTC. The deployed files match the repository.
- **`ADMIN_SITE_URL`:** `https://esm3bobadilla.github.io/Cuidance_Admin/`, entered by the owner in the dashboard. Not readable by tools.
- **Smoke tests (no data written):**
  - CORS preflight 200;
  - no sign-in: 401 (gateway);
  - public key only: 401 "not-signed-in";
  - GET: 405.
- **Logs:** the function booted in 26 ms, with no errors.

## Hosted Rollout 2: Auth settings. VERIFIED (Nov 13, 2026)

| Setting | Hosted value | Confirmed by |
| --- | --- | --- |
| Email provider | Enabled (Supabase built-in email, staging only) | Public Auth settings (read-only) and the owner's dashboard check |
| Public sign-ups | Disabled | Same |
| Email confirmation | Enabled | Same |
| Site URL | `https://esm3bobadilla.github.io/Cuidance_Admin/` | Owner (dashboard). Not readable by tools |
| Redirect URLs | `https://esm3bobadilla.github.io/Cuidance_Admin/**`, `http://localhost:3000/**` | Owner (dashboard). Not readable by tools |
| Email OTP expiration | **3600 seconds (1 hour)**. Matches the local config and the "expires in 1 hour" wording in the templates | Owner (dashboard). Not readable by tools |
| Invitation validity | **7 days**: hosted column default `now() + '7 days'`; migration `20261111060100`; database test `04_invitations_test.sql`; never extended on resend (D7) | Read-only database check |

Nothing was changed by tools in Rollout 2.

## Remaining rollout checklist

| # | Step | Status | Needs |
| --- | --- | --- | --- |
| 3 | **Email templates** (invite, sign-in link, reset) | Not done. The repo templates (`supabase/templates/`) are PROVISIONAL. **Waiting for the Week 12 email design package** to be attached; no template changes until then | The Week 12 Invite design. **Welcome is recorded as a separate future email** (see below) |
| 4 | **Email delivery decision** (D6) | **Decided for now: Option C** (Nov 13, 2026). No hosted email; a provider is still open | Team 03 selects an SMTP provider later |
| 5 | **Staging test accounts** (`example.com`, D13) and a workspace membership | Not done; waiting for the owner's authorization | Option C: for non-email testing only |
| 6 | **Staging check:** a local Supabase-mode build against the hosted project, running the Supabase-mode flows | Not done | Steps 3 to 5 |
| 7 | **Decide whether any hosted site runs in Supabase mode** | GitHub Pages stays in sample mode (enforced by the deploy workflow) | The owner, after step 6 |

### The email-delivery decision (D6)
Supabase's built-in email (from the Supabase docs, checked Nov 13, 2026):
- **sends only to the email addresses of the Supabase organization's team members**; other addresses fail with `email_address_not_authorized`;
- is limited to a small number of emails per hour for the whole project;
- "is not meant for production use".

What this means for staging:
1. **`example.com` test accounts can't receive any email**, with the built-in service or with a real provider. `example.com` is reserved and has no inboxes. With the built-in service, the invitations function would get `email_address_not_authorized`, reply "send-failed", and discard the invitation (by design).
2. So **an end-to-end hosted test of invite → email → accept needs a decision**. One of:
   - **A. Team-owned test inboxes:** invite addresses that belong to Team 03's Supabase organization members (built-in email works). This conflicts with D13 ("example.com addresses only"), so Team 03 must approve an exception for these test addresses.
   - **B. A custom SMTP provider now** (D6): pick a provider (for example Resend, Postmark, Amazon SES or SendGrid), verify a sending domain, and set it in Authentication → SMTP. Then use real test inboxes the team controls. D13 still needs an exception for them.
   - **C. No hosted email yet:** create the `example.com` staging accounts in the dashboard without sending email, test sign-in, review data and decisions on the hosted project, and keep testing the invitation email flow locally (where the mail catcher receives it), until steps 3 and 4 are decided.
3. **Before anyone outside Team 03 is invited:** a production SMTP provider is required (D6), with a verified sending domain and sender address, and email rate limits set in Authentication → Rate Limits.

## Decisions (Nov 13, 2026, owner)
1. **Option C for hosted email.**
   - No hosted email for now.
   - `example.com` accounts are for **non-email** application testing only: sign-in, review data and decisions.
   - Invitation email delivery stays a **local-only** test (the local mail catcher) until Team 03 selects a provider.
   - Not yet authorized: hosted test accounts, sending emails, configuring SMTP, or changing Auth settings.
2. **Welcome email:** recorded as a **separate future email**. It does **not** replace the sign-in-link template (`magic_link.html`, used when someone who already has an account is invited).
   - Adding a Welcome email needs approved application requirements: when it is sent, and by what (Supabase Auth has no built-in "welcome" email, so it would need app or Edge Function code and an email provider).
3. **Templates:** no changes until the Week 12 email design package is attached.
