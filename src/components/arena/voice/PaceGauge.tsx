import type { PaceTag } from "../../../types/voice";

type Props = { wpm: number; tag: PaceTag };

const TAG_STYLES: Record<PaceTag, string> = {
  "Too Fast": "border-orange-500/40 bg-orange-500/10 text-orange-400",
  "Optimal Pace": "border-emerald-500/40 bg-emerald-500/10 text-emerald-400",
  "Too Slow": "border-blue-500/40 bg-blue-500/10 text-blue-400",
};

// Words-per-minute gauge tagged against the 130-160 WPM band investors read as confident and clear
export default function PaceGauge({ wpm, tag }: Props) {
  return (
    <div className={`flex flex-col items-center gap-1 rounded-xl border p-3 text-center ${TAG_STYLES[tag]}`}>
      <span className="text-2xl font-black">{wpm}</span>
      <span className="text-[10px] font-semibold uppercase tracking-wider">{tag}</span>
    </div>
  );
}
