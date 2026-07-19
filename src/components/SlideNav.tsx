import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

type Props = {
  onPrev: () => void;
  onNext: () => void;
  canPrev: boolean;
  canNext: boolean;
  variant?: "compact" | "floating";
  layout?: "inline" | "sides";
};

// Prev/next arrow pair with a physical press feel (scale up on hover, brief scale-down on click) —
// shared by the deck browsing row (compact, inline) and Presentation Mode (large, floating, pinned
// to the screen edges)
export default function SlideNav({ onPrev, onNext, canPrev, canNext, variant = "compact", layout = "inline" }: Props) {
  const isFloating = variant === "floating";
  const base = isFloating
    ? "flex h-14 w-14 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm hover:bg-white/20"
    : "flex h-8 w-8 items-center justify-center rounded-full border border-current/10 hover:border-current/30";
  const iconClass = isFloating ? "h-7 w-7" : "h-4 w-4";
  const prevPos = layout === "sides" ? "absolute left-6 top-1/2 z-10 -translate-y-1/2" : "";
  const nextPos = layout === "sides" ? "absolute right-6 top-1/2 z-10 -translate-y-1/2" : "";

  return (
    <>
      <motion.button
        onClick={onPrev}
        disabled={!canPrev}
        whileHover={canPrev ? { scale: 1.1 } : undefined}
        whileTap={canPrev ? { scale: 0.95 } : undefined}
        className={`${base} ${prevPos} disabled:cursor-not-allowed disabled:opacity-30`}
        aria-label="Previous slide"
      >
        <ChevronLeft className={iconClass} />
      </motion.button>
      <motion.button
        onClick={onNext}
        disabled={!canNext}
        whileHover={canNext ? { scale: 1.1 } : undefined}
        whileTap={canNext ? { scale: 0.95 } : undefined}
        className={`${base} ${nextPos} disabled:cursor-not-allowed disabled:opacity-30`}
        aria-label="Next slide"
      >
        <ChevronRight className={iconClass} />
      </motion.button>
    </>
  );
}
