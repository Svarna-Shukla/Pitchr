import type { ChartDatum } from "../types/slide";
import { hexToRgb, PREMIUM_ACCENT_DEFAULT } from "./premiumSlideTheme";

// Cycles through these greys for any datum whose colour isn't on-brand — keeps the "monochrome +
// orange only" design rule even if the model returns an off-brand hue
const GREY_RAMP = ["#333333", "#555555", "#777777", "#999999"];

const HEX_RE = /^#[0-9a-fA-F]{6}$/;

// True for the brand orange or any true grayscale hex (r===g===b)
function isChartSafe(hex: string): boolean {
  if (!HEX_RE.test(hex)) return false;
  if (hex.toLowerCase() === PREMIUM_ACCENT_DEFAULT) return true;
  const [r, g, b] = hexToRgb(hex);
  return r === g && g === b;
}

// Snaps every datum's colour to the monochrome+orange design language, preserving on-brand colours
// as-is and reassigning anything else from a fixed grey ramp so the chart never shows a stray hue
export function sanitizeChartData(data: ChartDatum[]): ChartDatum[] {
  return data.map((d, i) => ({
    ...d,
    color: isChartSafe(d.color) ? d.color : i === 0 ? PREMIUM_ACCENT_DEFAULT : GREY_RAMP[(i - 1) % GREY_RAMP.length],
  }));
}
