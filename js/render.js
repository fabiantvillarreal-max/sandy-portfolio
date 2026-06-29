// js/render.js — page-specific content

(function () {
  const P = window.PORTFOLIO;
  const page = document.body.dataset.page;

  // ── WORK PAGE ──────────────────────────────────────
  if (page === 'work') {
    function getEmbedUrl(url) {
      if (!url || url.includes('REPLACE_WITH')) return '';
      const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
      if (yt) return `https://www.youtube.com/embed/${yt[1]}?autoplay=1`;
      const vimeo = url.match(/vimeo\.com\/(\d+)/);
      if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}?autoplay=1`;
      return url;
    }

    function renderFilters(active) {
      document.getElementById('work-filters').innerHTML = P.categories.map(cat =>
        `<button class="filter-btn ${cat === active ? 'active' : ''}" data-cat="${cat}">${cat}</button>`
      ).join('');
      document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => { renderFilters(btn.dataset.cat); renderGrid(btn.dataset.cat); });
      });
    }

    function renderGrid(active) {
      const list = active === 'All' ? P.projects : P.projects.filter(p => p.category === active);
      document.getElementById('work-grid').innerHTML = list.map(p => `
        <div class="project-card" data-project-id="${p.id}">
          <div class="edit-card-controls">
            <button class="edit-btn-duplicate" data-action="duplicate" data-id="${p.id}">◻ Dup</button>
            <button class="edit-btn-delete" data-action="delete" data-id="${p.id}">✕</button>
          </div>
          <div class="project-card__media">
            <img src="${p.image}" alt="${p.title}"
              onerror="this.outerHTML='<div class=\\'placeholder-img\\'>YOUR IMAGE</div>'" />
            <label class="card-img-edit" title="Change image">
              📷
              <input type="file" accept="image/*" data-img-for="${p.id}" style="display:none" />
            </label>
            ${p.type === 'video' ? `
              <div class="project-card__play-icon">
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M8 5v14l11-7z"/></svg>
              </div>` : ''}
          </div>
          <div class="project-card__info">
            <div class="project-card__meta">
              <span class="project-card__category" data-editable="projects.${p.id}.category">${p.category}</span>
              ${p.type === 'video' ? '<span class="project-card__type-badge">Video</span>' : ''}
            </div>
            <h3 class="project-card__title" data-editable="projects.${p.id}.title">${p.title}</h3>
            <p class="project-card__desc" data-editable="projects.${p.id}.description">${p.description}</p>
          </div>
        </div>
      `).join('');

      // Image file pickers
      document.querySelectorAll('input[data-img-for]').forEach(input => {
        input.addEventListener('change', e => {
          const file = e.target.files[0];
          if (!file) return;
          const id = parseInt(input.dataset.imgFor);
          const project = P.projects.find(p => p.id === id);
          if (!project) return;
          const url = URL.createObjectURL(file);
          const card = document.querySelector(`.project-card[data-project-id="${id}"]`);
          const img = card.querySelector('img');
          if (img) { img.src = url; img.style.display = 'block'; }
          project.image = 'images/' + file.name;
        });
      });

      // Card click → video modal
      document.querySelectorAll('.project-card').forEach(card => {
        const id = parseInt(card.dataset.projectId);
        const project = P.projects.find(p => p.id === id);
        if (project?.type === 'video') {
          card.addEventListener('click', e => {
            if (e.target.closest('.edit-card-controls') || e.target.closest('.card-img-edit')) return;
            if (document.body.classList.contains('edit-mode')) return;
            const embed = getEmbedUrl(project.video);
            if (embed) openModal(embed);
          });
        }
      });
    }

    const modal = document.getElementById('video-modal');
    const modalVideo = document.getElementById('modal-video');

    function openModal(url) {
      modalVideo.innerHTML = `<iframe src="${url}" allowfullscreen allow="autoplay"></iframe>`;
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
    }

    function closeModal() {
      modal.classList.remove('open');
      modalVideo.innerHTML = '';
      document.body.style.overflow = '';
    }

    document.getElementById('modal-close').addEventListener('click', closeModal);
    document.getElementById('modal-backdrop').addEventListener('click', closeModal);
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

    renderFilters('All');
    renderGrid('All');

    window.renderPortfolio = function () { renderFilters('All'); renderGrid('All'); };
  }

  // ── ABOUT / SANDY.INFO PAGE ────────────────────────
  if (page === 'about') {
    const I = P.info || {};
    const el = document.getElementById('about-content');
    if (!el) return;

    function tagList(items, arrayKey) {
      return (items || []).map((item, i) => `
        <span class="info-tag-wrap">
          <span class="info-tag" data-editable-array="${arrayKey}" data-index="${i}" contenteditable="false">${item}</span>
          <button class="info-tag-del" data-array="${arrayKey}" data-index="${i}" title="Remove">×</button>
        </span>
      `).join('') + `<button class="info-tag-add" data-array="${arrayKey}" title="Add new">+ Add</button>`;
    }

    el.innerHTML = `
      <div class="info-block">
        <p class="info-block__label">Who I am</p>
        <p class="info-bio" data-editable="about">${P.about}</p>
      </div>

      <div class="info-block">
        <p class="info-block__label">Disciplines</p>
        <div class="info-tags" id="tags-disciplines">${tagList(I.disciplines, 'info.disciplines')}</div>
      </div>

      <div class="info-block">
        <p class="info-block__label">Tools &amp; Software</p>
        <div class="info-tags" id="tags-tools">${tagList(I.tools, 'info.tools')}</div>
      </div>

      <div class="info-block">
        <p class="info-block__label">Education</p>
        <p class="info-education" data-editable="info.education">${I.education || ''}</p>
      </div>

      <div class="info-block">
        <p class="info-block__label">Languages</p>
        <p class="info-languages" data-editable="info.languages">${I.languages || ''}</p>
      </div>
    `;

    // Tag delete
    el.addEventListener('click', e => {
      if (!document.body.classList.contains('edit-mode')) return;

      if (e.target.classList.contains('info-tag-del')) {
        const arrayKey = e.target.dataset.array;
        const idx = parseInt(e.target.dataset.index);
        const parts = arrayKey.split('.');
        const arr = parts.reduce((o, k) => o[k], P);
        arr.splice(idx, 1);
        rerenderTags();
      }

      if (e.target.classList.contains('info-tag-add')) {
        const arrayKey = e.target.dataset.array;
        const parts = arrayKey.split('.');
        const arr = parts.reduce((o, k) => o[k], P);
        arr.push('New item');
        rerenderTags();
        // Auto-focus the new tag
        setTimeout(() => {
          const tags = document.querySelectorAll(`[data-editable-array="${arrayKey}"]`);
          const last = tags[tags.length - 1];
          if (last) last.focus();
        }, 50);
      }
    });

    // Tag content edits → update PORTFOLIO live
    el.addEventListener('input', e => {
      const tag = e.target.closest('[data-editable-array]');
      if (!tag) return;
      const arrayKey = tag.dataset.editableArray;
      const idx = parseInt(tag.dataset.index);
      const parts = arrayKey.split('.');
      const arr = parts.reduce((o, k) => o[k], P);
      arr[idx] = tag.textContent.trim();
    });

    function rerenderTags() {
      const I = P.info || {};
      const disc = document.getElementById('tags-disciplines');
      const tools = document.getElementById('tags-tools');
      if (disc) disc.innerHTML = tagList(I.disciplines, 'info.disciplines');
      if (tools) tools.innerHTML = tagList(I.tools, 'info.tools');
      // Re-apply contentEditable if in edit mode
      if (document.body.classList.contains('edit-mode')) {
        document.querySelectorAll('[data-editable-array]').forEach(t => {
          t.contentEditable = 'true';
        });
      }
    }

    window._rerenderTags = rerenderTags;
  }

  // ── CONTACT PAGE ───────────────────────────────────
  if (page === 'contact') {
    const socials = Object.entries(P.socials)
      .filter(([, url]) => url)
      .map(([name, url]) =>
        `<a class="contact__social" href="${url}" target="_blank" rel="noopener">
           ${name.charAt(0).toUpperCase() + name.slice(1)} ↗
         </a>`)
      .join('');

    const el = document.getElementById('contact-content');
    if (el) el.innerHTML = `
      <div class="contact__grid">
        <div>
          <h2 class="contact__heading" data-editable="contactHeading">Let's work<br>together</h2>
          <a class="contact__email-link" href="mailto:${P.email}" data-editable="email">${P.email}</a>
        </div>
        <div>
          <p class="sidebar__contact-text" data-editable="location"
             style="font-size:12px;margin-bottom:16px">${P.location}</p>
          <div class="contact__socials">${socials}</div>
        </div>
      </div>
    `;
  }
})();
