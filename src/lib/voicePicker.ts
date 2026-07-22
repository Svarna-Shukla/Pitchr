// Preferred natural-sounding voice names, checked in order, before falling back to whatever
// premium-quality or male-sounding voice the browser offers by default. Shared by every investor's
// spoken feedback — the generic useSpeechSynthesis hook and speakAsInvestor's browser fallback both
// pick from this same list.
const VOICE_PRIORITY = ["Daniel", "David", "Alex", "Google UK English Male", "Microsoft David", "Arthur"];

// Flags voices whose engine is a step above the flat, robotic OS default — Chrome/Android's "Google"
// voices and the "Natural"/"Enhanced"/"Premium" voices some OSes ship alongside the standard ones.
const PREMIUM_VOICE_MARKERS = /google|natural|enhanced|premium/i;

function isMaleSounding(voice: SpeechSynthesisVoice): boolean {
  return /male/i.test(voice.name) && !/female/i.test(voice.name);
}

// Picks the most natural-sounding voice available: first by exact-name priority match (preferring a
// premium-engine match over a non-premium one of the same name), then any premium-marked voice, then
// any male-sounding voice, then just the first English voice, then whatever's first.
export function pickNaturalVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null {
  const english = voices.filter((v) => v.lang.startsWith("en"));
  const pool = english.length ? english : voices;
  const premiumPool = pool.filter((v) => PREMIUM_VOICE_MARKERS.test(v.name));

  for (const name of VOICE_PRIORITY) {
    const match = premiumPool.find((v) => v.name.includes(name)) ?? pool.find((v) => v.name.includes(name));
    if (match) return match;
  }

  const premiumMale = premiumPool.find(isMaleSounding);
  if (premiumMale) return premiumMale;
  if (premiumPool[0]) return premiumPool[0];

  const male = pool.find(isMaleSounding);
  if (male) return male;
  return pool[0] ?? voices[0] ?? null;
}

// A natural, unhurried delivery that works for any investor when no persona-specific pitch/rate has
// been wired up — slightly slower than 1.0 so it doesn't sound rushed, close to neutral pitch.
export const NATURAL_DEFAULT_VOICE = { pitch: 0.95, rate: 0.94 };

// Splits a line into sentence/clause-sized chunks at natural pause points, keeping the boundary
// punctuation attached to the end of each chunk since several engines use it as a prosody cue.
const CLAUSE_BOUNDARY = /(?<=[.!?—,])\s+/;

function splitIntoClauses(text: string): string[] {
  const clauses = text
    .split(CLAUSE_BOUNDARY)
    .map((chunk) => chunk.trim())
    .filter(Boolean);
  return clauses.length ? clauses : [text];
}

// How long to hold silent after a clause before starting the next one — longer after a question or
// exclamation (a real beat for the line to land) than after a mid-thought comma.
function pauseAfterMs(clause: string): number {
  switch (clause.slice(-1)) {
    case "?":
    case "!":
      return 260;
    case ".":
      return 220;
    case "—":
      return 160;
    case ",":
      return 110;
    default:
      return 70;
  }
}

type SpeakOptions = { pitch: number; rate: number; onStart?: () => void; onEnd?: () => void };

// Bumps on every speakDeep call so a stale clause chain from a superseded call can recognize it's
// been cancelled and stop scheduling its own next clause, even though its onend already fired.
let speechGeneration = 0;

// Speaks a phrase aloud through the most natural available voice, clause by clause with brief
// natural pauses between them, cancelling anything already in progress; no-ops if unsupported.
// Shared low-level primitive — callers own their own enabled/mute state and just decide the
// pitch/rate delivery.
export function speakDeep(text: string, { pitch, rate, onStart, onEnd }: SpeakOptions): void {
  if (!text || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const generation = ++speechGeneration;

  const clauses = splitIntoClauses(text);
  const voice = pickNaturalVoice(window.speechSynthesis.getVoices());

  const speakClause = (index: number) => {
    if (generation !== speechGeneration) return;
    const clause = clauses[index];
    const utterance = new SpeechSynthesisUtterance(clause);
    if (voice) utterance.voice = voice;
    utterance.pitch = pitch;
    utterance.rate = rate;
    utterance.volume = 1;
    if (index === 0 && onStart) utterance.onstart = onStart;
    utterance.onend = () => {
      if (generation !== speechGeneration) return;
      if (index + 1 >= clauses.length) {
        onEnd?.();
      } else {
        window.setTimeout(() => speakClause(index + 1), pauseAfterMs(clause));
      }
    };
    utterance.onerror = () => {
      if (generation !== speechGeneration) return;
      onEnd?.();
    };
    window.speechSynthesis.speak(utterance);
  };

  speakClause(0);
}
