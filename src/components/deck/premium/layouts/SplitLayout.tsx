import type { LayoutProps } from "../SlideLayout";
import { SLIDE_PALETTES, resolveAccent, statTextShadow } from "../../../../lib/premiumSlideTheme";
import { STAT_CLASS, TITLE_CLASS } from "./typeScale";
import SlideBullets from "../../../SlideBullets";

// Split layout: a strict 50/50 grid — a massive title on the left, a massive stat (or bullet
// points, if there's no stat) on the right, divided by a thin accent line. The always-safe fallback.
export default function SplitLayout({ slide, context, slideTheme }: LayoutProps) {
  const palette = SLIDE_PALETTES[slideTheme];
  const accent = resolveAccent(slide.accentColor, slideTheme);

  return (
    <div className="relative grid h-full flex-1 grid-cols-2 items-center gap-12">
      <div className="absolute left-1/2 top-16 bottom-16 w-px bg-orange-500" />
      <h2 className={`font-display ${TITLE_CLASS}`} style={{ color: palette.title }}>
        {slide.title}
      </h2>
      <div className="flex h-full flex-col justify-center-safe">
        {slide.stat ? (
          <p
            className={`font-display ${STAT_CLASS}`}
            style={{ color: accent, textShadow: statTextShadow(slideTheme), transform: context === "pdf" ? undefined : "translateZ(40px)" }}
          >
            {slide.stat}
          </p>
        ) : (
          <SlideBullets bullets={slide.bulletPoints} color={accent} textColor={palette.bullet} marker="square" animate={context !== "pdf"} />
        )}
      </div>
    </div>
  );
}
