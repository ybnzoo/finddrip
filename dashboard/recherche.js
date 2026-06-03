// ── RECHERCHE EN TEMPS RÉEL ──
const searchInput = document.getElementById('searchInput');
const resultsGrid = document.getElementById('resultsGrid');
const searchStats = document.getElementById('searchStats');
const searchEmpty = document.getElementById('searchEmpty');
const searchInitial = document.getElementById('searchInitial');
const platformFilter = document.getElementById('platformFilter');

let activePlatform = 'all';
let searchTimeout = null;

// Filtres plateforme
platformFilter.querySelectorAll('.cat-pill').forEach(pill => {
  pill.addEventListener('click', () => {
    platformFilter.querySelectorAll('.cat-pill').forEach(p => p.classList.remove('active'));
    pill.classList.add('active');
    activePlatform = pill.dataset.platform;
    doSearch(searchInput.value.trim());
  });
});

// Recherche
searchInput.addEventListener('input', () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    doSearch(searchInput.value.trim());
  }, 180);
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

  // Limite à 60 résultats pour les perfs
  const toShow = filtered.slice(0, 60);

  resultsGrid.innerHTML = toShow.map(p => `
    <a class="result-card" href="${p.link}" target="_blank" rel="noopener noreferrer">
      <div class="result-card-body">
        <div class="result-card-info">
          <span class="result-card-name">${escapeHtml(p.name)}</span>
          <span class="result-card-cat">${escapeHtml(p.category)}</span>
        </div>
        <div class="result-card-meta">
          <span class="result-card-price">${escapeHtml(p.price)}</span>
          <span class="result-card-platform">${escapeHtml(p.platform)}</span>
        </div>
      </div>
      <div class="result-card-arrow">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>
      </div>
    </a>
  `).join('');
}

function escapeHtml(str) {
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
