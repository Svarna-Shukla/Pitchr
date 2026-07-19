import { Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import type { ChartSpec } from "../../../../types/slide";
import type { SlideTheme } from "../../../../lib/premiumSlideTheme";

type Props = { chart: ChartSpec; theme: SlideTheme; animate: boolean };

// Renders one of the deck's chart types (bar/line/pie/donut) with axis and grid colours pulled from
// the active slide theme — colours in the data itself come straight from the sanitized chart spec.
// Never has an outer border or background of its own.
export default function SlideChart({ chart, theme, animate }: Props) {
  const axisColor = theme === "dark" ? "#ffffff88" : "#00000066";
  const gridColor = theme === "dark" ? "#333333" : "#e5e5e5";

  if (chart.type === "bar") {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chart.data}>
          <CartesianGrid stroke={gridColor} vertical={false} />
          <XAxis dataKey="name" stroke={axisColor} fontSize={12} tickLine={false} />
          <YAxis stroke={axisColor} fontSize={12} tickLine={false} axisLine={false} />
          <Bar dataKey="value" isAnimationActive={animate} radius={[4, 4, 0, 0]}>
            {chart.data.map((d, i) => (
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
        <LineChart data={chart.data}>
          <CartesianGrid stroke={gridColor} vertical={false} />
          <XAxis dataKey="name" stroke={axisColor} fontSize={12} tickLine={false} />
          <YAxis stroke={axisColor} fontSize={12} tickLine={false} axisLine={false} />
          <Line type="monotone" dataKey="value" stroke={chart.data[0]?.color} strokeWidth={2} dot={false} isAnimationActive={animate} />
        </LineChart>
      </ResponsiveContainer>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
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
    </ResponsiveContainer>
  );
}
