import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

type Props = { health: number };

const FLASH_MS = 300;
const CRITICAL_THRESHOLD = 30;

// The founder's "YOUR PITCH" meter, 100 -> 0. Flashes red on damage and green on gain, then settles
// at the new value; pulses constantly once health drops to critical (<=30). Thinner on mobile but
// always visible — this is the single stat that decides whether the pitch survives.
export default function PitchHealthBar({ health }: Props) {
  const [flash, setFlash] = useState<"red" | "green" | null>(null);
  const prevHealth = useRef(health);

  // Flags a brief red or green flash whenever health actually changes value
  useEffect(() => {
    if (health === prevHealth.current) return;
    setFlash(health < prevHealth.current ? "red" : "green");
    prevHealth.current = health;
    const t = window.setTimeout(() => setFlash(null), FLASH_MS);
    return () => window.clearTimeout(t);
  }, [health]);

  const critical = health <= CRITICAL_THRESHOLD;
  const baseColor = health < 30 ? "#ef4444" : health < 60 ? "#f0a020" : "#38bdf8";
  const barColor = flash === "green" ? "#4ade80" : flash === "red" ? "#f87171" : baseColor;

  return (
    <div className="w-full max-w-2xl px-6 pt-4">
      <div className="flex items-center justify-between text-sm font-bold uppercase tracking-widest text-sky-400/80">
        <span>Your Pitch</span>
        <span>{Math.round(health)}</span>
      </div>
      <motion.div
        className="mt-1 h-1 w-full overflow-hidden rounded-full bg-white/10 sm:h-1.5"
        animate={critical ? { opacity: [1, 0.55, 1] } : { opacity: 1 }}
        transition={critical ? { duration: 0.9, repeat: Infinity, ease: "easeInOut" } : undefined}
      >
        <motion.div
          className="h-full rounded-full"
          style={{ background: barColor }}
          animate={{ width: `${health}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      </motion.div>
    </div>
  );
}
