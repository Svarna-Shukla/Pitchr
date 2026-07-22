import type { PersonalityConfig, PersonalityId } from "../types/investor";

export type CoachTip = { label: string; text: string };

const FRAMEWORK_TIPS: string[] = [
  "Use PREP: Point, Reason, Example, Point. Lead with your answer, not the windup.",
  "Try STAR: Situation, Task, Action, Result — investors remember outcomes, not context.",
  "Answer the actual question in your first sentence. You can always add color after.",
];

const DELIVERY_TIPS: string[] = [
  "Cut the \"um\"s and \"like\"s — a clean pause beats a filler word every time.",
  "Slow down on the number that matters most and let it land before moving on.",
  "Breathe between points. Steady pacing reads as command of the material.",
];

// One line of investor-specific coaching per personality, rotated by round number so Help Mode never
// repeats the exact same tip twice in a row across a longer battle
const INVESTOR_TIPS: Record<PersonalityId, string[]> = {
  lordvane: [
    "He respects certainty, not volume. State your CAC and moat like you've already won the fight.",
    "Never hedge with Lord Vane — a flat, certain answer lands better than a hesitant strong one.",
  ],
  mentor: [
    "Sensei is rooting for you, but don't coast on the warmth — back claims with a real number.",
    "He wants to hear how you'd handle the hard case, not just the happy path.",
  ],
  mogul: [
    "Skip the backstory with Victoria. Open with the number she actually asked for.",
    "She's timing you. If you can say it in one sentence, don't stretch it to three.",
  ],
  wildcard: [
    "Expect a curveball from Dr. Quirk — bridge back to your core thesis instead of chasing it.",
    "A little humor lands with him, but always close on a concrete, real answer.",
  ],
  techbro: [
    "Talk scale and growth loops with Chad — \"steady\" and \"linear\" are bad words in this room.",
    "Mention your moat or your 10x story, or he'll assume this is a lifestyle business.",
  ],
};

const METRICS_BY_INVESTOR: Record<PersonalityId, string> = {
  lordvane: "CAC, competitive moat, why you win",
  mentor: "retention, customer love, resilience",
  mogul: "CAC, LTV, ROI, margin, payback period",
  wildcard: "downside scenario, adaptability, worst case",
  techbro: "growth rate, TAM, virality, 10x potential",
};

// Rotates through a tip list by round number instead of a random pick, so the same tip never flashes
// twice back-to-back and Help Mode feels like it's actually tracking the conversation
function pick(list: string[], seed: number): string {
  if (list.length === 0) return "";
  return list[((seed % list.length) + list.length) % list.length];
}

export function buildCoachTips(investor: PersonalityConfig, roundNumber: number): { investor: CoachTip; framework: CoachTip; delivery: CoachTip; metrics: string } {
  const investorTips = INVESTOR_TIPS[investor.id] ?? [];
  return {
    investor: { label: investor.name, text: pick(investorTips, roundNumber) || investor.description },
    framework: { label: "Structure", text: pick(FRAMEWORK_TIPS, roundNumber + 1) },
    delivery: { label: "Delivery", text: pick(DELIVERY_TIPS, roundNumber + 2) },
    metrics: METRICS_BY_INVESTOR[investor.id] ?? "unit economics, growth, retention",
  };
}
