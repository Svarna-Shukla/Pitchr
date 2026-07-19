export type BusinessType = "B2B" | "B2C" | "Marketplace";
export type Rarity = "Common" | "Uncommon" | "Rare" | "Epic" | "Legendary";

// The full set of answers collected across the 6 quiz sections
export type QuizAnswers = {
  // Section 1 — Identity
  companyName: string;
  oneLiner: string;
  industry: string;
  businessType: BusinessType | "";
  // Section 2 — Innovation
  differentiation: string;
  builtBefore: "Yes" | "Somewhat" | "No" | "";
  copyDifficulty: "Very Easy" | "Somewhat Easy" | "Hard" | "Nearly Impossible" | "";
  problemType: "Old problem, new way" | "Completely new problem" | "";
  // Section 3 — Market
  marketSize: "Under $1B" | "$1B–$10B" | "$10B–$100B" | "$100B+" | "";
  marketGrowth: "Shrinking" | "Flat" | "Growing" | "Exploding" | "";
  idealCustomer: string;
  problemReach: "Thousands" | "Hundreds of thousands" | "Millions" | "Hundreds of millions" | "";
  // Section 4 — Execution
  buildingTime: "Just started" | "Under 6 months" | "6–18 months" | "18 months+" | "";
  activeUsers: "None yet" | "1–10" | "10–100" | "100–1,000" | "1,000+" | "";
  monthlyRevenue: "Pre-revenue" | "Under $1k" | "$1k–$10k" | "$10k–$100k" | "$100k+" | "";
  strongestSkill: "Tech" | "Sales" | "Domain Expertise" | "Operations" | "Design" | "";
  // Section 5 — Defensibility
  competitiveAdvantage: string;
  moats: string[];
  copyDefense: string;
  yearToReplicate: string;
  // Section 6 — Card flavour
  weaknessRaw: string;
  billionDollarPath: string;
};

export type SpecialAbility = { name: string; description: string };

// The four stat dimensions shown as bars on every card, player and competitor alike
export type CardStats = {
  innovation: number;
  market: number;
  execution: number;
  defensibility: number;
};

export type StartupCardData = CardStats & {
  name: string;
  oneLiner: string;
  industry: string;
  businessType: BusinessType;
  hp: number;
  rarity: Rarity;
  specialAbility: SpecialAbility;
  weakness: string;
  verdict: string;
};

export type StatKey = keyof CardStats;

export type RoundOutcome = {
  stat: StatKey;
  playerScore: number;
  competitorScore: number;
  winner: "player" | "competitor" | "tie";
};

export type BattleOutcome = {
  rounds: RoundOutcome[];
  playerWins: number;
  competitorWins: number;
  winner: "player" | "competitor";
};
