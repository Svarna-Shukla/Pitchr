import type { SpecialAbility } from "../../../types/battleCard";

type Props = { ability: SpecialAbility };

// The special ability block: small-caps label, bold move name, one-line description
export default function CardAbility({ ability }: Props) {
  return (
    <div className="mt-2 border-t border-white/10 pt-2">
      <p className="text-[8px] font-bold uppercase tracking-widest text-[color:var(--color-accent)]">Special Ability</p>
      <p className="mt-0.5 text-xs font-bold text-white">{ability.name}</p>
      <p className="mt-0.5 line-clamp-2 text-[10px] leading-snug text-white/55">{ability.description}</p>
    </div>
  );
}
