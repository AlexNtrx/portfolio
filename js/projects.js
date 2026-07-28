import { prefersReducedMotion, svgNamespace } from "./utils.js";

// PROJECT DATA
// Single source of truth for project content and display order. Empty optional fields stay hidden.
const projects = [
  {
    id: "taloushallinto",
    title: "Taloushallinto",
    type: "Verkkosovellus",
    status: null,
    role: null,
    purpose: "Verkkosovellus henkilökohtaisen talouden suunnitteluun ja taloustiedon tarkasteluun.",
    description: null,
    contribution: null,
    technologies: ["HTML", "CSS", "JavaScript"],
    image: "https://i.postimg.cc/qRHpHMyd/project-1.jpg",
    alt: "Taloushallinnon hallintapaneeli",
    demoUrl: "https://taloushalinto.onrender.com/",
    githubUrl: "",
    order: 3,
    visible: true,
  },
  {
    id: "kiinteisto",
    title: "Kiinteistö",
    type: "Kiinteistösivusto",
    status: null,
    role: null,
    purpose: "Kiinteistösivusto asuntojen selaamiseen ja myynti-ilmoitusten esittelyyn.",
    description: null,
    contribution: null,
    technologies: ["HTML", "CSS", "JavaScript"],
    image: "https://i.postimg.cc/jSJVqYsq/project-3.jpg",
    alt: "Kiinteistö-sivusto",
    demoUrl: "https://kiinteist-sivusto.onrender.com/",
    githubUrl: "",
    order: 4,
    visible: true,
  },
  {
    id: "nanas-thai-food-menu",
    title: "Nana’s Thai Food Menu",
    type: "Ruokalistasivusto",
    status: null,
    role: null,
    purpose: "Ravintolan ruokalistasivu, joka esittelee annokset ja niiden ainesosat allergiatietoa varten.",
    description: null,
    contribution: null,
    technologies: ["HTML", "CSS", "JavaScript", "Photoshop", "AI"],
    image: "assets/kuva/ruokalista.png",
    alt: "Nana’s Thai Food -ruokalista",
    demoUrl: "https://nanas-thai-food.onrender.com/menuPage.html",
    githubUrl: "",
    order: 2,
    visible: true,
  },
  {
    id: "nanas-thai-food-restaurant",
    title: "Nana’s Thai Food Restaurant",
    type: "Ravintolasivusto",
    status: null,
    role: null,
    purpose: "Ravintolasivusto pöytävarauksen ja ruokalistan tarkasteluun.",
    description: null,
    contribution: null,
    technologies: ["HTML", "CSS", "JavaScript"],
    image: "assets/kuva/ravintola.png",
    alt: "Nana’s Thai Food -ravintolasivusto",
    demoUrl: "https://nanas-thai-food.onrender.com",
    githubUrl: "",
    order: 1,
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
  const debugB2 = new URLSearchParams(window.location.search).has("b2debug");

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

  // Optional diagnostics are available only with the b2debug query parameter.
  const getGeometryDiagnostics = () => {
    const { trackStyle, activeAnchor, maxScrollLeft, scrollPaddingStart } =
      getReelGeometry();

    return {
      activeIndex,
      activeProjectId: visibleProjects[activeIndex]?.id,
      requestedTargetIndex,
      scrollLeft: track.scrollLeft,
      clientWidth: track.clientWidth,
      scrollWidth: track.scrollWidth,
      maxScrollLeft,
      activeAnchor,
      gap: trackStyle.columnGap,
      scrollSnapType: trackStyle.scrollSnapType,
      scrollPaddingInlineStart: scrollPaddingStart,
      cards: cards.map((card, index) => {
        const style = window.getComputedStyle(card);
        const rect = card.getBoundingClientRect();
        return {
          index,
          projectId: card.dataset.projectId,
          offsetLeft: card.offsetLeft,
          offsetWidth: card.offsetWidth,
          visualLeft: rect.left,
          visualWidth: rect.width,
          scrollSnapAlign: style.scrollSnapAlign,
          scrollMarginInlineStart: style.scrollMarginInlineStart,
          transform: style.transform,
        };
      }),
    };
  };

  // Keep development diagnostics out of normal visitor console output.
  const logGeometry = (event, extra = {}) => {
    if (!debugB2) return;
    const diagnostics = { event, ...extra, ...getGeometryDiagnostics() };
    console.groupCollapsed(`[B2] ${event}`);
    console.log(diagnostics);
    console.table(diagnostics.cards);
    console.groupEnd();
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
    detailActions.hidden = !project.demoUrl;

    if (project.demoUrl) {
      const link = document.createElement("a");
      link.href = project.demoUrl;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.textContent = "Avaa demo";
      link.dataset.detailAction = "demoUrl";
      detailActions.append(link);
    }

    const githubAction = project.githubUrl
      ? document.createElement("a")
      : document.createElement("button");
    githubAction.dataset.detailAction = "githubUrl";
    githubAction.append(createGitHubIcon(), document.createTextNode("GitHub"));

    if (project.githubUrl) {
      githubAction.href = project.githubUrl;
      githubAction.target = "_blank";
      githubAction.rel = "noopener noreferrer";
    } else {
      githubAction.type = "button";
      githubAction.disabled = true;
      githubAction.title = "GitHub-linkki lisätään myöhemmin";
    }
    detailActions.append(githubAction);

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

    logGeometry("commit", {
      committedIndex: activeIndex,
      committedProjectId: activeProject.id,
    });
  };

  // Commit active UI only after scrolling has settled on a card.
  const resolveSettledProject = () => {
    window.clearTimeout(settleTimer);
    const detectedIndex = getAnchoredIndex();
    logGeometry("settled", {
      detectedIndex,
      detectedProjectId: visibleProjects[detectedIndex]?.id,
    });
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
    logGeometry("request", {
      targetIndex,
      targetProjectId: visibleProjects[targetIndex]?.id,
      targetScrollLeft,
    });
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

  if (debugB2) {
    window.__b2Diagnostics = getGeometryDiagnostics;
    logGeometry("initial");
  }
};


// Public module initializer called by main.js.
export const initProjects = () => {
  setupProjectReel(renderProjects());
};
