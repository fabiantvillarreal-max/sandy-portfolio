# Fullscreen Project Popup Redesign

## Context

The site (`index.html`, `css/style.css`, `js/render.js`) already replicates the
visual language of the Framer "Jaxon Cruz" portfolio template (dark theme,
`IBM Plex Mono` for labels, sidebar + topnav shell, pill badges, mono
uppercase section labels). The project-detail popup (`.modal` in
`css/style.css:673-726`, wired up in `js/render.js`) was built before that
visual language was fully established and looks out of place: it's a small
centered card (`min(920px,92vw)`) with a translucent blurred backdrop,
floating circular close button, and a horizontal media carousel with
prev/next arrows and dots.

Reference: the real Framer template's individual project pages
(e.g. `jaxon-cruz-wbs.framer.website/work/skincare-ecommerce`) use a
full-page case-study layout: back link, title + metadata, hero/gallery,
overview text, feature/results/testimonial sections, related projects.

Sandy's project data (`_data/portfolio.json`) only has `title`, `category`,
`description`/`content`, `images[]`, `videos[]` — there is no
client/role/year/results/testimonial data, and the admin panel does not
support editing such fields.

## Goal

Redesign the popup to match the site's established code-editor aesthetic and
feel like the Framer template's project pages, using **only existing data
fields** — no new fields added to the JSON schema or admin panel this round.

## Decisions (confirmed with user)

- Full case-study aesthetic, but scoped to existing data fields only.
- Popup becomes a **fullscreen overlay** (not a centered card), and the
  content scrolls vertically like a real page.
- **No** "Related projects" section at the bottom.
- Closes via a **back-link** (`← back to work`) at the top-left, plus `Esc`.
  No floating circular close (×) button, no backdrop-click-to-close.
- Gallery keeps the **existing horizontal carousel** (prev/next arrows +
  dots) at the top of the popup, restyled larger; it is not converted into a
  vertically-stacked image list.

## Design

### Container

- `.modal` changes from a centered card with translucent blurred backdrop to
  a fullscreen fixed overlay: `position: fixed; inset: 0; z-index: 1000;`
  with an **opaque** solid background (`var(--bg)`, same as the page body) —
  it should read as if the user navigated to a new page, not as a dialog
  floating over the current one.
- The `.modal__backdrop` element and its click-to-close listener are removed
  (there is no "outside" to click when the overlay covers the full
  viewport).
- While open, `document.body` gets a class (e.g. `body.modal-open`) that sets
  `overflow: hidden`, since the page underneath must not scroll — the popup
  itself is the scroll container.
- The popup's own content area scrolls vertically
  (`overflow-y: auto` on the modal root or a wrapper), independent from the
  horizontal scroll-snap carousel inside it (no gesture conflict — vertical
  wheel/touch scrolls the page, horizontal drag scrolls the carousel track).

### Top bar

Fixed/sticky bar at the top of the popup, reusing the visual language of the
site's existing `.topnav` (same height token `--nav-h`, `1px solid
var(--border)` bottom border, `var(--nav-bg)` background):

- Left: a text link `← back to work` — `font-family: var(--font-mono)`,
  small size (~11px), uppercase, `var(--text-muted)` → `var(--text)` on
  hover, matching `.topnav__center a` styling. Click closes the popup (same
  handler as `Esc`).
- Right: a small mono hint showing `ESC`, styled like `.topnav__meta`
  (muted, small, decorative — no click behavior).

This replaces the current floating circular `.modal__close` button entirely.

### Content body

Scrollable area below the top bar, `max-width: 1200px` centered, horizontal
padding matching `.section` (`48px`, reduced on mobile per the existing
`768px` breakpoint pattern).

1. **Gallery** — the existing carousel (`.modal__track`, `.modal__slide`,
   prev/next `.modal__nav` buttons, `.modal__dots`) is kept functionally
   as-is (same JS logic in `js/render.js`: `goToSlide`, `renderSlideContent`,
   scroll-snap track, active-slide scaling) but restyled larger/taller to
   read as a hero section rather than a small embedded viewer — e.g. a
   taller aspect ratio / viewport-relative height instead of the current
   `aspect-ratio: 16/9` confined to the 920px card.

2. **Title + category** — project title in a large heading (visually between
   the current `.contact__heading` scale and `.modal__title`, e.g.
   `clamp(28px, 3vw, 40px)`, `font-weight: 700`), with the category shown as
   a pill badge next to or below it, reusing the existing pill visual style
   (`.project-card__category` / `.project-card__type-badge`: mono, uppercase,
   small, bordered/pill).

3. **Overview** — a section label `OVERVIEW` styled exactly like
   `.section__label` / `.info-block__label` (mono, uppercase, `10px`,
   `letter-spacing: 0.1em`, `var(--text-muted)`), followed by the project's
   `description`/`content` text styled like `.info-bio` (`18px`,
   `line-height: 1.85`, `var(--text-muted)`, `max-width: 680px`,
   `white-space: pre-line`) instead of the current small `.modal__description`
   (`12px`, capped `max-height: 30vh` with internal scroll — that cap is
   removed since the whole popup scrolls now).

No Client/Role/Year/Results/Testimonial/Related-projects sections are added.

### Interaction / animation

- Opening: fade in (existing `modal.open`/`display:flex` toggle pattern
  extended to the fullscreen layout). No backdrop blur (nothing behind it to
  blur).
- Closing: triggered by the back-link click or `Esc` keydown (existing
  listener in `js/render.js:190`, reused as-is). The backdrop-click listener
  (`js/render.js:189`) is removed along with the backdrop element.
- Carousel prev/next, dots, and slide click-to-focus behavior are unchanged
  functionally — same `goToSlide`/scroll-snap implementation, just restyled.

### Responsive

Same breakpoint (`768px`) pattern already used elsewhere in `style.css`:
reduced horizontal padding, top bar stays but may shrink text size slightly.
No structural change on mobile — it's fullscreen there too (arguably even
more natural on mobile than the current centered-card modal was).

## Out of scope

- No new data fields (client, role, year, results, testimonial, tags) added
  to `_data/portfolio.json` or the admin panel.
- No "Related projects" section.
- No changes to how project cards open the modal (`openProjectModal` is
  still called the same way from the grid).
