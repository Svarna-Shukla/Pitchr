import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Slide } from "../../types/slide";
import type { SlideTheme } from "../../lib/premiumSlideTheme";
import PresentationSlide from "./PresentationSlide";
import PresentationNav from "./PresentationNav";

type Props = { slides: Slide[]; slideTheme: SlideTheme; onClose: () => void };

// Fullscreen one-slide-at-a-time presentation: a cinematic 3D zoom on entry, then a cube-style
// rotation between slides. Always renders at the current slideTheme (dark or light), independent
// of the app's own light/dark theme toggle.
export default function PresentationMode({ slides, slideTheme, onClose }: Props) {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  // Moves to the previous slide, if any
  const prev = () => {
    setDirection(-1);
    setIndex((i) => Math.max(0, i - 1));
  };

  // Moves to the next slide, if any
  const next = () => {
    setDirection(1);
    setIndex((i) => Math.min(slides.length - 1, i + 1));
  };

  // Wires arrow-key and Escape navigation while the overlay is mounted
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
      else if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose, slides.length]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-10" style={{ background: "#000000" }}>
      <div className="vignette-layer" />
      <PresentationNav index={index} total={slides.length} onPrev={prev} onNext={next} onClose={onClose} />
      <motion.div
        className="relative aspect-video w-full max-w-5xl"
        style={{ perspective: 1600 }}
        initial={{ scale: 0.3, rotateX: 10, opacity: 0 }}
        animate={{ scale: 1, rotateX: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <AnimatePresence custom={direction} mode="popLayout">
          <PresentationSlide key={index} slide={slides[index]} index={index} total={slides.length} direction={direction} slideTheme={slideTheme} />
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
