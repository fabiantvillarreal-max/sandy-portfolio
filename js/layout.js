// js/layout.js — shared topnav + sidebar across all pages

(function () {
  const P = window.PORTFOLIO;
  const page = document.body.dataset.page;

  // ── TOP NAV ────────────────────────────────────────
  const nav = [
    { label: 'work.done',   href: 'index.html',   page: 'work'    },
    { label: 'sandy.info',  href: 'about.html',   page: 'about'   },
    { label: 'contact.now', href: 'contact.html', page: 'contact' },
  ];

  document.getElementById('topnav').innerHTML = `
    <div class="topnav__left">
      <span class="topnav__greeting">Welcome to my world!</span>
    </div>
    <nav class="topnav__center">
      ${nav.map(n => `<a href="${n.href}" class="${n.page === page ? 'active' : ''}">${n.label}</a>`).join('')}
    </nav>
    <div class="topnav__right">
      <div class="topnav__status">
        <span class="topnav__status-dot"></span>
        <span class="topnav__status-text">Open to new work</span>
      </div>
      <div class="topnav__meta" id="topnav-meta"></div>
    </div>
  `;

  function updateTime() {
    const time = new Date().toLocaleTimeString('en-US', {
      hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Madrid'
    });
    const meta = document.getElementById('topnav-meta');
    if (meta) meta.innerHTML = `${P.location.split(',')[0]}<span class="topnav__meta-dot"></span>${time}`;
  }
  updateTime();
  setInterval(updateTime, 30000);

  // ── SIDEBAR ────────────────────────────────────────
  document.getElementById('sidebar').innerHTML = `
    <div class="sidebar__top">

      <div class="sidebar__profile">
        <div class="sidebar__avatar-wrap" id="avatar-wrap">
          <img class="sidebar__avatar" id="sidebar-avatar" src="${P.heroImage}" alt="${P.name}"
            onerror="this.style.display='none'" />
          <div class="sidebar__avatar-placeholder">SG</div>
          <button class="sidebar__avatar-edit" id="avatar-edit-btn" title="Change photo">📷</button>
        </div>
        <div class="sidebar__identity">
          <p class="sidebar__name" data-editable="name">${P.name}</p>
          <p class="sidebar__title" data-editable="title">${P.title}</p>
        </div>
      </div>

      <p class="sidebar__bio" data-editable="tagline">${P.tagline}</p>

      <ul class="sidebar__contact">
        <li class="sidebar__contact-item">
          <span class="sidebar__contact-icon">📍</span>
          <span class="sidebar__contact-text" data-editable="location">${P.location}</span>
        </li>
        <li class="sidebar__contact-item">
          <span class="sidebar__contact-icon">✉</span>
          <a class="sidebar__contact-link" href="mailto:${P.email}" data-editable="email">${P.email}</a>
        </li>
        ${P.socials.behance   ? `<li class="sidebar__contact-item"><span class="sidebar__contact-icon">🔗</span><a class="sidebar__contact-link" href="${P.socials.behance}"   target="_blank" rel="noopener" data-editable="socials.behance">Behance</a></li>` : ''}
        ${P.socials.linkedin  ? `<li class="sidebar__contact-item"><span class="sidebar__contact-icon">🔗</span><a class="sidebar__contact-link" href="${P.socials.linkedin}"  target="_blank" rel="noopener" data-editable="socials.linkedin">LinkedIn</a></li>` : ''}
        ${P.socials.instagram ? `<li class="sidebar__contact-item"><span class="sidebar__contact-icon">🔗</span><a class="sidebar__contact-link" href="${P.socials.instagram}" target="_blank" rel="noopener" data-editable="socials.instagram">Instagram</a></li>` : ''}
      </ul>

    </div>

    <div class="sidebar__bottom">
      <a class="sidebar__cv-btn" href="CV Sandra Gomez English.pdf" target="_blank" rel="noopener">
        <span>Download CV</span>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/>
        </svg>
      </a>
      <div class="sidebar__cta">
        <a class="btn btn-primary" href="contact.html">Get in touch</a>
        <a class="btn" href="index.html">View Work</a>
      </div>
    </div>
  `;

  // Avatar photo picker (edit mode only)
  document.getElementById('avatar-edit-btn').addEventListener('click', () => {
    if (!document.body.classList.contains('edit-mode')) return;
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = e => {
      const file = e.target.files[0];
      if (!file) return;
      const url = URL.createObjectURL(file);
      const img = document.getElementById('sidebar-avatar');
      img.src = url;
      img.style.display = 'block';
      window.PORTFOLIO.heroImage = 'images/' + file.name;
      window._pendingAvatarFile = file;
    };
    input.click();
  });

  const footerCopy = document.querySelector('.footer__copy');
  if (footerCopy) footerCopy.textContent = `© ${new Date().getFullYear()} ${P.name}`;
})();
