import { speakDeep } from "./voicePicker";

// Tai Lung's dedicated delivery: noticeably deeper and slower than every other investor's shared
// voice.speak() in useSpeechSynthesis (pitch 0.5/rate 0.75) for an intimidating villain tone,
// reusing the same underlying voice-picking primitive so both stay in sync with whatever deep voice
// the browser actually has available.
const TAI_LUNG_PITCH = 0.55;
const TAI_LUNG_RATE = 0.9;

// Speaks a line as Tai Lung — used for both his attack questions (Phase 4, on entering the
// "attacking" battle phase) and his judgment reactions, so every line he speaks shares one voice
export function speakAsTaiLung(text: string): void {
  speakDeep(text, { pitch: TAI_LUNG_PITCH, rate: TAI_LUNG_RATE });
}
