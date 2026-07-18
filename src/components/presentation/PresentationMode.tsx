import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import type { Slide } from "../../types/slide";
import type { Theme } from "../../hooks/useTheme";
import PresentationSlide from "./PresentationSlide";
import PresentationNav from "./PresentationNav";

type Props = { slides: Slide[]; theme: Theme; onClose: () => void };

// Fullscreen one-slide-at-a-time presentation with keyboard and on-screen navigation
export default function PresentationMode({ slides, theme, onClose }: Props) {
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
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-10"
      style={{ background: theme === "dark" ? "#0a0a0a" : "#ffffff" }}
    >
      <PresentationNav index={index} total={slides.length} theme={theme} onPrev={prev} onNext={next} onClose={onClose} />
      <AnimatePresence mode="wait">
        <PresentationSlide key={index} slide={slides[index]} direction={direction} theme={theme} />
      </AnimatePresence>
    </div>
  );
}
