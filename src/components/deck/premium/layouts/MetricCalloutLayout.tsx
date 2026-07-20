import type { LayoutProps } from "../SlideLayout";
import { SLIDE_PALETTES, resolveAccent, statTextShadow } from "../../../../lib/premiumSlideTheme";
import { LABEL_CLASS, LAYOUT_LABELS, STAT_CLASS } from "./typeScale";

// Metric callout layout: one number, as big as the canvas allows, with the title as a supporting
// statement underneath. Gated behind the same "transcript has real numbers" backstop as "chart" in
// useClaude.ts's normalizeSlide — never rendered for a slide whose stat got stripped.
export default function MetricCalloutLayout({ slide, context, slideTheme }: LayoutProps) {
  const palette = SLIDE_PALETTES[slideTheme];
  const accent = resolveAccent(slide.accentColor, slideTheme);

  return (
    <div className="flex h-full flex-1 flex-col items-center justify-center-safe gap-6 text-center">
      <p className={`${LABEL_CLASS} opacity-60`} style={{ color: accent }}>
        {LAYOUT_LABELS.metric_callout}
      </p>
      <p
        className={`font-display ${STAT_CLASS}`}
        style={{ color: accent, textShadow: statTextShadow(slideTheme), transform: context === "pdf" ? undefined : "translateZ(40px)" }}
      >
        {slide.stat}
      </p>
      <h2 className="max-w-[70%] text-2xl font-bold leading-snug" style={{ color: palette.title }}>
        {slide.title}
      </h2>
    </div>
  );
}
