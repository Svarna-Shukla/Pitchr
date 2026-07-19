import { motion } from "framer-motion";

type Props = { section: number; total: number; title: string };

// Top-of-quiz progress bar plus the current section's numbered title
export default function QuizProgressBar({ section, total, title }: Props) {
  const pct = ((section + 1) / total) * 100;
  return (
    <div className="mb-6">
      <div className="mb-2 flex items-center justify-between text-xs font-semibold uppercase tracking-widest text-white/40">
        <span>
          Section {section + 1} of {total}
        </span>
        <span className="text-[color:var(--color-accent)]">{title}</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
        <motion.div
          className="h-full rounded-full bg-[color:var(--color-accent)]"
          animate={{ width: `${pct}%` }}
          transition={{ type: "spring", stiffness: 120, damping: 20 }}
        />
      </div>
    </div>
  );
}
