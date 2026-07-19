// The 6 visual treatments a slide can use — chosen by the deck generator per slide's content
export const LAYOUT_TYPES = ["hero", "split", "problem", "solution", "chart", "competitor_radar"] as const;
export type LayoutType = (typeof LAYOUT_TYPES)[number];

export type ChartType = "bar" | "line" | "pie" | "donut";
export type ChartDatum = { name: string; value: number; color: string };
export type ChartSpec = { type: ChartType; label: string; data: ChartDatum[] };

// One point plotted on the competitor_radar layout's 2x2 quadrant matrix
export type QuadrantPoint = { name: string; x: number; y: number; isFounder?: boolean };
export type QuadrantData = { xAxisLabel: string; yAxisLabel: string; points: QuadrantPoint[] };

export type Slide = {
  title: string;
  bulletPoints: string[];
  layoutType: LayoutType;
  accentColor: string;
  stat: string | null;
  chart?: ChartSpec;
  quadrant?: QuadrantData;
  requiresRealTimeData: boolean;
  searchQueries: string[];
};
