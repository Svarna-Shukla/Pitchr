import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Swords } from "lucide-react";
import type { BattleCard } from "../../types/battleCard";
import Button from "../Button";

type Props = { player: BattleCard; competitors: BattleCard[] };

// Total power score used to resolve a battle: HP plus the sum of all move damage
function power(card: BattleCard): number {
  return card.hp + card.moves.reduce((sum, m) => sum + m.damage, 0);
}

// "Battle" button that animates the player against each competitor and declares a winner by power score
export default function BattleArena({ player, competitors }: Props) {
  const [fighting, setFighting] = useState(false);
  const [results, setResults] = useState<{ name: string; won: boolean }[] | null>(null);

  // Runs the deterministic battle resolution behind a short clash animation
  const handleBattle = () => {
    setFighting(true);
    setResults(null);
    setTimeout(() => {
      const playerPower = power(player);
      setResults(competitors.map((c) => ({ name: c.name, won: playerPower > power(c) })));
      setFighting(false);
    }, 1200);
  };

  return (
    <div className="mt-8 flex flex-col items-center gap-4">
      <Button onClick={handleBattle} disabled={fighting}>
        <Swords className="h-4 w-4" /> {fighting ? "Battling…" : "Battle!"}
      </Button>

      <AnimatePresence>
        {fighting && (
          <motion.div
            className="text-sm text-white/60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, x: [0, -8, 8, -8, 8, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2 }}
          >
            Clash in progress…
          </motion.div>
        )}
      </AnimatePresence>

      {results && (
        <div className="flex flex-col gap-2">
          {results.map((r) => (
            <p key={r.name} className={`text-sm font-bold ${r.won ? "text-green-400" : "text-red-400"}`}>
              {player.name} vs {r.name}: {r.won ? `${player.name} wins!` : `${r.name} wins!`}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
