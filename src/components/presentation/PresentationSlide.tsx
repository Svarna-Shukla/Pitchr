import { motion } from "framer-motion";
import type { Slide } from "../../types/slide";
import type { SlideTheme } from "../../lib/premiumSlideTheme";
import SlideCard from "../deck/premium/SlideCard";

type Props = { slide: Slide; index: number; total: number; direction: number; slideTheme: SlideTheme };

// One face of Presentation Mode's 3D cube — the outgoing slide rotates out on the Y axis while the
// incoming one rotates in from the opposite face, direction-aware so left/right feels physical
const variants = {
  enter: (direction: number) => ({ opacity: 0, rotateY: direction > 0 ? 90 : -90 }),
  center: { opacity: 1, rotateY: 0 },
  exit: (direction: number) => ({ opacity: 0, rotateY: direction > 0 ? -90 : 90 }),
};

export default function PresentationSlide({ slide, index, total, direction, slideTheme }: Props) {
  return (
    <motion.div
      className="absolute inset-0"
      style={{ transformPerspective: 1600 }}
      custom={direction}
      variants={variants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <SlideCard slide={slide} index={index} total={total} context="fullscreen" slideTheme={slideTheme} />
    </motion.div>
  );
}
