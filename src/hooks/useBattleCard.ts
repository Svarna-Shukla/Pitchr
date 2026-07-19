import { useCallback, useState } from "react";
import { useBattleCardQuiz } from "./useBattleCardQuiz";
import { useStartupCardGen } from "./useStartupCardGen";
import { useCompetitorCards } from "./useCompetitorCards";
import type { StartupCardData } from "../types/battleCard";

export type BattleCardView = "quiz" | "cards" | "battle";

// Top-level orchestrator for the whole Battle Card feature: quiz -> player card -> competitor cards -> battle,
// entirely independent of the Arena / pitch session state elsewhere in the app
export function useBattleCard() {
  const quiz = useBattleCardQuiz();
  const player = useStartupCardGen();
  const competitors = useCompetitorCards();
  const [view, setView] = useState<BattleCardView>("quiz");
  const [opponent, setOpponent] = useState<StartupCardData | null>(null);

  // Generates the player's card, then — once it lands — moves to the cards view and fires competitor generation
  const generate = useCallback(async () => {
    const card = await player.generate(quiz.answers);
    if (card) {
      setView("cards");
      competitors.generate(card);
    }
  }, [player, quiz.answers, competitors]);

  // Retries player card generation after a failure, without losing the filled-in quiz answers
  const retryPlayer = useCallback(() => {
    generate();
  }, [generate]);

  // Retries competitor generation after a failure, without regenerating the player's own card
  const retryCompetitors = useCallback(() => {
    if (player.card) competitors.generate(player.card);
  }, [player.card, competitors]);

  // Opens the full-screen battle view against a chosen competitor card
  const startBattle = useCallback((card: StartupCardData) => {
    setOpponent(card);
    setView("battle");
  }, []);

  // Leaves the battle view and returns to the row of cards
  const exitBattle = useCallback(() => {
    setOpponent(null);
    setView("cards");
  }, []);

  // Wipes every piece of Battle Card state and sends the user back to a blank quiz
  const reset = useCallback(() => {
    quiz.reset();
    player.reset();
    competitors.reset();
    setOpponent(null);
    setView("quiz");
  }, [quiz, player, competitors]);

  return { quiz, player, competitors, view, opponent, generate, retryPlayer, retryCompetitors, startBattle, exitBattle, reset };
}
