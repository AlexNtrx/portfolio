import { prefersReducedMotion } from "./utils.js";

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
export const initHeroAnimation = setupHeroTyping;
export const initScrollAnimations = setupScrollMotion;
