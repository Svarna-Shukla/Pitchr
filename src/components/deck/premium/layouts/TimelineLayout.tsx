import type { LayoutProps } from "../SlideLayout";
import { SLIDE_PALETTES, resolveAccent } from "../../../../lib/premiumSlideTheme";
import { LABEL_CLASS, LAYOUT_LABELS, TITLE_CLASS } from "./typeScale";
import SlideBullets from "../../../SlideBullets";

// Timeline layout: title over a horizontal stepped sequence (phase + title + detail), for
// roadmaps and traction narratives that don't need hard numbers. Falls back to a plain bullet
// list if the model didn't supply timelineSteps.
export default function TimelineLayout({ slide, context, slideTheme }: LayoutProps) {
  const palette = SLIDE_PALETTES[slideTheme];
  const accent = resolveAccent(slide.accentColor, slideTheme);
  const steps = slide.timelineSteps?.slice(0, 5);

  return (
    <div className="flex h-full flex-1 flex-col">
      <p className={`${LABEL_CLASS} mb-3 opacity-60`} style={{ color: accent }}>
        {LAYOUT_LABELS.timeline}
      </p>
      <h2 className={`font-display ${TITLE_CLASS}`} style={{ color: palette.title }}>
        {slide.title}
      </h2>
      {steps && steps.length ? (
        <div className="mt-10 flex flex-1 items-start gap-6">
          {steps.map((s, i) => (
            <div key={i} className="flex flex-1 flex-col gap-3 border-t-2 pt-4" style={{ borderColor: accent }}>
              <span className={LABEL_CLASS} style={{ color: accent }}>
                {s.phase}
              </span>
              <h3 className="text-2xl font-bold" style={{ color: palette.title }}>
                {s.title}
              </h3>
              <p className="text-lg leading-relaxed" style={{ color: palette.bullet }}>
                {s.detail}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <SlideBullets bullets={slide.bulletPoints} color={accent} textColor={palette.bullet} marker="dash" animate={context !== "pdf"} />
      )}
    </div>
  );
}
