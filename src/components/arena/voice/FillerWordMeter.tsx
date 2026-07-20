type Props = { count: number };

const severityOf = (count: number) => (count >= 6 ? "high" : count >= 3 ? "medium" : "low");

const STYLES: Record<string, string> = {
  high: "border-red-500/40 bg-red-500/10 text-red-400",
  medium: "border-orange-500/40 bg-orange-500/10 text-orange-400",
  low: "border-white/10 bg-white/5 text-white/70",
};

// Total filler words ("um", "uh", "like", etc.) detected across every round the founder answered by
// voice — flares red/orange once the count climbs high enough to actually hurt credibility
export default function FillerWordMeter({ count }: Props) {
  return (
    <div className={`flex flex-col items-center gap-1 rounded-xl border p-3 text-center ${STYLES[severityOf(count)]}`}>
      <span className="text-2xl font-black">{count}</span>
      <span className="text-[10px] font-semibold uppercase tracking-wider">Filler Words</span>
    </div>
  );
}
