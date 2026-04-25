"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import "../organized/mobile-native-fixes.css";

const ORGANIZED_RUNTIME_STYLE_ID = "organized-mobile-runtime-polish";

const ORGANIZED_RUNTIME_CSS = `
body.life-organized-active {
  background: var(--background) !important;
  overscroll-behavior-y: none !important;
}

body.life-organized-active .organized-mobile-native {
  background: var(--background) !important;
  color: var(--foreground) !important;
  overflow-x: hidden !important;
  overscroll-behavior: none !important;
  scroll-behavior: auto !important;
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", Arial, sans-serif !important;
}

body.life-organized-active .organized-mobile-native *,
body.life-organized-active [data-slot="dialog-content"],
body.life-organized-active [data-radix-popper-content-wrapper] * {
  -webkit-tap-highlight-color: transparent !important;
}

body.life-organized-active .organized-mobile-native .organized-feature,
body.life-organized-active .organized-mobile-native .organized-feature > div {
  min-height: 100dvh !important;
  background: var(--background) !important;
}

body.life-organized-active .organized-mobile-native > .organized-back-btn {
  top: max(env(safe-area-inset-top), 8px) !important;
  left: 12px !important;
  min-width: 78px !important;
  min-height: 40px !important;
  padding: 0 13px !important;
  border-radius: 9999px !important;
  border: 1px solid color-mix(in oklch, var(--border) 74%, transparent) !important;
  background: color-mix(in oklch, var(--card) 90%, transparent) !important;
  color: var(--primary) !important;
  box-shadow: none !important;
  backdrop-filter: blur(8px) saturate(130%) !important;
  -webkit-backdrop-filter: blur(8px) saturate(130%) !important;
  font-size: 17px !important;
  font-weight: 600 !important;
  opacity: 1 !important;
  transition: opacity 160ms ease, transform 180ms cubic-bezier(0.34, 1.2, 0.64, 1) !important;
}

body.life-organized-active .organized-mobile-native.is-scrolling > .organized-back-btn {
  opacity: 0 !important;
  transform: translateY(-8px) scale(0.98) !important;
  pointer-events: none !important;
}

body.life-organized-active .organized-mobile-native .organized-feature > div > div {
  padding-top: calc(82px + env(safe-area-inset-top)) !important;
  padding-left: 16px !important;
  padding-right: 16px !important;
  padding-bottom: calc(116px + env(safe-area-inset-bottom)) !important;
}

body.life-organized-active .organized-mobile-native .pl-\\[5\\.5rem\\] {
  padding-left: 0 !important;
}

body.life-organized-active .organized-mobile-native header {
  text-align: center !important;
  margin-bottom: 18px !important;
}

body.life-organized-active .organized-mobile-native header h1 {
  font-size: clamp(2.35rem, 10.4vw, 3.55rem) !important;
  line-height: 1.02 !important;
  letter-spacing: -0.055em !important;
}

body.life-organized-active .organized-mobile-native header .mt-3.flex {
  display: flex !important;
  justify-content: center !important;
  gap: 8px !important;
  flex-wrap: wrap !important;
  overflow: visible !important;
  padding: 0 0 4px !important;
}

body.life-organized-active .organized-mobile-native header .organized-stat-chip {
  min-height: 38px !important;
  min-width: 78px !important;
  padding: 8px 13px !important;
  border-radius: 9999px !important;
  font-size: 15px !important;
  line-height: 1 !important;
  font-weight: 700 !important;
  background: color-mix(in oklch, var(--card) 86%, var(--muted)) !important;
  border: 1px solid color-mix(in oklch, var(--border) 82%, transparent) !important;
  box-shadow: none !important;
}

/* Bottom nav: simple iOS tab state, no green blobs or boxed backing. */
body.life-organized-active .organized-bottom-nav {
  border-top: 0 !important;
  background: color-mix(in oklch, var(--background) 94%, transparent) !important;
  box-shadow: 0 -10px 24px color-mix(in oklch, var(--background) 68%, transparent) !important;
  backdrop-filter: blur(12px) saturate(145%) !important;
  -webkit-backdrop-filter: blur(12px) saturate(145%) !important;
  padding-bottom: max(env(safe-area-inset-bottom), 8px) !important;
}

body.life-organized-active .organized-bottom-nav > div {
  max-width: 430px !important;
  padding: 8px 12px 6px !important;
  gap: 4px !important;
  background: transparent !important;
  border: 0 !important;
}

body.life-organized-active .organized-nav-pill,
body.life-organized-active .organized-fab-glow,
body.life-organized-active .organized-nav-item::before {
  display: none !important;
}

body.life-organized-active .organized-nav-item {
  position: relative !important;
  min-height: 54px !important;
  min-width: 54px !important;
  border-radius: 15px !important;
  background: transparent !important;
  box-shadow: none !important;
  color: var(--muted-foreground) !important;
  transition: color 120ms ease, transform 100ms ease !important;
}

body.life-organized-active .organized-nav-item.is-active {
  background: transparent !important;
  color: var(--primary) !important;
  box-shadow: none !important;
}

body.life-organized-active .organized-nav-item.is-active::after {
  content: "" !important;
  position: absolute !important;
  left: 50% !important;
  bottom: 3px !important;
  width: 22px !important;
  height: 3px !important;
  border-radius: 9999px !important;
  background: var(--primary) !important;
  transform: translateX(-50%) !important;
}

body.life-organized-active .organized-nav-item svg,
body.life-organized-active .organized-nav-item span {
  color: inherit !important;
  filter: none !important;
}

body.life-organized-active .organized-nav-item span {
  font-size: 12px !important;
  line-height: 1.05 !important;
  font-weight: 650 !important;
}

body.life-organized-active .organized-fab {
  width: 62px !important;
  height: 62px !important;
  border-radius: 9999px !important;
  border: 0 !important;
  outline: 0 !important;
  background: var(--primary) !important;
  box-shadow: 0 8px 22px color-mix(in oklch, var(--primary) 28%, transparent) !important;
}

/* Add Task: mobile-first sheet that works in portrait, landscape, and with keyboard. */
body.life-organized-active [data-slot="dialog-overlay"] {
  position: fixed !important;
  inset: 0 !important;
  z-index: 10000 !important;
  background: color-mix(in oklch, var(--background) 62%, transparent) !important;
  backdrop-filter: blur(5px) !important;
  -webkit-backdrop-filter: blur(5px) !important;
}

body.life-organized-active [data-slot="dialog-content"]:has(#task-title) {
  box-sizing: border-box !important;
  background: var(--card) !important;
  color: var(--card-foreground) !important;
  border: 1px solid color-mix(in oklch, var(--border) 84%, transparent) !important;
  overflow-x: hidden !important;
}

@media (max-width: 932px), (pointer: coarse) {
  body.life-organized-active [data-slot="dialog-content"]:has(#task-title) {
    position: fixed !important;
    top: auto !important;
    left: 50% !important;
    right: auto !important;
    bottom: max(env(safe-area-inset-bottom), 8px) !important;
    width: min(430px, calc(100vw - 20px)) !important;
    max-width: calc(100vw - 20px) !important;
    max-height: min(82dvh, calc(100dvh - 24px - env(safe-area-inset-top) - env(safe-area-inset-bottom))) !important;
    transform: translateX(-50%) !important;
    border-radius: 24px !important;
    padding: 16px 14px calc(14px + env(safe-area-inset-bottom)) !important;
    overflow-y: auto !important;
    animation: organized-sheet-up 180ms cubic-bezier(0.22, 1, 0.36, 1) both !important;
    box-shadow: 0 14px 34px color-mix(in oklch, var(--background) 72%, transparent) !important;
  }

  body.life-organized-active [data-slot="dialog-content"]:has(#task-title)::before {
    content: "" !important;
    display: block !important;
    width: 42px !important;
    height: 5px !important;
    border-radius: 9999px !important;
    background: color-mix(in oklch, var(--muted-foreground) 34%, transparent) !important;
    margin: 0 auto 10px !important;
  }

  body.life-organized-active [data-slot="dialog-content"]:has(#task-title) [data-slot="dialog-title"] {
    font-size: 22px !important;
    line-height: 1.15 !important;
    text-align: center !important;
  }

  body.life-organized-active [data-slot="dialog-content"]:has(#task-title) [data-slot="dialog-description"] {
    font-size: 15px !important;
    line-height: 1.25 !important;
    text-align: center !important;
  }

  body.life-organized-active [data-slot="dialog-content"]:has(#task-title) .space-y-3 {
    gap: 10px !important;
  }

  body.life-organized-active [data-slot="dialog-content"]:has(#task-title) button {
    min-height: 44px !important;
    border-radius: 14px !important;
  }

  body.life-organized-active [data-slot="dialog-content"]:has(#task-title) input,
  body.life-organized-active [data-slot="dialog-content"]:has(#task-title) textarea,
  body.life-organized-active [data-slot="dialog-content"]:has(#task-title) [data-slot="select-trigger"] {
    min-height: 44px !important;
    font-size: 16px !important;
    border-radius: 14px !important;
  }

  body.life-organized-active [data-slot="dialog-content"]:has(#task-title) .grid.grid-cols-2 {
    gap: 10px !important;
  }
}

@media (max-height: 520px) and (orientation: landscape) {
  body.life-organized-active [data-slot="dialog-content"]:has(#task-title) {
    top: max(env(safe-area-inset-top), 8px) !important;
    bottom: max(env(safe-area-inset-bottom), 8px) !important;
    width: min(640px, calc(100vw - 28px)) !important;
    max-width: calc(100vw - 28px) !important;
    max-height: calc(100dvh - 16px - env(safe-area-inset-top) - env(safe-area-inset-bottom)) !important;
    border-radius: 22px !important;
  }
}

@keyframes organized-sheet-up {
  from { opacity: 0; transform: translateX(-50%) translateY(22px); }
  to { opacity: 1; transform: translateX(-50%) translateY(0); }
}

/* Opaque popovers/selects: fixes see-through calendar/dropdowns. */
body.life-organized-active [data-radix-popper-content-wrapper] {
  z-index: 10050 !important;
}

body.life-organized-active [data-slot="popover-content"],
body.life-organized-active [data-slot="select-content"] {
  background: var(--popover, var(--card)) !important;
  color: var(--popover-foreground, var(--card-foreground)) !important;
  border: 1px solid color-mix(in oklch, var(--border) 86%, transparent) !important;
  border-radius: 18px !important;
  box-shadow: 0 12px 28px color-mix(in oklch, var(--background) 70%, transparent) !important;
  backdrop-filter: none !important;
  -webkit-backdrop-filter: none !important;
  overflow: hidden !important;
}

body.life-organized-active [data-slot="calendar"] {
  background: var(--popover, var(--card)) !important;
  color: var(--popover-foreground, var(--card-foreground)) !important;
}

/* Stats: centered, even iOS summary tiles. */
body.life-organized-active .organized-mobile-native .grid.grid-cols-2.md\\:grid-cols-4 {
  gap: 12px !important;
}

body.life-organized-active .organized-mobile-native .grid.grid-cols-2.md\\:grid-cols-4 > div {
  min-width: 0 !important;
}

body.life-organized-active .organized-mobile-native .grid.grid-cols-2.md\\:grid-cols-4 [data-slot="card"] {
  min-height: 164px !important;
  border-radius: 24px !important;
  border-width: 1px !important;
  box-shadow: none !important;
  background: var(--card) !important;
}

body.life-organized-active .organized-mobile-native .grid.grid-cols-2.md\\:grid-cols-4 [data-slot="card-content"] {
  min-height: 164px !important;
  padding: 18px 14px !important;
  display: flex !important;
  flex-direction: column !important;
  align-items: center !important;
  justify-content: center !important;
  text-align: center !important;
  gap: 8px !important;
  position: relative !important;
}

body.life-organized-active .organized-mobile-native .grid.grid-cols-2.md\\:grid-cols-4 [data-slot="card-content"] > .flex:first-child {
  width: auto !important;
  align-items: center !important;
  justify-content: center !important;
  margin: 0 !important;
}

body.life-organized-active .organized-mobile-native .grid.grid-cols-2.md\\:grid-cols-4 [data-slot="card-content"] > .flex:first-child > div:first-child {
  width: 42px !important;
  height: 42px !important;
  margin: 0 !important;
}

body.life-organized-active .organized-mobile-native .grid.grid-cols-2.md\\:grid-cols-4 [data-slot="card-content"] > .flex:first-child [data-slot="badge"] {
  position: absolute !important;
  top: 14px !important;
  right: 14px !important;
}

body.life-organized-active .organized-mobile-native .grid.grid-cols-2.md\\:grid-cols-4 .text-3xl {
  font-size: 48px !important;
  line-height: 0.95 !important;
  letter-spacing: -0.06em !important;
  margin: 0 !important;
}

body.life-organized-active .organized-mobile-native .grid.grid-cols-2.md\\:grid-cols-4 .text-xs {
  font-size: 17px !important;
  line-height: 1.06 !important;
  font-weight: 750 !important;
  color: var(--foreground) !important;
  max-width: 100% !important;
}

body.life-organized-active .organized-mobile-native .grid.grid-cols-2.md\\:grid-cols-4 [data-slot="badge"] {
  font-size: 13px !important;
  min-height: 24px !important;
  padding: 2px 8px !important;
}

/* Calendar cells stay circular. */
body.life-organized-active .organized-mobile-native .grid.grid-cols-7 > button {
  aspect-ratio: 1 / 1 !important;
  border-radius: 9999px !important;
  overflow: hidden !important;
}

body.life-organized-active .organized-mobile-native .grid.grid-cols-7 > button > div,
body.life-organized-active .organized-mobile-native .grid.grid-cols-7 > button > div > div {
  border-radius: 9999px !important;
}

/* Settings: compact grouped rows, lighter effects. */
body.life-organized-active .organized-settings-intro {
  display: none !important;
}

body.life-organized-active .organized-settings-scroll,
body.life-organized-active .organized-settings-panel {
  overflow: visible !important;
}

body.life-organized-active .organized-settings-stack {
  padding-bottom: 120px !important;
}

body.life-organized-active .organized-settings-stack.space-y-4 > :not([hidden]) ~ :not([hidden]),
body.life-organized-active .organized-settings-stack > * + * {
  margin-top: 12px !important;
}

body.life-organized-active .organized-settings-stack > [data-slot="card"] {
  border: 0 !important;
  background: transparent !important;
  box-shadow: none !important;
  overflow: visible !important;
  contain: layout paint !important;
}

body.life-organized-active .organized-settings-row {
  min-height: 72px !important;
  padding: 14px 18px !important;
  border-radius: 24px !important;
  background: var(--card) !important;
  border: 1px solid color-mix(in oklch, var(--border) 82%, transparent) !important;
  box-shadow: none !important;
  transition: border-color 110ms ease, background-color 110ms ease, transform 90ms ease !important;
}

body.life-organized-active .organized-settings-row > div:first-child {
  gap: 12px !important;
  min-width: 0 !important;
}

body.life-organized-active .organized-settings-row > div:first-child > div:first-child {
  width: 44px !important;
  height: 44px !important;
  min-width: 44px !important;
  border-radius: 9999px !important;
}

body.life-organized-active .organized-settings-row span {
  font-size: 19px !important;
  line-height: 1.12 !important;
  font-weight: 720 !important;
  letter-spacing: -0.035em !important;
}

body.life-organized-active .organized-settings-section-panel {
  margin-top: 8px !important;
  border-radius: 22px !important;
  background: var(--card) !important;
  border: 1px solid color-mix(in oklch, var(--border) 76%, transparent) !important;
  box-shadow: none !important;
  contain: layout paint !important;
}

body.life-organized-active .organized-settings-section-panel > div {
  padding: 14px !important;
}

body.life-organized-active .organized-choice-tile {
  min-height: 48px !important;
  border-radius: 16px !important;
}

body.life-organized-active .organized-choice-tile[aria-pressed="true"] {
  color: var(--primary-foreground) !important;
  background: var(--primary) !important;
  border-color: var(--primary) !important;
  box-shadow: none !important;
}

/* Visually shorten the final legal settings row without changing data or routing. */
body.life-organized-active .organized-settings-stack > [data-slot="card"]:last-of-type .organized-settings-row > div:first-child > span {
  font-size: 0 !important;
}

body.life-organized-active .organized-settings-stack > [data-slot="card"]:last-of-type .organized-settings-row > div:first-child > span::after {
  content: "Legal Terms" !important;
  display: inline !important;
  font-size: 19px !important;
  line-height: 1.12 !important;
  font-weight: 720 !important;
  letter-spacing: -0.035em !important;
}

/* Correct iOS switches: keep thumb inside the track in both states. */
body.life-organized-active button[data-slot="switch"],
body.life-organized-active .organized-mobile-native button[data-slot="switch"] {
  position: relative !important;
  inline-size: 51px !important;
  block-size: 31px !important;
  width: 51px !important;
  height: 31px !important;
  min-width: 51px !important;
  min-height: 31px !important;
  max-width: 51px !important;
  max-height: 31px !important;
  flex: 0 0 51px !important;
  padding: 0 !important;
  border-radius: 9999px !important;
  border: 0 !important;
  display: inline-block !important;
  background: color-mix(in oklch, var(--muted-foreground) 34%, transparent) !important;
  box-shadow: inset 0 0 0 1px color-mix(in oklch, var(--border) 72%, transparent) !important;
  overflow: hidden !important;
  transform: none !important;
  transition: background-color 150ms ease !important;
  opacity: 1 !important;
}

body.life-organized-active button[data-slot="switch"][data-state="checked"] {
  background: var(--primary) !important;
}

body.life-organized-active button[data-slot="switch"] [data-slot="switch-thumb"] {
  position: absolute !important;
  left: 2px !important;
  top: 2px !important;
  inline-size: 27px !important;
  block-size: 27px !important;
  width: 27px !important;
  height: 27px !important;
  min-width: 27px !important;
  min-height: 27px !important;
  max-width: 27px !important;
  max-height: 27px !important;
  border-radius: 9999px !important;
  background: var(--foreground) !important;
  box-shadow: 0 1px 3px color-mix(in oklch, var(--background) 68%, transparent) !important;
  transform: translateX(0) !important;
  transition: transform 150ms cubic-bezier(0.34, 1.15, 0.64, 1) !important;
}

body.life-organized-active button[data-slot="switch"][data-state="checked"] [data-slot="switch-thumb"] {
  transform: translateX(20px) !important;
}

/* Feedback rows: keep text readable and switches aligned. */
body.life-organized-active .organized-settings-section-panel .flex.items-center.justify-between.py-3 {
  gap: 12px !important;
  align-items: center !important;
}

body.life-organized-active .organized-settings-section-panel label {
  font-size: 17px !important;
  line-height: 1.2 !important;
  font-weight: 650 !important;
}

body.life-organized-active .organized-settings-section-panel p {
  font-size: 15px !important;
  line-height: 1.25 !important;
}

/* Legal modal: no horizontal scrolling; compact grid tabs. */
body.life-organized-active .organized-legal-overlay {
  padding: max(10px, env(safe-area-inset-top)) 10px max(10px, env(safe-area-inset-bottom)) !important;
  align-items: center !important;
  overflow: hidden !important;
}

body.life-organized-active .organized-legal-panel {
  width: min(100%, 430px) !important;
  max-width: calc(100vw - 20px) !important;
  height: calc(100dvh - 20px - env(safe-area-inset-top) - env(safe-area-inset-bottom)) !important;
  margin: 0 !important;
  border-radius: 24px !important;
  background: var(--background) !important;
  color: var(--foreground) !important;
}

body.life-organized-active .organized-legal-header {
  padding: 14px 16px !important;
}

body.life-organized-active .organized-legal-tabs-wrap {
  overflow-x: hidden !important;
  padding: 12px 12px 10px !important;
  border-bottom: 1px solid color-mix(in oklch, var(--border) 84%, transparent) !important;
}

body.life-organized-active .organized-legal-tabs {
  width: 100% !important;
  min-width: 0 !important;
  display: grid !important;
  grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
  gap: 8px !important;
  background: transparent !important;
}

body.life-organized-active .organized-legal-tab {
  min-width: 0 !important;
  min-height: 50px !important;
  width: 100% !important;
  border-radius: 9999px !important;
  padding: 8px 4px !important;
  white-space: normal !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
  background: var(--card) !important;
  color: var(--foreground) !important;
}

body.life-organized-active .organized-legal-tab span {
  display: inline !important;
  font-size: 12px !important;
  line-height: 1.05 !important;
  white-space: normal !important;
}

body.life-organized-active .organized-legal-tab[data-state="active"] {
  background: var(--primary) !important;
  color: var(--primary-foreground) !important;
  border-color: var(--primary) !important;
}

body.life-organized-active .organized-legal-body {
  padding: 12px !important;
}

body.life-organized-active .organized-legal-card,
body.life-organized-active .organized-legal-prose {
  background: var(--card) !important;
  color: var(--card-foreground) !important;
}

@media (max-width: 360px) {
  body.life-organized-active .organized-legal-tabs {
    grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
  }
}

/* Performance sweep: remove the expensive mobile effects causing jank. */
@media (hover: none), (pointer: coarse) {
  body.life-organized-active .organized-feature [data-slot="card"]:hover,
  body.life-organized-active .organized-feature .bg-card:hover,
  body.life-organized-active .organized-fab:hover,
  body.life-organized-active .organized-back-btn:hover {
    transform: none !important;
    box-shadow: none !important;
  }

  body.life-organized-active .organized-feature * {
    transition-duration: 110ms !important;
    animation-duration: 160ms !important;
  }
}

body.life-organized-active .organized-feature [data-slot="card"],
body.life-organized-active .organized-feature .bg-card,
body.life-organized-active .organized-feature button {
  box-shadow: none !important;
  transition-property: border-color, background-color, color, transform, opacity !important;
  transition-duration: 110ms !important;
  will-change: auto !important;
}
`;

