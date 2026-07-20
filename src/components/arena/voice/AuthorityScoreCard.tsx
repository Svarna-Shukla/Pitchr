type Props = { score: number };

// Overall vocal delivery confidence percentage, blending pace control and filler-word discipline
// across every voice-answered round into one authority number
export default function AuthorityScoreCard({ score }: Props) {
  return (
    <div className="flex flex-col items-center gap-1 rounded-xl border border-[#38bdf8]/30 bg-[#38bdf8]/10 p-3 text-center text-[#7dd3fc]">
      <span className="text-2xl font-black">{score}%</span>
      <span className="text-[10px] font-semibold uppercase tracking-wider">Authority Score</span>
    </div>
  );
}
