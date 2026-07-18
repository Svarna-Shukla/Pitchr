import { useCallback, useState } from "react";

const MAX_HEALTH = 100;
const FOUNDER_HIT_DAMAGE = 34;
const MIN_INVESTOR_DAMAGE = 15;
const MAX_INVESTOR_DAMAGE = 34;
const EVIDENCE_KEYWORDS = ["data", "users", "revenue", "growth", "customers", "%", "traction", "proof"];

// Cheap, dependency-free proxy for answer strength: longer, more evidence-backed answers hit harder.
// This never touches the network — the real 6-metric grade still comes from one Groq call at the end.
function estimateAnswerStrength(answer: string): number {
  const words = answer.trim().split(/\s+/).filter(Boolean).length;
  const lower = answer.toLowerCase();
  const evidenceHits = EVIDENCE_KEYWORDS.filter((kw) => lower.includes(kw)).length;
  const raw = words * 1.2 + evidenceHits * 4;
  return Math.min(MAX_INVESTOR_DAMAGE, Math.max(MIN_INVESTOR_DAMAGE, raw));
}

// Tracks both fighters' health bars and exposes the two damage events a battle round can trigger
export function useArenaHealth() {
  const [investorHealth, setInvestorHealth] = useState(MAX_HEALTH);
  const [founderHealth, setFounderHealth] = useState(MAX_HEALTH);

  // Applied when an investor question lands on the founder (projectile collision)
  const damageFounder = useCallback(() => {
    setFounderHealth((h) => Math.max(0, h - FOUNDER_HIT_DAMAGE));
  }, []);

  // Applied once the founder's answer to a round is judged
  const damageInvestor = useCallback((answer: string) => {
    setInvestorHealth((h) => Math.max(0, h - estimateAnswerStrength(answer)));
  }, []);

  // Resets both bars to full for a fresh battle
  const reset = useCallback(() => {
    setInvestorHealth(MAX_HEALTH);
    setFounderHealth(MAX_HEALTH);
  }, []);

  return { investorHealth, founderHealth, damageFounder, damageInvestor, reset };
}
