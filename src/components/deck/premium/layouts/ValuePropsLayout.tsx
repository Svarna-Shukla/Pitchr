import type { LayoutProps } from "../SlideLayout";
import { SLIDE_PALETTES, resolveAccent } from "../../../../lib/premiumSlideTheme";
import { LABEL_CLASS, LAYOUT_LABELS, TITLE_CLASS } from "./typeScale";
import SlideBullets from "../../../SlideBullets";

// Value-props layout: title over a 2-column grid of short qualitative value props (a title +
// description each, no numbers implied). Falls back to a plain bullet list if the model didn't
// supply a featureGrid.
export default function ValuePropsLayout({ slide, context, slideTheme }: LayoutProps) {
  const palette = SLIDE_PALETTES[slideTheme];
  const accent = resolveAccent(slide.accentColor, slideTheme);
  const features = slide.featureGrid?.slice(0, 4);

  return (
    <div className="flex h-full flex-1 flex-col">
      <p className={`${LABEL_CLASS} mb-3 opacity-60`} style={{ color: accent }}>
        {LAYOUT_LABELS.value_props}
      </p>
      <h2 className={`font-display ${TITLE_CLASS}`} style={{ color: palette.title }}>
        {slide.title}
      </h2>
      {features && features.length ? (
        <div className="mt-8 grid flex-1 grid-cols-2 gap-8">
          {features.map((f, i) => (
            <div key={i} className="flex flex-col gap-2">
              <span className="h-1.5 w-8 rounded-full" style={{ background: accent }} />
              <h3 className="text-3xl font-bold" style={{ color: palette.title }}>
                {f.title}
              </h3>
              <p className="text-2xl font-medium leading-relaxed" style={{ color: palette.bullet }}>
                {f.description}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <SlideBullets bullets={slide.bulletPoints} color={accent} textColor={palette.bullet} marker="square" animate={context !== "pdf"} />
      )}
    </div>
  );
}