const OrganizedPage = dynamic(
  () => import("../organized").then((m) => ({ default: m.OrganizedPage })),
  { ssr: false },
);

export function ToolsOrganizedPage({ uid, setPage, setScreen }) {
  const prefix = uid && uid !== "_" ? `organized_${uid}` : "organized";
  const [mounted, setMounted] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const isScrollingRef = useRef(false);
  const scrollTimerRef = useRef(null);

  useEffect(() => {
    const previousTitle = document.title;
    const runtimeStyle = document.createElement("style");
    runtimeStyle.id = ORGANIZED_RUNTIME_STYLE_ID;
    runtimeStyle.textContent = ORGANIZED_RUNTIME_CSS;
    document.getElementById(ORGANIZED_RUNTIME_STYLE_ID)?.remove();
    document.head.appendChild(runtimeStyle);

    setMounted(true);
    document.body.classList.add("life-organized-active");
    document.title = "To-Do";
    return () => {
      document.body.classList.remove("life-organized-active");
      document.title = previousTitle;
      runtimeStyle.remove();
      if (scrollTimerRef.current) window.clearTimeout(scrollTimerRef.current);
    };
  }, []);

  if (!mounted) {
    return <div data-page-tag="#tools_organized_page" />;
  }

  const exit = () => {
    if (typeof setPage === "function") setPage("sidebar_tools");
    else if (typeof setScreen === "function") setScreen("app");
  };

  const overlay = (
    <div
      data-page-tag="#tools_organized_page"
      className={`organized-feature organized-mobile-native${isScrolling ? " is-scrolling" : ""}`}
      onScroll={() => {
        if (!isScrollingRef.current) {
          isScrollingRef.current = true;
          setIsScrolling(true);
        }
        if (scrollTimerRef.current) window.clearTimeout(scrollTimerRef.current);
        scrollTimerRef.current = window.setTimeout(() => {
          isScrollingRef.current = false;
          setIsScrolling(false);
        }, 220);
      }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9000,
        background: "var(--background)",
        color: "var(--foreground)",
        overflow: "auto",
        overscrollBehavior: "none",
        WebkitOverflowScrolling: "touch",
      }}
    >
      <button
        type="button"
        onClick={exit}
        aria-label="Back to Life"
        className="organized-back-btn"
      >
        <span aria-hidden="true" className="organized-back-arrow">←</span>
        <span>Life</span>
      </button>
      <OrganizedPage storageKeyPrefix={prefix} />
    </div>
  );

  return createPortal(overlay, document.body);
}
