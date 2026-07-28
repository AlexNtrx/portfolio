import { svgNamespace } from "./utils.js";

// SKILLS DATA
// Keep groups, ordering, icons, and factual relationships here instead of in markup.
const capabilityGroups = [
  {
    id: 'foundations',
    title: 'Verkkokehityksen perusteet ja käyttöliittymät',
    relationships: [
      ['html', 'css'],
      ['css', 'javascript'],
      ['css', 'bootstrap'],
      ['css', 'tailwind'],
      ['javascript', 'react'],
      ['react', 'nextjs']
    ],
    skills: [
      ['html', 'HTML', 'html5-original-wordmark.svg', 'wordmark'],
      ['css', 'CSS', 'css3-original-wordmark.svg', 'wordmark'],
      ['javascript', 'JavaScript', 'javascript-original.svg', 'mark'],
      ['bootstrap', 'Bootstrap', 'bootstrap-original-wordmark.svg', 'wordmark'],
      ['tailwind', 'Tailwind CSS', 'tailwindcss-original-wordmark.svg', 'wordmark'],
      ['react', 'React', 'react-original-wordmark.svg', 'wordmark'],
      ['nextjs', 'Next.js', 'nextjs-original-wordmark.svg', 'wordmark']
    ]
  },
  {
    id: 'services',
    title: 'Ohjelmistokehykset ja palvelut',
    relationships: [
      ['nodejs', 'express'],
      ['php', 'laravel']
    ],
    skills: [
      ['nodejs', 'Node.js', 'nodejs-original-wordmark.svg', 'wordmark'],
      ['express', 'Express', 'express-original-wordmark.svg', 'wordmark'],
      ['php', 'PHP', 'php-original.svg', 'wordmark'],
      ['laravel', 'Laravel', 'laravel-original-wordmark.svg', 'wordmark'],
      ['supabase', 'Supabase', 'supabase-original-wordmark.svg', 'wordmark']
    ]
  },
  {
    id: 'data',
    showConnectors: false,
    title: 'Data ja kehitystyökalut',
    relationships: [
      ['postgresql', 'prisma'],
      ['mongodb', 'prisma']
    ],
    skills: [
      ['postgresql', 'PostgreSQL', 'postgresql-original-wordmark.svg', 'wordmark'],
      ['mongodb', 'MongoDB', 'mongodb-original-wordmark.svg', 'wordmark'],
      ['prisma', 'Prisma', 'prisma-original-wordmark.svg', 'wordmark'],
      ['github', 'GitHub', 'github-original-wordmark.svg', 'wordmark'],
      ['postman', 'Postman', 'postman-original-wordmark.svg', 'wordmark']
    ]
  },
  {
    id: 'creative',
    displayTitle: 'Muut työkalut',
    title: 'Muotoilu, sisältö ja viestintä',
    relationships: [],
    skills: [
      ['figma', 'Figma', 'figma-original.svg', 'mark'],
      ['photoshop', 'Adobe Photoshop', 'photoshop-original.svg', 'mark'],
      ['canva', 'Canva', 'canva-original.svg', 'mark'],
      ['word', 'Microsoft Word', 'microsoft-word-2013-logo-logo-svgrepo-com.svg', 'office'],
      ['excel', 'Microsoft Excel', 'microsoft-excel-2013-logo-svgrepo-com.svg', 'office'],
      ['powerpoint', 'Microsoft PowerPoint', 'microsoft-powerpoint-2013-logo-svgrepo-com.svg', 'office']
    ]
  }
];

// Connector stages are stored after rendering so geometry can be refreshed on resize.
const capabilityConnectorMaps = [];
let capabilityConnectorFrame = 0;

