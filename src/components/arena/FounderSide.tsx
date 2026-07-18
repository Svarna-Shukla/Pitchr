import { motion } from "framer-motion";

type Props = { founderHealth: number; isUnderAttack: boolean };

// Right half of the arena: the founder's health bar and a holographic blue avatar outline that shakes
// whenever an investor question is currently landing
export default function FounderSide({ founderHealth, isUnderAttack }: Props) {
  return (
    <div className="flex h-full w-1/2 flex-col items-center justify-center gap-4 pl-6">
      <div className="w-full max-w-xs">
        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-sky-400">
          <span>Your Pitch</span>
          <span>{Math.round(founderHealth)}/100</span>
        </div>
        <div className="mt-1 h-4 w-full rounded-sm border border-sky-900 bg-gray-900">
          <motion.div
            className="h-full bg-sky-500"
            animate={{ width: `${founderHealth}%` }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        </div>
      </div>

      <motion.div
        className="flex h-64 w-64 items-center justify-center rounded-full border-2 border-sky-400/60 sm:h-80 sm:w-80"
        style={{ boxShadow: "0 0 40px 10px rgba(56,189,248,0.25)", background: "radial-gradient(circle, rgba(56,189,248,0.08), transparent 70%)" }}
        animate={isUnderAttack ? { x: [-2, 2, -2, 2, 0] } : { x: 0 }}
        transition={{ duration: 0.4, repeat: isUnderAttack ? Infinity : 0 }}
      >
        <svg viewBox="0 0 100 140" className="h-2/3 w-2/3 opacity-70" fill="none" stroke="#38bdf8" strokeWidth="2">
          <circle cx="50" cy="35" r="24" />
          <path d="M12 130 Q12 80 50 78 Q88 80 88 130" />
        </svg>
      </motion.div>
    </div>
  );
}
