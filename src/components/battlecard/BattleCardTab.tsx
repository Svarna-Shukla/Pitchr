import { useBattleCard } from "../../hooks/useBattleCard";
import BattleCardWizard from "./BattleCardWizard";
import PokemonCard from "./PokemonCard";
import BattleArena from "./BattleArena";
import type { Theme } from "../../hooks/useTheme";

type Props = { theme: Theme };

// Battle Card tab: wizard collects founder answers, then renders the player + competitor Pokemon-style cards
export default function BattleCardTab({ theme }: Props) {
  const battleCard = useBattleCard();
  const isDark = theme === "dark";

  return (
    <div className="mx-auto max-w-4xl px-6 pb-28 pt-8">
      <h2 className={`mb-6 text-center font-display text-lg font-semibold ${isDark ? "text-white" : "text-black"}`}>Battle Card</h2>

      {!battleCard.player ? (
        <BattleCardWizard battleCard={battleCard} theme={theme} />
      ) : (
        <div className="flex flex-col items-center gap-8">
          <div>
            <p className={`mb-2 text-center text-xs font-bold uppercase tracking-widest ${isDark ? "text-white/40" : "text-black/40"}`}>
              Your Card
            </p>
            <PokemonCard card={battleCard.player} accent="#8b5cf6" />
          </div>
          <div className="w-full">
            <p className={`mb-3 text-center text-xs font-bold uppercase tracking-widest ${isDark ? "text-white/40" : "text-black/40"}`}>
              Competitors
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {battleCard.competitors.map((c, i) => (
                <PokemonCard key={i} card={c} accent="#f97316" />
              ))}
            </div>
          </div>
          <BattleArena player={battleCard.player} competitors={battleCard.competitors} />
          <button onClick={battleCard.reset} className={`text-xs font-semibold underline ${isDark ? "text-white/40" : "text-black/40"}`}>
            Start over
          </button>
        </div>
      )}
    </div>
  );
}
