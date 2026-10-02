(() => {
'use strict';
// Shared accessibility preference used to disable optional motion.
const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Shared namespace required when JavaScript creates SVG elements.
const svgNamespace = "http://www.w3.org/2000/svg";


// HERO TYPING
// Cycles through role descriptions only when the visitor allows motion.
const setupHeroTyping = () => {
  const output = document.querySelector("[data-hero-typing-output]");
  if (!output || prefersReducedMotion()) return;

  const phrases = [
    "Verkkokehitys",
    "Käyttöliittymäkehitys",
    "Käyttöliittymä- ja verkkosuunnittelu",
    "IT-opiskelija",
    "Junior-ohjelmistokehittäjä",
  ];
  const typingDelay = 60;
  const holdDelay = 1800;
  const deletingDelay = 35;
  const phraseDelay = 250;
  const startDelay = 1000;
  let phraseIndex = 0;
  let characterIndex = 0;
  let deleting = false;

  output.textContent = "";

  // Advance one character per call, switching between typing and deletion states.
  const tick = () => {
    const phrase = phrases[phraseIndex];

    if (deleting) {
      characterIndex -= 1;
      output.textContent = phrase.slice(0, characterIndex);
      if (characterIndex === 0) {
        deleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        window.setTimeout(tick, phraseDelay);
        return;
      }
      window.setTimeout(tick, deletingDelay);
      return;
    }

    characterIndex += 1;
    output.textContent = phrase.slice(0, characterIndex);
    if (characterIndex === phrase.length) {
      deleting = true;
      window.setTimeout(tick, holdDelay);
      return;
    }
    window.setTimeout(tick, typingDelay);
  };

  window.setTimeout(tick, startDelay);
};


// SCROLL REVEALS
// Reveals each marked element once when it enters the viewport.
const setupScrollMotion = () => {
  if (prefersReducedMotion() || !("IntersectionObserver" in window)) return;

  const targets = [...document.querySelectorAll("[data-reveal]")];
  if (!targets.length) return;

  document.documentElement.classList.add("scroll-motion-enabled");

  // Unobserve revealed elements to prevent repeated entrance animations.
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-revealed");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.16,
      rootMargin: "0px 0px -12% 0px",
    },
  );

  targets.forEach((target) => observer.observe(target));
};


// Public initializers called by main.js.
const initHeroAnimation = setupHeroTyping;
const initScrollAnimations = setupScrollMotion;

// SKILLS DATA
// Categorized into 4 clean domains: Frontend, Backend, Data/DevTools, Design.
const capabilityGroups = [
  {
    id: 'foundations',
    title: 'Verkkokehitys ja käyttöliittymät',
    skills: [
      ['html', 'HTML', 'html5-original-wordmark.svg', 'wordmark'],
      ['css', 'CSS', 'css3-original-wordmark.svg', 'wordmark'],
      ['javascript', 'JavaScript', 'javascript-original.svg', 'mark'],
      ['react', 'React', 'react-original-wordmark.svg', 'wordmark'],
      ['nextjs', 'Next.js', 'nextjs-original-wordmark.svg', 'wordmark'],
      ['tailwind', 'Tailwind CSS', 'tailwindcss-original-wordmark.svg', 'wordmark'],
    ]
  },
  {
    id: 'services',
    title: 'Ohjelmistokehykset ja palvelut',
    skills: [
      ['nodejs', 'Node.js', 'nodejs-original-wordmark.svg', 'wordmark'],
      ['express', 'Express', 'express-original-wordmark.svg', 'wordmark'],
      ['php', 'PHP', 'php-original.svg', 'wordmark'],
      ['supabase', 'Supabase', 'supabase-original-wordmark.svg', 'wordmark']
    ]
  },
  {
    id: 'data',
    title: 'Data ja kehitystyökalut',
    skills: [
      ['postgresql', 'PostgreSQL', 'postgresql-original-wordmark.svg', 'wordmark'],
      ['prisma', 'Prisma', 'prisma-original-wordmark.svg', 'wordmark'],
      ['github', 'GitHub', 'github-original-wordmark.svg', 'wordmark'],
      ['postman', 'Postman', 'postman-original-wordmark.svg', 'wordmark']
    ]
  },
  {
    id: 'creative',
    title: 'Muotoilu ja työkalut',
    skills: [
      ['figma', 'Figma', 'figma-original.svg', 'mark'],
      ['photoshop', 'Adobe Photoshop', 'photoshop-original.svg', 'mark'],
      ['canva', 'Canva', 'canva-original.svg', 'mark']
    ]
  }
];

