# Cuidance illustrations

Flat 2D Cuidance illustrations supplied by Team 03 in the Phase A1 reference pack
(`Cuidance_Admin_Phase_A1_Reference_Pack.zip`, `assets/brand/`, Nov 11, 2026). Used as supplied:
not redrawn, recolored or cropped in the files (one CSS crop on screen is noted below).

| File | Used on |
| --- | --- |
| `illus-leaf-hand.png` | Accept Invitation and Account Setup steps panel (removed from the sidebar in the Phase B1 shell) |
| `illus-hands-jar.png` | Not in use since Visual Package 01 (was the Super Admin role illustration); kept as an approved asset |
| `shape-leaf.png` | Not in use since the Phase B1 Dashboard hero; kept as an approved asset |
| `illus-hand-stone.png` | Sign In and Create Account hero. On screen, a CSS crop hides a stray stroke at the top edge of the supplied file |

Rules:
- Decorative only: always `alt=""` and hidden from screen readers.
- The black hands need a light backdrop: Warm Care (`--color-surface-warm`) in light mode, or the light-green brand surface in dark mode.
- Don't create new illustration artwork here; ask Team 03 for new assets.
- Logo files stay in `../logo/` and follow that folder's README.

## Added from the approved Admin Web prototype (Nov 16, 2026)

Team 03 approved the standalone Admin Web prototype as a source of production assets.
These files were extracted from it unchanged (no redrawing, recoloring or cropping).

| File | Planned use |
| --- | --- |
| `illus-arch-drop.webp`, `illus-bowl-lid.webp`, `illus-drop-bowl.webp`, `illus-sun-bowl.webp` | Role and section illustrations (Admin role uses arch-drop) |
| `mark-sprig.webp` | Small decorative sprig mark |
| `assign-drawer.webp` | "Assign a review task" drawer |
| `empty/empty-content.webp`, `empty/empty-review-tasks.webp` | Empty states (provisional until Team 03 confirms Empty states) |
| `content-categories/cat-*.webp` | Content workspace category tiles |
| `metrics/kpi-*.webp` | Metrics cards |
| `email/card-*.webp` | Email template cards and default email images (Phase 2 PR 1) |
| `glance/glance-*.svg` | Dashboard "Today at a glance" cards. Checked: plain shapes, no scripts or links |

Hero photographs for page banners are in `../heroes/`.

## Visual Package 01 (Team 03, Nov 26, 2026)

Approved replacements from `claude-code-visual-package-01.zip`. Re-encoded from the supplied
PNGs as WebP with transparency, scaled down for the web at their own proportions. Not
redrawn, recolored or cropped.

| File | Used on | Supplied file |
| --- | --- | --- |
| `email/card-invite.webp`, `card-welcome.webp`, `card-nudge.webp`, `card-reset.webp` | Email template cards and default email images (replace the Phase 2 versions; old ones are in Git history) | `*-email-icon.png` |
| `roles/role-super-admin.webp`, `role-admin.webp`, `role-team-member.webp` | Manage Team: Role column and the "What each role can do" card (24 px markers) | `*-role-icon.png` |
| `profile/profile-card.webp` | Profile card illustration | `profile-card-illustration.png` |

In dark mode the role markers and the Profile illustration sit on the light-green brand
surface (`--color-brand`), so the dark green hands stay visible. The earlier role
illustrations (`illus-hands-jar.png`, `illus-arch-drop.webp`) are no longer used on screen;
the files stay as approved assets. `illus-leaf-hand.png` is still used by Account Setup.
