import { Zap, Play, Download, History } from "lucide-react";

type Props = {
  hasSlides: boolean;
  pitcheratorActive: boolean;
  exporting: boolean;
  onPitcherator: () => void;
  onPresent: () => void;
  onExport: () => void;
  onSessions: () => void;
};

// Floating glassmorphism bar with quick actions: Pitcherator, Present, Export, Sessions
export default function BottomBar({
  hasSlides,
  pitcheratorActive,
  exporting,
  onPitcherator,
  onPresent,
  onExport,
  onSessions,
}: Props) {
  const base = "flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-30";

  return (
    <div className="fixed inset-x-0 bottom-4 z-30 flex justify-center px-4">
      <div className="flex flex-wrap items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 backdrop-blur-xl">
        <button onClick={onPitcherator} className={`${base} ${pitcheratorActive ? "bg-red-500/20 text-red-400" : "text-white/70 hover:bg-white/10"}`}>
          <Zap className="h-4 w-4" /> Pitcherator
        </button>
        <button onClick={onPresent} disabled={!hasSlides} className={`${base} text-white/70 hover:bg-white/10`}>
          <Play className="h-4 w-4" /> Present
        </button>
        <button onClick={onExport} disabled={!hasSlides || exporting} className={`${base} text-white/70 hover:bg-white/10`}>
          <Download className="h-4 w-4" /> {exporting ? "Exporting…" : "Export"}
        </button>
        <button onClick={onSessions} className={`${base} text-white/70 hover:bg-white/10`}>
          <History className="h-4 w-4" /> Sessions
        </button>
      </div>
    </div>
  );
}
