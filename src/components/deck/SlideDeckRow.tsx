import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Slide } from "../../types/slide";
import type { Theme } from "../../hooks/useTheme";
import DeckSlideCard from "./DeckSlideCard";

type Props = { slides: Slide[]; theme: Theme };

// Horizontal, snap-scrolling row of 16:9 slide cards — a real presentation deck laid out left to
// right. A "Slide X of N" counter and prev/next arrows sit above the row, themed to match the app's
// own light/dark toggle (unlike the cards themselves, which sit on the deck's forced-dark palette).
// The counter tracks whichever card is most visible, so it stays in sync with manual
// swiping/scrolling too, not just the arrow buttons.
export default function SlideDeckRow({ slides, theme }: Props) {
  const isDark = theme === "dark";
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  // Last-known intersection ratio per card index — IntersectionObserver doesn't guarantee every
  // observed target reports in the same callback batch, so picking the "most visible" card from a
  // single batch's entries alone can pick a lower-ratio card just because it happened to fire last
  const ratiosRef = useRef<number[]>([]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    ratiosRef.current = new Array(slides.length).fill(0);
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const index = cardRefs.current.findIndex((el) => el === entry.target);
          if (index !== -1) ratiosRef.current[index] = entry.intersectionRatio;
        }
        let bestIndex = 0;
        let bestRatio = -1;
        ratiosRef.current.forEach((ratio, i) => {
          if (ratio > bestRatio) {
            bestRatio = ratio;
            bestIndex = i;
          }
        });
        setActiveIndex(bestIndex);
      },
      { root: container, threshold: [0, 0.25, 0.5, 0.6, 0.75, 1] }
    );
    cardRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [slides.length]);

  // Smooth-scrolls a given card to the start of the row; arrow buttons clamp at the deck's ends
  const goTo = (index: number) => {
    const clamped = Math.max(0, Math.min(slides.length - 1, index));
    cardRefs.current[clamped]?.scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" });
  };

  return (
    <div className="flex w-full flex-col gap-3">
      <div className="flex items-center justify-between px-6">
        <span
          className="text-xs font-semibold uppercase tracking-widest"
          style={{ color: isDark ? "var(--color-text-muted)" : "var(--color-text-muted-light)" }}
        >
          Slide {activeIndex + 1} of {slides.length}
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => goTo(activeIndex - 1)}
            disabled={activeIndex === 0}
            className={`flex h-8 w-8 items-center justify-center rounded-full border transition disabled:cursor-not-allowed disabled:opacity-30 ${
              isDark ? "border-white/10 text-white hover:border-white/30" : "border-black/10 text-black hover:border-black/30"
            }`}
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => goTo(activeIndex + 1)}
            disabled={activeIndex === slides.length - 1}
            className={`flex h-8 w-8 items-center justify-center rounded-full border transition disabled:cursor-not-allowed disabled:opacity-30 ${
              isDark ? "border-white/10 text-white hover:border-white/30" : "border-black/10 text-black hover:border-black/30"
            }`}
            aria-label="Next slide"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div ref={containerRef} className="flex w-full snap-x snap-mandatory gap-6 overflow-x-auto px-6 pb-6">
        {slides.map((slide, i) => (
          <DeckSlideCard
            key={i}
            ref={(el) => {
              cardRefs.current[i] = el;
            }}
            slide={slide}
            index={i}
            total={slides.length}
          />
        ))}
      </div>
    </div>
  );
}
