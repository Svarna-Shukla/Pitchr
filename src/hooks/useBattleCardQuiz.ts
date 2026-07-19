import { useCallback, useState } from "react";
import type { QuizAnswers } from "../types/battleCard";

export const TOTAL_SECTIONS = 6;

export const INITIAL_ANSWERS: QuizAnswers = {
  companyName: "",
  oneLiner: "",
  industry: "",
  businessType: "",
  differentiation: "",
  builtBefore: "",
  copyDifficulty: "",
  problemType: "",
  marketSize: "",
  marketGrowth: "",
  idealCustomer: "",
  problemReach: "",
  buildingTime: "",
  activeUsers: "",
  monthlyRevenue: "",
  strongestSkill: "",
  competitiveAdvantage: "",
  moats: [],
  copyDefense: "",
  yearToReplicate: "",
  weaknessRaw: "",
  billionDollarPath: "",
};

// Drives the 6-section quiz: current section, all answers so far, and navigation between sections
export function useBattleCardQuiz() {
  const [section, setSection] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswers>(INITIAL_ANSWERS);

  // Updates a single answer field, used by every text/dropdown/option input across all 6 sections
  const setField = useCallback(<K extends keyof QuizAnswers>(key: K, value: QuizAnswers[K]) => {
    setAnswers((a) => ({ ...a, [key]: value }));
  }, []);

  // Toggles a moat option in/out of the multi-select list for Section 5
  const toggleMoat = useCallback((moat: string) => {
    setAnswers((a) => ({
      ...a,
      moats: a.moats.includes(moat) ? a.moats.filter((m) => m !== moat) : [...a.moats, moat],
    }));
  }, []);

  const next = useCallback(() => setSection((s) => Math.min(s + 1, TOTAL_SECTIONS - 1)), []);
  const back = useCallback(() => setSection((s) => Math.max(s - 1, 0)), []);

  // Resets the quiz back to its first section with a blank form
  const reset = useCallback(() => {
    setSection(0);
    setAnswers(INITIAL_ANSWERS);
  }, []);

  return { section, answers, setField, toggleMoat, next, back, reset };
}
