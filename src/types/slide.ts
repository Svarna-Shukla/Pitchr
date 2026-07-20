// The visual treatments a slide can use — chosen by the deck generator per slide's content.
// hero/hero_split/hero_minimal and value_props/timeline are qualitative — no chart or stat
// required — while chart and competitor_radar carry structured data (chart is gated on the
// transcript actually containing explicit numbers; see useClaude.ts's anti-hallucination guard).
export const LAYOUT_TYPES = [
  "hero",
  "hero_split",
  "hero_minimal",
  "split",
  "problem",
  "solution",
  "value_props",
  "timeline",
  "chart",
  "competitor_radar",
] as const;
export type LayoutType = (typeof LAYOUT_TYPES)[number];

export type ChartType = "bar" | "line" | "pie" | "donut";
export type ChartDatum = { name: string; value: number; color: string };
export type ChartSpec = { type: ChartType; label: string; data: ChartDatum[] };

// One point plotted on the competitor_radar layout's 2x2 quadrant matrix
export type QuadrantPoint = { name: string; x: number; y: number; isFounder?: boolean };
export type QuadrantData = { xAxisLabel: string; yAxisLabel: string; points: QuadrantPoint[] };

// A short, non-numeric value proposition card for the value_props layout
export type FeatureItem = { title: string; description: string };

// One step in the timeline layout's roadmap/narrative sequence
export type TimelineStep = { phase: string; title: string; detail: string };

export type Slide = {
  title: string;
  bulletPoints: string[];
  layoutType: LayoutType;
  accentColor: string;
  stat: string | null;
  chart?: ChartSpec;
  quadrant?: QuadrantData;
  featureGrid?: FeatureItem[];
  timelineSteps?: TimelineStep[];
  requiresRealTimeData: boolean;
  searchQueries: string[];
};
