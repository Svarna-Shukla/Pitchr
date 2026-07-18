import { useEffect, useState } from "react";
import { motion, animate } from "framer-motion";

type Props = { total: number; grade: string };

// Massive letter grade with a spring-eased number counter charging up from 0 to the final score
export default function GradeReveal({ total, grade }: Props) {
  const [display, setDisplay] = useState(0);

  // Animates the displayed score from 0 up to the real total using a spring curve, not a linear tween
  useEffect(() => {
    const controls = animate(0, total, {
      type: "spring",
      stiffness: 90,
      damping: 18,
      onUpdate: (value) => setDisplay(Math.round(value)),
    });
    return () => controls.stop();
  }, [total]);

  return (
    <div className="flex flex-col items-center gap-1">
      <motion.div
        className="font-display text-8xl font-black text-orange-400"
        initial={{ scale: 0.4, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 14 }}
      >
        {grade}
      </motion.div>
      <span className="text-lg font-semibold text-white/70">{display}/60</span>
    </div>
  );
}
