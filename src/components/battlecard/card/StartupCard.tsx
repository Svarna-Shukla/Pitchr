import { motion } from "framer-motion";
import type { StartupCardData } from "../../../types/battleCard";
import { rarityStyle } from "../../../lib/battleCardStyle";
import TiltCard from "../../TiltCard";
import CardHeader from "./CardHeader";
import CardArt from "./CardArt";
import CardStatsList from "./CardStatsList";
import CardAbility from "./CardAbility";
import CardFooter from "./CardFooter";

type Props = { card: StartupCardData; badge?: string };

// The full Pokemon-trading-card-style startup card: 280x400, rarity-driven border/glow/gradient, holo tilt
// foil on Epic/Legendary, four animated stat bars, special ability, and a weakness/rarity footer.
export default function StartupCard({ card, badge }: Props) {
  const style = rarityStyle(card.rarity);
  const holo = card.rarity === "Epic" || card.rarity === "Legendary";

  return (
    <motion.div
      className="flex w-[280px] shrink-0 flex-col items-center"
      initial={{ opacity: 0, y: 20, rotateX: -10 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ type: "spring", stiffness: 130, damping: 16 }}
    >
      {badge && (
        <span className="mb-2 rounded-full bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white/70">
          {badge}
        </span>
      )}
      <TiltCard
        holo={holo}
        maxTilt={holo ? 12 : 6}
        className={`h-[400px] w-[280px] rounded-2xl border-2 p-1 ${style.borderClass} ${style.glowClass} ${
          card.rarity === "Legendary" ? "animate-[gold-shift_3s_linear_infinite] bg-[length:300%_300%]" : ""
        }`}
        style={
          card.rarity === "Legendary"
            ? { backgroundImage: "linear-gradient(120deg,#fde047,#f59e0b,#fde047,#fbbf24)" }
            : undefined
        }
      >
        <div className="flex h-full w-full flex-col rounded-xl bg-[#0f0f1a] p-3">
          <CardHeader name={card.name} hp={card.hp} rarity={card.rarity} />
          <CardArt name={card.name} businessType={card.businessType} rarity={card.rarity} />
          <p className="mb-2 text-[9px] italic text-white/40">{card.industry}</p>
          <CardStatsList stats={card} />
          <CardAbility ability={card.specialAbility} />
          <CardFooter weakness={card.weakness} rarity={card.rarity} />
        </div>
      </TiltCard>
    </motion.div>
  );
}
