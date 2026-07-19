// The forced palette for every deck slide, regardless of the app's own light/dark theme toggle
export const PREMIUM_BG = "#0a0a0a";
export const PREMIUM_SURFACE = "#111111";
export const PREMIUM_ACCENT_DEFAULT = "#ff7700";

const HEX_RE = /^#[0-9a-fA-F]{6}$/;

// Converts a #rrggbb hex colour into an [r,g,b] triple, used by jsPDF fills and hue distance checks
export function hexToRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

// True if a colour is a valid hex string reasonably close to the brand orange (loose hue check —
// accepts warm oranges/ambers a model might return instead of the exact hex, rejects everything else)
function isOnBrand(hex: string): boolean {
  if (!HEX_RE.test(hex)) return false;
  const [r, g, b] = hexToRgb(hex);
  return r > 180 && g > 60 && g < 190 && b < 100 && r > g && g > b;
}

// Clamps any model-supplied accent colour to on-brand, falling back to the default orange otherwise
export function sanitizeAccentColor(hex: string | undefined | null): string {
  if (hex && isOnBrand(hex)) return hex;
  return PREMIUM_ACCENT_DEFAULT;
}
