import type { Rarity } from "../../../types/battleCard";
import { rarityStyle } from "../../../lib/battleCardStyle";

type Props = { weakness: string; rarity: Rarity };

// Card footer: small red WEAKNESS tag plus a five-dot rarity indicator, filled according to tier
export default function CardFooter({ weakness, rarity }: Props) {
  const { filledDots } = rarityStyle(rarity);
  return (
    <div className="mt-2 flex items-end justify-between gap-2 border-t border-white/10 pt-2">
      <p className="line-clamp-2 text-[9px] leading-snug text-red-400">
        <span className="font-bold uppercase">Weakness: </span>
        {weakness}
      </p>
      <div className="flex shrink-0 gap-0.5">
        {Array.from({ length: 5 }, (_, i) => (
          <span key={i} className={`h-1.5 w-1.5 rounded-full ${i < filledDots ? "bg-[color:var(--color-accent)]" : "bg-white/15"}`} />
        ))}
      </div>
    </div>
  );
}
