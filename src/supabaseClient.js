import { createClient } from "@supabase/supabase-js";
 
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
 
if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error(
    "[Life.] Missing Supabase env vars.\n" +
    "Set NEXT_PUBLIC_SUPABASE_URL + NEXT_PUBLIC_SUPABASE_ANON_KEY in Vercel.\n" +
    "The app will render but auth and all network features will be unavailable."
  );
}
 
export const supabase = createClient(
  SUPABASE_URL || "https://placeholder.supabase.co",
  SUPABASE_KEY || "placeholder-key",
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  }
);
 
export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_KEY);
