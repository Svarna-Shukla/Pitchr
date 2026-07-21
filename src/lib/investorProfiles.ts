import type { AnswerTier } from "../types/arena";
import type { PersonalityConfig, PersonalityId } from "../types/investor";

// Reads a Voice ID from whichever env system is actually live. This project runs on Vite
// (import.meta.env.VITE_*), but also checks process.env.NEXT_PUBLIC_* so the same lookup works
// unchanged if this ever ships behind Next.js instead. Missing/undefined on both resolves to ""
// rather than throwing — speakAsInvestor treats an empty voiceId as "use fallback".
function readVoiceId(viteKey: keyof ImportMetaEnv, nextKey: string): string {
  const viteValue = import.meta.env[viteKey];
  if (viteValue) return viteValue;
  const nextValue = typeof process !== "undefined" ? process.env?.[nextKey] : undefined;
  return nextValue ?? "";
}

// The 5 investor personalities selectable before entering the arena — the single source of truth
// for each investor's identity/copy, dedicated ElevenLabs voice, Groq prompt tone, mask reaction
// intensity, canned spoken reactions per answer tier, and 3D preview head. Tai Lung is first,
// making him the default/first card shown on the select screen.
export const INVESTOR_PROFILES: PersonalityConfig[] = [
  {
    id: "tailung",
    name: "Tai Lung",
    archetype: "The Ruthless Villain",
    description: "A martial-arts-obsessed villain VC who treats every pitch like a duel he's already won.",
    greetingText: "You walk into my arena with a pitch this weak? Convince me before I tear it apart.",
    // Falls back to the legacy VITE_ELEVENLABS_VOICE_ID key so existing demo configs keep working
    voiceId: readVoiceId("VITE_VOICE_TAI_LUNG", "NEXT_PUBLIC_VOICE_TAI_LUNG") || import.meta.env.VITE_ELEVENLABS_VOICE_ID || "",
    systemPrompt:
      "Write as Tai Lung: a dominant, hyper-confident, condescending villain investor who talks in martial-arts and battle metaphors. Taunt the founder — e.g. 'Our battle will be legendary!' or 'Is that all you've got?' — and end the question with a contemptuous jab at their pitch, like 'Your CAC is weak.' Never break the villain-VC persona.",
    maskIntensity: 1.3,
    voiceLines: {
      strong: ["Impressive. You may be worthy after all.", "Finally, a real opponent."],
      neutral: ["Is that all you've got?", "Keep talking. I'm not impressed yet."],
      weak: ["Your CAC is weak. Your pitch is weaker.", "Pathetic. This battle is already over."],
      timeout: ["Silence is not an answer.", "You hesitate. I win."],
    },
    maskTheme: {
      baseColor: "#1a1a1a",
      glowColor: "#f97316",
      eyeColor: "#ff9a4d",
      pointLightColor: "#ff4500",
      ambientColor: "#0f172a",
      particleColors: ["#f97316", "#fbbf24"],
    },
  },
  {
    id: "mentor",
    name: "Arthur Pendelton",
    archetype: "The Gentle Mentor",
    description: "A patient, supportive investor who genuinely wants you to win — but won't let you skate past the hard questions.",
    greetingText: "It sounds like you're passionate! But tell me... aren't you worried Google copies this next week?",
    voiceId: readVoiceId("VITE_VOICE_MENTOR", "NEXT_PUBLIC_VOICE_MENTOR"),
    systemPrompt:
      "Write as a warm, encouraging investor who is genuinely rooting for the founder's success. Keep the tone supportive and constructive, never combative — but still ask a real, substantive question that probes a weak spot. End with a gentle, specific follow-up like 'I love the energy here — but walk me through how you'd handle a competitor undercutting you on price.'",
    maskIntensity: 0.6,
    voiceLines: {
      strong: ["This is really strong work.", "I'm impressed — genuinely."],
      neutral: ["Good start. Let's dig a little deeper.", "I like where this is going."],
      weak: ["I think there's a gap here worth addressing.", "Let's be honest with each other on this one."],
      timeout: ["Take your time — but I do need an answer.", "No worries, but let's come back to this."],
    },
    maskTheme: {
      baseColor: "#1c1917",
      glowColor: "#10b981",
      eyeColor: "#34d399",
      pointLightColor: "#059669",
      ambientColor: "#f59e0b",
      particleColors: ["#10b981", "#f59e0b"],
    },
  },
  {
    id: "mogul",
    name: "Victoria Sterling",
    archetype: "The Unimpressed Corporate Mogul",
    description: "A hard-nosed corporate executive who's allocated exactly four minutes of her day to your entire company.",
    greetingText: "Spare me the backstory. What is your CAC, and when do I see a return?",
    voiceId: readVoiceId("VITE_VOICE_MOGUL", "NEXT_PUBLIC_VOICE_MOGUL"),
    systemPrompt:
      "Write as a ruthless, impatient corporate-executive investor who is never satisfied and always pushing for the bottom line. End the question with a sharp, boardroom-flavored remark like 'What's my ROI, precisely?' or 'I have a board meeting in five minutes.'",
    maskIntensity: 1.4,
    voiceLines: {
      strong: ["Acceptable numbers.", "Now that's a return."],
      neutral: ["Thin margins.", "Get to the bottom line."],
      weak: ["This wouldn't clear our board.", "Weak unit economics."],
      timeout: ["Time is money you don't have.", "My board doesn't wait."],
    },
    maskTheme: {
      baseColor: "#121212",
      glowColor: "#a855f7",
      eyeColor: "#c084fc",
      pointLightColor: "#9333ea",
      ambientColor: "#e2e8f0",
      particleColors: ["#d946ef", "#eab308"],
    },
  },
  {
    id: "wildcard",
    name: "Professor Zany",
    archetype: "The Chaotic Wildcard",
    description: "One question he's hyping you to the moon, the next he's asking what happens when a meteor hits your headquarters.",
    greetingText: "If a meteor hits your headquarters tomorrow, how does this business model survive?",
    voiceId: readVoiceId("VITE_VOICE_WILDCARD", "NEXT_PUBLIC_VOICE_WILDCARD"),
    systemPrompt:
      "Write as a wildly unpredictable investor who swings between over-the-top hype and brutal skepticism from one line to the next. Throw in a left-field comparison or hypothetical scenario, then end with a sudden curveball question the founder wouldn't see coming.",
    maskIntensity: 1.0,
    voiceLines: {
      strong: ["Wait... that's actually genius.", "Didn't see that coming. I like it."],
      neutral: ["Huh. Interesting choice.", "Not what I expected. Keep going."],
      weak: ["Yeah, no, that's a hard pass.", "That imploded fast."],
      timeout: ["Plot twist: you said nothing.", "Didn't see that non-answer coming."],
    },
    maskTheme: {
      baseColor: "#262626",
      glowColor: "#ff007f",
      eyeColor: "#84cc16",
      pointLightColor: "#ff0055",
      ambientColor: "#22c55e",
      particleColors: ["#ff0055", "#22c55e"],
    },
  },
  {
    id: "techbro",
    name: "Chad Vance",
    archetype: "The Tech-Bro Visionary",
    description: "A hoodie-wearing angel investor who name-drops his own exit and just wants to know if this thing scales.",
    greetingText: "Bro, is this scalable? If there's no neural network protocol attached, I'm out.",
    voiceId: readVoiceId("VITE_VOICE_TECH_BRO", "NEXT_PUBLIC_VOICE_TECH_BRO"),
    systemPrompt:
      "Write as a hyper-casual tech-bro investor obsessed with scale, growth, and buzzwords like '10x', 'moat', and 'stack'. Dismiss anything that sounds like old-school business fundamentals. End the question with something like 'Does this scale? Because if it doesn't 10x, I'm out.'",
    maskIntensity: 1.1,
    voiceLines: {
      strong: ["Okay that's actually kind of based.", "Now we're talking unicorn energy."],
      neutral: ["Mid. Needs more scale.", "I've heard this pitch at three other demo days."],
      weak: ["Bro, that's not a business model.", "Zero moat. Hard pass."],
      timeout: ["Silence isn't a growth strategy.", "You froze. Not a good look."],
    },
    maskTheme: {
      baseColor: "#09090b",
      glowColor: "#00f0ff",
      eyeColor: "#00f0ff",
      pointLightColor: "#00d8f6",
      ambientColor: "#3b0764",
      particleColors: ["#00f0ff", "#38bdf8"],
    },
  },
];

// Looks up an investor's full profile by id, falling back to Tai Lung (the default) if somehow unset
export function getInvestorProfile(id: PersonalityId | null): PersonalityConfig {
  return INVESTOR_PROFILES.find((p) => p.id === id) ?? INVESTOR_PROFILES[0];
}

// The color that represents this investor visually — their mask theme's panel-crack glow color
export function getInvestorColor(investor: PersonalityConfig): string {
  return investor.maskTheme.glowColor;
}

// Picks a random short canned line for the given investor + answer tier, used for spoken feedback
export function pickVoiceLine(investor: PersonalityConfig, tier: AnswerTier): string {
  const lines = investor.voiceLines[tier];
  return lines[Math.floor(Math.random() * lines.length)];
}
