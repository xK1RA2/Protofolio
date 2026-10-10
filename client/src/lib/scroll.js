import { gsap } from "./gsap";

// Smooth-scroll to a "#hash" (or "#top"). Jumps instantly for reduced-motion users.
export function scrollToHash(hash) {
  const target = hash === "#top" ? 0 : hash;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const el = target === 0 ? null : document.querySelector(target);
    window.scrollTo(0, el ? el.getBoundingClientRect().top + window.scrollY : 0);
    return;
  }

  gsap.to(window, { duration: 1.2, ease: "power3.inOut", scrollTo: { y: target, offsetY: 0 } });
}
