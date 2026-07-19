import type { SlideContext } from "../PremiumSlide";

// Fullscreen/PDF sizes hit the design spec's literal pixel minimums (title ≥36px, bullets 18px,
// hero title ≥64px, hero stat ≥80px); grid sizes are scaled down to fit the 560px browsing card
export const TITLE_CLASS: Record<SlideContext, string> = { grid: "text-xl", fullscreen: "text-4xl md:text-5xl", pdf: "text-5xl" };
export const BULLET_CLASS: Record<SlideContext, string> = { grid: "text-[13px]", fullscreen: "text-lg", pdf: "text-lg" };
export const HERO_TITLE_CLASS: Record<SlideContext, string> = { grid: "text-2xl", fullscreen: "text-6xl md:text-7xl", pdf: "text-7xl" };
export const HERO_STAT_CLASS: Record<SlideContext, string> = { grid: "text-3xl", fullscreen: "text-7xl md:text-8xl", pdf: "text-8xl" };
export const PADDING_CLASS: Record<SlideContext, string> = { grid: "gap-3", fullscreen: "gap-6", pdf: "gap-6" };
