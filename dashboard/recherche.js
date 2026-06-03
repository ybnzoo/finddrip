const searchInput = document.getElementById('searchInput');
const resultsGrid = document.getElementById('resultsGrid');
const searchStats = document.getElementById('searchStats');
const searchEmpty = document.getElementById('searchEmpty');
const searchInitial = document.getElementById('searchInitial');
const platformFilter = document.getElementById('platformFilter');

let activePlatform = 'all';
let searchTimeout = null;

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80';

function getImg(product) {
  return product.img || FALLBACK_IMG;
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
  searchStats.textContent = filtered.length + ' résultat' + (filtered.length > 1 ? 's' : '') + ' pour "' + query + '"';

  const toShow = filtered.slice(0, 40);

  resultsGrid.innerHTML = toShow.map(p => `
    <a class="product-card" href="${p.link}" target="_blank" rel="noopener noreferrer">
      <div class="product-img-wrap">
        <div class="product-img" style="background-image:url('${getImg(p)}');background-color:#111"></div>
        <div class="result-platform-badge">${escapeHtml(p.platform)}</div>
        <button class="fav-btn" onclick="event.preventDefault();event.stopPropagation()" aria-label="Favori">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
        </button>
      </div>
      <div class="product-info">
        <span class="product-name">${escapeHtml(p.name)}</span>
        <span class="product-price">${escapeHtml(p.price)}</span>
      </div>
    </a>
  `).join('');

  // Handle broken images
  resultsGrid.querySelectorAll('.product-img').forEach(img => {
    const el = img;
    const testImg = new Image();
    testImg.onerror = () => { el.style.backgroundImage = "url('" + FALLBACK_IMG + "')"; };
    const match = el.style.backgroundImage.match(/url\(['"]?(.*?)['"]?\)/);
    if (match) testImg.src = match[1];
  });
}

function escapeHtml(str) {
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
