// ── AUTH GUARD ──
// Ce script protège les pages du dashboard.
// Si l'utilisateur n'est pas connecté → redirige vers la page de connexion.

(async () => {
  // Attendre que Supabase soit chargé
  if (typeof supabase === 'undefined') return;

  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    window.location.href = '../auth/connexion.html';
  }
})();
