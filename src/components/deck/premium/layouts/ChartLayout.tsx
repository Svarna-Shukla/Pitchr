import { Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import type { LayoutProps } from "../SlideLayout";
import { TITLE_CLASS } from "./typeScale";

// Chart layout: title + one supporting bullet at top, the chart fills the bottom half — colors come
// straight from the (already-sanitized) data array, transparent background, white text, dark gridlines
export default function ChartLayout({ slide, context }: LayoutProps) {
  const chart = slide.chart;
  const animate = context !== "pdf";

  return (
    <div className="flex h-full flex-1 flex-col">
      <h2 className={`font-display font-bold leading-tight text-white ${TITLE_CLASS[context]}`}>{slide.title}</h2>
      {slide.bulletPoints[0] && <p className="mt-2 text-sm text-white/70">{slide.bulletPoints[0]}</p>}
      <div className="mt-4 min-h-0 flex-1">
        {chart && (
          <ResponsiveContainer width="100%" height="100%">
            {chart.type === "bar" ? (
              <BarChart data={chart.data}>
                <CartesianGrid stroke="#333333" vertical={false} />
                <XAxis dataKey="name" stroke="#ffffff88" fontSize={12} tickLine={false} />
                <YAxis stroke="#ffffff88" fontSize={12} tickLine={false} axisLine={false} />
                <Bar dataKey="value" isAnimationActive={animate} radius={[4, 4, 0, 0]}>
                  {chart.data.map((d, i) => (
                    <Cell key={i} fill={d.color} />
                  ))}
                </Bar>
              </BarChart>
            ) : chart.type === "line" ? (
              <LineChart data={chart.data}>
                <CartesianGrid stroke="#333333" vertical={false} />
                <XAxis dataKey="name" stroke="#ffffff88" fontSize={12} tickLine={false} />
                <YAxis stroke="#ffffff88" fontSize={12} tickLine={false} axisLine={false} />
                <Line type="monotone" dataKey="value" stroke={chart.data[0]?.color} strokeWidth={2} dot={false} isAnimationActive={animate} />
              </LineChart>
            ) : (
              <PieChart>
                <Pie
                  data={chart.data}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={chart.type === "donut" ? "55%" : 0}
                  outerRadius="85%"
                  isAnimationActive={animate}
                >
                  {chart.data.map((d, i) => (
                    <Cell key={i} fill={d.color} />
                  ))}
                </Pie>
              </PieChart>
            )}
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
