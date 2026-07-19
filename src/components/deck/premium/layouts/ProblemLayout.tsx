import type { LayoutProps } from "../SlideLayout";
import { SLIDE_PALETTES, resolveAccent, statTextShadow } from "../../../../lib/premiumSlideTheme";
import { LABEL_CLASS, LAYOUT_LABELS, STAT_CLASS, TITLE_CLASS } from "./typeScale";
import SlideBullets from "../../../SlideBullets";

// Problem layout: a massive left-aligned title over up to three square-marked bullets, with an
// optional stat floating as a huge, low-opacity decorative number in the top-right corner. The
// subtle red/pink background tint itself is applied one level up, in SlideCard's shell.
export default function ProblemLayout({ slide, slideTheme }: LayoutProps) {
  const palette = SLIDE_PALETTES[slideTheme];
  const accent = resolveAccent(slide.accentColor, slideTheme);

  return (
    <div className="relative flex h-full flex-1 flex-col justify-center">
      {slide.stat && (
        <span
          className={`absolute right-0 top-0 select-none font-display opacity-20 ${STAT_CLASS}`}
          style={{ color: accent, textShadow: statTextShadow(slideTheme), transform: "translateZ(40px)" }}
        >
          {slide.stat}
        </span>
      )}
      <p className={`${LABEL_CLASS} mb-3 opacity-60`} style={{ color: accent }}>
        {LAYOUT_LABELS.problem}
      </p>
      <h2 className={`max-w-[80%] font-display ${TITLE_CLASS}`} style={{ color: palette.title }}>
        {slide.title}
      </h2>
      <SlideBullets bullets={slide.bulletPoints} color={accent} textColor={palette.bullet} marker="square" />
    </div>
  );
}
