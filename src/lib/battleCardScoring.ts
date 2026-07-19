import type { BattleOutcome, CardStats, Rarity, RoundOutcome, StatKey } from "../types/battleCard";

const STAT_LABEL: Record<StatKey, string> = {
  innovation: "Innovation",
  market: "Market reach",
  execution: "Execution",
  defensibility: "Defensibility",
};

export const STAT_ORDER: StatKey[] = ["innovation", "market", "execution", "defensibility"];

// Clamps any number Groq hands back into a valid 0-100 stat score
export function clampStat(value: unknown): number {
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n)) return 50;
  return Math.max(0, Math.min(100, Math.round(n)));
}

// HP is always the four stats averaged and rounded — computed client-side so it can never drift from the bars
export function computeHp(stats: CardStats): number {
  return Math.round((stats.innovation + stats.market + stats.execution + stats.defensibility) / 4);
}

// Maps an HP score to a rarity tier using the fixed thresholds from the spec
export function computeRarity(hp: number): Rarity {
  if (hp <= 40) return "Common";
  if (hp <= 55) return "Uncommon";
  if (hp <= 70) return "Rare";
  if (hp <= 85) return "Epic";
  return "Legendary";
}

// Resolves one 4-round battle: each stat is a round, the higher score wins, ties tiebreak to HP at the end
export function resolveBattle(player: CardStats & { hp: number }, competitor: CardStats & { hp: number }): BattleOutcome {
  const rounds: RoundOutcome[] = STAT_ORDER.map((stat) => {
    const playerScore = player[stat];
    const competitorScore = competitor[stat];
    const winner = playerScore === competitorScore ? "tie" : playerScore > competitorScore ? "player" : "competitor";
    return { stat, playerScore, competitorScore, winner };
  });

  const playerWins = rounds.filter((r) => r.winner === "player").length;
  const competitorWins = rounds.filter((r) => r.winner === "competitor").length;

  let winner: "player" | "competitor";
  if (playerWins === competitorWins) {
    winner = player.hp >= competitor.hp ? "player" : "competitor";
  } else {
    winner = playerWins > competitorWins ? "player" : "competitor";
  }

  return { rounds, playerWins, competitorWins, winner };
}

// Picks one sentence naming the player's single biggest edge and single biggest gap versus this opponent
export function deriveInsight(rounds: RoundOutcome[]): string {
  const byMargin = [...rounds].sort((a, b) => b.playerScore - b.competitorScore - (a.playerScore - a.competitorScore));
  const strongest = byMargin[0];
  const weakest = byMargin[byMargin.length - 1];
  return `Your strongest advantage is ${STAT_LABEL[strongest.stat]}. Your biggest risk is ${STAT_LABEL[weakest.stat]}.`;
}
