// Canonical slide types the deck generator always covers, in pitch order
export const SLIDE_TYPES = [
  "problem",
  "solution",
  "market",
  "businessModel",
  "traction",
  "competitive",
  "team",
  "ask",
] as const;

export type SlideType = (typeof SLIDE_TYPES)[number];

const HEX: Record<SlideType, string> = {
  problem: "#ef4444",
  solution: "#3b82f6",
  market: "#10b981",
  businessModel: "#06b6d4",
  traction: "#f59e0b",
  competitive: "#8b5cf6",
  team: "#ec4899",
  ask: "#f97316",
};

const LABELS: Record<SlideType, string> = {
  problem: "Problem",
  solution: "Solution",
  market: "Market Size",
  businessModel: "Business Model",
  traction: "Traction",
  competitive: "Competitive Advantage",
  team: "Team",
  ask: "The Ask",
};

export const DEFAULT_SLIDE_COLOR = "#9ca3af";

// Looks up a slide's accent colour, falling back to grey for unrecognized types
export function slideColor(type: string): string {
  return HEX[type as SlideType] ?? DEFAULT_SLIDE_COLOR;
}

// Looks up a slide's display label, falling back to the raw type string
export function slideLabel(type: string): string {
  return LABELS[type as SlideType] ?? type;
}

// Converts a #rrggbb hex colour into an [r,g,b] triple for jsPDF fills
export function hexToRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

// Builds a per-type CSS gradient background for a slide card, tuned per theme — a restrained wash, not a neon glow
export function slideGradient(type: string, isDark: boolean): string {
  const hex = slideColor(type);
  return isDark
    ? `linear-gradient(135deg, ${hex}22 0%, #131316 70%)`
    : `linear-gradient(135deg, ${hex}17 0%, #ffffff 70%)`;
}
