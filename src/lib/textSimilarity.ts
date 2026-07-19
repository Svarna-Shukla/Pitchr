// Normalizes text to a lowercase word set for similarity comparison
function wordSet(text: string): Set<string> {
  return new Set(text.toLowerCase().match(/[a-z0-9']+/g) ?? []);
}

// Dice coefficient over word sets (0 = completely different, 1 = identical vocabulary) — cheap,
// dependency-free stand-in for a full edit-distance similarity check
export function similarity(a: string, b: string): number {
  const setA = wordSet(a);
  const setB = wordSet(b);
  if (!setA.size && !setB.size) return 1;
  if (!setA.size || !setB.size) return 0;
  let shared = 0;
  for (const word of setA) if (setB.has(word)) shared += 1;
  return (2 * shared) / (setA.size + setB.size);
}
