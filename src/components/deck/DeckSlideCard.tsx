import { forwardRef } from "react";
import { motion } from "framer-motion";
import type { Slide } from "../../types/slide";
import CopyButton from "../CopyButton";
import TiltCard from "../TiltCard";
import PremiumSlide from "./premium/PremiumSlide";

type Props = { slide: Slide; index: number; total: number };

// One slide in the horizontal deck-browsing row: the shared PremiumSlide shell/layout, wrapped in
// the entrance animation, tilt effect, and a copy button (both always dark, per the deck's forced
// palette). Full width on mobile, a fixed 800px on desktop. Forwards its ref so SlideDeckRow can
// track which card is currently in view for the "Slide X of N" counter and arrow navigation.
const DeckSlideCard = forwardRef<HTMLDivElement, Props>(function DeckSlideCard({ slide, index, total }, ref) {
  const copyText = () => `${slide.title}\n\n${slide.bulletPoints.map((b) => `- ${b}`).join("\n")}`;

  return (
    <motion.div
      ref={ref}
      className="relative w-full shrink-0 snap-start sm:w-[800px]"
      style={{ transformPerspective: 1400 }}
      initial={{ opacity: 0, rotateY: -85, x: 24 }}
      animate={{ opacity: 1, rotateY: 0, x: 0 }}
      transition={{ type: "spring", stiffness: 110, damping: 16, delay: index * 0.08 }}
    >
      <TiltCard className="aspect-video overflow-hidden rounded-2xl border border-white/10">
        <PremiumSlide slide={slide} index={index} total={total} context="grid" />
      </TiltCard>
      <div className="absolute right-3 top-3">
        <CopyButton getText={copyText} />
      </div>
    </motion.div>
  );
});

export default DeckSlideCard;
