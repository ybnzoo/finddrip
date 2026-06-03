/* Affiche les produits de products.js (import spreadsheet) sur les grilles du site */
document.addEventListener('DOMContentLoaded', () => {
  if (typeof PRODUCTS === 'undefined') return;

  document.querySelectorAll('[data-catalog]').forEach((el) => {
    const count = parseInt(el.dataset.count || '10', 10);
    const offset = parseInt(el.dataset.offset || '0', 10);
    const start = parseInt(el.dataset.start || '0', 10);
    let items;
    if (offset < 0) {
      items = PRODUCTS.slice(offset);
      if (count > 0) items = items.slice(0, count);
    } else if (start > 0) {
      items = PRODUCTS.slice(start, start + count);
    } else {
      items = PRODUCTS.slice(offset, offset + count);
    }
    ProductsUI.renderGrid(el, items, {
      ranks: el.hasAttribute('data-rank'),
      newBadge: el.hasAttribute('data-new-badge'),
      newBadgeDash: el.hasAttribute('data-new-badge-dash'),
    });
  });

  const tendancesCatalog = document.getElementById('tendancesCatalog');
  const categoryFilter = document.getElementById('tendancesCategoryFilter');
  if (tendancesCatalog) {
    let activeCategory = 'all';

    function renderTendancesCatalog() {
      const filtered = ProductsUI.filterByCategory(PRODUCTS, activeCategory);
      ProductsUI.renderGrid(tendancesCatalog, filtered.slice(0, 60), { platform: true });
      const countEl = document.getElementById('tendancesCount');
      if (countEl) {
        const shown = Math.min(60, filtered.length);
        countEl.textContent = `${shown} sur ${filtered.length} produits`;
      }
    }

    renderTendancesCatalog();

    if (categoryFilter) {
      categoryFilter.querySelectorAll('.cat-pill').forEach((pill) => {
        pill.addEventListener('click', () => {
          categoryFilter.querySelectorAll('.cat-pill').forEach((p) => p.classList.remove('active'));
          pill.classList.add('active');
          activeCategory = pill.dataset.category || 'all';
          renderTendancesCatalog();
        });
      });
    }
  }

  const homeSearch = document.querySelector('.search-section .search-input');
  const homeCta = document.querySelector('.search-section .cta-btn');
  function goSearch() {
    const q = (homeSearch && homeSearch.value.trim()) || '';
    const base = document.body.dataset.dashboard === 'true' ? 'recherche.html' : 'dashboard/recherche.html';
    window.location.href = q ? `${base}?q=${encodeURIComponent(q)}` : base;
  }
  if (homeCta) homeCta.addEventListener('click', goSearch);
  if (homeSearch) {
    homeSearch.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        goSearch();
      }
    });
  }

  const dashSearch = document.querySelector('.dash-section .search-input');
  const dashCta = document.querySelector('.dash-section .cta-btn');
  if (dashSearch && dashCta) {
    dashCta.addEventListener('click', () => {
      const q = dashSearch.value.trim();
      window.location.href = q
        ? `recherche.html?q=${encodeURIComponent(q)}`
        : 'recherche.html';
    });
  }
});
