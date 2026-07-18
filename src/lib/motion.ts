// Shared framer-motion spring/easing tokens so motion feels consistent across the app
export const springSnappy = { type: "spring", stiffness: 260, damping: 24 } as const;
export const springSoft = { type: "spring", stiffness: 120, damping: 20 } as const;
export const easeOutExpo = [0.16, 1, 0.3, 1] as const;

// Standard scroll-triggered reveal: fades and lifts into place once ~20% is in view, plays once
export const revealOnScroll = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.5, ease: easeOutExpo },
} as const;
