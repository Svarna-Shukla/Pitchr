import { motion } from "framer-motion";
import type { Slide } from "../../types/slide";
import PremiumSlide from "../deck/premium/PremiumSlide";

type Props = { slide: Slide; index: number; total: number; direction: number };

// Renders one slide fullscreen for Presentation Mode, sliding in from the given direction — the
// shared PremiumSlide shell/layout, always dark regardless of the app's own theme toggle
export default function PresentationSlide({ slide, index, total, direction }: Props) {
  return (
    <motion.div
      className="aspect-video w-full max-w-5xl"
      initial={{ opacity: 0, x: direction * 80 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -direction * 80 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      <PremiumSlide slide={slide} index={index} total={total} context="fullscreen" />
    </motion.div>
  );
}
