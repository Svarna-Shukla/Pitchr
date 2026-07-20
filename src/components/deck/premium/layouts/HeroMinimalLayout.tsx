import type { LayoutProps } from "../SlideLayout";
import { SLIDE_PALETTES, resolveAccent } from "../../../../lib/premiumSlideTheme";
import { LABEL_CLASS, HERO_TITLE_CLASS } from "./typeScale";

// Hero-minimal layout: the sparest possible treatment — one italic pull-quote statement, centred,
// with an optional small attribution line drawn from the slide's first bullet. No stat, no chart,
// no bullet list — doubles as a narrative-quote beat between denser slides.
export default function HeroMinimalLayout({ slide, slideTheme }: LayoutProps) {
  const palette = SLIDE_PALETTES[slideTheme];
  const accent = resolveAccent(slide.accentColor, slideTheme);
  const attribution = slide.bulletPoints[0];

  return (
    <div className="flex h-full flex-1 flex-col items-center justify-center-safe gap-6 text-center">
      <span className="h-1 w-16 rounded-full" style={{ background: accent }} />
      <h2 className={`max-w-[85%] font-display italic ${HERO_TITLE_CLASS}`} style={{ color: palette.title }}>
        {slide.title}
      </h2>
      {attribution && (
        <p className={`${LABEL_CLASS} opacity-60`} style={{ color: accent }}>
          {attribution}
        </p>
      )}
    </div>
  );
}
