import { motion } from "framer-motion";

type Props = { label: string; value: number; colorClass: string };

// A single stat row: name, a bar that animates from 0 to its value on mount, and the number
export default function StatBar({ label, value, colorClass }: Props) {
  return (
    <div className="flex items-center gap-2 text-[10px]">
      <span className="w-16 shrink-0 font-bold uppercase tracking-wide text-white/60">{label}</span>
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10">
        <motion.div
          className={`h-full rounded-full ${colorClass}`}
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.9, ease: "easeOut", delay: 0.15 }}
        />
      </div>
      <span className="w-6 shrink-0 text-right font-bold text-white/80">{value}</span>
    </div>
  );
}
