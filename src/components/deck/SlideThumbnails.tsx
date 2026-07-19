import type { Slide } from "../../types/slide";
import type { SlideTheme } from "../../lib/premiumSlideTheme";
import { SLIDE_PALETTES, resolveAccent } from "../../lib/premiumSlideTheme";

type Props = { slides: Slide[]; activeIndex: number; slideTheme: SlideTheme; onSelect: (index: number) => void };

// Strip of small 16:9 preview rectangles below the slide row — click any to jump straight to it.
// The active slide's thumbnail gets an accent-coloured border; the rest sit on a transparent one.
export default function SlideThumbnails({ slides, activeIndex, slideTheme, onSelect }: Props) {
  const palette = SLIDE_PALETTES[slideTheme];

  return (
    <div className="flex w-full gap-2 overflow-x-auto px-6 pb-2">
      {slides.map((slide, i) => {
        const isActive = i === activeIndex;
        const accent = resolveAccent(slide.accentColor, slideTheme);
        return (
          <button
            key={i}
            onClick={() => onSelect(i)}
            className="h-[45px] w-[80px] shrink-0 overflow-hidden rounded-md border-2 transition"
            style={{ background: palette.background, borderColor: isActive ? accent : "transparent" }}
            aria-label={`Jump to slide ${i + 1}`}
            aria-current={isActive}
          >
            <span className="flex h-full items-center justify-center text-[10px] font-bold" style={{ color: palette.title, opacity: 0.6 }}>
              {i + 1}
            </span>
          </button>
        );
      })}
    </div>
  );
}
