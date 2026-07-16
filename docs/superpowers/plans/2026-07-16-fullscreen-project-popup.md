# Fullscreen Project Popup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the centered-card project-detail popup with a fullscreen, code-editor-styled overlay that matches the rest of the site's Jaxon-Cruz-template look, per `docs/superpowers/specs/2026-07-16-fullscreen-project-popup-design.md`.

**Architecture:** Pure HTML/CSS/JS edits across three existing files (`index.html`, `css/style.css`, `js/render.js`). No new files, no build step, no new dependencies. The existing carousel logic (`goToSlide`, `setActiveSlide`, `layoutSlides`, `buildMediaList`, `renderSlideContent`, `playVideoSlide`) is preserved unchanged — only the container, close mechanism, and typography change.

**Tech Stack:** Static HTML/CSS/vanilla JS, no framework, no bundler. Loaded either directly via `file://` (using the `js/content.js` fallback data already wired in `index.html:66-67`) or via Netlify.

## Global Constraints

- No new data fields added to `_data/portfolio.json` or the admin panel (spec: "Out of scope").
- No "Related projects" section (spec: "Decisions").
- Popup closes only via the `← back to work` link and `Esc` — no floating × button, no backdrop-click-to-close (spec: "Decisions").
- Existing carousel behavior (prev/next, dots, scroll-snap, video play-on-click) must keep working exactly as before — do not change `SLIDE_WIDTH_RATIO`, `goToSlide`, `setActiveSlide`, `layoutSlides`, `buildMediaList`, `renderSlideContent`, or `playVideoSlide` (spec: "Interaction / animation").
- This repo has **no automated test framework** (`package.json` does not exist; no Jest/Playwright/etc. is configured). Introducing one is out of scope (YAGNI) — every verification step below is a manual browser check with exact steps and exact expected outcome, not an automated test. Open `index.html` directly in a browser (double-click it, or drag it into a browser tab) — the `js/content.js` fallback makes it render fully over `file://` with no server needed.
- Reuse existing design tokens (`--bg`, `--nav-bg`, `--nav-h`, `--border`, `--text`, `--text-muted`, `--text-dim`, `--font-mono`, `--accent-yellow`) already defined in `css/style.css:7-30` — do not introduce new color/font values.

---

### Task 1: Fullscreen container, topbar, and close mechanics

**Files:**
- Modify: `index.html:33-51` (modal markup)
- Modify: `css/style.css:673-726` (modal CSS block)
- Modify: `js/render.js:143-190` (open/close wiring)

**Interfaces:**
- Consumes: `openProjectModal(project)`, `closeModal()`, and the carousel functions (`goToSlide`, `setActiveSlide`, `layoutSlides`, `buildMediaList`, `renderSlideContent`, `playVideoSlide`) already defined in `js/render.js` — none of their signatures change in this task.
- Produces: HTML id `#modal-back` (replaces `#modal-close`); CSS classes `.modal__topbar`, `.modal__back`, `.modal__esc-hint`, a non-card `.modal__content` wrapper, and `body.modal-open` as the scroll-lock mechanism (replaces the old inline `document.body.style.overflow` toggle). Task 2 depends on `.modal__content`, `.modal__viewer`, `.modal__info`, `.modal__meta`, `.modal__title`, `.modal__category`, `.modal__description` all still existing with the same names after this task.

- [ ] **Step 1: Update the modal markup in `index.html`**

Replace lines 33-51:

```html
  <div class="modal" id="project-modal">
    <div class="modal__backdrop" id="modal-backdrop"></div>
    <div class="modal__content">
      <button class="modal__close" id="modal-close">✕</button>
      <div class="modal__viewer" id="modal-viewer">
        <div class="modal__track" id="modal-track"></div>
        <button class="modal__nav modal__nav--prev" id="modal-prev" aria-label="Previous">‹</button>
        <button class="modal__nav modal__nav--next" id="modal-next" aria-label="Next">›</button>
      </div>
      <div class="modal__dots" id="modal-dots"></div>
      <div class="modal__info">
        <div class="modal__meta">
          <h2 class="modal__title" id="modal-title"></h2>
          <span class="modal__category" id="modal-category"></span>
        </div>
        <p class="modal__description" id="modal-description"></p>
      </div>
    </div>
  </div>
```

