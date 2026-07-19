import { motion } from "framer-motion";

// A pulsing placeholder the size of a StartupCard, shown while a competitor card is still generating
export default function CardSkeleton() {
  return (
    <div className="flex w-[280px] shrink-0 flex-col items-center">
      <span className="mb-2 h-4 w-24 rounded-full bg-white/5" />
      <motion.div
        className="h-[400px] w-[280px] rounded-2xl border-2 border-white/10 bg-white/5"
        animate={{ opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}
