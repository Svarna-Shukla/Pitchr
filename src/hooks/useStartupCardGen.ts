import { useCallback, useState } from "react";
import type { QuizAnswers, StartupCardData } from "../types/battleCard";
import { fetchGroqJSON } from "../lib/groq";
import { buildCardPrompt } from "../lib/battleCardPrompts";
import { clampStat, computeHp, computeRarity } from "../lib/battleCardScoring";

type RawCardAnalysis = {
  innovation?: unknown;
  market?: unknown;
  execution?: unknown;
  defensibility?: unknown;
  specialAbility?: { name?: string; description?: string };
  weakness?: string;
  verdict?: string;
};

// Turns the loosely-typed Groq reply into a fully valid StartupCardData, computing hp/rarity locally
function toCard(answers: QuizAnswers, raw: RawCardAnalysis): StartupCardData {
  const stats = {
    innovation: clampStat(raw.innovation),
    market: clampStat(raw.market),
    execution: clampStat(raw.execution),
    defensibility: clampStat(raw.defensibility),
  };
  const hp = computeHp(stats);
  return {
    ...stats,
    hp,
    rarity: computeRarity(hp),
    name: answers.companyName || "Unnamed Startup",
    oneLiner: answers.oneLiner,
    industry: answers.industry || "Other",
    businessType: answers.businessType || "B2B",
    specialAbility: {
      name: raw.specialAbility?.name || "Unnamed Move",
      description: raw.specialAbility?.description || answers.billionDollarPath || "No description.",
    },
    weakness: raw.weakness || answers.weaknessRaw || "Unknown",
    verdict: raw.verdict || "",
  };
}

// Generates the player's Pokemon-style startup card from their quiz answers via Groq
export function useStartupCardGen() {
  const [card, setCard] = useState<StartupCardData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [failed, setFailed] = useState(false);

  // Fires the Groq call, normalizes the reply, stores the resulting card, and returns it so callers can chain off it
  const generate = useCallback(async (answers: QuizAnswers): Promise<StartupCardData | null> => {
    setIsGenerating(true);
    setFailed(false);
    try {
      const { prompt, content } = buildCardPrompt(answers);
      const raw = await fetchGroqJSON<RawCardAnalysis>(prompt, content, 700);
      if (!raw) {
        setFailed(true);
        return null;
      }
      const card = toCard(answers, raw);
      setCard(card);
      return card;
    } catch {
      setFailed(true);
      return null;
    } finally {
      setIsGenerating(false);
    }
  }, []);

  // Clears the generated card so a fresh quiz run can start over
  const reset = useCallback(() => {
    setCard(null);
    setFailed(false);
  }, []);

  return { card, isGenerating, failed, generate, reset };
}