with:

```html
  <div class="modal" id="project-modal">
    <div class="modal__topbar">
      <button class="modal__back" id="modal-back" type="button">&larr; back to work</button>
      <span class="modal__esc-hint">ESC</span>
    </div>
    <div class="modal__content">
      <div class="modal__viewer" id="modal-viewer">
        <div class="modal__track" id="modal-track"></div>
        <button class="modal__nav modal__nav--prev" id="modal-prev" aria-label="Previous">‹</button>
        <button class="modal__nav modal__nav--next" id="modal-next" aria-label="Next">›</button>
      </div>
      <div class="modal__dots" id="modal-dots"></div>
      <div class="modal__info">
        <div class="modal__meta">
          <h2 class="modal__title" id="modal-title"></h2>
          <span class="modal__category" id="modal-category"></span>
        </div>
        <p class="modal__description" id="modal-description"></p>
      </div>
    </div>
  </div>
```

- [ ] **Step 2: Replace the modal CSS block in `css/style.css`**

Replace lines 673-726 (the entire `/* ── PROJECT DETAIL MODAL ── */` block) with:

```css
/* ── PROJECT DETAIL MODAL ────────────────────────────── */
.modal { position: fixed; inset: 0; z-index: 1000; display: none; flex-direction: column; background: var(--bg); overflow-y: auto; }
.modal.open { display: flex; }
body.modal-open { overflow: hidden; }

.modal__topbar {
  position: sticky; top: 0; z-index: 2;
  height: var(--nav-h); flex-shrink: 0;
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 20px;
  background: var(--nav-bg);
  border-bottom: 1px solid var(--border);
}

.modal__back {
  font-family: var(--font-mono); font-size: 11px; font-weight: 500;
  text-transform: uppercase; letter-spacing: 0.05em;
  color: var(--text-muted); background: none; border: none; cursor: pointer;
  transition: color 0.15s;
}
.modal__back:hover { color: var(--text); }

.modal__esc-hint {
  font-family: var(--font-mono); font-size: 10px; font-weight: 500;
  letter-spacing: 0.05em; color: var(--text-dim);
}

.modal__content { width: 100%; max-width: 1200px; margin: 0 auto; padding: 48px; cursor: default; }

.modal__viewer { position: relative; aspect-ratio: 16/9; background: var(--nav-bg); overflow: hidden; border-radius: 12px; }

.modal__track {
  display: flex; align-items: center; height: 100%; gap: 12px;
  overflow-x: auto; scroll-snap-type: x mandatory; scroll-behavior: smooth;
  scrollbar-width: none; -ms-overflow-style: none;
}
.modal__track::-webkit-scrollbar { display: none; }

.modal__slide {
  position: relative; flex: 0 0 auto; height: 82%;
  scroll-snap-align: center; border-radius: 8px; overflow: hidden;
  background: var(--surface); cursor: pointer;
  transform: scale(0.84); opacity: 0.55;
  transition: transform 0.3s cubic-bezier(0.25,0.46,0.45,0.94), opacity 0.3s ease;
}
.modal__slide.active { transform: scale(1); opacity: 1; }
.modal__slide img { width: 100%; height: 100%; object-fit: cover; }
.modal__slide iframe { width: 100%; height: 100%; border: none; }
.modal__slide-play-icon {
  position: absolute; inset: 0; display: flex; align-items: center; justify-content: center;
  background: rgba(0,0,0,0.35); pointer-events: none;
}
.modal__slide-play-icon svg { width: 44px; height: 44px; fill: white; filter: drop-shadow(0 2px 8px rgba(0,0,0,0.6)); }

.modal__nav {
  position: absolute; top: 50%; transform: translateY(-50%); z-index: 2;
  background: rgba(0,0,0,0.6); border: none; color: var(--text); font-size: 22px;
  width: 34px; height: 34px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center; cursor: pointer;
}
.modal__nav--prev { left: 10px; }
.modal__nav--next { right: 10px; }
.modal__nav:disabled { opacity: 0.25; cursor: default; }

.modal__dots { display: flex; justify-content: center; gap: 6px; padding: 12px 20px 0; }
.modal__dot {
  width: 6px; height: 6px; border-radius: 50%; background: var(--text-dim);
  cursor: pointer; border: none; padding: 0; transition: background 0.15s, transform 0.15s;
}
.modal__dot.active { background: var(--accent-yellow); transform: scale(1.3); }

.modal__info { padding: 32px 0 0; }
.modal__meta { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 10px; }
.modal__title { font-size: 18px; font-weight: 600; color: var(--text); }
.modal__category { font-family: var(--font-mono); font-size: 9px; font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase; color: var(--text-muted); white-space: nowrap; }
.modal__description { font-size: 12px; line-height: 1.6; color: var(--text-muted); white-space: pre-line; }
```

