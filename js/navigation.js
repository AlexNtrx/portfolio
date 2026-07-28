// MOBILE NAVIGATION
// Owns the menu toggle, focus return, and breakpoint-specific visibility.
const setupMobileNavigation = () => {
  const toggle = document.querySelector("[data-nav-toggle]");
  const navigation = document.querySelector("[data-primary-navigation]");
  if (!toggle || !navigation) return;

  const mobileQuery = window.matchMedia("(max-width: 47.9375rem)");
  const toggleLabel = toggle.querySelector("[data-nav-toggle-label]");

  // Centralize state changes so ARIA, visible menu state, and focus stay in sync.
  const setOpen = (isOpen, { returnFocus = false } = {}) => {
    if (!mobileQuery.matches) return;
    navigation.hidden = !isOpen;
    toggle.setAttribute("aria-expanded", String(isOpen));
    if (toggleLabel) toggleLabel.textContent = isOpen ? "Sulje" : "Valikko";
    if (isOpen) {
      navigation.querySelector("a")?.focus();
    } else if (returnFocus) {
      toggle.focus();
    }
  };

  // Reset mobile-only state whenever the viewport crosses the navigation breakpoint.
  const syncMode = () => {
    const isMobile = mobileQuery.matches;
    toggle.hidden = !isMobile;
    navigation.hidden = isMobile;
    toggle.setAttribute("aria-expanded", "false");
    if (toggleLabel) toggleLabel.textContent = "Valikko";
  };

  // Toggle control and keyboard Escape both use the shared menu state helper.
  toggle.addEventListener("click", () => {
    setOpen(navigation.hidden);
  });

  navigation.addEventListener("click", (event) => {
    if (mobileQuery.matches && event.target.closest("a")) setOpen(false);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && mobileQuery.matches && !navigation.hidden) {
      event.preventDefault();
      setOpen(false, { returnFocus: true });
    }
  });

  mobileQuery.addEventListener("change", syncMode);
  syncMode();
};

// STICKY HEADER
// Adds the scrolled style only after the hero has cleared the header.
const setupStickyHeader = () => {
  const header = document.querySelector(".site-header");
  const hero = document.querySelector(".intro");
  if (!header || !hero) return;

  let currentState = null;
  let heroEnd = 0;
  let headerHeight = 0;
  let syncFrame = 0;

  // Avoid DOM updates until the sticky state actually changes.
  const syncHeaderState = () => {
    syncFrame = 0;
    const isScrolled = window.scrollY > Math.max(headerHeight, heroEnd);
    if (isScrolled === currentState) return;
    currentState = isScrolled;
    header.classList.toggle("is-scrolled", isScrolled);
  };

  // Recalculate boundaries when responsive content changes height.
  const updateMetrics = () => {
    headerHeight = header.offsetHeight;
    heroEnd = hero.offsetTop + hero.offsetHeight - headerHeight;
    syncHeaderState();
  };

  // Batch frequent scroll events into one animation-frame update.
  const queueHeaderSync = () => {
    if (syncFrame) return;
    syncFrame = window.requestAnimationFrame(syncHeaderState);
  };

  window.addEventListener("scroll", queueHeaderSync, { passive: true });
  window.addEventListener("resize", updateMetrics, { passive: true });

  if ("ResizeObserver" in window) {
    const resizeObserver = new ResizeObserver(updateMetrics);
    resizeObserver.observe(header);
    resizeObserver.observe(hero);
  }

  updateMetrics();
};


// Public module initializer called by main.js.
export const initNavigation = () => {
  setupMobileNavigation();
  setupStickyHeader();
};
