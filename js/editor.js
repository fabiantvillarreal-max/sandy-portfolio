// js/editor.js

(function () {
  let editMode = false;

  // ── SAVE BAR ──────────────────────────────────────────
  const saveBar = document.createElement('div');
  saveBar.className = 'edit-save-bar';
  saveBar.id = 'edit-save-bar';
  saveBar.innerHTML = `
    <span>✏ Edit mode — click any text to edit</span>
    <button class="edit-cancel-btn" id="edit-cancel">Cancel</button>
    <button class="edit-save-btn" id="edit-save">⬇ Save content.js</button>
  `;
  saveBar.style.display = 'none';
  document.body.appendChild(saveBar);

  // ── TOGGLE ────────────────────────────────────────────
  function toggleEditMode() {
    editMode = !editMode;
    document.body.classList.toggle('edit-mode', editMode);
    setEditable(editMode);
    saveBar.style.display = editMode ? 'flex' : 'none';
  }

  function setEditable(on) {
    document.querySelectorAll('[data-editable]').forEach(el => {
      el.contentEditable = on ? 'true' : 'false';
    });
  }

  // ── COLLECT EDITS ─────────────────────────────────────
  function collectEdits() {
    const P = window.PORTFOLIO;

    document.querySelectorAll('[data-editable]').forEach(el => {
      const key = el.dataset.editable;
      if (!key.includes('.')) {
        P[key] = el.textContent.trim();
      }
    });

    document.querySelectorAll('.project-card').forEach(card => {
      const id = parseInt(card.dataset.projectId);
      const project = P.projects.find(p => p.id === id);
      if (!project) return;
      const titleEl = card.querySelector('[data-editable$=".title"]');
      const descEl = card.querySelector('[data-editable$=".description"]');
      const catEl = card.querySelector('[data-editable$=".category"]');
      if (titleEl) project.title = titleEl.textContent.trim();
      if (descEl) project.description = descEl.textContent.trim();
      if (catEl) project.category = catEl.textContent.trim();
    });

    return P;
  }

  // ── DOWNLOAD content.js ───────────────────────────────
  function downloadContentJs() {
    const P = collectEdits();
    const js = `// js/content.js — updated ${new Date().toLocaleString()}
// ============================================================
// PORTFOLIO CONTENT — edit this file to update the site
// ============================================================

window.PORTFOLIO = ${JSON.stringify(P, null, 2)};
`;
    const blob = new Blob([js], { type: 'text/javascript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'content.js';
    a.click();
    URL.revokeObjectURL(url);
  }

  // ── CARD CONTROLS ─────────────────────────────────────
  document.getElementById('work-grid').addEventListener('click', function (e) {
    if (!editMode) return;
    const action = e.target.dataset.action;
    const id = parseInt(e.target.dataset.id);
    if (!action || !id) return;

    if (action === 'delete') {
      if (window.PORTFOLIO.projects.length <= 1) return;
      window.PORTFOLIO.projects = window.PORTFOLIO.projects.filter(p => p.id !== id);
    }

    if (action === 'duplicate') {
      const original = window.PORTFOLIO.projects.find(p => p.id === id);
      if (!original) return;
      const newId = Math.max(...window.PORTFOLIO.projects.map(p => p.id)) + 1;
      const clone = Object.assign({}, original, { id: newId, title: original.title + ' (copy)' });
      const idx = window.PORTFOLIO.projects.indexOf(original);
      window.PORTFOLIO.projects.splice(idx + 1, 0, clone);
    }

    window.renderPortfolio();
    setEditable(true);
  });

  // ── BINDINGS ──────────────────────────────────────────
  document.getElementById('edit-toggle').addEventListener('click', toggleEditMode);

  document.getElementById('edit-cancel').addEventListener('click', () => {
    editMode = false;
    document.body.classList.remove('edit-mode');
    setEditable(false);
    saveBar.style.display = 'none';
  });

  document.getElementById('edit-save').addEventListener('click', downloadContentJs);

  document.addEventListener('keydown', e => {
    if (e.ctrlKey && e.shiftKey && e.key === 'E') {
      e.preventDefault();
      toggleEditMode();
    }
  });
})();
