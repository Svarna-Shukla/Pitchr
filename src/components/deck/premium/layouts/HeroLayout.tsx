import type { LayoutProps } from "../SlideLayout";
import { HERO_STAT_CLASS, HERO_TITLE_CLASS } from "./typeScale";

// Hero layout: a centered massive title with an optional huge orange stat below — no bullets, all whitespace
export default function HeroLayout({ slide, context }: LayoutProps) {
  return (
    <div className="flex h-full flex-1 flex-col items-center justify-center text-center">
      <h2 className={`font-display font-bold leading-[1.05] text-white ${HERO_TITLE_CLASS[context]}`}>{slide.title}</h2>
      {slide.stat && (
        <p className={`mt-6 font-display font-bold ${HERO_STAT_CLASS[context]}`} style={{ color: slide.accentColor }}>
          {slide.stat}
        </p>
      )}
    </div>
  );
}
