import type { LayoutProps } from "../SlideLayout";
import { SLIDE_PALETTES, resolveAccent } from "../../../../lib/premiumSlideTheme";
import { HERO_TITLE_CLASS, LABEL_CLASS, LAYOUT_LABELS } from "./typeScale";

// Narrative quote layout: a single centred testimonial or mission-statement beat, no bullets or
// numbers implied. Reuses the slide's own title as the quote and its first bullet (if any) as the
// attribution line below — deliberately no new Slide fields for this, since both already exist.
export default function NarrativeQuoteLayout({ slide, slideTheme }: LayoutProps) {
  const palette = SLIDE_PALETTES[slideTheme];
  const accent = resolveAccent(slide.accentColor, slideTheme);
  const attribution = slide.bulletPoints[0];

  return (
    <div className="flex h-full flex-1 flex-col items-center justify-center-safe gap-6 text-center">
      <p className="text-xs uppercase tracking-widest opacity-50" style={{ color: palette.title }}>
        {LAYOUT_LABELS.narrative_quote}
      </p>
      <span className="font-display text-7xl leading-none" style={{ color: accent }}>
        &ldquo;
      </span>
      <h2 className={`max-w-[80%] font-display italic ${HERO_TITLE_CLASS}`} style={{ color: palette.title }}>
        {slide.title}
      </h2>
      {attribution && (
        <p className={LABEL_CLASS} style={{ color: accent }}>
          — {attribution}
        </p>
      )}
    </div>
  );
}
