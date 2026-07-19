export const MAX_BULLETS = 3;
export const MAX_BULLET_WORDS = 8;

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

// Joins the founder's original pitch with the full arena Q&A history into one flat transcript,
// used to seed the Founder Kit input from a completed Battle Arena session
export function buildArenaTranscript(pitchTranscript: string, rounds: { question: string; answer: string }[]): string {
  const qa = rounds.map((r, i) => `Q${i + 1}: ${r.question}\nA${i + 1}: ${r.answer}`).join("\n\n");
  return qa ? `${pitchTranscript}\n\n${qa}` : pitchTranscript;
}
