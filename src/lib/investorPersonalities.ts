import type { AnswerTier } from "../types/arena";
import type { PersonalityConfig, PersonalityId } from "../types/investor";

// The 4 investor personalities selectable before entering the arena — each reshapes the Groq
// prompt's tone, how hard the mask reacts, and which short lines get spoken aloud per answer tier
export const PERSONALITIES: PersonalityConfig[] = [
  {
    id: "silent",
    name: "The Silent VC",
    tagline: "Cold. Analytical. Says almost nothing.",
    description: "Barely reacts. Long pauses. When he finally speaks, it cuts deep.",
    promptStyle:
      "Write as a coldly analytical, barely-reactive investor who rarely shows emotion. Terse, clinical, unsettling in its restraint.",
    maskIntensity: 0.6,
    voiceLines: {
      strong: ["Noted.", "Acceptable."],
      average: ["Hm.", "Go on."],
      weak: ["No.", "Weak."],
      timeout: ["Silence.", "Nothing."],
    },
  },
  {
    id: "shark",
    name: "The Shark",
    tagline: "Aggressive. Interrupts. Never satisfied.",
    description: "Loud, impatient, always hunting for the kill. Nothing is ever good enough.",
    promptStyle: "Write as an aggressive, impatient investor who interrupts and is never satisfied, always pushing harder.",
    maskIntensity: 1.4,
    voiceLines: {
      strong: ["Finally.", "Not bad."],
      average: ["Boring.", "Keep going."],
      weak: ["Pathetic.", "Is that your best answer?"],
      timeout: ["Useless.", "Waste of my time."],
    },
  },
  {
    id: "pattern",
    name: "The Pattern Matcher",
    tagline: "Compares everything to something else.",
    description: "Constantly benchmarks you against companies you've never heard of.",
    promptStyle:
      "Write as an investor obsessed with pattern-matching to other startups — constantly comparing the idea to existing companies, e.g. 'This sounds like Uber for X.'",
    maskIntensity: 1.0,
    voiceLines: {
      strong: ["Interesting angle.", "Original, actually."],
      average: ["Seen it before.", "Derivative."],
      weak: ["Copycat.", "Not novel."],
      timeout: ["No comparison to make.", "Nothing here."],
    },
  },
  {
    id: "technical",
    name: "The Technical",
    tagline: "Only cares how it actually works.",
    description: "Dismisses vision talk. Wants architecture, mechanisms, proof.",
    promptStyle:
      "Write as an investor who only cares about technical mechanics and how things actually work, dismissing vision or storytelling.",
    maskIntensity: 1.1,
    voiceLines: {
      strong: ["That checks out.", "Sound mechanics."],
      average: ["Vague.", "Too high-level."],
      weak: ["Doesn't work.", "Handwaving."],
      timeout: ["No mechanism given.", "Nothing to evaluate."],
    },
  },
];

// Looks up a personality config by id, falling back to The Shark if somehow unset
export function getPersonality(id: PersonalityId | null): PersonalityConfig {
  return PERSONALITIES.find((p) => p.id === id) ?? PERSONALITIES[1];
}

// Picks a random short canned line for the given personality + answer tier, used for spoken feedback
export function pickVoiceLine(personality: PersonalityConfig, tier: AnswerTier): string {
  const lines = personality.voiceLines[tier];
  return lines[Math.floor(Math.random() * lines.length)];
}
