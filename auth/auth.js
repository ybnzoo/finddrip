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
      { width: '0%',   color: 'transparent',  label: '' },
      { width: '25%',  color: '#ff4d4d',       label: 'Trop faible' },
      { width: '50%',  color: '#ff9500',       label: 'Moyen' },
      { width: '75%',  color: '#34c759',       label: 'Bon' },
      { width: '100%', color: '#6C4DFF',       label: 'Excellent' },
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

// ── SOUMISSION CONNEXION ──
const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = loginForm.querySelector('.auth-btn');
    btn.textContent = 'Connexion…';
    btn.style.opacity = '0.7';
    // Simule une redirection
    setTimeout(() => {
      window.location.href = '../dashboard/accueil.html';
    }, 800);
  });
}

// ── SOUMISSION INSCRIPTION ──
const signupForm = document.getElementById('signupForm');
if (signupForm) {
  signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = signupForm.querySelector('.auth-btn');
    btn.textContent = 'Création du compte…';
    btn.style.opacity = '0.7';
    setTimeout(() => {
      window.location.href = '../dashboard/accueil.html';
    }, 800);
  });
}
