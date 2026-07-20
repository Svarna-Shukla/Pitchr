import type { LayoutType } from "../../../../types/slide";

// Apple-keynote-style type scale, fixed relative to the 1920x1080 reference canvas every slide
// renders at (see SlideViewport) — no responsive md:/vw/vh variants here. The canvas itself is
// uniformly scaled up or down to fit whatever real box it lands in (grid thumbnail, fullscreen
// Present Mode, PDF export), so a single fixed size here already renders at the right *relative*
// size everywhere; adding a breakpoint would only reintroduce the preview/present drift this fixes.
export const SLIDE_PADDING = "p-16";
export const TITLE_CLASS = "text-6xl font-black leading-tight tracking-tight";
// Bumped from text-2xl to text-4xl (36px @ the 1920x1080 reference canvas) with bold weight for
// scannability at presentation distance — this is the single constant SlideBullets and every
// layout's bullet rendering shares, so the increase is deck-wide from this one line.
export const BULLET_CLASS = "text-4xl font-bold leading-relaxed";
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
  narrative_quote: "In Their Words",
  chart: "By The Numbers",
  metric_callout: "The Headline Number",
  competitor_radar: "Competitive Landscape",
};
