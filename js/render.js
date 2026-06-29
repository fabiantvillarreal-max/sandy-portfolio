// js/render.js

(function () {
  const P = window.PORTFOLIO;

  // ── NAV ────────────────────────────────────────────
  document.getElementById('nav-logo').textContent = P.name;
  document.getElementById('nav-links').innerHTML = `
    <a href="#about">About</a>
    <a href="#work">Work</a>
    <a href="#contact">Contact</a>
  `;

  // ── HERO ────────────────────────────────────────────
  const heroName = document.getElementById('hero-name');
  heroName.setAttribute('data-editable', 'name');
  heroName.textContent = P.name;

  const heroTitle = document.getElementById('hero-title');
  heroTitle.setAttribute('data-editable', 'title');
  heroTitle.textContent = P.title;

  const heroTagline = document.getElementById('hero-tagline');
  heroTagline.setAttribute('data-editable', 'tagline');
  heroTagline.textContent = P.tagline;

  const heroImg = document.getElementById('hero-img');
  heroImg.src = P.heroImage;
  heroImg.onerror = () => { heroImg.style.opacity = '0'; };

  // ── ABOUT ────────────────────────────────────────────
  const aboutText = document.getElementById('about-text');
  aboutText.setAttribute('data-editable', 'about');
  aboutText.textContent = P.about;

  // ── WORK FILTERS ─────────────────────────────────────
  function renderFilters(activeCategory) {
    const container = document.getElementById('work-filters');
    container.innerHTML = P.categories.map(cat => `
      <button class="filter-btn ${cat === activeCategory ? 'active' : ''}" data-cat="${cat}">
        ${cat}
      </button>
    `).join('');

    container.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        renderFilters(btn.dataset.cat);
        renderGrid(btn.dataset.cat);
      });
    });
  }

  // ── WORK GRID ─────────────────────────────────────────
  function getEmbedUrl(url) {
    if (!url) return '';
    const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
    if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1`;
    const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
    if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1`;
    return url;
  }

  function renderGrid(activeCategory) {
    const grid = document.getElementById('work-grid');
    const filtered = activeCategory === 'All'
      ? P.projects
      : P.projects.filter(p => p.category === activeCategory);

    grid.innerHTML = filtered.map(project => `
      <div class="project-card" data-project-id="${project.id}">
        <div class="edit-card-controls">
          <button class="edit-btn-duplicate" data-action="duplicate" data-id="${project.id}">◻ Duplicate</button>
          <button class="edit-btn-delete" data-action="delete" data-id="${project.id}">✕ Delete</button>
        </div>
        <div class="project-card__media">
          <img src="${project.image}" alt="${project.title}" onerror="this.style.opacity='0.05'" />
          ${project.type === 'video' ? '<div class="project-card__play">▶</div>' : ''}
        </div>
        <div class="project-card__info">
          <span class="project-card__category" data-editable="projects.${project.id}.category">${project.category}</span>
          <h3 class="project-card__title" data-editable="projects.${project.id}.title">${project.title}</h3>
          <p class="project-card__desc" data-editable="projects.${project.id}.description">${project.description}</p>
        </div>
      </div>
    `).join('');

    grid.querySelectorAll('.project-card').forEach(card => {
      const id = parseInt(card.dataset.projectId);
      const project = P.projects.find(p => p.id === id);
      if (project && project.type === 'video') {
        card.addEventListener('click', (e) => {
          if (e.target.closest('.edit-card-controls')) return;
          openModal(project.video);
        });
      }
    });
  }

  // ── VIDEO MODAL ────────────────────────────────────────
  const modal = document.getElementById('video-modal');
  const modalVideo = document.getElementById('modal-video');

  function openModal(videoUrl) {
    const embed = getEmbedUrl(videoUrl);
    if (!embed) return;
    modalVideo.innerHTML = `<iframe src="${embed}" allowfullscreen allow="autoplay"></iframe>`;
    modal.classList.add('open');
  }

  function closeModal() {
    modal.classList.remove('open');
    modalVideo.innerHTML = '';
  }

  document.getElementById('modal-close').addEventListener('click', closeModal);
  document.getElementById('modal-backdrop').addEventListener('click', closeModal);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

  // ── CONTACT ────────────────────────────────────────────
  const socials = Object.entries(P.socials)
    .filter(([, url]) => url)
    .map(([name, url]) => `<a class="contact__social" href="${url}" target="_blank" rel="noopener">${name.charAt(0).toUpperCase() + name.slice(1)}</a>`)
    .join('');

  document.getElementById('contact-content').innerHTML = `
    <h2 class="contact__heading">Let's work together</h2>
    <a class="contact__email" href="mailto:${P.email}" data-editable="email">${P.email}</a>
    <div class="contact__meta">
      <span class="contact__location" data-editable="location">${P.location}</span>
      <div class="contact__socials">${socials}</div>
    </div>
  `;

  // ── FOOTER ─────────────────────────────────────────────
  document.getElementById('footer-name').textContent = `© ${new Date().getFullYear()} ${P.name}`;

  // ── INIT ────────────────────────────────────────────────
  renderFilters('All');
  renderGrid('All');

  window.renderPortfolio = function () {
    renderFilters('All');
    renderGrid('All');
  };
})();
