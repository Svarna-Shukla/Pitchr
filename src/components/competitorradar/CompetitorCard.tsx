import type { Competitor } from "../../types/competitor";

type Props = { competitor: Competitor };

const THREAT_CONFIG: Record<Competitor["threat"], { border: string; badge: string }> = {
  low:    { border: "border-green-500",  badge: "bg-green-500/20 text-green-400" },
  medium: { border: "border-yellow-500", badge: "bg-yellow-500/20 text-yellow-400" },
  high:   { border: "border-red-500",    badge: "bg-red-500/20 text-red-400" },
};

// Renders one competitor as a slide-card-styled entry with a colour-coded threat badge
export default function CompetitorCard({ competitor }: Props) {
  const cfg = THREAT_CONFIG[competitor.threat];

  return (
    <div className={`rounded-2xl border-l-4 ${cfg.border} bg-[#0f0f1a] p-5 shadow-xl`}>
      <div className="flex items-center justify-between">
        <h4 className="text-lg font-bold text-white">{competitor.name}</h4>
        <span className={`rounded-full px-3 py-1 text-xs font-bold uppercase ${cfg.badge}`}>
          {competitor.threat} threat
        </span>
      </div>
      <p className="mt-2 text-sm text-white/70">{competitor.whatTheyDo}</p>
      <p className="mt-2 text-sm text-white/50">
        <span className="font-semibold text-white/70">Weakness: </span>
        {competitor.weakness}
      </p>
    </div>
  );
}
