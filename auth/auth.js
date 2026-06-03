// ── TOGGLE MOT DE PASSE ──
const togglePassword = document.getElementById('togglePassword');
const passwordInput = document.getElementById('passwordInput');

if (togglePassword && passwordInput) {
  togglePassword.addEventListener('click', () => {
    const isHidden = passwordInput.type === 'password';
    passwordInput.type = isHidden ? 'text' : 'password';
    togglePassword.style.color = isHidden ? 'var(--purple-bright)' : '';
  });
}

// ── FORCE DU MOT DE PASSE ──
const strengthFill = document.getElementById('strengthFill');
const strengthLabel = document.getElementById('strengthLabel');

if (passwordInput && strengthFill) {
  passwordInput.addEventListener('input', () => {
    const val = passwordInput.value;
    let score = 0;
    if (val.length >= 8) score++;
    if (/[A-Z]/.test(val)) score++;
    if (/[0-9]/.test(val)) score++;
    if (/[^A-Za-z0-9]/.test(val)) score++;

    const levels = [
      { width: '0%', color: 'transparent', label: '' },
      { width: '25%', color: '#ff4d4d', label: 'Trop faible' },
      { width: '50%', color: '#ff9500', label: 'Moyen' },
      { width: '75%', color: '#34c759', label: 'Bon' },
      { width: '100%', color: '#6C4DFF', label: 'Excellent' },
    ];

    const level = val.length === 0 ? levels[0] : levels[score] || levels[1];
    strengthFill.style.width = level.width;
    strengthFill.style.background = level.color;
    if (strengthLabel) {
      strengthLabel.textContent = level.label;
      strengthLabel.style.color = level.color;
    }
  });
}

// ── ERROR DISPLAY ──
function showError(msg) {
  let errEl = document.querySelector('.auth-error');
  if (!errEl) {
    errEl = document.createElement('div');
    errEl.className = 'auth-error';
    const form = document.querySelector('.auth-form');
    if (form) form.prepend(errEl);
  }
  errEl.textContent = msg;
  errEl.style.display = 'block';
  setTimeout(() => { errEl.style.display = 'none'; }, 5000);
}

// ── INSCRIPTION ──
const signupForm = document.getElementById('signupForm');
if (signupForm) {
  signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = signupForm.querySelector('.auth-btn');
    const email = signupForm.querySelector('input[type="email"]').value;
    const password = signupForm.querySelector('input[type="password"]').value;

    if (password.length < 6) {
      showError('Le mot de passe doit faire au moins 6 caractères.');
      return;
    }

    btn.textContent = 'Création du compte…';
    btn.style.opacity = '0.7';
    btn.disabled = true;

    const { data, error } = await sb.auth.signUp({ email, password });

    if (error) {
      console.error('Signup error:', error);
      showError(error.message === 'User already registered' ? 'Un compte existe déjà avec cet email.' : error.message);
      btn.textContent = 'Créer mon compte';
      btn.style.opacity = '1';
      btn.disabled = false;
      return;
    }

    console.log('Signup data:', data);

    // Si la session existe directement (email confirm désactivé)
    if (data.session) {
      window.location.href = '../dashboard/accueil.html';
      return;
    }

    // Si confirmation email activée
    if (data.user && !data.session) {
      showError('Vérifie ta boîte mail pour confirmer ton compte, ou désactive la confirmation email dans Supabase.');
      btn.textContent = 'Créer mon compte';
      btn.style.opacity = '1';
      btn.disabled = false;
      return;
    }
  });
}

// ── CONNEXION ──
const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = loginForm.querySelector('.auth-btn');
    const email = loginForm.querySelector('input[type="email"]').value;
    const password = loginForm.querySelector('input[type="password"]').value;

    btn.textContent = 'Connexion…';
    btn.style.opacity = '0.7';
    btn.disabled = true;

    const { data, error } = await sb.auth.signInWithPassword({ email, password });

    if (error) {
      showError(error.message === 'Invalid login credentials' ? 'Email ou mot de passe incorrect.' : error.message);
      btn.textContent = 'Se connecter';
      btn.style.opacity = '1';
      btn.disabled = false;
      return;
    }

    if (data.session) {
      window.location.href = '../dashboard/accueil.html';
    } else {
      showError('Erreur de connexion. Réessaye.');
      btn.textContent = 'Se connecter';
      btn.style.opacity = '1';
      btn.disabled = false;
    }
  });
}

// ── GOOGLE LOGIN ──
document.querySelectorAll('.auth-social-btn:not(.auth-discord-btn)').forEach(btn => {
  btn.addEventListener('click', async () => {
    await sb.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin + '/dashboard/accueil.html' }
    });
  });
});

// ── DISCORD LOGIN ──
document.querySelectorAll('.auth-discord-btn').forEach(btn => {
  btn.addEventListener('click', async () => {
    await sb.auth.signInWithOAuth({
      provider: 'discord',
      options: { redirectTo: window.location.origin + '/dashboard/accueil.html' }
    });
  });
});

// ── SI DÉJÀ CONNECTÉ → REDIRECT ──
(async () => {
  const { data: { session } } = await sb.auth.getSession();
  if (session) {
    window.location.href = '../dashboard/accueil.html';
  }
})();
