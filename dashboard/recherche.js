const searchInput = document.getElementById('searchInput');
const resultsGrid = document.getElementById('resultsGrid');
const searchStats = document.getElementById('searchStats');
const searchEmpty = document.getElementById('searchEmpty');
const searchInitial = document.getElementById('searchInitial');
const platformFilter = document.getElementById('platformFilter');

let activePlatform = 'all';
let searchTimeout = null;

// Images placeholder par catégorie
const CATEGORY_IMGS = {
  'SHOES': 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80',
  'BOOT': 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400&q=80',
  'SLIDE': 'https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=400&q=80',
  'HOODIE': 'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=400&q=80',
  'JACKET': 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&q=80',
  'PANT': 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=400&q=80',
  'SHIRT': 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400&q=80',
  'TEE': 'https://images.unsplash.com/photo-1574180566232-aaad1b5b8450?w=400&q=80',
  'BAG': 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&q=80',
  'DEFAULT': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80',
};

function getImg(product) {
  const text = (product.name + ' ' + product.category).toUpperCase();
  for (const [key, url] of Object.entries(CATEGORY_IMGS)) {
    if (text.includes(key)) return url;
  }
  return CATEGORY_IMGS.DEFAULT;
}

// Traduction catégories
function translateCat(cat) {
  return cat
    .replace('SHOES, BOOTS, SLIDES, ETC', 'Chaussures')
    .replace('HOODIES', 'Hoodies')
    .replace('JACKETS', 'Vestes')
    .replace('PANTS', 'Pantalons')
    .replace('SHIRTS', 'Chemises')
    .replace('T-SHIRTS', 'T-shirts')
    .replace('BAGS', 'Sacs')
    .replace('ACCESSORIES', 'Accessoires')
    .replace('SHORTS', 'Shorts')
    .replace('SWEATERS', 'Pulls');
}

// Filtres plateforme
platformFilter.querySelectorAll('.cat-pill').forEach(pill => {
  pill.addEventListener('click', () => {
    platformFilter.querySelectorAll('.cat-pill').forEach(p => p.classList.remove('active'));
    pill.classList.add('active');
    activePlatform = pill.dataset.platform;
    doSearch(searchInput.value.trim());
  });
});

// Recherche avec debounce
searchInput.addEventListener('input', () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => doSearch(searchInput.value.trim()), 180);
});

function doSearch(query) {
  if (!query) {
    resultsGrid.innerHTML = '';
    searchStats.style.display = 'none';
    searchEmpty.style.display = 'none';
    searchInitial.style.display = 'flex';
    return;
  }

  searchInitial.style.display = 'none';

  const q = query.toLowerCase();
  const filtered = PRODUCTS.filter(p => {
    const matchQuery = p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
    const matchPlatform = activePlatform === 'all' || p.platform === activePlatform;
    return matchQuery && matchPlatform;
  });

  if (filtered.length === 0) {
    resultsGrid.innerHTML = '';
    searchStats.style.display = 'none';
    searchEmpty.style.display = 'flex';
    return;
  }

  searchEmpty.style.display = 'none';
  searchStats.style.display = 'block';
  searchStats.textContent = `${filtered.length} résultat${filtered.length > 1 ? 's' : ''} pour "${query}"`;

  const toShow = filtered.slice(0, 60);

  resultsGrid.innerHTML = toShow.map(p => `
    <a class="product-card" href="${p.link}" target="_blank" rel="noopener noreferrer">
      <div class="product-img-wrap">
        <div class="product-img" style="background-image:url('${getImg(p)}')"></div>
        <div class="result-platform-badge">${escapeHtml(p.platform)}</div>
        <button class="fav-btn" onclick="event.preventDefault()" aria-label="Favori">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
        </button>
      </div>
      <div class="product-info">
        <span class="product-name">${escapeHtml(p.name)}</span>
        <span class="product-price">${escapeHtml(p.price)}</span>
      </div>
    </a>
  `).join('');

  // Fav toggle
  resultsGrid.querySelectorAll('.fav-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
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
}

function escapeHtml(str) {
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
