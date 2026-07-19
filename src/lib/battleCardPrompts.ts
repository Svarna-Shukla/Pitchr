import type { QuizAnswers } from "../types/battleCard";

const CARD_SYSTEM = `Analyze these startup quiz answers and return a JSON object only, no markdown, with exactly these fields:
{"innovation":0-100,"market":0-100,"execution":0-100,"defensibility":0-100,"specialAbility":{"name":"a punchy special-move name for their biggest strength","description":"one line describing it"},"weakness":"one sentence describing their biggest vulnerability","verdict":"two sentence investor-style take on this startup"}
Score each stat honestly based on the substance of the answers, not on tone. Do not include hp or rarity — those are computed separately.`;

// Flattens the quiz answers into a plain-text block Groq can reason over for the player card
export function buildCardPrompt(a: QuizAnswers): { prompt: string; content: string } {
  const content = `Company: ${a.companyName}
One-liner: ${a.oneLiner}
Industry: ${a.industry}
Business type: ${a.businessType}
Differentiation: ${a.differentiation}
Built before by someone else: ${a.builtBefore}
How hard to copy: ${a.copyDifficulty}
Old problem new way, or new problem: ${a.problemType}
Target market size: ${a.marketSize}
Market growth: ${a.marketGrowth}
Ideal customer: ${a.idealCustomer}
People with this problem: ${a.problemReach}
Time spent building: ${a.buildingTime}
Active users: ${a.activeUsers}
Monthly revenue: ${a.monthlyRevenue}
Team's strongest skill: ${a.strongestSkill}
Biggest competitive advantage: ${a.competitiveAdvantage}
Moats held: ${a.moats.join(", ") || "none stated"}
Defense against a funded copycat: ${a.copyDefense}
What takes a year+ to replicate: ${a.yearToReplicate}
Biggest weakness: ${a.weaknessRaw}
Path to a billion dollar company: ${a.billionDollarPath}`;
  return { prompt: CARD_SYSTEM, content };
}

const COMPETITOR_SYSTEM = `Identify the 3 most relevant real world competitors to the startup described below. Return a JSON array only, no markdown, of exactly 3 objects with this shape:
[{"name":"real competitor company name","oneLiner":"what they do in one line","innovation":0-100,"market":0-100,"execution":0-100,"defensibility":0-100,"weakness":"their biggest weakness","specialAbility":{"name":"punchy move name","description":"one line"}}]
Use real, recognizable companies in the same space if you know of any; otherwise use the most plausible realistic rivals. Score them honestly relative to how strong a real competitor in this space would be.`;

// Builds the prompt asking Groq for the 3 real-world competitors once the player's card exists
export function buildCompetitorPrompt(companyName: string, oneLiner: string, industry: string, businessType: string) {
  const content = `Startup: ${companyName}, which does "${oneLiner}" in the ${industry} space for ${businessType} customers.`;
  return { prompt: COMPETITOR_SYSTEM, content };
}
