/* Utilitaires partagés pour afficher les produits (spreadsheet → products.js) */
const ProductsUI = (function () {
  const CATEGORY_IMGS = {
    SHOES: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80',
    BOOT: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400&q=80',
    SLIDE: 'https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=400&q=80',
    HOODIE: 'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=400&q=80',
    JACKET: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&q=80',
    PANT: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=400&q=80',
    SHIRT: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400&q=80',
    TEE: 'https://images.unsplash.com/photo-1574180566232-aaad1b5b8450?w=400&q=80',
    BAG: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&q=80',
    ACCESSOR: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80',
    DEFAULT: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80',
  };

  const FAV_ICON =
    '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>';

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function getImg(product) {
    const text = (product.name + ' ' + product.category).toUpperCase();
    for (const [key, url] of Object.entries(CATEGORY_IMGS)) {
      if (key !== 'DEFAULT' && text.includes(key)) return url;
    }
    return CATEGORY_IMGS.DEFAULT;
  }

  function rankBadgeHtml(rank) {
    if (!rank) return '';
    let cls = 'rank-badge';
    if (rank === 1) cls += ' rank-1';
    else if (rank === 2) cls += ' rank-2';
    else if (rank === 3) cls += ' rank-3';
    const style =
      rank > 3
        ? ' style="background:rgba(255,255,255,0.06);color:rgba(255,255,255,0.5);border:1px solid rgba(255,255,255,0.08)"'
        : '';
    return `<div class="${cls}"${style}>TOP ${rank}</div>`;
  }

  function renderCard(product, index, opts) {
    const rank = opts.ranks ? index + 1 : null;
    const newBadge = opts.newBadge
      ? '<div class="new-badge">NEW</div>'
      : opts.newBadgeDash
        ? '<div class="new-badge-dash">NEW</div>'
        : '';
    const platformBadge = opts.platform
      ? `<div class="result-platform-badge">${escapeHtml(product.platform)}</div>`
      : '';

    return `
    <a class="product-card" href="${escapeHtml(product.link)}" target="_blank" rel="noopener noreferrer">
      <div class="product-img-wrap">
        ${rankBadgeHtml(rank)}
        ${newBadge}
        <div class="product-img" style="background-image:url('${getImg(product)}')"></div>
        ${platformBadge}
        <button class="fav-btn" type="button" onclick="event.preventDefault()" aria-label="Favori">${FAV_ICON}</button>
      </div>
      <div class="product-info">
        <span class="product-name">${escapeHtml(product.name)}</span>
        <span class="product-price">${escapeHtml(product.price)}</span>
      </div>
    </a>`;
  }

  function bindFavButtons(root) {
    root.querySelectorAll('.fav-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const svg = btn.querySelector('svg');
        const active = svg.style.fill === 'rgb(108, 77, 255)';
        svg.style.fill = active ? 'none' : '#6C4DFF';
        svg.style.stroke = active ? 'rgba(255,255,255,0.7)' : '#6C4DFF';
        btn.style.background = active ? 'rgba(0,0,0,0.6)' : 'rgba(108,77,255,0.25)';
        if (!active) {
          btn.style.transform = 'scale(1.2)';
          setTimeout(() => {
            btn.style.transform = 'scale(1)';
          }, 150);
        }
      });
    });
  }

  function renderGrid(container, products, opts = {}) {
    if (!container || !products.length) {
      if (container) container.innerHTML = '';
      return;
    }
    container.innerHTML = products.map((p, i) => renderCard(p, i, opts)).join('');
    bindFavButtons(container);
  }

  function filterByCategory(products, categoryKey) {
    if (!categoryKey || categoryKey === 'all') return products;
    const rules = {
      shoes: (p) => p.category.includes('SHOES'),
      hoodies: (p) => p.category.includes('HOODIE'),
      pants: (p) => p.category.includes('PANTS'),
      shirts: (p) => p.category.includes('SHIRT') || p.category.includes('TEE'),
      accessories: (p) => p.category.includes('ACCESSOR'),
      jackets: (p) =>
        /JACKET|COAT|VESTE|PUFFER|MONCLER|CANADA GOOSE/i.test(p.name) ||
        p.category.includes('HOODIE'),
    };
    const fn = rules[categoryKey];
    return fn ? products.filter(fn) : products;
  }

  return { escapeHtml, getImg, renderGrid, bindFavButtons, filterByCategory };
})();
