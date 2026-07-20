import { Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import type { ChartSpec } from "../../../../types/slide";
import type { SlideTheme } from "../../../../lib/premiumSlideTheme";
import { resolveChartColor } from "../../../../lib/chartPalette";

type Props = { chart: ChartSpec; theme: SlideTheme; animate: boolean };

// Renders one of the deck's chart types (bar/line/pie/donut) with axis and grid colours pulled from
// the active slide theme — colours in the data itself are re-resolved per-theme via
// resolveChartColor so switching ThemeRemixer instantly restyles charts too.
export default function SlideChart({ chart, theme, animate }: Props) {
  const axisColor = theme === "yc" ? "#00000066" : "#ffffff88";
  const gridColor = theme === "yc" ? "#e5e5e5" : "#333333";
  const data = chart.data.map((d) => ({ ...d, color: resolveChartColor(d.color, theme) }));

  if (chart.type === "bar") {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid stroke={gridColor} vertical={false} />
          <XAxis dataKey="name" stroke={axisColor} fontSize={12} tickLine={false} />
          <YAxis stroke={axisColor} fontSize={12} tickLine={false} axisLine={false} />
          <Bar dataKey="value" isAnimationActive={animate} radius={[4, 4, 0, 0]}>
            {data.map((d, i) => (
              <Cell key={i} fill={d.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    );
  }

  if (chart.type === "line") {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid stroke={gridColor} vertical={false} />
          <XAxis dataKey="name" stroke={axisColor} fontSize={12} tickLine={false} />
          <YAxis stroke={axisColor} fontSize={12} tickLine={false} axisLine={false} />
          <Line type="monotone" dataKey="value" stroke={data[0]?.color} strokeWidth={2} dot={false} isAnimationActive={animate} />
        </LineChart>
      </ResponsiveContainer>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          innerRadius={chart.type === "donut" ? "55%" : 0}
          outerRadius="85%"
          isAnimationActive={animate}
        >
          {data.map((d, i) => (
            <Cell key={i} fill={d.color} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
}
