import type { LayoutProps } from "../SlideLayout";
import { SLIDE_PALETTES, resolveAccent } from "../../../../lib/premiumSlideTheme";
import { LABEL_CLASS, LAYOUT_LABELS, TITLE_CLASS } from "./typeScale";
import SlideBullets from "../../../SlideBullets";

// Hero-split layout: a hero-scale statement anchored to the left half, supporting bullets filling
// the right half — visual variety for opening/closing beats that want bullet support instead of
// hero's zero-bullets minimalism
export default function HeroSplitLayout({ slide, context, slideTheme }: LayoutProps) {
  const palette = SLIDE_PALETTES[slideTheme];
  const accent = resolveAccent(slide.accentColor, slideTheme);

  return (
    <div className="grid h-full flex-1 grid-cols-2 items-center gap-16">
      <div>
        <p className={`${LABEL_CLASS} mb-3 opacity-60`} style={{ color: accent }}>
          {LAYOUT_LABELS.hero_split}
        </p>
        <h2 className={`font-display ${TITLE_CLASS}`} style={{ color: palette.title }}>
          {slide.title}
        </h2>
      </div>
      <SlideBullets bullets={slide.bulletPoints} color={accent} textColor={palette.bullet} marker="dash" animate={context !== "pdf"} />
    </div>
  );
}
