import { motion } from "framer-motion";
import { Share2, Swords } from "lucide-react";
import type { BattleOutcome, StartupCardData } from "../../../types/battleCard";
import { deriveInsight } from "../../../lib/battleCardScoring";
import { generateBattleResultDataUrl } from "../../../lib/battleCardShare";
import { downloadDataUrl } from "../../../lib/shareImage";
import RoundBreakdownTable from "./RoundBreakdownTable";
import Button from "../../Button";

type Props = { player: StartupCardData; competitor: StartupCardData; outcome: BattleOutcome; onAnotherCompetitor: () => void };

// Post-battle screen: big VICTORY/DEFEAT verdict, the round-by-round table, a one-line insight, and the
// two closing actions — rematch against a different competitor, or download a shareable result graphic
export default function BattleResultScreen({ player, competitor, outcome, onAnotherCompetitor }: Props) {
  const won = outcome.winner === "player";

  // Renders the result graphic to canvas and downloads it as a PNG
  const handleShare = () => {
    const dataUrl = generateBattleResultDataUrl(player, competitor, outcome);
    if (dataUrl) downloadDataUrl(dataUrl, `pitchr-battle-${player.name.toLowerCase().replace(/\s+/g, "-")}.png`);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-6 bg-black/95 px-6 py-10"
    >
      <motion.h2
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 14 }}
        className={`font-display text-6xl font-black uppercase tracking-widest sm:text-7xl ${won ? "text-green-400" : "text-red-400"}`}
      >
        {won ? "Victory" : "Defeat"}
      </motion.h2>
      <p className="text-sm text-white/60">
        {player.name} vs {competitor.name} — {outcome.playerWins} to {outcome.competitorWins}
      </p>

      <RoundBreakdownTable rounds={outcome.rounds} />

      <p className="max-w-md text-center text-sm text-white/70">{deriveInsight(outcome.rounds)}</p>

      <div className="mt-2 flex flex-wrap justify-center gap-3">
        <Button onClick={onAnotherCompetitor}>
          <Swords className="h-4 w-4" /> Battle Another Competitor
        </Button>
        <Button variant="ghost" onClick={handleShare}>
          <Share2 className="h-4 w-4" /> Share Result
        </Button>
      </div>
    </motion.div>
  );
}
