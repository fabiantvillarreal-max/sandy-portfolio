// js/layout.js — shared topnav + sidebar (called by data.js after PORTFOLIO loads)

function initLayout() {
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
  const s = P.socials || {};
  document.getElementById('sidebar').innerHTML = `
    <div class="sidebar__top">

      <div class="sidebar__profile">
        <div class="sidebar__avatar-wrap">
          <img class="sidebar__avatar" src="${P.heroImage}" alt="${P.name}"
            onerror="this.style.display='none'" />
          <div class="sidebar__avatar-placeholder">SG</div>
        </div>
        <div class="sidebar__identity">
          <p class="sidebar__name">${P.name}</p>
          <p class="sidebar__title">${P.title}</p>
        </div>
      </div>

      <p class="sidebar__bio">${P.tagline}</p>

      <ul class="sidebar__contact">
        <li class="sidebar__contact-item">
          <span class="sidebar__contact-icon">📍</span>
          <span class="sidebar__contact-text">${P.location}</span>
        </li>
        <li class="sidebar__contact-item">
          <span class="sidebar__contact-icon">✉</span>
          <a class="sidebar__contact-link" href="mailto:${P.email}">${P.email}</a>
        </li>
        ${s.behance   ? `<li class="sidebar__contact-item"><span class="sidebar__contact-icon">🔗</span><a class="sidebar__contact-link" href="${s.behance}"   target="_blank" rel="noopener">Behance</a></li>` : ''}
        ${s.linkedin  ? `<li class="sidebar__contact-item"><span class="sidebar__contact-icon">🔗</span><a class="sidebar__contact-link" href="${s.linkedin}"  target="_blank" rel="noopener">LinkedIn</a></li>` : ''}
        ${s.instagram ? `<li class="sidebar__contact-item"><span class="sidebar__contact-icon">🔗</span><a class="sidebar__contact-link" href="${s.instagram}" target="_blank" rel="noopener">Instagram</a></li>` : ''}
      </ul>

    </div>

    <div class="sidebar__bottom">
      <a class="sidebar__cv-btn" href="CV Sandra Gomez English.pdf" target="_blank" rel="noopener">
        <span>Download Resume</span>
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

  const footerCopy = document.querySelector('.footer__copy');
  if (footerCopy) footerCopy.textContent = `© ${new Date().getFullYear()} ${P.name}`;
}
