import { Volume2, VolumeX } from "lucide-react";

type Props = { enabled: boolean; onToggle: () => void };

// Small icon toggle, bottom-left of the arena (mirroring "End Pitch" on the bottom-right), letting
// the founder mute the investor's spoken judgment lines (Web Speech Synthesis) without affecting
// anything else. Kept away from the top HUD stack (health bar, round counter, streak badge).
export default function SpeakerToggle({ enabled, onToggle }: Props) {
  return (
    <button
      onClick={onToggle}
      aria-label={enabled ? "Mute investor voice" : "Unmute investor voice"}
      className="fixed bottom-24 left-4 z-[65] flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-black/40 text-white/50 backdrop-blur-md transition hover:text-white/80 md:bottom-4"
    >
      {enabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
    </button>
  );
}