// SKILLS RENDERER
// Creates accessible skill groups with modern badge-style items.
const renderCapabilities = () => {
  const list = document.querySelector('[data-capability-list]');
  if (!list) return;

  list.replaceChildren(...capabilityGroups.map((group, groupIndex) => {
    const section = document.createElement('section');
    section.className = 'capability-group';
    section.dataset.capabilityGroup = group.id;
    section.style.setProperty('--group-delay', `${groupIndex * 55}ms`);
    section.setAttribute('aria-labelledby', `capability-group-${groupIndex + 1}`);

    const heading = document.createElement('h3');
    heading.id = `capability-group-${groupIndex + 1}`;
    heading.append(document.createTextNode(group.title));

    const skills = document.createElement('ul');
    skills.className = 'skill-list';
    skills.append(...group.skills.map(([id, name, icon, kind], skillIndex) => {
      const item = document.createElement('li');
      item.className = 'skill-node';
      item.dataset.skillId = id;
      item.tabIndex = 0;
      item.style.setProperty('--node-delay', `${skillIndex * 35}ms`);
      item.setAttribute('aria-label', name);

      const content = document.createElement('span');
      content.className = 'skill-node-content';

      const mark = document.createElement('span');
      mark.className = 'skill-mark';

      const image = document.createElement('img');
      image.className = 'skill-logo';
      image.dataset.logoKind = kind;
      image.src = `assets/icons/${icon}`;
      image.alt = '';
      image.loading = 'lazy';
      image.decoding = 'async';
      image.setAttribute('aria-hidden', 'true');

      mark.append(image);

      const label = document.createElement('span');
      label.className = 'skill-name';
      label.textContent = name;

      content.append(mark, label);
      item.append(content);
      return item;
    }));

    section.append(heading, skills);
    return section;
  }));
};

// Public module initializer called by main.js.
const initCapabilities = renderCapabilities;


// CONTACT FORM FEEDBACK
// Provides local validation and inline success feedback; submission is not sent to a server.
const setupContactForm = () => {
  const form = document.querySelector("[data-contact-form]");
  const status = document.querySelector("[data-contact-form-status]");
  if (!form || !status) return;

  // Keep native validation UI while preventing a page reload in this static portfolio.
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    form.reset();
    status.textContent = "✓ Viesti lähetetty. Kiitos viestistä!";
    status.classList.add("is-success");
  });

  // Clear stale confirmation as soon as the visitor starts a new message.
  form.addEventListener("input", () => {
    if (!status.textContent) return;
    status.textContent = "";
    status.classList.remove("is-success");
  });
};


// Public module initializer called by main.js.
const initContact = setupContactForm;

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
const initNavigation = () => {
  setupMobileNavigation();
  setupStickyHeader();
  setupBackToTop();
};



// PROJECT DATA
// Single source of truth for project content and display order. Empty optional fields stay hidden.
const projects = [
  {
    id: "mini-x",
    title: "Mini-X",
    type: "Full Stack Web Application",

    status: "Valmis",
    role: "Full Stack Kehittäjä",

    purpose:
     "Mini X on yhteisöllinen sisältö- ja Q&A-alusta, joka yhdistää keskustelut, kysymykset ja vastaukset sekä käyttäjäprofiilien personoinnin. Käyttäjät voivat julkaista sisältöä, osallistua keskusteluihin, vastata kysymyksiin, valita parhaan vastauksen sekä muokata profiilinsa ulkoasua ja musiikkia.",

    contribution:
      "Suunnittelin ja toteutin sovelluksen frontendin, backendin, tietokannan, autentikoinnin, profiilin personoinnin, Q&A-toiminnot, ilmoitukset ja Apple Music / iTunes API -integraation.",

    technologies: [
      "HTML",
      "CSS",
      "JavaScript",
      "PHP",
      "MySQL",
    ],

    image: "assets/kuva/minisome.png",
    alt: "Mini-X social media web application",

    demoUrl: "https://mini-x.infinityfree.io/",
    githubUrl: "https://github.com/AlexNtrx/mini-X",

    order: 1,
    visible: true,
  },
   {
    id: "ilmo",
    title: "Ilmo",
    type: "Full Stack Web Application",

    status: "Kehitteillä",
    role: "Full Stack Kehittäjä",

    purpose:
     "",

    contribution:
      "",

    technologies: [
      "Next.js",
      'Tailwind CSS',
      "TypeScript",
      "Prisma",
      "PostgreSQL",
    ],

    image: "assets/kuva/ilmo.png",
    alt: "Mini-X social media web application",

    demoUrl: "https://mini-x.infinityfree.io/",
    githubUrl: "https://github.com/AlexNtrx/mini-X",
    order: 2,
    visible: true,
  },
];
// PROJECT REEL CARDS
// Creates the lightweight, clickable image card shown in the horizontal reel.
const createProjectCard = (project, index) => {
  const article = document.createElement("article");
  article.className = "project-card";
  article.dataset.projectId = project.id;
  article.dataset.projectIndex = String(index);
  article.setAttribute("aria-label", project.title);

  const activate = document.createElement("button");
  activate.className = "project-card-activate";
  activate.type = "button";
  activate.dataset.projectActivate = String(index);
  activate.setAttribute("aria-label", `Näytä projekti: ${project.title}`);
  article.append(activate);

  const figure = document.createElement("figure");
  figure.className = "project-media";
  const image = document.createElement("img");
  image.src = project.image;
  image.alt = project.alt;
  image.loading = "lazy";
  image.decoding = "async";
  figure.append(image);
  article.append(figure);
  return article;
};

