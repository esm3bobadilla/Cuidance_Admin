# Hero banner images

Cut-paper hero images from the approved Admin Web prototype (Team 03, Nov 16, 2026),
extracted unchanged. Used by `admin-web/components/ui/HeroBanner.tsx`.

| File | Page |
| --- | --- |
| `hero-dashboard.jpg`, `hero-dashboard-wide.jpg` | Dashboard (wide version for screens 1280 px and up) |
| `hero-content.jpg` | Content |
| `hero-review.webp` | Review Tasks (Visual Package 01) |
| `hero-metrics.webp` | Metrics (Visual Package 01) |
| `hero-email.webp` | Email (Visual Package 01) |

Decorative only: always `alt=""`. Text never sits on the image without a solid backing.
Email was added with Phase 2 PR 1.

**Visual Package 01 (Team 03, Nov 26, 2026):** the Review Tasks, Metrics and Email artwork
was replaced with the package's approved `*-hero.png` files. They are 2:1 and were only
re-encoded as WebP at their full size (1774 x 887); the artwork itself is not cropped or
edited. On screen the banner is 5:2 and the artwork fills it (`object-fit: cover`), cropped
slightly below center (`packageHeroFrame` in `HeroBanner.tsx`) so every object stays in
view and the text sits on the open cream side. The previous JPGs are in Git history. Live screen images are in `../live/`.
