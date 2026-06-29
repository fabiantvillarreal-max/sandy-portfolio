// js/render.js

(function () {
  const P = window.PORTFOLIO;

  // ── NAV ────────────────────────────────────────────
  document.getElementById('nav-logo').textContent = P.name.split(' ')[0].toLowerCase() + '.portfolio';
  document.getElementById('nav-links').innerHTML = `
    <a href="#about">about.me</a>
    <a href="#work">work.done</a>
    <a href="#contact">contact.now</a>
  `;

  // ── HERO ────────────────────────────────────────────
  document.getElementById('hero-name').innerHTML =
    `<span data-editable="name">${P.name}</span>`;

  document.getElementById('hero-title').setAttribute('data-editable', 'title');
  document.getElementById('hero-title').textContent = P.title;

  document.getElementById('hero-tagline').setAttribute('data-editable', 'tagline');
  document.getElementById('hero-tagline').textContent = P.tagline;

  const heroImg = document.getElementById('hero-img');
  heroImg.src = P.heroImage;
  heroImg.onerror = () => {
    heroImg.parentElement.innerHTML = '<div class="placeholder-img">YOUR PHOTO</div>';
  };

  // ── ABOUT ────────────────────────────────────────────
  const aboutText = document.getElementById('about-text');
  aboutText.setAttribute('data-editable', 'about');
  aboutText.textContent = P.about;

  // ── WORK FILTERS ─────────────────────────────────────
  function renderFilters(activeCategory) {
    const container = document.getElementById('work-filters');
    container.innerHTML = P.categories.map(cat => `
      <button class="filter-btn ${cat === activeCategory ? 'active' : ''}" data-cat="${cat}">${cat}</button>
    `).join('');
    container.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        renderFilters(btn.dataset.cat);
        renderGrid(btn.dataset.cat);
      });
    });
  }

  // ── EMBED URL ─────────────────────────────────────────
  function getEmbedUrl(url) {
    if (!url || url.includes('REPLACE_WITH')) return '';
    const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
    if (yt) return `https://www.youtube.com/embed/${yt[1]}?autoplay=1`;
    const vimeo = url.match(/vimeo\.com\/(\d+)/);
    if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}?autoplay=1`;
    return url;
  }

  // ── WORK GRID ─────────────────────────────────────────
  function renderGrid(activeCategory) {
    const grid = document.getElementById('work-grid');
    const filtered = activeCategory === 'All'
      ? P.projects
      : P.projects.filter(p => p.category === activeCategory);

    grid.innerHTML = filtered.map(project => {
      const isVideo = project.type === 'video';
      const badge = isVideo
        ? `<span class="project-card__type-badge">Video</span>`
        : '';
      return `
        <div class="project-card" data-project-id="${project.id}">
          <div class="edit-card-controls">
            <button class="edit-btn-duplicate" data-action="duplicate" data-id="${project.id}">◻ Duplicate</button>
            <button class="edit-btn-delete" data-action="delete" data-id="${project.id}">✕ Delete</button>
          </div>
          <div class="project-card__media">
            <img src="${project.image}" alt="${project.title}"
              onerror="this.outerHTML='<div class=\\'placeholder-img\\'>ADD IMAGE</div>'" />
            ${isVideo ? `
              <div class="project-card__play-icon">
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </div>` : ''}
          </div>
          <div class="project-card__info">
            <div class="project-card__meta">
              <span class="project-card__category" data-editable="projects.${project.id}.category">${project.category}</span>
              ${badge}
            </div>
            <h3 class="project-card__title" data-editable="projects.${project.id}.title">${project.title}</h3>
            <p class="project-card__desc" data-editable="projects.${project.id}.description">${project.description}</p>
          </div>
        </div>`;
    }).join('');

    grid.querySelectorAll('.project-card').forEach(card => {
      const id = parseInt(card.dataset.projectId);
      const project = P.projects.find(p => p.id === id);
      if (project && project.type === 'video') {
        card.style.cursor = 'pointer';
        card.addEventListener('click', e => {
          if (e.target.closest('.edit-card-controls')) return;
          const embed = getEmbedUrl(project.video);
          if (embed) openModal(embed);
        });
      }
    });
  }

  // ── VIDEO MODAL ────────────────────────────────────────
  const modal = document.getElementById('video-modal');
  const modalVideo = document.getElementById('modal-video');

  function openModal(embedUrl) {
    modalVideo.innerHTML = `<iframe src="${embedUrl}" allowfullscreen allow="autoplay"></iframe>`;
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

  // ── CONTACT ────────────────────────────────────────────
  const socials = Object.entries(P.socials)
    .filter(([, url]) => url)
    .map(([name, url]) => `
      <a class="contact__social" href="${url}" target="_blank" rel="noopener">
        ${name.charAt(0).toUpperCase() + name.slice(1)} ↗
      </a>`)
    .join('');

  document.getElementById('contact-content').innerHTML = `
    <div class="contact__main">
      <h2 class="contact__heading" data-editable="contactHeading">Let's work<br>together</h2>
      <a class="contact__email-link" href="mailto:${P.email}" data-editable="email">${P.email}</a>
      <div class="contact__meta-row">
        <span class="contact__location" data-editable="location">${P.location}</span>
        <div class="contact__socials">${socials}</div>
      </div>
    </div>
  `;

  // ── FOOTER ─────────────────────────────────────────────
  document.querySelector('.footer__copy').textContent =
    `© ${new Date().getFullYear()} ${P.name} — All rights reserved`;

  // ── INIT ────────────────────────────────────────────────
  renderFilters('All');
  renderGrid('All');

  window.renderPortfolio = function () {
    renderFilters('All');
    renderGrid('All');
  };
})();