// CONNECTOR GEOMETRY
// Draw relationship lines from rendered node positions, not hard-coded coordinates.
const syncCapabilityConnectors = () => {
  capabilityConnectorMaps.forEach(({ stage, svg, relationships }) => {
    const stageBounds = stage.getBoundingClientRect();
    if (!stageBounds.width || !stageBounds.height) return;

    svg.setAttribute('viewBox', `0 0 ${stageBounds.width} ${stageBounds.height}`);
    svg.replaceChildren(...relationships.map(([from, to]) => {
      const source = stage.querySelector(`[data-skill-id="${from}"] .skill-node-content`);
      const target = stage.querySelector(`[data-skill-id="${to}"] .skill-node-content`);
      if (!source || !target) return null;
      const sourceBounds = source.getBoundingClientRect();
      const targetBounds = target.getBoundingClientRect();
      const x1 = sourceBounds.left - stageBounds.left + sourceBounds.width / 2;
      const y1 = sourceBounds.top - stageBounds.top + sourceBounds.height / 2;
      const x2 = targetBounds.left - stageBounds.left + targetBounds.width / 2;
      const y2 = targetBounds.top - stageBounds.top + targetBounds.height / 2;
      const sourceCenterY = sourceBounds.top - stageBounds.top + sourceBounds.height / 2;
      const targetCenterY = targetBounds.top - stageBounds.top + targetBounds.height / 2;
      const targetContainsSourceY = targetBounds.top - stageBounds.top <= sourceCenterY
        && targetBounds.bottom - stageBounds.top >= sourceCenterY;
      const horizontal = Math.abs(sourceCenterY - targetCenterY) < 6 || targetContainsSourceY;
      const directionX = x2 >= x1 ? 1 : -1;
      const directionY = y2 >= y1 ? 1 : -1;
      const startX = horizontal ? x1 + (sourceBounds.width / 2 * directionX) : x1;
      const startY = horizontal ? sourceCenterY : y1 + (sourceBounds.height / 2 * directionY);
      const endX = horizontal ? x2 - (targetBounds.width / 2 * directionX) : x2;
      const endY = horizontal ? sourceCenterY : y2 - (targetBounds.height / 2 * directionY);
      const midY = startY + (endY - startY) / 2;
      const points = horizontal
        ? `${startX},${startY} ${endX},${endY}`
        : `${startX},${startY} ${startX},${midY} ${endX},${midY} ${endX},${endY}`;
      const line = document.createElementNS(svgNamespace, 'polyline');
      const length = horizontal
        ? Math.abs(endX - startX)
        : Math.abs(midY - startY) + Math.abs(endX - startX) + Math.abs(endY - midY);
      line.dataset.from = from;
      line.dataset.to = to;
      line.style.setProperty('--connector-length', String(length));
      line.setAttribute('points', points);
      return line;
    }).filter(Boolean));
  });
};

// Batch resize-driven connector redraws into one animation frame.
const queueCapabilityConnectorSync = () => {
  if (capabilityConnectorFrame) return;
  capabilityConnectorFrame = window.requestAnimationFrame(() => {
    capabilityConnectorFrame = 0;
    syncCapabilityConnectors();
  });
};

// SKILLS RENDERER
// Creates accessible skill groups, lazy-loaded icons, and optional relationship connectors.
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
    const number = document.createElement('span');
    number.className = 'capability-number';
    number.textContent = String(groupIndex + 1).padStart(2, '0');
    heading.append(number, document.createTextNode(group.displayTitle || group.title));

    const stage = document.createElement('div');
    stage.className = 'capability-cluster';
    const connectors = document.createElementNS(svgNamespace, 'svg');
    connectors.classList.add('capability-connectors');
    connectors.setAttribute('aria-hidden', 'true');
    connectors.setAttribute('focusable', 'false');
    const skills = document.createElement('ul');
    skills.className = 'skill-list';
    skills.append(...group.skills.map(([id, name, icon, kind], skillIndex) => {
      const item = document.createElement('li');
      item.className = 'skill-node';
      item.dataset.skillId = id;
      item.style.gridArea = id;
      item.tabIndex = 0;
      item.style.setProperty('--node-delay', `${skillIndex * 52}ms`);
      const relatedNames = group.relationships
        .filter(([from, to]) => from === id || to === id)
        .flatMap(([from, to]) => group.skills
          .filter(([skillId]) => skillId === (from === id ? to : from))
          .map(([, skillName]) => skillName));
      if (relatedNames.length) {
        item.setAttribute('aria-label', `${name}. Liittyvät teknologiat: ${relatedNames.join(', ')}.`);
      }
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

    stage.append(connectors, skills);
    section.append(heading, stage);
    capabilityConnectorMaps.push({
      stage,
      svg: connectors,
      relationships: group.showConnectors === false ? [] : group.relationships,
    });

    // Highlight only relationships for the hovered or keyboard-focused skill.
    const setRelatedConnectors = (id = '') => {
      connectors.querySelectorAll('polyline').forEach((line) => {
        line.classList.toggle('is-related', line.dataset.from === id || line.dataset.to === id);
      });
    };
    // Pointer and keyboard handlers share the same connector highlighting behavior.
    stage.addEventListener('pointerover', (event) => {
      const node = event.target.closest('.skill-node');
      if (node) setRelatedConnectors(node.dataset.skillId);
    });
    stage.addEventListener('pointerout', (event) => {
      if (!event.relatedTarget?.closest('.skill-node')) setRelatedConnectors();
    });
    stage.addEventListener('focusin', (event) => {
      const node = event.target.closest('.skill-node');
      if (node) setRelatedConnectors(node.dataset.skillId);
    });
    stage.addEventListener('focusout', () => setRelatedConnectors());
    return section;
  }));

  queueCapabilityConnectorSync();
  window.addEventListener('resize', queueCapabilityConnectorSync, { passive: true });
};


// Public module initializer called by main.js.
export const initCapabilities = renderCapabilities;
