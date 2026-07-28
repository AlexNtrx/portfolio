import { prefersReducedMotion } from "./utils.js";

// PROFILE AVATAR
// Handles the timed portrait-to-avatar transformation and its accessible state.
const setupProfileTransformation = () => {
  const toggle = document.querySelector("[data-profile-toggle]");
  if (!toggle) return;

  const card = toggle.querySelector(".profile-card");
  const initialDelay = 500;
  const flipDuration = 500;
  const avatarHold = 5000;
  let state = "real";
  let sequenceRunning = false;

  // Keep visual state, control labels, and pressed state synchronized.
  const updatePresentation = (nextState) => {
    const avatarVisible =
      nextState === "avatar" ||
      (nextState === "flipping" && toggle.dataset.avatarTarget === "avatar");
    toggle.dataset.profileState = nextState;
    toggle.dataset.avatarVisible = String(avatarVisible);
    toggle.setAttribute("aria-pressed", String(avatarVisible));
    toggle.setAttribute(
      "aria-label",
      avatarVisible
        ? "Näytä Nithitorn Kaosa-ardin oikea muotokuva"
        : "Näytä Nithitorn Kaosa-ardin AI-avatar",
    );
    toggle.title = avatarVisible ? "Näytä oikea muotokuva" : "Näytä AI-avatar";
  };

  // Small promise helper used to sequence the profile transformation.
  const wait = (duration) =>
    new Promise((resolve) => window.setTimeout(resolve, duration));

  // Resolve on transition end, with a timeout fallback for interrupted transitions.
  const flipTo = (target) =>
    new Promise((resolve) => {
      state = "flipping";
      toggle.dataset.avatarTarget = target;
      updatePresentation(state);

      const finish = () => {
        state = target;
        delete toggle.dataset.avatarTarget;
        updatePresentation(state);
        resolve();
      };

      if (prefersReducedMotion()) {
        window.setTimeout(finish, 160);
        return;
      }

      let settled = false;
      const settle = () => {
        if (settled) return;
        settled = true;
        card.removeEventListener("transitionend", onTransformEnd);
        finish();
      };
      const onTransformEnd = (event) => {
        if (event.target === card && event.propertyName === "transform")
          settle();
      };

      card.addEventListener("transitionend", onTransformEnd);
      window.setTimeout(settle, flipDuration + 150);
    });

  // Prevent overlapping sequences from repeated clicks or focus events.
  const runSequence = async ({ delay = 0 } = {}) => {
    if (sequenceRunning) return;
    sequenceRunning = true;
    if (delay) await wait(delay);
    await flipTo("avatar");
    await wait(avatarHold);
    await flipTo("real");
    sequenceRunning = false;
  };

  updatePresentation(state);

  if (!prefersReducedMotion()) runSequence({ delay: initialDelay });

  toggle.addEventListener("click", () => runSequence());
  toggle.addEventListener("focus", () => {
    if (toggle.matches(":focus-visible")) runSequence();
  });
};


// CONTACT CHIBI VIDEO
// Plays the decorative bow once on entry and again only after the section is left.
const setupContactAvatarPlayback = () => {
  const section = document.querySelector(".contact-section");
  const video = document.querySelector(".contact-avatar video");
  if (!section || !video) return;

  video.pause();
  video.loop = false;

  if (prefersReducedMotion()) return;

  // Start at frame zero so each permitted viewport entry has a complete bow.
  const playFromStart = () => {
    video.currentTime = 0;
    video.play().catch(() => {});
  };

  if (!("IntersectionObserver" in window)) {
    playFromStart();
    return;
  }

  let hasPlayed = false;
  let hasClearlyLeft = false;
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (!hasPlayed || hasClearlyLeft) {
            playFromStart();
            hasPlayed = true;
            hasClearlyLeft = false;
          }
          return;
        }

        if (hasPlayed) {
          hasClearlyLeft = true;
          video.pause();
        }
      });
    },
    {
      threshold: 0.15,
      rootMargin: "-10% 0px -10% 0px",
    },
  );

  observer.observe(section);
};


// Public initializers called by main.js.
export const initProfileAvatar = setupProfileTransformation;
export const initContactAvatar = setupContactAvatarPlayback;
