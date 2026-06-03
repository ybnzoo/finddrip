const searchInput = document.getElementById('searchInput');
const resultsGrid = document.getElementById('resultsGrid');
const searchStats = document.getElementById('searchStats');
const searchEmpty = document.getElementById('searchEmpty');
const searchInitial = document.getElementById('searchInitial');
const platformFilter = document.getElementById('platformFilter');

let activePlatform = 'all';
let searchTimeout = null;
let dailySearchCount = 0;
const MAX_FREE_SEARCHES = 3;

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80';

function getImg(product) {
  return product.img || FALLBACK_IMG;
}

// ── CHARGER LE COMPTEUR DU JOUR ──
async function loadDailyCount() {
  if (typeof sb === 'undefined') return;
  const { data: { session } } = await sb.auth.getSession();
  if (!session) return;

  const today = new Date().toISOString().split('T')[0];
  const { data } = await sb.from('daily_searches')
    .select('count')
    .eq('user_id', session.user.id)
    .eq('search_date', today)
    .single();

  dailySearchCount = data ? data.count : 0;
  updateSearchCounter();
}

function updateSearchCounter() {
  const counterEl = document.getElementById('searchCounter');
  if (counterEl) {
    counterEl.textContent = `${dailySearchCount} / ${MAX_FREE_SEARCHES} recherches aujourd'hui`;
  }
}

// ── INCRÉMENTER LE COMPTEUR ──
async function incrementSearch(query) {
  if (typeof sb === 'undefined') return true;
  const { data: { session } } = await sb.auth.getSession();
  if (!session) return true;

  const today = new Date().toISOString().split('T')[0];
  const userId = session.user.id;

  // Check si limite atteinte
  if (dailySearchCount >= MAX_FREE_SEARCHES) {
    showLimitPopup();
    return false;
  }

  // Upsert le compteur
  const { data: existing } = await sb.from('daily_searches')
    .select('id, count')
    .eq('user_id', userId)
    .eq('search_date', today)
    .single();

  if (existing) {
    await sb.from('daily_searches')
      .update({ count: existing.count + 1 })
      .eq('id', existing.id);
  } else {
    await sb.from('daily_searches')
      .insert({ user_id: userId, search_date: today, count: 1 });
  }

  // Sauvegarder dans l'historique
  await sb.from('searches').insert({ user_id: userId, query: query });

  dailySearchCount++;
  updateSearchCounter();
  return true;
}

// ── POPUP LIMITE ──
function showLimitPopup() {
  let popup = document.getElementById('limitPopup');
  if (!popup) {
    popup = document.createElement('div');
    popup.id = 'limitPopup';
    popup.className = 'auth-popup-overlay open';
    popup.innerHTML = `
      <div class="auth-popup">
        <button class="auth-popup-close" onclick="this.closest('.auth-popup-overlay').classList.remove('open')">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
        <div style="width:48px;height:48px;background:var(--purple-dim);border-radius:14px;display:flex;align-items:center;justify-content:center">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--purple-bright)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
        </div>
        <h2 class="auth-popup-title">Limite atteinte</h2>
        <p class="auth-popup-sub">Tu as utilisé tes 3 recherches gratuites aujourd'hui. Passe à Premium pour des recherches illimitées.</p>
        <div class="auth-popup-btns">
          <a href="../index.html#tarifs" class="auth-popup-cta">Voir Premium — 7,99€ à vie</a>
          <a href="#" class="auth-popup-login" onclick="this.closest('.auth-popup-overlay').classList.remove('open');return false;">Revenir plus tard</a>
        </div>
      </div>
    `;
    document.body.appendChild(popup);
  } else {
    popup.classList.add('open');
  }
}

// ── FILTRES PLATEFORME ──
platformFilter.querySelectorAll('.cat-pill').forEach(pill => {
  pill.addEventListener('click', () => {
    platformFilter.querySelectorAll('.cat-pill').forEach(p => p.classList.remove('active'));
    pill.classList.add('active');
    activePlatform = pill.dataset.platform;
    if (searchInput.value.trim()) renderResults(searchInput.value.trim());
  });
});

// ── RECHERCHE ──
let lastQuery = '';
searchInput.addEventListener('input', () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    const q = searchInput.value.trim();
    if (q && q !== lastQuery) {
      doSearch(q);
    } else if (!q) {
      resultsGrid.innerHTML = '';
      searchStats.style.display = 'none';
      searchEmpty.style.display = 'none';
      searchInitial.style.display = 'flex';
    }
  }, 400);
});

async function doSearch(query) {
  // Vérifie la limite
  const allowed = await incrementSearch(query);
  if (!allowed) return;

  lastQuery = query;
  renderResults(query);
}

function renderResults(query) {
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
  searchStats.textContent = filtered.length + ' résultat' + (filtered.length > 1 ? 's' : '');

  const toShow = filtered.slice(0, 40);

  resultsGrid.innerHTML = toShow.map((p, i) => `
    <a class="product-card" href="${p.link}" target="_blank" rel="noopener noreferrer" data-index="${i}">
      <div class="product-img-wrap">
        <div class="product-img" style="background-image:url('${getImg(p)}');background-color:#111"></div>
        <div class="result-platform-badge">${escapeHtml(p.platform)}</div>
        <button class="fav-btn" data-fav="${i}" aria-label="Favori">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
        </button>
      </div>
      <div class="product-info">
        <span class="product-name">${escapeHtml(p.name)}</span>
        <span class="product-price">${escapeHtml(p.price)}</span>
      </div>
    </a>
  `).join('');

  // Fav buttons
  resultsGrid.querySelectorAll('.fav-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      e.stopPropagation();
      const idx = parseInt(btn.dataset.fav);
      const p = toShow[idx];
      const svg = btn.querySelector('svg');
      const active = svg.style.fill === 'rgb(108, 77, 255)';

      svg.style.fill = active ? 'none' : '#6C4DFF';
      svg.style.stroke = active ? 'rgba(255,255,255,0.7)' : '#6C4DFF';
      btn.style.background = active ? 'rgba(0,0,0,0.6)' : 'rgba(108,77,255,0.25)';
      if (!active) {
        btn.style.transform = 'scale(1.2)';
        setTimeout(() => { btn.style.transform = 'scale(1)'; }, 150);
      }

      if (typeof sb !== 'undefined' && p) {
        const { data: { session } } = await sb.auth.getSession();
        if (session) {
          if (!active) {
            await sb.from('favorites').upsert({
              user_id: session.user.id,
              product_name: p.name,
              product_price: p.price,
              product_link: p.link,
              product_img: getImg(p),
              platform: p.platform
            }, { onConflict: 'user_id,product_link' });
          } else {
            await sb.from('favorites').delete().match({ user_id: session.user.id, product_link: p.link });
          }
        }
      }
    });
  });
}

function escapeHtml(str) {
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// Charger le compteur au démarrage
loadDailyCount();
