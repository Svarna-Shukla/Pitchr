import { forwardRef } from "react";
import { motion } from "framer-motion";
import type { Slide } from "../../types/slide";
import type { SlideTheme } from "../../lib/premiumSlideTheme";
import CopyButton from "../CopyButton";
import SlideCard from "./premium/SlideCard";

type Props = { slide: Slide; index: number; total: number; slideTheme: SlideTheme };

// One slide in the horizontal deck-browsing row: SlideCard's 3D shell, wrapped in a flip-in
// entrance animation and a copy button. Full width on mobile, a fixed 800px on desktop. Forwards
// its ref so SlideDeckRow can track which card is currently in view for the counter and nav.
const DeckSlideCard = forwardRef<HTMLDivElement, Props>(function DeckSlideCard({ slide, index, total, slideTheme }, ref) {
  const copyText = () => `${slide.title}\n\n${slide.bulletPoints.map((b) => `- ${b}`).join("\n")}`;

  return (
    <motion.div
      ref={ref}
      className="relative w-full shrink-0 snap-start sm:w-[800px]"
      style={{ perspective: 1400 }}
      initial={{ opacity: 0, rotateY: 90, scale: 0.95 }}
      animate={{ opacity: 1, rotateY: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: index * 0.08 }}
    >
      <div className="aspect-video overflow-hidden rounded-2xl">
        <SlideCard slide={slide} index={index} total={total} context="grid" slideTheme={slideTheme} />
      </div>
      <div className="absolute right-3 top-3">
        <CopyButton getText={copyText} />
      </div>
    </motion.div>
  );
});

export default DeckSlideCard;
