// Supabase configuration
(function() {
  var SUPABASE_URL = 'https://cysebixeabqzugaybqxl.supabase.co';
  var SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN5c2ViaXhlYWJxenVnYXlicXhsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA1MTEyMDAsImV4cCI6MjA5NjA4NzIwMH0.xD2dOfUV5xmdfzWhOMQxmcTCCSf_nya0eKxr_ZTDxgI';

  if (!window._supabaseClient) {
    window._supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }
})();

// Global reference
var supabase = window._supabaseClient;
