import type { ChartDatum } from "../types/slide";
import type { SlideTheme } from "./premiumSlideTheme";
import { hexToRgb, PREMIUM_ACCENT_DEFAULT, SLIDE_PALETTES } from "./premiumSlideTheme";

// Cycles through these greys for any datum whose colour isn't on-brand — keeps the "monochrome +
// orange only" design rule even if the model returns an off-brand hue
const GREY_RAMP = ["#333333", "#555555", "#777777", "#999999"];

// Cyberpunk's secondary accent ramp — the same grey-ramp slots reassigned to magenta tints instead,
// so charts pick up both of cyberpunk's colours (cyan primary via resolveAccent, magenta secondary
// here) rather than falling back to plain grey
const MAGENTA_RAMP = ["#ff007f", "#c2005f", "#8f0046", "#5c002d"];

const HEX_RE = /^#[0-9a-fA-F]{6}$/;

// True for the brand orange or any true grayscale hex (r===g===b)
function isChartSafe(hex: string): boolean {
  if (!HEX_RE.test(hex)) return false;
  if (hex.toLowerCase() === PREMIUM_ACCENT_DEFAULT) return true;
  const [r, g, b] = hexToRgb(hex);
  return r === g && g === b;
}

// Snaps every datum's colour to the monochrome+orange design language, preserving on-brand colours
// as-is and reassigning anything else from a fixed grey ramp so the chart never shows a stray hue.
// This runs once at deck-generation time, independent of whatever theme is active later — see
// resolveChartColor below for the theme-aware remap applied at render time.
export function sanitizeChartData(data: ChartDatum[]): ChartDatum[] {
  return data.map((d, i) => ({
    ...d,
    color: isChartSafe(d.color) ? d.color : i === 0 ? PREMIUM_ACCENT_DEFAULT : GREY_RAMP[(i - 1) % GREY_RAMP.length],
  }));
}

// Remaps a sanitized chart datum's colour to the active ThemeRemixer theme at render time: a datum
// baked with the generation-time default orange picks up the current theme's own accent (mirroring
// resolveAccent), and — on cyberpunk only — the neutral grey ramp is swapped for a magenta ramp so
// charts pick up both of cyberpunk's colours instead of reading as flat grey
export function resolveChartColor(color: string, theme: SlideTheme): string {
  if (color.toLowerCase() === PREMIUM_ACCENT_DEFAULT) return SLIDE_PALETTES[theme].accent;
  if (theme !== "cyberpunk") return color;
  const greyIndex = GREY_RAMP.indexOf(color);
  return greyIndex === -1 ? color : MAGENTA_RAMP[greyIndex];
}
