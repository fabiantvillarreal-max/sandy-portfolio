// js/data.js — loads portfolio data then initializes all modules

(async function () {
  // On a real server (Netlify), load from _data/portfolio.json
  // On file:// (local), use content.js fallback (already loaded as script tag)
  if (window.location.protocol !== 'file:') {
    try {
      const res = await fetch('_data/portfolio.json');
      if (res.ok) window.PORTFOLIO = await res.json();
    } catch (e) {
      console.warn('Could not fetch portfolio.json, using content.js fallback');
    }
  }

  // Normalize: ensure socials and info exist
  if (window.PORTFOLIO) {
    window.PORTFOLIO.socials = window.PORTFOLIO.socials || {};
    window.PORTFOLIO.info = window.PORTFOLIO.info || {};
    // categories always starts with "All"
    const cats = window.PORTFOLIO.categories || [];
    window.PORTFOLIO.categories = cats[0] === 'All' ? cats : ['All', ...cats];
  }

  if (!window.PORTFOLIO) {
    document.body.innerHTML = '<p style="color:white;padding:40px;font-family:monospace">Error: no portfolio data found.</p>';
    return;
  }

  if (typeof initLayout === 'function') initLayout();
  if (typeof initRender === 'function') initRender();
  if (typeof initEditor === 'function') initEditor();
})();
