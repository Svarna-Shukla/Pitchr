import { motion } from "framer-motion";

// Slides up the subtitle after the headline finishes animating
export default function Subtitle() {
  return (
    <motion.p
      className="mt-4 text-center text-lg text-white/60"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 2.4, ease: "easeOut" }}
    >
      60 seconds of talking. A complete founder kit.
    </motion.p>
  );
}
