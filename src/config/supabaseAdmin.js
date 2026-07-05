import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseServiceRole = import.meta.env.VITE_SUPABASE_SERVICE_ROLE;

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRole, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
    storageKey: 'supabase-admin-key'
  }
});