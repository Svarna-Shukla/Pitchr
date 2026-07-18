import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { playSwooshFX, playThudFX } from "../../utils/audioSynth";
import TypedQuestion from "./TypedQuestion";

type Props = { question: string; roundNumber: number; totalRounds: number; onLanded: () => void };

// Phase 3 of the arena: the investor's question flies in as a sharp SVG shard, then "shatters" on
// impact into the readable question text, triggering the founder's shake and the response timer
export default function ProjectileEngine({ question, roundNumber, totalRounds, onLanded }: Props) {
  const [landed, setLanded] = useState(false);
  const firedOnLanded = useRef(false);

  // Plays the launch swoosh exactly once per new question
  useEffect(() => {
    playSwooshFX();
    setLanded(false);
    firedOnLanded.current = false;
  }, [question]);

  // Fires the collision side-effects exactly once: thud SFX and the shake/health callback upstream
  const handleImpact = () => {
    if (firedOnLanded.current) return;
    firedOnLanded.current = true;
    playThudFX();
    setLanded(true);
    onLanded();
  };

  return (
    <div className="flex flex-col items-center gap-6 text-center">
      <span className="text-xs font-bold uppercase tracking-widest text-orange-400">
        Question {roundNumber} of {totalRounds}
      </span>

      {!landed && (
        <motion.svg
          width="70"
          height="70"
          viewBox="0 0 70 70"
          initial={{ x: "-70vw", rotate: 0, opacity: 1 }}
          animate={{ x: "0vw", rotate: 340, opacity: 1 }}
          transition={{ duration: 0.65, ease: "easeIn" }}
          onAnimationComplete={handleImpact}
        >
          <polygon points="35,2 60,25 50,68 20,68 10,25" fill="#f97316" stroke="#7c2d12" strokeWidth="2" />
        </motion.svg>
      )}

      {landed && (
        <motion.div initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }}>
          <TypedQuestion text={question} />
        </motion.div>
      )}
    </div>
  );
}
