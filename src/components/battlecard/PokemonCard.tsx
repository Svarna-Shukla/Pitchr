import { motion } from "framer-motion";
import type { BattleCard } from "../../types/battleCard";
import TiltCard from "../TiltCard";

type Props = { card: BattleCard; accent?: string };

const RARITY_GLOW: Record<BattleCard["rarity"], string> = {
  Common: "shadow-gray-400/30",
  Uncommon: "shadow-green-400/40",
  Rare: "shadow-blue-400/40",
  Epic: "shadow-purple-400/50",
  Legendary: "shadow-yellow-400/60",
};

// Pokemon-trading-card-styled business card: mouse-tracked holo foil border, gradient art, stats, moves, weakness, rarity
export default function PokemonCard({ card, accent = "#8b5cf6" }: Props) {
  return (
    <motion.div
      className="w-64 shrink-0"
      initial={{ opacity: 0, y: 16, rotateX: -8 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ type: "spring", stiffness: 140, damping: 16 }}
    >
      <TiltCard
        holo
        maxTilt={10}
        className={`rounded-2xl p-1 shadow-2xl ${RARITY_GLOW[card.rarity] ?? RARITY_GLOW.Common}`}
        style={{ background: "linear-gradient(135deg, #fde047, #facc15, #f59e0b, #fde047)" }}
      >
        <div className="rounded-xl bg-[#0f0f1a] p-3">
          <div className="flex items-center justify-between gap-2">
            <h4 className="truncate text-base font-black text-white">{card.name}</h4>
            <span className="shrink-0 text-sm font-bold text-red-400">HP {card.hp}</span>
          </div>
          <div className="mt-1 flex items-center gap-2">
            <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-bold uppercase text-white/70">{card.category}</span>
            <span className="rounded-full bg-yellow-400/20 px-2 py-0.5 text-[10px] font-bold uppercase text-yellow-300">{card.rarity}</span>
          </div>

          <div
            className="my-3 flex h-24 items-center justify-center rounded-lg"
            style={{ background: `linear-gradient(135deg, ${accent}55, #0b0b12)` }}
          >
            <span className="text-3xl font-black text-white/20">{card.name.slice(0, 1).toUpperCase()}</span>
          </div>

          <div className="flex flex-col gap-1.5">
            {card.moves.slice(0, 4).map((m) => (
              <div key={m.name} className="flex items-center justify-between text-xs">
                <span className="text-white/80">{m.name}</span>
                <span className="font-bold text-orange-300">{m.damage}</span>
              </div>
            ))}
          </div>

          <p className="mt-3 border-t border-white/10 pt-2 text-[10px] text-white/50">
            <span className="font-bold text-white/70">Weakness: </span>
            {card.weakness}
          </p>
        </div>
      </TiltCard>
    </motion.div>
  );
}
