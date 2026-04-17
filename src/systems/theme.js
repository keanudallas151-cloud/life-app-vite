import { useCallback, useEffect, useMemo, useState } from "react";
import { LS } from "./storage";

// ── Professional Gray Palette ──────────────────────────────────────────
// Light mode: crisp cool grays, sage-muted green accent, warm gold
// Dark mode:  deep charcoal surfaces, balanced contrast (WCAG AA+)
export const C = {
  skin: "#f7f8fa",        // cool off-white page bg
  white: "#ffffff",        // card / surface
  green: "#3d5a4c",        // deep sage — primary accent (sophisticated, not kid-green)
  greenAlt: "#5a7d6a",     // medium sage — gradient end, secondary accent
  greenLt: "#edf1ef",      // barely-there sage tint
  ink: "#1c1f23",          // charcoal text
  mid: "#464b53",          // secondary text
  muted: "#888e96",        // tertiary / placeholder
  border: "#e2e4e8",       // clean gray border
  light: "#f0f1f3",        // light surface / hover bg
  gold: "#b8975a",         // warm professional gold accent
  red: "#c0392b",
  orange: "#d4834a",
};

export const DARK = {
  skin: "#131517",          // deep charcoal bg
  white: "#1c1e22",         // dark card surface
  green: "#5a8a6a",         // muted sage in dark
  greenAlt: "#74a888",      // lighter sage
  greenLt: "#1e2824",       // dark sage tint
  ink: "#e8eaed",           // bright text (14:1 on skin)
  mid: "#bfc3c9",           // secondary text
  muted: "#8c929a",         // muted text
  border: "#2e3138",        // subtle dark border
  light: "#222528",         // dark hover / surface
  gold: "#d4b55e",          // warm gold in dark
  red: "#d25545",
  orange: "#e09560",
};

export const THEME_MODE_KEY = "life_theme_mode";
export const THEME_DARK_LEGACY_KEY = "life_dark_mode";
export const THEME_MODES = {
  system: "system",
  light: "light",
  dark: "dark",
};

/** Depth tokens — neutral gray shadows (no colored tint) */
export const S = {
  sm: "0 1px 2px rgba(0,0,0,0.05), 0 2px 8px rgba(0,0,0,0.04)",
  md: "0 2px 4px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.08)",
  lg: "0 8px 16px rgba(0,0,0,0.06), 0 24px 48px rgba(0,0,0,0.10)",
  glow: "0 0 0 1px rgba(184,151,90,0.14), 0 12px 36px rgba(0,0,0,0.10)",
};

function canUseDOM() {
  return typeof window !== "undefined";
}

export function getSystemPrefersDark() {
  if (!canUseDOM() || !window.matchMedia) return false;
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function normalizeThemeMode(value) {
  return Object.values(THEME_MODES).includes(value) ? value : THEME_MODES.system;
}

function getStoredThemeMode() {
  if (!canUseDOM()) return THEME_MODES.system;

  try {
    const rawMode = window.localStorage.getItem(THEME_MODE_KEY);
    if (rawMode) return normalizeThemeMode(JSON.parse(rawMode));

    const rawLegacy = window.localStorage.getItem(THEME_DARK_LEGACY_KEY);
    if (rawLegacy !== null) {
      return JSON.parse(rawLegacy) ? THEME_MODES.dark : THEME_MODES.light;
    }
  } catch {
    return THEME_MODES.system;
  }

  return THEME_MODES.system;
}

export function useTheme() {
  const [themeMode, setThemeModeState] = useState(getStoredThemeMode);
  const [systemDark, setSystemDark] = useState(getSystemPrefersDark);

  useEffect(() => {
    if (!canUseDOM() || !window.matchMedia) return undefined;
    const query = window.matchMedia("(prefers-color-scheme: dark)");
    const sync = (event) => setSystemDark(event.matches);
    setSystemDark(query.matches);
    if (typeof query.addEventListener === "function") {
      query.addEventListener("change", sync);
      return () => query.removeEventListener("change", sync);
    }
    query.addListener(sync);
    return () => query.removeListener(sync);
  }, []);

  const setThemeMode = useCallback((nextMode) => {
    setThemeModeState(normalizeThemeMode(nextMode));
  }, []);

  const dark = themeMode === THEME_MODES.dark || (
    themeMode === THEME_MODES.system && systemDark
  );

  useEffect(() => {
    LS.set(THEME_MODE_KEY, themeMode);
    LS.set(THEME_DARK_LEGACY_KEY, dark);
  }, [dark, themeMode]);

  const toggleTheme = useCallback(() => {
    setThemeModeState((currentMode) => {
      if (currentMode === THEME_MODES.dark) return THEME_MODES.light;
      if (currentMode === THEME_MODES.light) return THEME_MODES.dark;
      return dark ? THEME_MODES.light : THEME_MODES.dark;
    });
  }, [dark]);

  const t = useMemo(() => (dark ? DARK : C), [dark]);

  return { dark, t, themeMode, setThemeMode, toggleTheme, systemDark };
}

if (typeof document !== "undefined") {
  if (!document.getElementById("life-theme-global-style")) {
    const style = document.createElement("style");
    style.id = "life-theme-global-style";
    style.textContent = `button:active{filter:brightness(0.92)!important;transform:scale(0.985)!important;}button{transition:filter 0.18s cubic-bezier(0.4,0,0.2,1),transform 0.18s cubic-bezier(0.4,0,0.2,1),box-shadow 0.22s ease,background 0.18s ease,border-color 0.18s ease;}`;
    document.head.appendChild(style);
  }
}
