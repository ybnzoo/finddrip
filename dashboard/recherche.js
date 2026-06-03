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

  ProductsUI.renderGrid(resultsGrid, toShow, { platform: true });
}

const urlQuery = new URLSearchParams(window.location.search).get('q');
if (urlQuery && searchInput) {
  searchInput.value = urlQuery;
  doSearch(urlQuery);
}
