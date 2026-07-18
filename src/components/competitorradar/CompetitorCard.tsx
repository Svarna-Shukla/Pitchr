import type { Competitor } from "../../types/competitor";
import type { Theme } from "../../hooks/useTheme";
import TiltCard from "../TiltCard";

type Props = { competitor: Competitor; theme: Theme };

const THREAT_CONFIG: Record<Competitor["threat"], { border: string; badge: string }> = {
  low: { border: "border-green-500", badge: "bg-green-500/20 text-green-400" },
  medium: { border: "border-yellow-500", badge: "bg-yellow-500/20 text-yellow-400" },
  high: { border: "border-red-500", badge: "bg-red-500/20 text-red-400" },
};

// Renders one competitor with a colour-coded threat badge; falls back to "medium" styling for any unexpected value
export default function CompetitorCard({ competitor, theme }: Props) {
  const cfg = THREAT_CONFIG[competitor.threat] ?? THREAT_CONFIG.medium;
  const isDark = theme === "dark";

  return (
    <TiltCard
      maxTilt={4}
      className={`rounded-2xl border-l-4 p-5 shadow-xl ${cfg.border} ${isDark ? "bg-[#0f0f1a]" : "bg-white ring-1 ring-black/5"}`}
    >
      <div className="flex items-center justify-between gap-3">
        <h4 className={`text-lg font-bold ${isDark ? "text-white" : "text-black"}`}>{competitor.name}</h4>
        <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold uppercase ${cfg.badge}`}>
          {competitor.threat} threat
        </span>
      </div>
      <p className={`mt-2 text-sm ${isDark ? "text-white/70" : "text-black/60"}`}>{competitor.whatTheyDo}</p>
      <p className={`mt-2 text-sm ${isDark ? "text-white/50" : "text-black/45"}`}>
        <span className={`font-semibold ${isDark ? "text-white/70" : "text-black/60"}`}>Weakness: </span>
        {competitor.weakness}
      </p>
    </TiltCard>
  );
}
