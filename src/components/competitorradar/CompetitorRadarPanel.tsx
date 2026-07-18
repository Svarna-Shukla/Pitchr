import type { Competitor } from "../../types/competitor";
import CompetitorCard from "./CompetitorCard";

type Props = { competitors: Competitor[] | null; isGenerating: boolean; failed: boolean };

// Renders the AI-inferred competitor list, or a loading/failure state while it's being produced
export default function CompetitorRadarPanel({ competitors, isGenerating, failed }: Props) {
  if (isGenerating) return <p className="text-sm text-white/50">Scanning for competitors…</p>;
  if (failed) return <p className="text-sm text-red-400">Generation failed — try reopening this tab.</p>;
  if (!competitors) return null;

  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs text-white/40">Inferred from the pitch — no live web search.</p>
      {competitors.slice(0, 4).map((c, i) => (
        <CompetitorCard key={`${c.name}-${i}`} competitor={c} />
      ))}
    </div>
  );
}
