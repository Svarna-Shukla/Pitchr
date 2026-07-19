import { useCallback, useState } from "react";
import type { StartupCardData } from "../types/battleCard";
import { fetchGroqJSON, GROQ_MODELS } from "../lib/groq";
import { buildCompetitorPrompt } from "../lib/battleCardPrompts";
import { clampStat, computeHp, computeRarity } from "../lib/battleCardScoring";

type RawCompetitor = {
  name?: string;
  oneLiner?: string;
  innovation?: unknown;
  market?: unknown;
  execution?: unknown;
  defensibility?: unknown;
  weakness?: string;
  specialAbility?: { name?: string; description?: string };
};

// Pulls a usable competitor array out of whatever shape Groq returned — a bare array or an object wrapping one
function extractArray(raw: unknown): RawCompetitor[] {
  if (Array.isArray(raw)) return raw;
  if (raw && typeof raw === "object") {
    const arr = Object.values(raw as Record<string, unknown>).find((v) => Array.isArray(v));
    if (Array.isArray(arr)) return arr as RawCompetitor[];
  }
  return [];
}

// Converts one raw competitor entry into a fully valid StartupCardData, same shape as the player's card
function toCard(raw: RawCompetitor, industry: string, businessType: StartupCardData["businessType"]): StartupCardData | null {
  if (!raw?.name) return null;
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
    name: raw.name,
    oneLiner: raw.oneLiner || "",
    industry,
    businessType,
    specialAbility: { name: raw.specialAbility?.name || "Unnamed Move", description: raw.specialAbility?.description || "" },
    weakness: raw.weakness || "Unknown",
    verdict: "",
  };
}

// Generates the 3 real-world competitor cards for the player's startup via Groq
export function useCompetitorCards() {
  const [cards, setCards] = useState<StartupCardData[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [failed, setFailed] = useState(false);

  // Fires the Groq call and stores up to 3 normalized competitor cards
  const generate = useCallback(async (player: StartupCardData) => {
    setIsGenerating(true);
    setFailed(false);
    try {
      const { prompt, content } = buildCompetitorPrompt(player.name, player.oneLiner, player.industry, player.businessType);
      const raw = await fetchGroqJSON<unknown>(prompt, content, 900, GROQ_MODELS.quality);
      const list = extractArray(raw)
        .map((c) => toCard(c, player.industry, player.businessType))
        .filter((c): c is StartupCardData => c !== null)
        .slice(0, 3);
      if (list.length) setCards(list);
      else setFailed(true);
    } catch {
      setFailed(true);
    } finally {
      setIsGenerating(false);
    }
  }, []);

  // Clears the competitor list so a fresh quiz run can regenerate
  const reset = useCallback(() => {
    setCards([]);
    setFailed(false);
  }, []);

  return { cards, isGenerating, failed, generate, reset };
}
