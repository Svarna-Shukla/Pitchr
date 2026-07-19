import { Gem } from "lucide-react";
import type { Rarity } from "../../../types/battleCard";

type Props = { name: string; hp: number; rarity: Rarity };

// Pokemon-card header row: company name + rarity gem on the left, HP score in bold red on the right
export default function CardHeader({ name, hp, rarity }: Props) {
  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex min-w-0 items-center gap-1">
        <Gem className="h-3.5 w-3.5 shrink-0 text-[color:var(--color-accent)]" aria-label={rarity} />
        <h4 className="truncate text-[15px] font-black leading-tight text-white">{name}</h4>
      </div>
      <span className="shrink-0 text-sm font-black text-red-400">HP {hp}</span>
    </div>
  );
}
