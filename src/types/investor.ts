import type { AnswerTier } from "./arena";

// The 5 investor personalities the founder can choose to be grilled by
export type PersonalityId = "lordvane" | "techbro" | "mogul" | "wildcard" | "mentor";

// The full visual identity for one investor's hand-sculpted low-poly mask: the shell/backing base
// color, the emissive glow bleeding through the panel cracks, the eye/accent glow color, the two
// dramatic lights (a strong colored point light from below, a contrasting ambient tone from above),
// and the pair of colors its floating particle field drifts between. Every investor has one — there
// is no primitive fallback shape.
export type MaskTheme = {
  baseColor: string;
  glowColor: string;
  eyeColor: string;
  pointLightColor: string;
  ambientColor: string;
  particleColors: [string, string];
};

// The pitch/rate this investor's lines are delivered at when speaking through the browser's native
// speechSynthesis — either because ElevenLabs isn't configured, or because Fast Voice mode is on.
// Rate stays close to 1.0 (0.92-0.95) so delivery reads as natural rather than rushed or robotic;
// pitch is what actually differentiates an energetic investor from a serious/dominant one.
export type FallbackVoice = { pitch: number; rate: number };

// The single source of truth for one investor: identity/copy, their dedicated ElevenLabs voice, the
// tone guidance fed into the Groq round prompt, how intensely the battle-arena mask reacts, the short
// canned lines used for spoken feedback per answer tier, the theme driving their dedicated
// BufferGeometry mask (rendered by both the preview modal and the live battle arena), and the
// pitch/rate their browser-native speechSynthesis fallback speaks in.
export type PersonalityConfig = {
  id: PersonalityId;
  name: string;
  archetype: string;
  description: string;
  greetingText: string;
  voiceId: string;
  systemPrompt: string;
  maskIntensity: number;
  voiceLines: Record<AnswerTier, string[]>;
  maskTheme: MaskTheme;
  fallbackVoice: FallbackVoice;
};
