// js/editor.js

(function () {
  let editMode = false;
  let fileHandle = null; // File System Access API handle

  // ── SAVE BAR ──────────────────────────────────────────
  const saveBar = document.createElement('div');
  saveBar.className = 'edit-save-bar';
  saveBar.innerHTML = `
    <span id="edit-bar-hint">✏ Edit mode — click any text to edit</span>
    <button class="edit-cancel-btn" id="edit-cancel">Cancel</button>
    <button class="edit-save-btn" id="edit-save">💾 Save changes</button>
  `;
  document.body.appendChild(saveBar);

  // ── TOGGLE ────────────────────────────────────────────
  function toggleEditMode() {
    editMode = !editMode;
    document.body.classList.toggle('edit-mode', editMode);
    setEditable(editMode);
  }

  function setEditable(on) {
    document.querySelectorAll('[data-editable]').forEach(el => {
      el.contentEditable = on ? 'true' : 'false';
    });
    document.querySelectorAll('[data-editable-array]').forEach(el => {
      el.contentEditable = on ? 'true' : 'false';
    });
  }

  // ── SET NESTED VALUE (dot-notation path) ──────────────
  function setNestedValue(obj, path, value) {
    const parts = path.split('.');
    let current = obj;
    for (let i = 0; i < parts.length - 1; i++) {
      const key = parts[i];
      if (current[key] === undefined || current[key] === null) {
        current[key] = isNaN(parts[i + 1]) ? {} : [];
      }
      current = current[key];
    }
    const last = parts[parts.length - 1];
    current[isNaN(last) ? last : parseInt(last)] = value;
  }

  // ── COLLECT EDITS ─────────────────────────────────────
  function collectEdits() {
    const P = window.PORTFOLIO;

    document.querySelectorAll('[data-editable]').forEach(el => {
      const key = el.dataset.editable;
      if (key.startsWith('projects.')) return;
      setNestedValue(P, key, el.textContent.trim());
    });

    document.querySelectorAll('.project-card').forEach(card => {
      const id = parseInt(card.dataset.projectId);
      const project = P.projects.find(p => p.id === id);
      if (!project) return;
      const titleEl = card.querySelector('[data-editable$=".title"]');
      const descEl  = card.querySelector('[data-editable$=".description"]');
      const catEl   = card.querySelector('[data-editable$=".category"]');
      if (titleEl) project.title       = titleEl.textContent.trim();
      if (descEl)  project.description = descEl.textContent.trim();
      if (catEl)   project.category    = catEl.textContent.trim();
    });

    const arrays = {};
    document.querySelectorAll('[data-editable-array]').forEach(el => {
      const key = el.dataset.editableArray;
      if (!arrays[key]) arrays[key] = [];
      const text = el.textContent.trim();
      if (text) arrays[key].push(text);
    });
    Object.entries(arrays).forEach(([path, items]) => setNestedValue(P, path, items));

    return P;
  }

  // ── BUILD content.js TEXT ─────────────────────────────
  function buildContentJs(P) {
    return `// js/content.js — updated ${new Date().toLocaleString()}
// ============================================================
// PORTFOLIO CONTENT — edit this file to update the site
// ============================================================

window.PORTFOLIO = ${JSON.stringify(P, null, 2)};
`;
  }

  // ── SAVE — File System Access API ─────────────────────
  async function saveChanges() {
    const P = collectEdits();
    const content = buildContentJs(P);
    const hint = document.getElementById('edit-bar-hint');

    // Use File System Access API if available (Chrome/Edge)
    if (window.showOpenFilePicker) {
      try {
        if (!fileHandle) {
          hint.textContent = '📂 Select your js/content.js file to link it...';
          const [handle] = await window.showOpenFilePicker({
            types: [{ description: 'JavaScript', accept: { 'text/javascript': ['.js'] } }],
            multiple: false
          });
          fileHandle = handle;
        }

        const writable = await fileHandle.createWritable();
        await writable.write(content);
        await writable.close();

        hint.textContent = '✅ Saved!';
        setTimeout(() => { hint.textContent = '✏ Edit mode — click any text to edit'; }, 2000);

      } catch (err) {
        if (err.name !== 'AbortError') {
          // Fallback to download if something went wrong
          downloadFallback(content);
        }
        hint.textContent = '✏ Edit mode — click any text to edit';
      }

    } else {
      // Firefox or other browsers — download fallback
      downloadFallback(content);
      hint.textContent = '⬇ File downloaded — replace js/content.js with it';
      setTimeout(() => { hint.textContent = '✏ Edit mode — click any text to edit'; }, 4000);
    }
  }

  function downloadFallback(content) {
    const blob = new Blob([content], { type: 'text/javascript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'content.js';
    a.click();
    URL.revokeObjectURL(url);
  }

  // ── CARD CONTROLS (work page only) ───────────────────
  const workGrid = document.getElementById('work-grid');
  if (workGrid) workGrid.addEventListener('click', function (e) {
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

    if (window.renderPortfolio) window.renderPortfolio();
    setEditable(true);
  });

  // ── BINDINGS ──────────────────────────────────────────
  document.getElementById('edit-toggle').addEventListener('click', toggleEditMode);

  document.getElementById('edit-cancel').addEventListener('click', () => {
    editMode = false;
    document.body.classList.remove('edit-mode');
    setEditable(false);
  });

  document.getElementById('edit-save').addEventListener('click', saveChanges);

  document.addEventListener('keydown', e => {
    if (e.ctrlKey && e.shiftKey && e.key === 'E') { e.preventDefault(); toggleEditMode(); }
  });
})();
