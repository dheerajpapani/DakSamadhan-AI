import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Supabase URL or Key is missing. Check your .env file.');
}

// Base client for auth
export const supabase = createClient(
    supabaseUrl || '',
    supabaseAnonKey || ''
);

// Schema-scoped client for all DB queries in this app
export const db = supabase.schema('daksamadhan');
