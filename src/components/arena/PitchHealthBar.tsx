import { motion } from "framer-motion";

type Props = { health: number };

// The only health bar left in the arena: the founder's "YOUR PITCH" meter, 100 -> 0. Thinner on
// mobile but always visible — this is the single stat that decides whether the pitch survives.
export default function PitchHealthBar({ health }: Props) {
  const color = health < 30 ? "#ef4444" : health < 60 ? "#f0a020" : "#38bdf8";
  return (
    <div className="w-full max-w-2xl px-6 pt-4">
      <div className="flex items-center justify-between text-sm font-bold uppercase tracking-widest text-sky-400/80">
        <span>Your Pitch</span>
        <span>{Math.round(health)}</span>
      </div>
      <div className="mt-1 h-1 w-full overflow-hidden rounded-full bg-white/10 sm:h-1.5">
        <motion.div
          className="h-full rounded-full"
          style={{ background: color }}
          animate={{ width: `${health}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}
