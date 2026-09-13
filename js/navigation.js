// MOBILE NAVIGATION
// Owns the menu toggle, focus return, and breakpoint-specific visibility.
const setupMobileNavigation = () => {
  const header = document.querySelector(".site-header");
  const toggle = document.querySelector("[data-nav-toggle]");
  const navigation = document.querySelector("[data-primary-navigation]");
  if (!toggle || !navigation) return;

  const mobileQuery = window.matchMedia("(max-width: 47.9375rem)");
  const toggleLabel = toggle.querySelector("[data-nav-toggle-label]");

  // Centralize state changes so ARIA, visible menu state, and focus stay in sync.
  const setOpen = (isOpen, { returnFocus = false } = {}) => {
    navigation.hidden = !isOpen;
    navigation.classList.toggle("is-open", isOpen);
    if (header) header.classList.toggle("nav-open", isOpen);
    toggle.setAttribute("aria-expanded", String(isOpen));
    if (toggleLabel) toggleLabel.textContent = isOpen ? "Sulje" : "Valikko";

    if (returnFocus) {
      toggle.focus();
    }
  };

  // Reset mobile-only state whenever the viewport crosses the navigation breakpoint.
  const syncMode = () => {
    const isMobile = mobileQuery.matches;
    toggle.hidden = !isMobile;
    if (isMobile) {
      setOpen(false);
    } else {
      navigation.hidden = false;
      navigation.classList.remove("is-open");
      if (header) header.classList.remove("nav-open");
      toggle.setAttribute("aria-expanded", "false");
      if (toggleLabel) toggleLabel.textContent = "Valikko";
    }
  };

  // Toggle button click: toggle aria-expanded unconditionally when clicked
  toggle.addEventListener("click", (event) => {
    event.stopPropagation();
    const isOpen = toggle.getAttribute("aria-expanded") === "true";
    setOpen(!isOpen);
  });

  // Close when clicking any navigation link
  navigation.addEventListener("click", (event) => {
    if (event.target.closest("a")) {
      setOpen(false);
    }
  });

  // Close when tapping/clicking anywhere outside the header
  document.addEventListener("click", (event) => {
    const isOpen = toggle.getAttribute("aria-expanded") === "true";
    if (isOpen && header && !header.contains(event.target)) {
      setOpen(false);
    }
  });

  // Close when pressing Escape
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      const isOpen = toggle.getAttribute("aria-expanded") === "true";
      if (isOpen) {
        event.preventDefault();
        setOpen(false, { returnFocus: true });
      }
    }
  });

  mobileQuery.addEventListener("change", syncMode);
  window.addEventListener("resize", () => {
    if (!mobileQuery.matches && navigation.hidden) {
      syncMode();
    }
  }, { passive: true });

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


// BACK TO TOP ACTION
// Smoothly scrolls to the top of the viewport when clicked.
const setupBackToTop = () => {
  const backToTop = document.querySelector("[data-back-to-top]");
  if (!backToTop) return;
  backToTop.addEventListener("click", (event) => {
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
};

// Public module initializer called by main.js.
export const initNavigation = () => {
  setupMobileNavigation();
  setupStickyHeader();
  setupBackToTop();
};

