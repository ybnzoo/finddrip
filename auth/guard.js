// AUTH GUARD — redirige si pas connecté
(async () => {
  if (typeof sb === 'undefined') return;
  const { data: { session } } = await sb.auth.getSession();
  if (!session) {
    window.location.href = '../auth/connexion.html';
  }
})();
