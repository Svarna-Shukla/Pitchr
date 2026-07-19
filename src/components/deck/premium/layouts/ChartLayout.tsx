import type { LayoutProps } from "../SlideLayout";
import { SLIDE_PALETTES, resolveAccent } from "../../../../lib/premiumSlideTheme";
import { capBullets } from "../../../../lib/text";
import { BULLET_CLASS, LABEL_CLASS, LAYOUT_LABELS, TITLE_CLASS } from "./typeScale";
import SlideChart from "./SlideChart";

// Chart layout: title + one short bullet along the top, the chart itself filling the bottom 55% of
// the slide with no outer border or background of its own
export default function ChartLayout({ slide, context, slideTheme }: LayoutProps) {
  const palette = SLIDE_PALETTES[slideTheme];
  const accent = resolveAccent(slide.accentColor, slideTheme);
  const bullet = capBullets(slide.bulletPoints)[0];
  const animate = context !== "pdf";

  return (
    <div className="flex h-full flex-1 flex-col">
      <p className={`${LABEL_CLASS} mb-3 opacity-60`} style={{ color: accent }}>
        {LAYOUT_LABELS.chart}
      </p>
      <div className="flex items-start justify-between gap-6">
        <h2 className={`font-display ${TITLE_CLASS}`} style={{ color: palette.title }}>
          {slide.title}
        </h2>
        {bullet && (
          <p className={`max-w-[40%] text-right ${BULLET_CLASS}`} style={{ color: palette.bullet }}>
            {bullet}
          </p>
        )}
      </div>
      {slide.chart && (
        <div className="mt-6 h-[55%] min-h-0">
          <SlideChart chart={slide.chart} theme={slideTheme} animate={animate} />
        </div>
      )}
    </div>
  );
}
