// ── NAVIGATION SIDEBAR / BOTTOM NAV ──
const pages = {
  accueil:    { title: 'Accueil' },
  recherche:  { title: 'Rechercher' },
  favoris:    { title: 'Mes Favoris' },
  historique: { title: 'Historique' },
  tendances:  { title: 'Tendances' },
  profil:     { title: 'Profil' },
};

function navigateTo(pageId) {
  // Update active link — sidebar
  document.querySelectorAll('.sidebar-link[data-page]').forEach(l => {
    l.classList.toggle('active', l.dataset.page === pageId);
  });

  // Update active link — bottom nav
  document.querySelectorAll('.nav-item[data-page]').forEach(l => {
    l.classList.toggle('active', l.dataset.page === pageId);
  });

  // Show correct page panel
  document.querySelectorAll('.dash-page').forEach(p => p.classList.remove('active'));
  const panel = document.getElementById('page-' + pageId);
  if (panel) panel.classList.add('active');

  // Update topbar title
  const info = pages[pageId];
  if (info) document.getElementById('pageTitle').textContent = info.title;
}

// Attach click handlers
document.querySelectorAll('[data-page]').forEach(el => {
  el.addEventListener('click', e => {
    e.preventDefault();
    navigateTo(el.dataset.page);
  });
});

// ── FAV BUTTONS ──
document.querySelectorAll('.fav-btn').forEach(btn => {
  btn.addEventListener('click', e => {
    e.stopPropagation();
    const svg = btn.querySelector('svg');
    const active = svg.style.fill === 'rgb(108, 77, 255)';
    svg.style.fill = active ? 'none' : '#6C4DFF';
    svg.style.stroke = active ? 'rgba(255,255,255,0.7)' : '#6C4DFF';
    btn.style.background = active ? 'rgba(0,0,0,0.6)' : 'rgba(108,77,255,0.25)';
    if (!active) {
      btn.style.transform = 'scale(1.2)';
      setTimeout(() => { btn.style.transform = 'scale(1)'; }, 150);
    }
  });
});

// ── SEARCH ──
const ctaBtn = document.querySelector('.cta-btn');
if (ctaBtn) {
  ctaBtn.addEventListener('click', () => {
    ctaBtn.style.transform = 'scale(0.97)';
    setTimeout(() => { ctaBtn.style.transform = ''; }, 120);
  });
}

// Search focus glow
const searchInput = document.querySelector('.search-input');
if (searchInput) {
  const wrap = searchInput.closest('.search-bar-wrap');
  searchInput.addEventListener('focus', () => { wrap.style.borderColor = 'rgba(108,77,255,0.45)'; });
  searchInput.addEventListener('blur', () => { wrap.style.borderColor = ''; });
}

// ── RECENT ITEMS ──
document.querySelectorAll('.dash-recent-item').forEach(item => {
  item.addEventListener('click', () => {
    item.style.background = 'rgba(108,77,255,0.08)';
    setTimeout(() => { item.style.background = ''; }, 200);
  });
});

// ── TOGGLE (profil) ──
document.querySelectorAll('.profil-toggle').forEach(toggle => {
  toggle.addEventListener('click', () => {
    toggle.classList.toggle('profil-toggle-on');
  });
});

// ── CATEGORY PILLS ──
document.querySelectorAll('.cat-pill').forEach(pill => {
  pill.addEventListener('click', () => {
    const parent = pill.closest('.categories-scroll, .dash-section, .dash-content');
    const siblings = parent ? parent.querySelectorAll('.cat-pill') : document.querySelectorAll('.cat-pill');
    siblings.forEach(p => p.classList.remove('active'));
    pill.classList.add('active');
  });
});

// ── FAV REMOVE (favoris dashboard) ──
document.querySelectorAll('.fav-remove-btn').forEach(btn => {
  btn.addEventListener('click', e => {
    e.stopPropagation();
    const card = btn.closest('.fav-full-card');
    if (card) {
      card.style.opacity = '0';
      card.style.transform = 'scale(0.9)';
      card.style.transition = 'all 0.25s ease';
      setTimeout(() => { card.style.display = 'none'; }, 250);
    }
  });
});

// ── HISTORIQUE CLEAR ──
const clearBtn = document.querySelector('.histo-clear-btn');
if (clearBtn) {
  clearBtn.addEventListener('click', () => {
    document.querySelectorAll('.dash-recent-item').forEach(item => {
      item.style.opacity = '0';
      item.style.transition = 'opacity 0.3s ease';
      setTimeout(() => { item.style.display = 'none'; }, 300);
    });
  });
}
