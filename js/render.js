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
    const modalTitle = document.getElementById('modal-title');
    const modalClient = document.getElementById('modal-client');
    const modalRole = document.getElementById('modal-role');
    const modalYear = document.getElementById('modal-year');
    const modalHero = document.getElementById('modal-hero');
    const modalOverview = document.getElementById('modal-overview');
    const modalApproach = document.getElementById('modal-approach');
    const modalDeliverables = document.getElementById('modal-deliverables');
    const modalGallery = document.getElementById('modal-gallery');
    const modalSeeMore = document.getElementById('modal-see-more');

    function renderParagraphs(el, text) {
      el.innerHTML = (text || '')
        .split(/\n\s*\n/)
        .filter(p => p.trim())
        .map(p => `<p>${p}</p>`)
        .join('');
    }

    function imgTag(url) {
      return `<img src="${url}" alt=""
        onerror="this.outerHTML='<div class=\\'placeholder-img\\'>YOUR IMAGE</div>'" />`;
    }

    function openProjectModal(project) {
      const images = project.images || [];
      const videos = project.videos || [];
      const [heroUrl, ...galleryImages] = images;

      modalTitle.textContent = project.title;
      modalClient.textContent = project.client || '';
      modalRole.textContent = project.role || '';
      modalYear.textContent = project.year || '';

      modalHero.innerHTML = heroUrl ? imgTag(heroUrl) : `<div class="placeholder-img">YOUR IMAGE</div>`;

      renderParagraphs(modalOverview, project.content || project.description || '');
      document.getElementById('modal-section-overview').style.display = modalOverview.innerHTML ? '' : 'none';

      renderParagraphs(modalApproach, project.approach || '');
      document.getElementById('modal-section-approach').style.display = modalApproach.innerHTML ? '' : 'none';

      const deliverables = project.deliverables || [];
      modalDeliverables.innerHTML = deliverables.map(d => `<li>${d}</li>`).join('');
      document.getElementById('modal-section-deliverables').style.display = deliverables.length ? '' : 'none';

      const galleryItems = [
        ...galleryImages.map(url => `<div class="modal__gallery-item">${imgTag(url)}</div>`),
        ...videos.map(url => {
          const thumb = getYouTubeThumb(url);
          return `<a class="modal__gallery-item modal__gallery-item--video" href="${url}" target="_blank" rel="noopener">
            ${thumb ? `<img src="${thumb}" alt="" />` : ''}
            <div class="modal__slide-play-icon">
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M8 5v14l11-7z"/></svg>
            </div>
          </a>`;
        })
      ];
      modalGallery.innerHTML = galleryItems.join('');
      modalGallery.style.display = galleryItems.length ? '' : 'none';

      modal.classList.add('open');
      document.body.classList.add('modal-open');
      modal.scrollTop = 0;
    }

    function closeModal() {
      modal.classList.remove('open');
      document.body.classList.remove('modal-open');
    }

    document.getElementById('modal-back').addEventListener('click', closeModal);
    modalSeeMore.addEventListener('click', closeModal);
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && modal.classList.contains('open')) closeModal(); });

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
