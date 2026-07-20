import type { AnswerTier } from "../types/arena";
import type { PersonalityConfig, PersonalityId } from "../types/investor";

// The 5 investor personalities selectable before entering the arena — each reshapes the Groq
// prompt's tone, how hard the mask reacts, and which short lines get spoken aloud per answer tier.
// Tai Lung is first in this array, making him the default/first card shown on the select screen.
export const PERSONALITIES: PersonalityConfig[] = [
  {
    id: "tailung",
    name: "Tai Lung",
    tagline: "Arrogant. Dominant. Loves the sound of your defeat.",
    description: "A martial-arts-obsessed villain VC who treats every pitch like a duel he's already won.",
    promptStyle:
      "Write as Tai Lung: a dominant, hyper-confident, condescending villain investor who talks in martial-arts and battle metaphors. Taunt the founder — e.g. 'Our battle will be legendary!' or 'Is that all you've got?' — and end the question with a contemptuous jab at their pitch, like 'Your CAC is weak.' Never break the villain-VC persona.",
    maskIntensity: 1.3,
    voiceLines: {
      strong: ["Impressive. You may be worthy after all.", "Finally, a real opponent."],
      neutral: ["Is that all you've got?", "Keep talking. I'm not impressed yet."],
      weak: ["Your CAC is weak. Your pitch is weaker.", "Pathetic. This battle is already over."],
      timeout: ["Silence is not an answer.", "You hesitate. I win."],
    },
  },
  {
    id: "silent",
    name: "The Silent VC",
    tagline: "Cold. Analytical. Says almost nothing.",
    description: "Barely reacts. Long pauses. When he finally speaks, it cuts deep.",
    promptStyle:
      "Write as a coldly analytical, barely-reactive investor who rarely shows emotion. Terse, clinical, unsettling in its restraint. Keep questions short and cold — no personality remarks, no extra flourish tacked onto the end.",
    maskIntensity: 0.6,
    voiceLines: {
      strong: ["Noted.", "Acceptable."],
      neutral: ["Hm.", "Go on."],
      weak: ["No.", "Weak."],
      timeout: ["Silence.", "Nothing."],
    },
  },
  {
    id: "shark",
    name: "The Shark",
    tagline: "Aggressive. Interrupts. Never satisfied.",
    description: "Loud, impatient, always hunting for the kill. Nothing is ever good enough.",
    promptStyle:
      "Write as an aggressive, impatient investor who interrupts and is never satisfied, always pushing harder. End the question with a sharp, impatient remark like 'Answer fast.' or 'I have 10 other meetings.'",
    maskIntensity: 1.4,
    voiceLines: {
      strong: ["Finally.", "Not bad."],
      neutral: ["Boring.", "Keep going."],
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
      "Write as an investor obsessed with pattern-matching to other startups — constantly comparing the idea to a specific real or plausible company and year, e.g. 'This sounds exactly like what Notion tried in 2019. What makes you different?'",
    maskIntensity: 1.0,
    voiceLines: {
      strong: ["Interesting angle.", "Original, actually."],
      neutral: ["Seen it before.", "Derivative."],
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
      "Write as an investor who only cares about technical mechanics and how things actually work, dismissing vision or storytelling. Drill into implementation specifics, e.g. 'How does this actually work under the hood? Walk me through the technical architecture.'",
    maskIntensity: 1.1,
    voiceLines: {
      strong: ["That checks out.", "Sound mechanics."],
      neutral: ["Vague.", "Too high-level."],
      weak: ["Doesn't work.", "Handwaving."],
      timeout: ["No mechanism given.", "Nothing to evaluate."],
    },
  },
];

// Looks up a personality config by id, falling back to Tai Lung (the default) if somehow unset
export function getPersonality(id: PersonalityId | null): PersonalityConfig {
  return PERSONALITIES.find((p) => p.id === id) ?? PERSONALITIES[0];
}

// Picks a random short canned line for the given personality + answer tier, used for spoken feedback
export function pickVoiceLine(personality: PersonalityConfig, tier: AnswerTier): string {
  const lines = personality.voiceLines[tier];
  return lines[Math.floor(Math.random() * lines.length)];
}
