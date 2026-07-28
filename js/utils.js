// Shared accessibility preference used to disable optional motion.
export const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Shared namespace required when JavaScript creates SVG elements.
export const svgNamespace = "http://www.w3.org/2000/svg";
