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
      ['bootstrap', 'Bootstrap', 'bootstrap-original-wordmark.svg', 'wordmark']
    ]
  },
  {
    id: 'services',
    title: 'Ohjelmistokehykset ja palvelut',
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
    title: 'Data ja kehitystyökalut',
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
export const initCapabilities = renderCapabilities;

