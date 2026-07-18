export const MAX_BULLETS = 3;
export const MAX_BULLET_WORDS = 10;

// Truncates a string to at most `max` words, appending an ellipsis if anything was cut
export function truncateWords(text: string, max: number): string {
  const words = text.trim().split(/\s+/);
  if (words.length <= max) return text.trim();
  return words.slice(0, max).join(" ") + "…";
}

// Caps a bullet list to MAX_BULLETS entries, each truncated to MAX_BULLET_WORDS words
export function capBullets(bullets: string[]): string[] {
  return bullets.slice(0, MAX_BULLETS).map((b) => truncateWords(b, MAX_BULLET_WORDS));
}
