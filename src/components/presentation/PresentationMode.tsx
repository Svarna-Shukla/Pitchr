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

  // Wires arrow-key navigation while the overlay is mounted. Escape is handled by the browser's
  // native Fullscreen API below; this listener is just a safety net for browsers where
  // requestFullscreen() is unavailable or was rejected.
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
      else if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose, slides.length]);

  // The fullscreen request itself is fired synchronously from the Present button's click handler
  // (see App.tsx) so it keeps the click's transient user activation. This effect just keeps the two
  // exit paths in sync: the browser's own ESC handling and the X button unmounting this component
  // both end up here via fullscreenchange, mirrored back into app state via onClose.
  useEffect(() => {
    const onFullscreenChange = () => {
      if (!document.fullscreenElement) onClose();
    };
    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", onFullscreenChange);
      if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    };
  }, [onClose]);

  return (
    // z-[100]: above every other overlay in the app (NavBar sits at z-[60] on purpose so it stays
    // clickable over other panels), since Presentation Mode is meant to hide all app chrome outright
    <div className="fixed inset-0 z-[100] flex items-center justify-center" style={{ background: "#000000" }}>
      <div className="vignette-layer" />
      <PresentationNav index={index} total={slides.length} onPrev={prev} onNext={next} onClose={onClose} />
      <motion.div
        className="relative"
        style={{ perspective: 1600, width: "min(100vw, 100vh * 16 / 9)", height: "min(100vh, 100vw * 9 / 16)" }}
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
