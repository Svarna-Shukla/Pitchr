import { motion, AnimatePresence } from "framer-motion";

type Props = { active: boolean };

const BAR_COUNT = 4;
const BAR_HEIGHTS = ["30%", "100%", "45%", "80%", "30%"];

// Small "Listening..." pill with a mini bouncing equalizer, floating at the top of the mask stage
// whenever the investor is actively taking in the founder's answer — a quick, legible confirmation
// that the room is paying attention, on top of the ambient glow rings.
export default function ListeningBadge({ active }: Props) {
  return (
    <AnimatePresence>
      {active && (
        <motion.div
          className="pointer-events-none absolute top-2 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2 rounded-full border border-sky-400/25 bg-black/50 px-3 py-1.5 backdrop-blur-md"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3 }}
        >
          <span className="flex h-3 items-end gap-[2px]">
            {Array.from({ length: BAR_COUNT }).map((_, i) => (
              <motion.span
                key={i}
                className="w-[3px] rounded-full bg-sky-400"
                animate={{ height: BAR_HEIGHTS }}
                transition={{ duration: 1 + i * 0.15, repeat: Infinity, ease: "easeInOut", delay: i * 0.12 }}
              />
            ))}
          </span>
          <span className="text-[11px] font-semibold uppercase tracking-widest text-sky-300/90">Listening…</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
