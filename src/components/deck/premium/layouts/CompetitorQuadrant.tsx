import type { LayoutProps } from "../SlideLayout";
import { SLIDE_PALETTES, resolveAccent } from "../../../../lib/premiumSlideTheme";
import { LABEL_CLASS, LAYOUT_LABELS, TITLE_CLASS } from "./typeScale";

const SIZE = 260;
const MARGIN = 30;
const PLOT = SIZE - MARGIN * 2;

// Hand-built SVG 2x2 positioning matrix for the competitive-advantage slide — deliberately named
// "CompetitorQuadrant" (not "*Radar*") so it isn't confused with the separate, unrelated
// CompetitorRadarPanel feature already living in the deck tab (src/components/competitorradar/)
export default function CompetitorQuadrant({ slide, slideTheme }: LayoutProps) {
  const palette = SLIDE_PALETTES[slideTheme];
  const accent = resolveAccent(slide.accentColor, slideTheme);
  const q = slide.quadrant;
  const gridStroke = slideTheme === "yc" ? "#dddddd" : "#333333";
  const axisLabelColor = slideTheme === "yc" ? "#00000066" : "#ffffff88";
  const cornerColor = slideTheme === "yc" ? "#00000099" : "#ffffffaa";
  const dotColor = slideTheme === "yc" ? "#999999" : "#777777";

  return (
    <div className="flex h-full flex-1 flex-col">
      <p className={`${LABEL_CLASS} mb-3 opacity-60`} style={{ color: accent }}>
        {LAYOUT_LABELS.competitor_radar}
      </p>
      <h2 className={`font-display ${TITLE_CLASS}`} style={{ color: palette.title }}>
        {slide.title}
      </h2>
      {q && (
        <div className="mt-4 flex h-[65%] flex-1 items-center justify-center">
          <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="h-full max-h-full">
            <rect x={MARGIN} y={MARGIN} width={PLOT} height={PLOT} fill="none" stroke={gridStroke} strokeWidth={1} />
            <line x1={MARGIN} y1={SIZE / 2} x2={SIZE - MARGIN} y2={SIZE / 2} stroke={accent} strokeWidth={1.5} />
            <line x1={SIZE / 2} y1={MARGIN} x2={SIZE / 2} y2={SIZE - MARGIN} stroke={accent} strokeWidth={1.5} />

            <text x={SIZE / 2} y={SIZE - 6} textAnchor="middle" fill={axisLabelColor} fontSize={9}>
              {q.xAxisLabel}
            </text>
            <text x={12} y={SIZE / 2} textAnchor="middle" fill={axisLabelColor} fontSize={9} transform={`rotate(-90 12 ${SIZE / 2})`}>
              {q.yAxisLabel}
            </text>

            {/* Four small quadrant corner labels naming each end of both axes */}
            <text x={MARGIN + 4} y={MARGIN - 8} textAnchor="start" fill={cornerColor} fontSize={8} fontWeight={600}>
              High {q.yAxisLabel}
            </text>
            <text x={MARGIN + 4} y={SIZE - MARGIN + 16} textAnchor="start" fill={cornerColor} fontSize={8} fontWeight={600}>
              Low {q.yAxisLabel}
            </text>
            <text x={SIZE - MARGIN} y={SIZE / 2 - 8} textAnchor="end" fill={cornerColor} fontSize={8} fontWeight={600}>
              High {q.xAxisLabel}
            </text>
            <text x={MARGIN} y={SIZE / 2 - 8} textAnchor="start" fill={cornerColor} fontSize={8} fontWeight={600}>
              Low {q.xAxisLabel}
            </text>

            {q.points.map((p, i) => {
              const cx = MARGIN + (p.x / 100) * PLOT;
              const cy = SIZE - MARGIN - (p.y / 100) * PLOT;
              return (
                <g key={i}>
                  <circle cx={cx} cy={cy} r={p.isFounder ? 6 : 4} fill={p.isFounder ? accent : dotColor} />
                  <text
                    x={cx}
                    y={cy - 10}
                    textAnchor="middle"
                    fill={p.isFounder ? accent : dotColor}
                    fontSize={9}
                    fontWeight={p.isFounder ? 700 : 400}
                  >
                    {p.name}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      )}
    </div>
  );
}
