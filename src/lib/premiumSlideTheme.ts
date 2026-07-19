// The forced palette for every deck slide, regardless of the app's own light/dark theme toggle.
// Slides get their own independent dark/light toggle instead — see SlideTheme below.
export const PREMIUM_BG = "#0a0a0a";
export const PREMIUM_SURFACE = "#111111";
export const PREMIUM_ACCENT_DEFAULT = "#ff7700";

export type SlideTheme = "dark" | "light";

export type SlidePalette = {
  background: string;
  title: string;
  bullet: string;
  accent: string;
  stat: string;
  footer: string;
};

// The two colour sets a slide can render in, toggled independently of the app's own theme
export const SLIDE_PALETTES: Record<SlideTheme, SlidePalette> = {
  dark: {
    background: PREMIUM_BG,
    title: "#ffffff",
    bullet: "rgba(255,255,255,0.8)",
    accent: PREMIUM_ACCENT_DEFAULT,
    stat: PREMIUM_ACCENT_DEFAULT,
    footer: "rgba(255,255,255,0.22)",
  },
  light: {
    background: "#ffffff",
    title: "#0a0a0a",
    bullet: "#333333",
    accent: "#ff5500",
    stat: "#ff5500",
    footer: "rgba(10,10,10,0.28)",
  },
};

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

// Resolves a slide's effective accent for the active slide theme: a genuinely custom (non-default)
// model-supplied accent is always respected as-is, but a slide left on the generic brand default
// picks up the current theme's own default accent (#ff7700 dark / #ff5500 light)
export function resolveAccent(accentColor: string, theme: SlideTheme): string {
  return accentColor === PREMIUM_ACCENT_DEFAULT ? SLIDE_PALETTES[theme].accent : accentColor;
}

// The floating drop-shadow under a slide's stat number, tuned per theme so it stays subtle on both
export function statTextShadow(theme: SlideTheme): string {
  return theme === "dark" ? "0 8px 32px rgba(255,119,0,0.4)" : "0 8px 32px rgba(255,85,0,0.2)";
}