Note: `.modal__info`/`.modal__title`/`.modal__category`/`.modal__description` are carried over as-is here (still small/card-sized) — Task 2 upgrades them to the hero typography from the spec. This task's only job is making the container fullscreen and the close mechanism work.

- [ ] **Step 3: Update `js/render.js` open/close wiring**

In `openProjectModal`, replace (around line 144):

```js
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
```

with:

```js
      modal.classList.add('open');
      document.body.classList.add('modal-open');
```

Replace `closeModal` (around lines 182-186):

```js
    function closeModal() {
      modal.classList.remove('open');
      modalTrack.innerHTML = '';
      document.body.style.overflow = '';
    }
```

with:

```js
    function closeModal() {
      modal.classList.remove('open');
      modalTrack.innerHTML = '';
      document.body.classList.remove('modal-open');
    }
```

Replace the listener wiring (around lines 188-190):

```js
    document.getElementById('modal-close').addEventListener('click', closeModal);
    document.getElementById('modal-backdrop').addEventListener('click', closeModal);
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
```

with:

```js
    document.getElementById('modal-back').addEventListener('click', closeModal);
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
```

- [ ] **Step 4: Manual verification**

Open `index.html` in a browser. Open DevTools console first (must show zero errors on page load — a stray `#modal-close`/`#modal-backdrop` reference left anywhere would throw `Cannot read properties of null` and silently break the whole page).

1. Click any project card in the work grid.
   - Expected: the popup covers the entire viewport (no visible page content behind it, no rounded card, no dim/blurred backdrop), background is solid dark (`var(--bg)`), and a top bar with `← BACK TO WORK` (left) and `ESC` (right) is visible and stays pinned while you scroll the popup.
2. Scroll the popup content down and back up.
   - Expected: the topbar stays fixed at the top; the page behind the popup does not scroll (check by trying to scroll — nothing moves outside the popup).
3. Click `← back to work`.
   - Expected: popup closes, work grid is visible again, page scroll is restored (you can scroll the main page normally).
4. Re-open a project card, then press `Esc`.
   - Expected: popup closes the same way.
5. Re-open a project card with multiple images (e.g. "Immersive Room Installation" in the seed data), click the prev/next arrows and the dots.
   - Expected: carousel still slides between images exactly as before (unchanged behavior).

- [ ] **Step 5: Commit**

```bash
git add index.html css/style.css js/render.js
git commit -m "feat: make project popup fullscreen with back-link close"
```

---

### Task 2: Hero gallery sizing and case-study typography

**Files:**
- Modify: `index.html` (add the `Overview` section label inside `.modal__info`)
- Modify: `css/style.css` (upgrade `.modal__viewer`, `.modal__title`, `.modal__category`, add `.modal__section-label`, upgrade `.modal__description`, extend the `768px` responsive block)

**Interfaces:**
- Consumes: `.modal__content`, `.modal__viewer`, `.modal__info`, `.modal__meta`, `.modal__title`, `.modal__category`, `.modal__description` from Task 1 (all names unchanged); `layoutSlides()` in `js/render.js`, which reads `modalViewer.clientWidth` (only `.modal__viewer`'s **height**/aspect-ratio changes in this task — its width stays `100%` of `.modal__content`, so `layoutSlides()`'s math is unaffected).
- Produces: final visual state of the popup — no further task depends on this one.

- [ ] **Step 1: Add the "Overview" section label in `index.html`**

Find this block inside `.modal__info` (added in Task 1):

```html
        <div class="modal__meta">
          <h2 class="modal__title" id="modal-title"></h2>
          <span class="modal__category" id="modal-category"></span>
        </div>
        <p class="modal__description" id="modal-description"></p>
```

