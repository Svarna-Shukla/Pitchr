import { Lightbulb } from "lucide-react";

type Props = { enabled: boolean; onToggle: () => void };

// Arena header toggle for the Coach Tips side panel — off by default so it never gets in the way of
// founders who don't want hand-holding, one tap away for anyone who wants a live nudge on structure,
// delivery, and what this specific investor actually wants to hear.
export default function HelpModeToggle({ enabled, onToggle }: Props) {
  return (
    <button
      onClick={onToggle}
      aria-label={enabled ? "Turn off Help Mode" : "Turn on Help Mode"}
      className={`fixed right-4 top-32 z-[65] flex min-h-[36px] items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide backdrop-blur-md transition ${
        enabled ? "border-amber-400/40 bg-amber-400/10 text-amber-300" : "border-white/10 bg-black/40 text-white/60 hover:border-white/25 hover:text-white/90"
      }`}
    >
      <Lightbulb className="h-3.5 w-3.5" />
      {enabled ? "Help Mode: On" : "Help Mode"}
    </button>
  );
}
