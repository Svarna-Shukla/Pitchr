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

export function getPreviewAudioSrc(id: PersonalityId): string {
  return `/audio/previews/${PREVIEW_AUDIO_SLUG[id]}.mp3`;
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

  const audio = new Audio(getPreviewAudioSrc(id));
  currentPreviewAudio = audio;

  return new Promise((resolve) => {
    const finish = () => {
      if (currentPreviewAudio === audio) currentPreviewAudio = null;
      resolve();
    };
    audio.addEventListener("ended", finish, { once: true });
    audio.addEventListener("error", finish, { once: true });
    audio.play().catch((err) => {
      console.error(`[investorPreviewAudio] Preview playback failed to start for "${id}"`, err);
      finish();
    });
  });
}
