# Prototype alignment, Batch 1: Settings and Team Access

- **Branch:** `feat/admin-web-prototype-alignment`
- **Date:** Nov 6, 2026
- **Route:** `/settings/` (unchanged). **No new route:** Team Access sits on Settings until Team 03 approves its own route (D10).
- **Prepared by:** Claude Code for Team 03. **Needs review by Alyssa and Esme.** Items marked **PROVISIONAL** need a Team 03 decision.
- **Source:** the readable responsive prototype, Team Access (F09). Under D1 it's the source for Team Access. The role wording is the approved four-role model.

## 1. What changed

1. **Header:** the eyebrow is "Internal tool", as in the prototype. The title and scope note are unchanged, as is "Other settings are not built yet."
2. **Team Access section:**
   - The heading, and the prototype's description, "Who can work in Cuidance Content Team and what each role can do."
   - **Filter chips** (prototype F09): "All · 7", Active, Invitation pending, Deactivated. The selected chip has Compass Blue plus ✓ (`aria-pressed`).
   - **Member table** "Team members (sample data)", with the columns Member, Role, Status and Last active. There are seven members with the prototype's roles, statuses and last-active values.
   - The role names are the approved names.
   - **Statuses** (PROVISIONAL mapping): Active is success plus ✓, Invitation pending is warning orange, and Deactivated is neutral and dashed.
   - The prototype's **boundary note**: "Boundary: internal access management only. Provisional: role changes are not saved or enforced."
3. **Roles and publishing card:** unchanged, with the approved four-role wording exactly as written.
4. **States** for the member list:
   - Loading, empty and error (`?state=`).
   - **No results** can't happen: each filter matches at least one member.
   - Without JavaScript, all seven members show and the chips are hidden.

## 2. PROVISIONAL

| Item | Why |
| --- | --- |
| **Member names: "Team member A" to "G"; email addresses left out** | The prototype's people names and emails are sample people. They're replaced by placeholders, as everywhere else |
| **"Cuidance Content Team" in the description** | The prototype's workspace name. The workspace card is still open (D16) |
| **Not built:** Invite team member, Invitations, the Actions column (Edit role, Deactivate), "(you)", Team Access history, the role switcher | Invitations, account changes, sign-in and permissions are deferred |
| **The prototype's role cards and permission grid** | Not used. Their wording differs from the approved model (D15). The approved Roles and publishing card is shown instead |
| **Access denied (F12)** | Not built. Its wording ("managed by the Main Admin / Owner and Admins") gives Admins team-management permissions the approved Admin wording doesn't include (D15) |
| Status color mapping, state wording | No approved mapping; Empty and Loading are provisional on the board |

## 3. Files

- **New:**
  - `shared/content/team-access.ts`
  - `admin-web/app/_settings/TeamAccessView.tsx`, `TeamAccessStateFromUrl.tsx` and `teamAccess.module.css`
- **Updated:** `admin-web/app/settings/page.tsx`.
- `RolesPolicy` and `admin-roles.ts` are unchanged.

## 4. Tests

| Check | Result |
| --- | --- |
| Settings tests (both builds × 4 widths × light and dark) | **0 failures.** <ul><li>7 members with the right role, status and last active.</li><li>Chips: All · 7 selected; Invitation pending shows 1, Active 5, Deactivated 1, All 7.</li><li>Boundary note, and the roles card with the exact Content Editor wording and publishing rule.</li><li>No emails, prototype people names, Invite, Edit role or Deactivate.</li><li>No em dashes, no overflow.</li></ul> |
| States | Loading, empty and error in both builds and both themes |
| Keyboard | The chips follow the sidebar; Enter on Deactivated filters to 1; visible rings |
| No JavaScript | 7 rows at 1440 and 320 px, chips hidden, no overflow |
| Theme tests | 0 failures, including "roles wording the same in Settings and `/dev/`" |
| Contrast | At least 4.8:1 in light and 8.1:1 in dark |
| Hydration | No warnings |

## 5. Screenshots

In `docs/Week-10/evidence/`:
- **Prototype F09 beside this build:** `settings-team-access-compare-f09-1440-{light,dark}.png`
- **Full screen:** `settings-team-access-aligned-{1440,834,390}-{light,dark}.png`
- **States:** `settings-team-access-{loading,empty}-1440-light.png` and `settings-team-access-error-1440-dark.png`
- **Keyboard:** `settings-team-access-keyboard-dark.png`
