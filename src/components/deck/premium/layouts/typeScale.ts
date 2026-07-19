import type { LayoutType } from "../../../../types/slide";

// Apple-keynote-style type scale — every size hits the spec's literal pixel minimum (title ≥52px
// desktop / 36px mobile, bullets ≥22px desktop / 18px mobile, stat ≥96px). These are body-copy
// sizes; small decorative chrome (kicker labels, footer index, chart tick labels) intentionally
// sits below the 18px floor since it isn't content a viewer is meant to read closely.
export const SLIDE_PADDING = "p-8 md:p-16";
export const TITLE_CLASS = "text-5xl md:text-6xl font-black leading-tight tracking-tight";
export const BULLET_CLASS = "text-xl md:text-2xl font-medium leading-relaxed";
export const STAT_CLASS = "text-8xl md:text-9xl font-black";
export const LABEL_CLASS = "text-sm font-semibold uppercase tracking-widest";
export const HERO_TITLE_CLASS = "text-7xl font-black leading-tight tracking-tight";
export const HERO_STAT_CLASS = "text-9xl font-black";

// Small kicker shown above each layout's title, naming the slide's role in Apple-keynote style
export const LAYOUT_LABELS: Record<LayoutType, string> = {
  hero: "Overview",
  problem: "The Problem",
  solution: "The Solution",
  split: "At A Glance",
  chart: "By The Numbers",
  competitor_radar: "Competitive Landscape",
};
