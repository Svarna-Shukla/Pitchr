import type { Rarity } from "../types/battleCard";

type RarityStyle = {
  artGradient: string;
  borderClass: string;
  glowClass: string;
  badgeClass: string;
  filledDots: number;
  shimmer: boolean;
};

// Every visual cue driven purely by rarity: art gradient, border colour, glow strength, dot count
const RARITY_STYLE: Record<Rarity, RarityStyle> = {
  Common: {
    artGradient: "linear-gradient(160deg, #9ca3af, #1f2937)",
    borderClass: "border-gray-400/70",
    glowClass: "shadow-lg shadow-black/40",
    badgeClass: "bg-gray-400/20 text-gray-300",
    filledDots: 1,
    shimmer: false,
  },
  Uncommon: {
    artGradient: "linear-gradient(160deg, #4ade80, #052e16)",
    borderClass: "border-green-400/70",
    glowClass: "shadow-lg shadow-green-500/20",
    badgeClass: "bg-green-400/20 text-green-300",
    filledDots: 2,
    shimmer: false,
  },
  Rare: {
    artGradient: "linear-gradient(160deg, #60a5fa, #0c1a3d)",
    borderClass: "border-blue-400/80",
    glowClass: "shadow-xl shadow-blue-500/30",
    badgeClass: "bg-blue-400/20 text-blue-300",
    filledDots: 3,
    shimmer: false,
  },
  Epic: {
    artGradient: "linear-gradient(160deg, #c084fc, #2e1065)",
    borderClass: "border-purple-400/90",
    glowClass: "shadow-2xl shadow-purple-500/40",
    badgeClass: "bg-purple-400/20 text-purple-300",
    filledDots: 4,
    shimmer: true,
  },
  Legendary: {
    artGradient: "linear-gradient(160deg, #fde047, #78350f)",
    borderClass: "border-yellow-300",
    glowClass: "shadow-2xl shadow-yellow-400/50",
    badgeClass: "bg-yellow-400/20 text-yellow-200",
    filledDots: 5,
    shimmer: true,
  },
};

// Looks up the visual style for a rarity, always falling back to Common so a bad value can never crash rendering
export function rarityStyle(rarity: Rarity): RarityStyle {
  return RARITY_STYLE[rarity] ?? RARITY_STYLE.Common;
}