// Renders only projects marked visible, sorted by their editorial order.
const renderProjects = () => {
  const track = document.querySelector("[data-project-track]");
  if (!track) return;

  const visibleProjects = projects
    .filter((project) => project.visible)
    .sort((first, second) => first.order - second.order);

  track.replaceChildren(...visibleProjects.map(createProjectCard));
  return visibleProjects;
};

// Creates the decorative GitHub mark used by the project action.
const createGitHubIcon = () => {
  const icon = document.createElement("img");
  icon.className = "project-action-icon project-action-icon--github";
  icon.src = "assets/icons/github-original-wordmark.svg";
  icon.alt = "";
  icon.decoding = "async";
  icon.setAttribute("aria-hidden", "true");
  return icon;
};

// Technology icon registry used by the accessible project-detail visualization.
const technologyIcons = {
  HTML: { src: "assets/icons/html5-original-wordmark.svg", format: "mark" },
  CSS: { src: "assets/icons/css3-original-wordmark.svg", format: "mark" },
  JavaScript: { src: "assets/icons/javascript-original.svg", format: "mark" },
  Photoshop: { src: "assets/icons/photoshop-original.svg", format: "mark" },
  React: { src: "assets/icons/react-original-wordmark.svg", format: "wordmark" },
  "Next.js": { src: "assets/icons/nextjs-original-wordmark.svg", format: "wordmark", contrast: true },
  "Node.js": { src: "assets/icons/nodejs-original-wordmark.svg", format: "wordmark" },
  Express: { src: "assets/icons/express-original-wordmark.svg", format: "wordmark", contrast: true },
  PHP: { src: "assets/icons/php-original.svg", format: "wordmark" },
  Laravel: { src: "assets/icons/laravel-original-wordmark.svg", format: "wordmark" },
  Supabase: { src: "assets/icons/supabase-original-wordmark.svg", format: "wordmark" },
  PostgreSQL: { src: "assets/icons/postgresql-original-wordmark.svg", format: "wordmark" },
  MongoDB: { src: "assets/icons/mongodb-original-wordmark.svg", format: "wordmark" },
  Prisma: { src: "assets/icons/prisma-original-wordmark.svg", format: "wordmark", contrast: true },
  GitHub: { src: "assets/icons/github-original-wordmark.svg", format: "wordmark", contrast: true },
  Postman: { src: "assets/icons/postman-original-wordmark.svg", format: "wordmark" },
};

