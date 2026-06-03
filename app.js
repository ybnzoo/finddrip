// FAQ accordion
document.querySelectorAll('.faq-question').forEach(q => {
  q.addEventListener('click', () => {
    const item = q.closest('.faq-item');
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  });
});

// Fav button toggle
document.querySelectorAll('.fav-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const svg = btn.querySelector('svg');
    const isActive = svg.style.fill === 'rgb(108, 77, 255)';
    if (isActive) {
      svg.style.fill = 'none';
      svg.style.stroke = 'rgba(255,255,255,0.7)';
      btn.style.background = 'rgba(0,0,0,0.6)';
      btn.style.borderColor = '';
    } else {
      svg.style.fill = '#6C4DFF';
      svg.style.stroke = '#6C4DFF';
      btn.style.background = 'rgba(108,77,255,0.25)';
      btn.style.borderColor = 'rgba(108,77,255,0.5)';
      btn.style.transform = 'scale(1.2)';
      setTimeout(() => { btn.style.transform = 'scale(1)'; }, 150);
    }
  });
});

// ── AUTH POPUP ──
const authPopup = document.getElementById('authPopup');
const authPopupClose = document.getElementById('authPopupClose');

function showAuthPopup() {
  if (authPopup) {
    authPopup.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
}

function hideAuthPopup() {
  if (authPopup) {
    authPopup.classList.remove('open');
    document.body.style.overflow = '';
  }
}

if (authPopupClose) {
  authPopupClose.addEventListener('click', hideAuthPopup);
}
if (authPopup) {
  authPopup.addEventListener('click', (e) => {
    if (e.target === authPopup) hideAuthPopup();
  });
}

// Intercepte bottom nav links (recherche, favoris, profil)
document.querySelectorAll('.bottom-nav .nav-item').forEach(link => {
  const href = link.getAttribute('href');
  if (href && href !== 'index.html' && !href.startsWith('#')) {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      showAuthPopup();
    });
  }
});

// Intercepte le bouton "Rechercher maintenant"
const ctaBtn = document.querySelector('.cta-btn');
if (ctaBtn) {
  ctaBtn.addEventListener('click', function(e) {
    e.preventDefault();
    showAuthPopup();
  });
}

// Upload button — ouvre la galerie photo
const uploadBtn = document.getElementById('uploadBtn');
const photoInput = document.getElementById('photoInput');
if (uploadBtn && photoInput) {
  uploadBtn.addEventListener('click', function() {
    photoInput.click();
    this.style.transform = 'scale(0.9)';
    setTimeout(() => { this.style.transform = ''; }, 120);
  });
  photoInput.addEventListener('change', function() {
    if (this.files && this.files[0]) {
      const file = this.files[0];
      uploadBtn.style.background = 'rgba(108,77,255,0.8)';
      setTimeout(() => { uploadBtn.style.background = ''; }, 400);
      // Affiche le nom du fichier dans la barre de recherche
      const searchInput = document.querySelector('.search-input');
      if (searchInput) searchInput.placeholder = file.name;
    }
  });
}

// Search focus
const searchInput = document.querySelector('.search-input');
if (searchInput) {
  searchInput.addEventListener('focus', () => {
    document.querySelector('.search-bar-wrap').style.borderColor = 'rgba(108,77,255,0.45)';
  });
  searchInput.addEventListener('blur', () => {
    document.querySelector('.search-bar-wrap').style.borderColor = '';
  });
}

// ── MENU HAMBURGER ──
const menuBtn = document.getElementById('menuBtn');
const mobileMenu = document.getElementById('mobileMenu');

if (menuBtn && mobileMenu) {
  menuBtn.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.contains('open');
    if (isOpen) {
      mobileMenu.classList.remove('open');
      menuBtn.classList.remove('open');
      document.body.style.overflow = '';
    } else {
      mobileMenu.classList.add('open');
      menuBtn.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  });

  // Ferme le menu en cliquant sur un lien
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      menuBtn.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}
