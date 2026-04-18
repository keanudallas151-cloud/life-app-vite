import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() || "";
const SUPABASE_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim() ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ||
  "";

const FALLBACK_SUPABASE_URL = "https://example.supabase.co";
const FALLBACK_SUPABASE_KEY = "sb_publishable_placeholder";

function trimTrailingSlash(value) {
  return value.replace(/\/+$/, "");
}

export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_KEY);

export function getAppOrigin() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

  if (typeof window !== "undefined" && window.location?.origin) {
    return window.location.origin;
  }

  if (siteUrl) {
    return trimTrailingSlash(siteUrl);
  }

  return "http://localhost:3000";
}

export function getAuthRedirectUrl(path = "") {
  const origin = trimTrailingSlash(getAppOrigin());
  if (!path) return origin;

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${origin}${normalizedPath}`;
}

const SUPABASE_OPTIONS = {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
};

const globalKey = "__lifeSupabaseClient";
const existingClient =
  typeof globalThis !== "undefined" ? globalThis[globalKey] : undefined;

export const supabase =
  existingClient ||
  createClient(
    SUPABASE_URL || FALLBACK_SUPABASE_URL,
    SUPABASE_KEY || FALLBACK_SUPABASE_KEY,
    SUPABASE_OPTIONS,
  );

if (typeof globalThis !== "undefined" && !existingClient) {
  globalThis[globalKey] = supabase;
}
