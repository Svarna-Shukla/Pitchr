import type { BusinessType, Rarity } from "../../../types/battleCard";
import { rarityStyle } from "../../../lib/battleCardStyle";

type Props = { name: string; businessType: BusinessType; rarity: Rarity };

// The card's art panel: a rarity-coloured gradient with the company's initial and a business-type badge.
// Legendary/Epic get a continuously shifting shimmer sweep across the art.
export default function CardArt({ name, businessType, rarity }: Props) {
  const style = rarityStyle(rarity);
  return (
    <div className="relative my-2.5 flex h-[38%] min-h-24 items-center justify-center overflow-hidden rounded-lg" style={{ background: style.artGradient }}>
      <span className="select-none text-4xl font-black text-white/25">{name.slice(0, 1).toUpperCase() || "?"}</span>
      <span className="absolute left-2 top-2 rounded-full bg-black/40 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white/80">
        {businessType}
      </span>
      {style.shimmer && (
        <div
          className="pointer-events-none absolute inset-0 animate-[shimmer_2.6s_linear_infinite] bg-[length:200%_100%]"
          style={{ background: "linear-gradient(110deg, transparent 30%, rgba(255,255,255,0.35) 50%, transparent 70%)" }}
        />
      )}
    </div>
  );
}
