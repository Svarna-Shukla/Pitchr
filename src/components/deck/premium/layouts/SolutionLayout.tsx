import type { LayoutProps } from "../SlideLayout";
import { SLIDE_PALETTES, resolveAccent } from "../../../../lib/premiumSlideTheme";
import { LABEL_CLASS, LAYOUT_LABELS, TITLE_CLASS } from "./typeScale";
import SlideBullets from "../../../SlideBullets";

// Solution layout: an accent-coloured massive title over clean, left-aligned bullets in the
// primary text colour — lots of room to breathe
export default function SolutionLayout({ slide, slideTheme }: LayoutProps) {
  const palette = SLIDE_PALETTES[slideTheme];
  const accent = resolveAccent(slide.accentColor, slideTheme);

  return (
    <div className="flex h-full flex-1 flex-col justify-center">
      <p className={`${LABEL_CLASS} mb-3 opacity-60`} style={{ color: accent }}>
        {LAYOUT_LABELS.solution}
      </p>
      <h2 className={`max-w-[80%] font-display ${TITLE_CLASS}`} style={{ color: accent }}>
        {slide.title}
      </h2>
      <SlideBullets bullets={slide.bulletPoints} color={accent} textColor={palette.title} marker="square" />
    </div>
  );
}
