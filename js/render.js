// js/render.js — page content (called by data.js after PORTFOLIO loads)

function initRender() {
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

    function getYouTubeThumb(url) {
      const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
      return yt ? `https://img.youtube.com/vi/${yt[1]}/hqdefault.jpg` : '';
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
      document.getElementById('work-grid').innerHTML = list.map((p, i) => {
        const cover = (p.images && p.images[0]) || '';
        const hasVideo = p.videos && p.videos.length > 0;
        return `
        <div class="project-card" data-idx="${i}">
          <div class="project-card__media">
            <img src="${cover}" alt="${p.title}"
              onerror="this.outerHTML='<div class=\\'placeholder-img\\'>YOUR IMAGE</div>'" />
            ${hasVideo ? `
              <div class="project-card__play-icon">
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M8 5v14l11-7z"/></svg>
              </div>` : ''}
          </div>
          <div class="project-card__info">
            <div class="project-card__meta">
              <span class="project-card__category">${p.category}</span>
              ${hasVideo ? '<span class="project-card__type-badge">Video</span>' : ''}
            </div>
            <h3 class="project-card__title">${p.title}</h3>
            <p class="project-card__desc">${p.description}</p>
          </div>
        </div>
      `;
      }).join('');

      document.querySelectorAll('.project-card').forEach(card => {
        const idx = parseInt(card.dataset.idx);
        const project = list[idx];
        card.addEventListener('click', () => openProjectModal(project));
      });
    }

    // ── PROJECT DETAIL MODAL ────────────────────────────
    const modal = document.getElementById('project-modal');
    const modalViewer = document.getElementById('modal-viewer');
    const modalThumbs = document.getElementById('modal-thumbs');
    const modalTitle = document.getElementById('modal-title');
    const modalCategory = document.getElementById('modal-category');
    const modalDescription = document.getElementById('modal-description');

    function buildMediaList(project) {
      const images = (project.images || []).map(url => ({ type: 'image', url }));
      const videos = (project.videos || []).map(url => ({ type: 'video', url }));
      return [...images, ...videos];
    }

    function renderViewer(item) {
      if (!item) { modalViewer.innerHTML = ''; return; }
      if (item.type === 'image') {
        modalViewer.innerHTML = `<img src="${item.url}" alt="" />`;
      } else {
        const embed = getEmbedUrl(item.url);
        modalViewer.innerHTML = embed ? `<iframe src="${embed}" allowfullscreen allow="autoplay"></iframe>` : '';
      }
    }

    function openProjectModal(project) {
      const media = buildMediaList(project);

      modalTitle.textContent = project.title;
      modalCategory.textContent = project.category;
      modalDescription.textContent = project.content || project.description || '';

      modalThumbs.innerHTML = media.map((item, i) => {
        const thumbSrc = item.type === 'image' ? item.url : getYouTubeThumb(item.url);
        return `
          <div class="modal__thumb ${i === 0 ? 'active' : ''}" data-idx="${i}">
            ${thumbSrc ? `<img src="${thumbSrc}" alt="" />` : ''}
            ${item.type === 'video' ? `
              <div class="modal__thumb-play-icon">
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M8 5v14l11-7z"/></svg>
              </div>` : ''}
          </div>
        `;
      }).join('');

      document.querySelectorAll('.modal__thumb').forEach(thumb => {
        thumb.addEventListener('click', () => {
          const idx = parseInt(thumb.dataset.idx);
          renderViewer(media[idx]);
          document.querySelectorAll('.modal__thumb').forEach(t => t.classList.remove('active'));
          thumb.classList.add('active');
        });
      });

      renderViewer(media[0]);
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
    }

    function closeModal() {
      modal.classList.remove('open');
      modalViewer.innerHTML = '';
      document.body.style.overflow = '';
    }

    document.getElementById('modal-close').addEventListener('click', closeModal);
    document.getElementById('modal-backdrop').addEventListener('click', closeModal);
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

    renderFilters('All');
    renderGrid('All');
  }

  // ── ABOUT / SANDY.INFO PAGE ────────────────────────
  if (page === 'about') {
    const I = P.info || {};
    const el = document.getElementById('about-content');
    if (!el) return;

    el.innerHTML = `
      <div class="info-block">
        <p class="info-block__label">Who I am</p>
        <p class="info-bio">${P.about}</p>
      </div>
      <div class="info-block">
        <p class="info-block__label">Disciplines</p>
        <div class="info-tags">${(I.disciplines || []).map(d => `<span class="info-tag">${d}</span>`).join('')}</div>
      </div>
      <div class="info-block">
        <p class="info-block__label">Tools &amp; Software</p>
        <div class="info-tags">${(I.tools || []).map(t => `<span class="info-tag">${t}</span>`).join('')}</div>
      </div>
      <div class="info-block">
        <p class="info-block__label">Education</p>
        <p class="info-education">${I.education || ''}</p>
      </div>
      <div class="info-block">
        <p class="info-block__label">Languages</p>
        <p class="info-languages">${I.languages || ''}</p>
      </div>
    `;
  }

  // ── CONTACT PAGE ───────────────────────────────────
  if (page === 'contact') {
    const s = P.socials || {};
    const socials = Object.entries(s)
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
          <h2 class="contact__heading">Let's work<br>together</h2>
          <a class="contact__email-link" href="mailto:${P.email}">${P.email}</a>
        </div>
        <div>
          <p class="sidebar__contact-text" style="font-size:12px;margin-bottom:16px">${P.location}</p>
          <div class="contact__socials">${socials}</div>
        </div>
      </div>
    `;
  }
}