// PROJECT REEL
// Coordinates native horizontal scrolling, detail content, controls, and keyboard support.
const setupProjectReel = (visibleProjects) => {
  const reel = document.querySelector("[data-project-reel]");
  const track = document.querySelector("[data-project-track]");
  const previous = document.querySelector("[data-project-previous]");
  const next = document.querySelector("[data-project-next]");
  const counter = document.querySelector("[data-project-counter]");
  const status = document.querySelector("[data-project-status]");
  const detail = document.querySelector("[data-project-detail]");

  if (
    !reel ||
    !track ||
    !previous ||
    !next ||
    !counter ||
    !status ||
    !detail ||
    !visibleProjects.length
  )
    return;

  const cards = [...track.querySelectorAll(".project-card")];
  let activeIndex = 0;
  let settleTimer = null;
  let requestedTargetIndex = null;

  const detailLabel = detail.querySelector("[data-project-detail-label]");
  const detailTitle = detail.querySelector("[data-project-detail-title]");
  const detailType = detail.querySelector("[data-project-detail-type]");
  const detailDescription = detail.querySelector(
    "[data-project-detail-description]",
  );
  const detailTechnologies = detail.querySelector(
    "[data-project-detail-technologies]",
  );
  const detailContribution = detail.querySelector(
    "[data-project-detail-contribution]",
  );
  const detailMeta = detail.querySelector("[data-project-detail-meta]");
  const detailActions = detail.querySelector("[data-project-detail-actions]");
  const technologyCanvas = detailTechnologies.querySelector(
    "[data-technology-canvas]",
  );
  const technologyTextList = detailTechnologies.querySelector(
    "[data-technology-text-list]",
  );
  let renderedTechnologySignature = "";
  let technologyTransitionVersion = 0;

  // Reusable SVG factory for the technology visualization.
  const createSvgNode = (name, attributes = {}) => {
    const node = document.createElementNS(svgNamespace, name);
    Object.entries(attributes).forEach(([attribute, value]) =>
      node.setAttribute(attribute, String(value)),
    );
    return node;
  };

  // Rebuild the compact diagram only when this project's technologies change.
  const renderTechnologyVisualization = (technologies) => {
    const items = technologies || [];
    const signature = items.join("|");
    if (signature === renderedTechnologySignature) return;
    renderedTechnologySignature = signature;
    technologyTransitionVersion += 1;
    const transitionVersion = technologyTransitionVersion;

    // Use a stacked mobile diagram so labels remain readable at narrow widths.
    const build = () => {
      const compact = window.matchMedia("(max-width: 44rem)").matches;
      const columns = compact ? 1 : Math.min(items.length, 3);
      const rows = Math.max(1, Math.ceil(items.length / columns));
      const width = 360;
      const height = compact
        ? Math.max(74, items.length * 42 + 20)
        : Math.max(88, rows * 76 + 18);
      const svg = createSvgNode("svg", {
        class: "technology-diagram",
        viewBox: `0 0 ${width} ${height}`,
        "aria-hidden": "true",
        focusable: "false",
      });

      const positions = items.map((technology, index) => {
        const column = compact ? 0 : index % columns;
        const row = compact ? index : Math.floor(index / columns);
        return {
          technology,
          x: compact
            ? 24
            : columns === 1
              ? width / 2
              : 34 + column * ((width - 68) / (columns - 1)),
          y: compact ? 22 + row * 42 : 28 + row * 76,
          compact,
        };
      });

      positions.slice(1).forEach((position, index) => {
        const previous = positions[index];
        svg.append(
          createSvgNode("line", {
            class: "technology-connector",
            x1: previous.x,
            y1: previous.y,
            x2: position.x,
            y2: position.y,
          }),
        );
      });

        positions.forEach((position, index) => {
          const group = createSvgNode("g", {
            class: "technology-node",
            style: `--technology-delay: ${index * 35}ms`,
          });
          const icon = technologyIcons[position.technology];
          if (icon) {
            const isWordmark = icon.format === "wordmark";
            const iconWidth = isWordmark ? 26 : 20;
            const iconHeight = isWordmark ? 14 : 20;
            group.append(
              createSvgNode("image", {
                class: `technology-node-logo${icon.contrast ? " technology-node-logo--contrast" : ""}`,
                href: icon.src,
                x: position.x - iconWidth / 2,
                y: position.y - iconHeight / 2,
                width: iconWidth,
                height: iconHeight,
                preserveAspectRatio: "xMidYMid meet",
                "aria-hidden": "true",
              }),
            );
          } else {
            const fallback = createSvgNode("text", {
              class: "technology-node-fallback",
              x: position.x,
              y: position.y + 3.5,
              "text-anchor": "middle",
            });
            fallback.textContent = position.technology.slice(0, 2).toUpperCase();
            group.append(fallback);
          }
        const label = createSvgNode("text", {
          class: "technology-node-label",
          x: position.compact ? position.x + 20 : position.x,
          y: position.compact ? position.y + 4 : position.y + 27,
          "text-anchor": position.compact ? "start" : "middle",
        });
        label.textContent = position.technology;
        group.append(label);
        svg.append(group);
      });

      technologyCanvas.replaceChildren(svg);
      technologyTextList.replaceChildren(
        ...items.map((technology) => {
          const item = document.createElement("li");
          item.textContent = technology;
          return item;
        }),
      );
      detailTechnologies.hidden = items.length === 0;
    };

    if (prefersReducedMotion() || !technologyCanvas.children.length) {
      build();
      if (!prefersReducedMotion()) {
        technologyCanvas.classList.add("is-entering");
        window.requestAnimationFrame(() =>
          technologyCanvas.classList.remove("is-entering"),
        );
      }
      return;
    }

    technologyCanvas.classList.add("is-exiting");
    window.setTimeout(() => {
      if (transitionVersion !== technologyTransitionVersion) return;
      build();
      technologyCanvas.classList.remove("is-exiting");
      technologyCanvas.classList.add("is-entering");
      window.requestAnimationFrame(() =>
        technologyCanvas.classList.remove("is-entering"),
      );
    }, 120);
  };

  // Shared geometry keeps snap alignment and end spacing based on live layout measurements.
  const getReelGeometry = () => {
    const reelRect = track.getBoundingClientRect();
    const trackStyle = window.getComputedStyle(track);
    const scrollPaddingStart =
      Number.parseFloat(trackStyle.scrollPaddingInlineStart) ||
      Number.parseFloat(trackStyle.paddingInlineStart) ||
      0;

    return {
      reelRect,
      trackStyle,
      scrollPaddingStart,
      activeAnchor: reelRect.left + scrollPaddingStart,
      maxScrollLeft: Math.max(0, track.scrollWidth - track.clientWidth),
    };
  };

  // Convert a card's viewport position into the horizontal scroll destination.
  const getTargetScrollLeft = (card) => {
    const { activeAnchor, maxScrollLeft } = getReelGeometry();
    const cardRect = card.getBoundingClientRect();
    const reelRelativeTarget =
      track.scrollLeft + (cardRect.left - activeAnchor);
    return Math.max(0, Math.min(reelRelativeTarget, maxScrollLeft));
  };

  // Reserve just enough trailing space for the last card to reach the active anchor.
  const syncReelEndSpace = () => {
    const { scrollPaddingStart } = getReelGeometry();
    const lastCardWidth = cards.at(-1)?.getBoundingClientRect().width || 0;
    const requiredEndSpace = Math.max(
      scrollPaddingStart,
      track.clientWidth - scrollPaddingStart - lastCardWidth,
    );
    track.style.setProperty("--b2-end-space", `${requiredEndSpace}px`);
  };

  // PROJECT DETAIL
  // Updates copy, technologies, metadata, and actions while preserving action focus.
  const renderProjectDetail = (project, index) => {
    const focusedAction = detailActions.contains(document.activeElement)
      ? document.activeElement.dataset.detailAction
      : null;
    detailLabel.textContent = `${String(index + 1).padStart(2, "0")} / projekti`;
    detailTitle.textContent = project.title;
    detailType.textContent = project.type || "";
    detailType.hidden = !project.type;
    detailDescription.textContent =
      project.purpose || project.description || "";
    detailDescription.hidden = !(project.purpose || project.description);
    detailContribution.textContent = project.contribution || "";
    detailContribution.hidden = !project.contribution;

    renderTechnologyVisualization(project.technologies);

    detailMeta.replaceChildren();
    [
      ["Rooli", project.role],
      ["Tila", project.status],
    ].forEach(([label, value]) => {
      if (!value) return;
      const term = document.createElement("dt");
      term.textContent = label;
      const definition = document.createElement("dd");
      definition.textContent = value;
      detailMeta.append(term, definition);
    });
    detailMeta.hidden = !detailMeta.children.length;
    detailActions.replaceChildren();
    detailActions.hidden = !project.demoUrl && !project.githubUrl;

    if (project.demoUrl) {
      const link = document.createElement("a");
      link.href = project.demoUrl;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.textContent = "Avaa sivusto";
      link.dataset.detailAction = "demoUrl";
      detailActions.append(link);
    }

    if (project.githubUrl) {
      const githubAction = document.createElement("a");
      githubAction.dataset.detailAction = "githubUrl";
      githubAction.append(createGitHubIcon(), document.createTextNode("GitHub"));
      githubAction.href = project.githubUrl;
      githubAction.target = "_blank";
      githubAction.rel = "noopener noreferrer";
      detailActions.append(githubAction);
    }

    if (focusedAction) {
      detailActions
        .querySelector(`[data-detail-action="${focusedAction}"]`)
        ?.focus();
    }
  };

  // Find the card closest to the visual snap anchor after native scrolling settles.
  const getAnchoredIndex = () => {
    const { activeAnchor } = getReelGeometry();
    return cards.reduce((closest, card, index) => {
      const currentDistance = Math.abs(
        card.getBoundingClientRect().left - activeAnchor,
      );
      const closestDistance = Math.abs(
        cards[closest].getBoundingClientRect().left - activeAnchor,
      );
      return currentDistance < closestDistance ? index : closest;
    }, 0);
  };

  // This is the only path that changes active project UI. It runs only after
  // the native reel has settled on the card closest to its snap anchor.
  const setActiveProject = (nextIndex, announce = false) => {
    activeIndex = nextIndex;
    const activeProject = visibleProjects[activeIndex];

    cards.forEach((card, index) => {
      const isActive = index === activeIndex;
      card.dataset.active = String(isActive);
      const activate = card.querySelector("[data-project-activate]");
      if (isActive) {
        activate.setAttribute("aria-current", "true");
      } else {
        activate.removeAttribute("aria-current");
      }
    });

    renderProjectDetail(activeProject, activeIndex);
    counter.textContent = `${String(activeIndex + 1).padStart(2, "0")} / ${String(cards.length).padStart(2, "0")}`;
    previous.disabled = activeIndex === 0;
    next.disabled = activeIndex === cards.length - 1;

    if (announce) {
      status.textContent = `Projekti ${activeIndex + 1} / ${cards.length}: ${activeProject.title}.`;
    }
  };

  // Commit active UI only after scrolling has settled on a card.
  const resolveSettledProject = () => {
    window.clearTimeout(settleTimer);
    const detectedIndex = getAnchoredIndex();
    if (detectedIndex !== activeIndex) {
      setActiveProject(detectedIndex, true);
    }
    requestedTargetIndex = null;
  };

  // Fallback debounce for browsers that do not support the scrollend event.
  const scheduleSettledProject = () => {
    window.clearTimeout(settleTimer);
    settleTimer = window.setTimeout(resolveSettledProject, 140);
  };

  // Scroll to a clamped project index; reduced-motion users skip smooth scrolling.
  const scrollToProject = (
    index,
    behavior = prefersReducedMotion() ? "auto" : "smooth",
  ) => {
    const targetIndex = Math.max(0, Math.min(index, cards.length - 1));
    const target = cards[targetIndex];
    const targetScrollLeft = getTargetScrollLeft(target);
    requestedTargetIndex = targetIndex;
    track.scrollTo({
      left: targetScrollLeft,
      behavior,
    });
  };

  // Prefer native scrollend, with a passive-scroll fallback for wider browser support.
  if ("onscrollend" in track) {
    track.addEventListener("scrollend", resolveSettledProject);
  } else {
    track.addEventListener("scroll", scheduleSettledProject, { passive: true });
  }

  // Button, pointer-card, and Arrow-key controls all use the same scroll path.
  previous.addEventListener("click", () => scrollToProject(activeIndex - 1));
  next.addEventListener("click", () => scrollToProject(activeIndex + 1));

  track.addEventListener("click", (event) => {
    const activate = event.target.closest("[data-project-activate]");
    if (!activate) return;
    scrollToProject(Number(activate.dataset.projectActivate));
  });

  track.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      scrollToProject(activeIndex - 1);
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      scrollToProject(activeIndex + 1);
    }
  });

  // Re-anchor the active card after responsive layout measurements change.
  let resizeFrame = null;
  window.addEventListener("resize", () => {
    if (resizeFrame) window.cancelAnimationFrame(resizeFrame);
    resizeFrame = window.requestAnimationFrame(() => {
      syncReelEndSpace();
      scrollToProject(activeIndex, "auto");
      scheduleSettledProject();
      resizeFrame = null;
    });
  });

  syncReelEndSpace();
  setActiveProject(getAnchoredIndex());
};


// Public module initializer called by main.js.
const initProjects = () => {
  setupProjectReel(renderProjects());
};


let initialized = false;
function bootstrap() {
  if (initialized) return;
  initialized = true;
  initNavigation();
  initHeroAnimation();
  initCapabilities();
  initProjects();
  initScrollAnimations();
  initContact();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootstrap);
} else {
  bootstrap();
}
})();