Replace with:

```html
        <div class="modal__meta">
          <h2 class="modal__title" id="modal-title"></h2>
          <span class="modal__category" id="modal-category"></span>
        </div>
        <p class="modal__section-label">Overview</p>
        <p class="modal__description" id="modal-description"></p>
```

- [ ] **Step 2: Upgrade the gallery, title, category, and description CSS in `css/style.css`**

Replace:

```css
.modal__viewer { position: relative; aspect-ratio: 16/9; background: var(--nav-bg); overflow: hidden; border-radius: 12px; }
```

with:

```css
.modal__viewer { position: relative; aspect-ratio: 21/9; min-height: 320px; background: var(--nav-bg); overflow: hidden; border-radius: 12px; }
```

Replace:

```css
.modal__info { padding: 32px 0 0; }
.modal__meta { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 10px; }
.modal__title { font-size: 18px; font-weight: 600; color: var(--text); }
.modal__category { font-family: var(--font-mono); font-size: 9px; font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase; color: var(--text-muted); white-space: nowrap; }
.modal__description { font-size: 12px; line-height: 1.6; color: var(--text-muted); white-space: pre-line; }
```

with:

```css
.modal__info { padding: 32px 0 0; }
.modal__meta { display: flex; align-items: center; gap: 14px; flex-wrap: wrap; margin-bottom: 28px; }
.modal__title { font-size: clamp(28px, 3vw, 40px); font-weight: 700; line-height: 1.15; color: var(--text); }
.modal__category {
  font-family: var(--font-mono); font-size: 9px; font-weight: 500;
  letter-spacing: 0.08em; text-transform: uppercase; color: var(--text-muted);
  border: 1px solid var(--border); border-radius: 100px; padding: 4px 12px;
  white-space: nowrap;
}
.modal__section-label {
  font-family: var(--font-mono); font-size: 10px; font-weight: 500;
  letter-spacing: 0.1em; text-transform: uppercase; color: var(--text-muted);
  margin-bottom: 16px;
}
.modal__description { font-size: 18px; line-height: 1.85; color: var(--text-muted); max-width: 680px; white-space: pre-line; }
```

- [ ] **Step 3: Extend the `768px` responsive block**

Find the existing mobile breakpoint at the end of `css/style.css`:

```css
@media (max-width: 768px) {
  :root { --sidebar-w: 0px; --nav-h: 52px; }
  .sidebar { display: none; }
  .topnav { grid-template-columns: 1fr auto; }
  .topnav__left { display: none; }
  .topnav__right { display: none; }
  .topnav__center a { padding: 0 12px; }
  .section { padding: 32px 24px 40px; }
  .work__grid { grid-template-columns: 1fr; }
  .contact__grid { grid-template-columns: 1fr; }
  .footer { padding: 20px 24px; }
}
```

Add three lines inside that same block (before the closing `}`):

```css
  .modal__content { padding: 24px; }
  .modal__viewer { aspect-ratio: 4/3; min-height: 220px; }
  .modal__title { font-size: 24px; }
```

- [ ] **Step 4: Manual verification**

Open `index.html` in a browser at full desktop width.

1. Click a project card with a `description`/`content` value (e.g. "Escribà — AI Creative Direction").
   - Expected: the gallery is a wide hero banner (much taller/wider than the old small viewer), the title reads large and bold, the category sits next to it as a bordered pill (not a plain muted label), an uppercase `OVERVIEW` mono label appears above the body text, and the description text is noticeably larger (18px) and no longer clipped/scrollable on its own — it's part of the page's normal scroll.
2. Click prev/next arrows and dots again.
   - Expected: still works identically to Task 1's verification (the taller viewer must not have broken `layoutSlides()`'s centering — slides should still be horizontally centered and snap correctly).
3. Open DevTools device toolbar (or resize the window) to under 768px width.
   - Expected: popup content padding shrinks, the gallery becomes a shorter 4:3 box, and the title shrinks to 24px — no horizontal overflow/scrollbar appears anywhere in the popup.
4. Confirm in DevTools console: zero errors through all of the above.

- [ ] **Step 5: Commit**

```bash
git add index.html css/style.css
git commit -m "style: hero-size the project popup gallery and case-study typography"
```
