"use client";

import { useEffect } from "react";

export default function CanonicalHostRedirect({ canonicalSiteUrl }) {
  useEffect(() => {
    if (!canonicalSiteUrl || typeof window === "undefined") return;

    try {
      const canonical = new URL(canonicalSiteUrl);
      const current = new URL(window.location.href);
      const isPreviewVercelHost = current.hostname.endsWith(".vercel.app");
      const isCanonicalHost = current.hostname === canonical.hostname;

      if (!isPreviewVercelHost || isCanonicalHost) return;

      const nextUrl = `${canonical.origin}${current.pathname}${current.search}${current.hash}`;
      if (nextUrl !== window.location.href) {
        window.location.replace(nextUrl);
      }
    } catch {
      // Ignore invalid URL parsing and leave the current host untouched.
    }
  }, [canonicalSiteUrl]);

  return null;
}
