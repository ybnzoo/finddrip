// Supabase configuration
const SUPABASE_URL = 'https://cysebixeabqzugaybqxl.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN5c2ViaXhlYWJxenVnYXlicXhsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA1MTEyMDAsImV4cCI6MjA5NjA4NzIwMH0.xD2dOfUV5xmdfzWhOMQxmcTCCSf_nya0eKxr_ZTDxgI';

// Initialize Supabase client
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
