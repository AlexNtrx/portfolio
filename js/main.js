// Application entry point. Keep initialization order aligned with page layout.
import {
  initHeroAnimation,
  initScrollAnimations,
} from "./animations.js";
import { initCapabilities } from "./capabilities.js";
import { initContact } from "./contact.js";
import { initNavigation } from "./navigation.js";
import { initProjects } from "./projects.js";

// Initialize self-contained site features after the module is loaded at page end.
initNavigation();
initHeroAnimation();
initCapabilities();
initProjects();
initScrollAnimations();
initContact();
