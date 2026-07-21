import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { PersonalityId } from "../../types/investor";
import MaskStage from "./MaskStage";
import Button from "../Button";

type Props = { investorId: PersonalityId; onTryAgain: () => void; onViewPartial: () => void };

const FLASH_MS = 300;
const SURGE_MS = 1000;

// Game-over sequence fired the instant health hits 0: a red flash, the mask surging forward to fill
// the screen for a beat, then "PITCH FAILED." in massive type over the mask as it settles and stares
export default function GameOverOverlay({ investorId, onTryAgain, onViewPartial }: Props) {
  const [stage, setStage] = useState<"flash" | "surge" | "reveal">("flash");

  // Advances flash -> surge -> reveal on fixed timers, once, on mount
  useEffect(() => {
    const t1 = window.setTimeout(() => setStage("surge"), FLASH_MS);
    const t2 = window.setTimeout(() => setStage("reveal"), FLASH_MS + SURGE_MS);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[95] flex flex-col items-center justify-center overflow-hidden bg-black">
      <AnimatePresence>
        {stage === "flash" && (
          <motion.div
            className="pointer-events-none fixed inset-0 z-[1] bg-red-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.85, 0.3] }}
            exit={{ opacity: 0 }}
            transition={{ duration: FLASH_MS / 1000 }}
          />
        )}
      </AnimatePresence>

      <MaskStage
        state={stage === "surge" ? "gameover" : "idle"}
        attackTrigger={0}
        investorId={investorId}
        flash={null}
        flashKey={0}
        fill={stage === "surge"}
      />

      {stage === "reveal" && (
        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/50 px-6 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="font-display text-5xl font-black text-white sm:text-7xl">PITCH FAILED.</h1>
          <p className="max-w-md text-base text-white/60 sm:text-lg">The investor passed. Your pitch didn't survive.</p>
          <div className="mt-4 flex w-full max-w-sm flex-col gap-3 sm:flex-row">
            <Button variant="ghost" onClick={onTryAgain} className="flex-1">
              Try Again
            </Button>
            <Button onClick={onViewPartial} className="flex-1">
              See What Went Wrong
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
