import type { LayoutProps } from "../SlideLayout";
import { TITLE_CLASS } from "./typeScale";

const SIZE = 260;
const MARGIN = 30;
const PLOT = SIZE - MARGIN * 2;

// Hand-built SVG 2x2 positioning matrix for the competitive-advantage slide — deliberately named
// "CompetitorQuadrant" (not "*Radar*") so it isn't confused with the separate, unrelated
// CompetitorRadarPanel feature already living in the deck tab (src/components/competitorradar/)
export default function CompetitorQuadrant({ slide, context }: LayoutProps) {
  const q = slide.quadrant;

  return (
    <div className="flex h-full flex-1 flex-col">
      <h2 className={`font-display font-bold leading-tight text-white ${TITLE_CLASS[context]}`}>{slide.title}</h2>
      {q && (
        <div className="mt-4 flex flex-1 items-center justify-center">
          <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="h-full max-h-[320px]">
            <rect x={MARGIN} y={MARGIN} width={PLOT} height={PLOT} fill="none" stroke="#333333" strokeWidth={1} />
            <line x1={MARGIN} y1={SIZE / 2} x2={SIZE - MARGIN} y2={SIZE / 2} stroke={slide.accentColor} strokeWidth={1.5} />
            <line x1={SIZE / 2} y1={MARGIN} x2={SIZE / 2} y2={SIZE - MARGIN} stroke={slide.accentColor} strokeWidth={1.5} />

            <text x={SIZE / 2} y={SIZE - 6} textAnchor="middle" fill="#ffffff88" fontSize={9}>
              {q.xAxisLabel}
            </text>
            <text x={12} y={SIZE / 2} textAnchor="middle" fill="#ffffff88" fontSize={9} transform={`rotate(-90 12 ${SIZE / 2})`}>
              {q.yAxisLabel}
            </text>

            {q.points.map((p, i) => {
              const cx = MARGIN + (p.x / 100) * PLOT;
              const cy = SIZE - MARGIN - (p.y / 100) * PLOT;
              return (
                <g key={i}>
                  <circle cx={cx} cy={cy} r={p.isFounder ? 6 : 4} fill={p.isFounder ? slide.accentColor : "#777777"} />
                  <text
                    x={cx}
                    y={cy - 10}
                    textAnchor="middle"
                    fill={p.isFounder ? slide.accentColor : "#ffffff99"}
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
