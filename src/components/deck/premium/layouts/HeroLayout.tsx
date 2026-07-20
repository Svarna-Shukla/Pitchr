import type { LayoutProps } from "../SlideLayout";
import { SLIDE_PALETTES, resolveAccent, statTextShadow } from "../../../../lib/premiumSlideTheme";
import { HERO_STAT_CLASS, HERO_TITLE_CLASS, LAYOUT_LABELS } from "./typeScale";

// Hero layout: an Apple product-reveal moment — a tiny kicker, one massive centred title, and an
// optional floating stat below. Zero bullets, maximum whitespace, one idea only.
export default function HeroLayout({ slide, context, slideTheme }: LayoutProps) {
  const palette = SLIDE_PALETTES[slideTheme];
  const accent = resolveAccent(slide.accentColor, slideTheme);

  return (
    <div className="flex h-full flex-1 flex-col items-center justify-center gap-8 text-center">
      <p className="text-xs uppercase tracking-widest opacity-50" style={{ color: palette.title }}>
        {LAYOUT_LABELS.hero}
      </p>
      <h2 className={`font-display ${HERO_TITLE_CLASS}`} style={{ color: palette.title }}>
        {slide.title}
      </h2>
      {slide.stat && (
        <p
          className={`font-display ${HERO_STAT_CLASS}`}
          style={{ color: accent, textShadow: statTextShadow(slideTheme), transform: context === "pdf" ? undefined : "translateZ(40px)" }}
        >
          {slide.stat}
        </p>
      )}
    </div>
  );
}
