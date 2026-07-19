import { motion } from "framer-motion";

// A pulsing placeholder grid shown while all 17 outputs are still generating in parallel
export default function FounderKitSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {Array.from({ length: 6 }, (_, i) => (
        <motion.div
          key={i}
          className="h-28 rounded-2xl border border-white/10 bg-white/5"
          animate={{ opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut", delay: i * 0.08 }}
        />
      ))}
    </div>
  );
}
