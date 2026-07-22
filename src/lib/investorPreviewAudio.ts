import type { PersonalityId } from "../types/investor";

// Maps each investor to the filename (without extension) of their static preview clip living in
// /public/audio/previews/ — Vite serves that folder's contents from the site root, so the file at
// public/audio/previews/lord-vane.mp3 is reachable at /audio/previews/lord-vane.mp3. Replaces the
// old live ElevenLabs TTS call in the preview modal so "Play Voice Sample" is instant and free.
const PREVIEW_AUDIO_SLUG: Record<PersonalityId, string> = {
  lordvane: "lord-vane",
  techbro: "chad-vance",
  mogul: "victoria-sterling",
  wildcard: "dr-quirk",
  mentor: "sensei-sterling",
};

if (import.meta.env.DEV) {
  console.info(
    "[investorPreviewAudio] Static preview clips expected in public/audio/previews/:\n" +
      Object.values(PREVIEW_AUDIO_SLUG)
        .map((slug) => `  - ${slug}.mp3`)
        .join("\n")
  );
}

// Strips whitespace/case/separators so ids that reach here in an unexpected shape — "lord_vane",
// "Lord Vane", "LORD-VANE" — still line up with the canonical PersonalityId keys above. Ids can
// arrive loosely formatted from places outside the strict PersonalityId type (persisted config,
// URL params), so this only trusts the *normalized* form, never the raw string.
function normalizeToken(value: string): string {
  return value.trim().toLowerCase().replace(/[^a-z0-9]/g, "");
}

const PERSONALITY_ID_BY_NORMALIZED_TOKEN: Record<string, PersonalityId> = (
  Object.keys(PREVIEW_AUDIO_SLUG) as PersonalityId[]
).reduce<Record<string, PersonalityId>>((lookup, id) => {
  lookup[normalizeToken(id)] = id;
  return lookup;
}, {});

// Resolves a possibly-loosely-formatted id ("mentor", "lord_vane", "Lord Vane") to the canonical
// PersonalityId it refers to, or null if it doesn't match any known investor.
function resolvePersonalityId(id: string): PersonalityId | null {
  return PERSONALITY_ID_BY_NORMALIZED_TOKEN[normalizeToken(id)] ?? null;
}

export function getPreviewAudioSrc(id: string): string {
  const resolved = resolvePersonalityId(id);
  if (!resolved) {
    console.warn(`[investorPreviewAudio] Unrecognized investor id "${id}"; falling back to raw slug`);
  }
  const slug = resolved ? PREVIEW_AUDIO_SLUG[resolved] : normalizeToken(id);
  return `/audio/previews/${slug}.mp3`;
}

// Keeps a handle on whichever preview clip is currently playing so switching investors (or
// re-opening the preview modal) cuts off the last clip instead of letting two overlap.
let currentPreviewAudio: HTMLAudioElement | null = null;

// Stops and resets whatever preview clip is currently playing, if any.
export function stopInvestorPreviewAudio(): void {
  if (!currentPreviewAudio) return;
  currentPreviewAudio.pause();
  currentPreviewAudio.currentTime = 0;
  currentPreviewAudio = null;
}

// Plays the given investor's static preview clip, first stopping any clip already in flight.
// Resolves once the clip finishes (or fails to start), so callers can drive a "Playing…" state off it.
export function playInvestorPreview(id: PersonalityId): Promise<void> {
  stopInvestorPreviewAudio();

  const src = getPreviewAudioSrc(id);
  const audio = new Audio(src);
  currentPreviewAudio = audio;

  const missingClipWarning = () =>
    `[investorPreviewAudio] Preview clip for "${id}" not found at ${src} — add the .mp3 file to ` +
    `public/audio/previews/ to enable this voice sample.`;

  return new Promise((resolve) => {
    const finish = () => {
      if (currentPreviewAudio === audio) currentPreviewAudio = null;
      resolve();
    };
    // Fires when the browser can't load the source at all (404, bad format, etc). This is the
    // expected case while preview clips are still being recorded, so it's a warning, not an error.
    const handleLoadError = () => {
      console.warn(missingClipWarning());
      finish();
    };
    audio.addEventListener("ended", finish, { once: true });
    audio.addEventListener("error", handleLoadError, { once: true });
    audio.play().catch((err) => {
      // A missing/unsupported source rejects play() with NotSupportedError — log it as the same
      // friendly warning instead of letting it surface as an unhandled playback error.
      if (err instanceof DOMException && err.name === "NotSupportedError") {
        console.warn(missingClipWarning());
      } else {
        console.error(`[investorPreviewAudio] Preview playback failed to start for "${id}"`, err);
      }
      finish();
    });
  });
}
