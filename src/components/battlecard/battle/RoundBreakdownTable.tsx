import type { RoundOutcome } from "../../../types/battleCard";

type Props = { rounds: RoundOutcome[] };

// A simple round-by-round breakdown table: stat, both scores, and who took the round
export default function RoundBreakdownTable({ rounds }: Props) {
  return (
    <table className="w-full max-w-md text-left text-sm">
      <thead>
        <tr className="text-[10px] uppercase tracking-widest text-white/40">
          <th className="pb-2 font-semibold">Stat</th>
          <th className="pb-2 font-semibold">You</th>
          <th className="pb-2 font-semibold">Them</th>
          <th className="pb-2 font-semibold">Result</th>
        </tr>
      </thead>
      <tbody>
        {rounds.map((r) => (
          <tr key={r.stat} className="border-t border-white/10">
            <td className="py-2 capitalize text-white/80">{r.stat}</td>
            <td className="py-2 font-bold text-white">{r.playerScore}</td>
            <td className="py-2 font-bold text-white">{r.competitorScore}</td>
            <td className={`py-2 font-bold ${r.winner === "player" ? "text-green-400" : r.winner === "competitor" ? "text-red-400" : "text-white/50"}`}>
              {r.winner === "player" ? "Won" : r.winner === "competitor" ? "Lost" : "Tied"}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
