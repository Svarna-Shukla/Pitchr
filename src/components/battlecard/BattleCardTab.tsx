import { AnimatePresence, motion } from "framer-motion";
import { useBattleCard } from "../../hooks/useBattleCard";
import QuizFlow from "./quiz/QuizFlow";
import ForgingLoader from "./ForgingLoader";
import CardsView from "./CardsView";
import BattleView from "./battle/BattleView";

// Battle Card: a fully standalone tool — quiz, then a Pokemon-style card for the company plus its top 3
// real competitors, then a head-to-head stat battle against any of them. Always renders on a dark,
// premium backdrop regardless of the app's light/dark theme, since this feature is unrelated to the Arena.
export default function BattleCardTab() {
  const battleCard = useBattleCard();
  const { view, quiz, player, competitors, opponent } = battleCard;

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-[#08080c] pb-24 pt-8">
      <h2 className="mb-6 text-center font-display text-lg font-semibold text-white">Battle Card</h2>

      <AnimatePresence mode="wait">
        {view === "quiz" && (
          <motion.div key="quiz" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="px-4">
            {player.isGenerating ? (
              <ForgingLoader />
            ) : (
              <QuizFlow quiz={quiz} isGenerating={player.isGenerating} failed={player.failed} onGenerate={battleCard.generate} />
            )}
          </motion.div>
        )}

        {view === "cards" && player.card && (
          <motion.div key="cards" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <CardsView
              player={player.card}
              competitors={competitors.cards}
              competitorsGenerating={competitors.isGenerating}
              competitorsFailed={competitors.failed}
              onRetryCompetitors={battleCard.retryCompetitors}
              onBattle={battleCard.startBattle}
              onReset={battleCard.reset}
            />
          </motion.div>
        )}

        {view === "battle" && player.card && opponent && (
          <BattleView key="battle" player={player.card} competitor={opponent} onExit={battleCard.exitBattle} onAnotherCompetitor={battleCard.exitBattle} />
        )}
      </AnimatePresence>
    </div>
  );
}
