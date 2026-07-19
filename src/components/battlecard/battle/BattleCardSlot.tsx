import { motion } from "framer-motion";
import type { StartupCardData } from "../../../types/battleCard";
import StartupCard from "../card/StartupCard";
import CardCrackOverlay from "./CardCrackOverlay";
import CardShatterOverlay from "./CardShatterOverlay";

type Props = { card: StartupCardData; side: "left" | "right"; crackCount: number; flash: "win" | "lose" | null; final: "winner" | "loser" | null };

const FLASH_CLASS = { win: "ring-4 ring-green-400/80 shadow-[0_0_50px_10px_rgba(74,222,128,0.5)]", lose: "ring-4 ring-red-500/80" };

// One side of the battle stage: the card itself plus its reactive round-flash ring, accumulated cracks,
// and — once the battle is fully resolved — either a triumphant glow surge or a shatter-into-fragments exit
export default function BattleCardSlot({ card, side, crackCount, flash, final }: Props) {
  const fromX = side === "left" ? -400 : 400;
  return (
    <motion.div
      className="relative"
      initial={{ x: fromX, opacity: 0 }}
      animate={{
        x: final === "winner" ? (side === "left" ? 20 : -20) : 0,
        opacity: final === "loser" ? 0 : 1,
        scale: final === "winner" ? 1.06 : 1,
      }}
      transition={{ type: "spring", stiffness: 120, damping: 18 }}
    >
      <div className={`rounded-2xl transition-shadow duration-300 ${flash ? FLASH_CLASS[flash] : ""}`}>
        <StartupCard card={card} />
      </div>
      <CardCrackOverlay count={crackCount} />
      {final === "loser" && <CardShatterOverlay />}
    </motion.div>
  );
}
