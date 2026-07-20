import type { LayoutType } from "../../../../types/slide";

// Apple-keynote-style type scale, fixed relative to the 1920x1080 reference canvas every slide
// renders at (see SlideViewport) — no responsive md:/vw/vh variants here. The canvas itself is
// uniformly scaled up or down to fit whatever real box it lands in (grid thumbnail, fullscreen
// Present Mode, PDF export), so a single fixed size here already renders at the right *relative*
// size everywhere; adding a breakpoint would only reintroduce the preview/present drift this fixes.
export const SLIDE_PADDING = "p-16";
export const TITLE_CLASS = "text-6xl font-black leading-tight tracking-tight";
export const BULLET_CLASS = "text-2xl font-medium leading-relaxed";
export const STAT_CLASS = "text-9xl font-black";
export const LABEL_CLASS = "text-sm font-semibold uppercase tracking-widest";
export const HERO_TITLE_CLASS = "text-7xl font-black leading-tight tracking-tight";
export const HERO_STAT_CLASS = "text-9xl font-black";

// Small kicker shown above each layout's title, naming the slide's role in Apple-keynote style
export const LAYOUT_LABELS: Record<LayoutType, string> = {
  hero: "Overview",
  hero_split: "Vision",
  hero_minimal: "The Idea",
  problem: "The Problem",
  solution: "The Solution",
  split: "At A Glance",
  value_props: "What We Offer",
  timeline: "The Roadmap",
  chart: "By The Numbers",
  competitor_radar: "Competitive Landscape",
};
