// Preferred deep/male voice names, checked in order, before falling back to whatever male-sounding
// voice the browser offers by default. Shared by every investor's spoken feedback — the generic
// useSpeechSynthesis hook and Tai Lung's dedicated deeper delivery both pick from this same list.
const VOICE_PRIORITY = ["Daniel", "David", "Alex", "Google UK English Male", "Microsoft David", "Arthur"];

// Picks the deepest, darkest-sounding voice available: first by exact-name priority match, then any
// voice whose name suggests a male voice, then just the first English voice, then whatever's first
export function pickDeepVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null {
  for (const name of VOICE_PRIORITY) {
    const match = voices.find((v) => v.name.includes(name));
    if (match) return match;
  }
  const male = voices.find((v) => /male/i.test(v.name) && !/female/i.test(v.name));
  if (male) return male;
  return voices.find((v) => v.lang.startsWith("en")) ?? voices[0] ?? null;
}

type SpeakOptions = { pitch: number; rate: number; onStart?: () => void; onEnd?: () => void };

// Speaks a phrase aloud through the deepest available voice, cancelling anything already in
// progress; no-ops if unsupported. Shared low-level primitive — callers own their own enabled/mute
// state and just decide the pitch/rate delivery.
export function speakDeep(text: string, { pitch, rate, onStart, onEnd }: SpeakOptions): void {
  if (!text || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  const voice = pickDeepVoice(window.speechSynthesis.getVoices());
  if (voice) utterance.voice = voice;
  utterance.pitch = pitch;
  utterance.rate = rate;
  utterance.volume = 1;
  if (onStart) utterance.onstart = onStart;
  utterance.onend = () => onEnd?.();
  utterance.onerror = () => onEnd?.();
  window.speechSynthesis.speak(utterance);
}
