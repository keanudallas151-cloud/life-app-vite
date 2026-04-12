(() => {
  const normalize = (value) => (value || "").replace(/\s+/g, " ").trim();

  const hasHomeHeaderSearch = () =>
    !!document.querySelector(
      'input[placeholder*="Search topics"], input[placeholder*="Search"]'
    );

  const findTextNode = (matcher) => {
    const elements = Array.from(
      document.querySelectorAll("h1, h2, h3, p, span, strong, div")
    );
    return elements.find((el) => {
      if (el.children.length > 0) return false;
      return matcher(normalize(el.textContent));
    });
  };

  const findHeroContainer = (welcomeEl, logoEl) => {
    if (!welcomeEl || !logoEl) return null;

    let container = welcomeEl.closest("section, article, main, div");
    while (container && !container.contains(logoEl)) {
      container = container.parentElement?.closest("section, article, main, div");
    }
    return container || logoEl.parentElement || null;
  };

  const patchHero = () => {
    if (!hasHomeHeaderSearch()) return;

    const welcomeEl = findTextNode((text) => /^welcome to$/i.test(text));
    const logoEl =
      findTextNode((text) => /^life\.?$/i.test(text)) ||
      findTextNode((text) => /^life$/i.test(text));

    if (!welcomeEl || !logoEl) return;

    const container = findHeroContainer(welcomeEl, logoEl);
    if (container) {
      container.classList.add("life-home-hero-upgraded");
    }

    welcomeEl.classList.add("life-home-welcome-upgraded");
    logoEl.classList.add("life-home-logo-upgraded");
  };

  const isSidebarPanel = (el) => {
    if (!(el instanceof Element)) return false;
    const text = normalize(el.textContent).toLowerCase();
    return (
      text.includes("knowledge map") &&
      text.includes("quiz") &&
      (text.includes("where to start") || text.includes("help"))
    );
  };

  const patchSidebarWordmark = () => {
    const containers = Array.from(
      document.querySelectorAll("aside, nav, section, div")
    ).filter(isSidebarPanel);

    containers.forEach((container) => {
      const nodes = Array.from(container.querySelectorAll("h1, h2, h3, p, span, div"));
      nodes.forEach((node) => {
        if (node.children.length > 0) return;
        const text = normalize(node.textContent);
        if (!/^life\.?$/i.test(text)) return;
        const fontSize = Number.parseFloat(getComputedStyle(node).fontSize || "0");
        if (fontSize < 40) return;
        node.style.display = "none";
        node.setAttribute("data-life-sidebar-wordmark-removed", "true");
      });
    });
  };

  const run = () => {
    patchHero();
    patchSidebarWordmark();
  };

  const observer = new MutationObserver(() => {
    run();
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      run();
      if (document.body) {
        observer.observe(document.body, { childList: true, subtree: true });
      }
    });
  } else {
    run();
    if (document.body) {
      observer.observe(document.body, { childList: true, subtree: true });
    }
  }
})();
