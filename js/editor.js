// js/editor.js — opens /admin panel (Decap CMS handles all editing)

function initEditor() {
  const btn = document.getElementById('edit-toggle');
  if (btn) {
    btn.title = 'Open content manager (/admin)';
    btn.addEventListener('click', () => { window.location.href = '/admin/'; });
  }
  document.addEventListener('keydown', e => {
    if (e.ctrlKey && e.shiftKey && e.key === 'E') {
      e.preventDefault();
      window.location.href = '/admin/';
    }
  });
}
