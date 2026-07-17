import { motion, AnimatePresence } from "framer-motion";

type Props = { active: boolean };

const RINGS = [0, 0.4, 0.8];

// Renders expanding, fading rings radiating out from the record button while recording
export default function RippleRings({ active }: Props) {
  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
      <AnimatePresence>
        {active &&
          RINGS.map((delay) => (
            <motion.span
              key={delay}
              className="absolute h-20 w-20 rounded-full border-2 border-red-500"
              initial={{ scale: 1, opacity: 0.6 }}
              animate={{ scale: 2.4, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeOut", delay }}
            />
          ))}
      </AnimatePresence>
    </div>
  );
}
