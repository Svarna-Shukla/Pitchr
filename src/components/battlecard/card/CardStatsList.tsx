import type { CardStats } from "../../../types/battleCard";
import StatBar from "./StatBar";

type Props = { stats: CardStats };

const STAT_META: { key: keyof CardStats; label: string; colorClass: string }[] = [
  { key: "innovation", label: "Innovation", colorClass: "bg-orange-400" },
  { key: "market", label: "Market", colorClass: "bg-blue-400" },
  { key: "execution", label: "Execution", colorClass: "bg-green-400" },
  { key: "defensibility", label: "Defense", colorClass: "bg-purple-400" },
];

// The four animated stat bars: Innovation (orange), Market (blue), Execution (green), Defensibility (purple)
export default function CardStatsList({ stats }: Props) {
  return (
    <div className="flex flex-col gap-1.5">
      {STAT_META.map((s) => (
        <StatBar key={s.key} label={s.label} value={stats[s.key]} colorClass={s.colorClass} />
      ))}
    </div>
  );
}
