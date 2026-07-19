import { useCallback, useState } from "react";
import type { FounderKit } from "../types/founderKit";
import { fetchGroqJSON, GROQ_MODELS } from "../lib/groq";
import {
  ELEVATOR_PROMPT,
  FINANCIAL_PROJECTIONS_PROMPT,
  GTM_PROMPT,
  INVESTOR_EMAIL_PROMPT,
  LANDING_PAGE_PROMPT,
  LINKEDIN_PROMPT,
  NARRATION_SCRIPT_PROMPT,
  ONE_LINER_PROMPT,
  PRESS_RELEASE_PROMPT,
  PROBLEM_STATEMENT_PROMPT,
  RISK_ASSESSMENT_PROMPT,
  SWOT_PROMPT,
  TARGET_CUSTOMER_PROMPT,
  VALIDATION_QUESTIONS_PROMPT,
  VALUE_PROP_PROMPT,
} from "../lib/founderKitPrompts";

const EMPTY_SWOT = { strengths: [], weaknesses: [], opportunities: [], threats: [] };

// Fires one Groq call and returns its parsed JSON, or a fallback value if the call fails — keeps one
// bad output from sinking the other 14 that fired alongside it in the same Promise.all
async function fetchOrFallback<T>(prompt: string, transcript: string, maxTokens: number, fallback: T): Promise<T> {
  const data = await fetchGroqJSON<T>(prompt, transcript, maxTokens, GROQ_MODELS.quality);
  return data ?? fallback;
}

// Generates all 17 Founder Kit outputs from a transcript, firing every underlying Groq call in
// parallel via Promise.all so the whole kit lands roughly as fast as its single slowest call
export function useFounderKit() {
  const [founderKit, setFounderKit] = useState<FounderKit | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [failed, setFailed] = useState(false);

  // Fires every grouped Groq call in parallel and assembles the results into one FounderKit
  const generate = useCallback(async (transcript: string) => {
    setIsGenerating(true);
    setFailed(false);
    try {
      const [
        oneLiner,
        elevatorPitch,
        problemStatement,
        valueProposition,
        targetCustomer,
        gtmStrategy,
        validationQuestions,
        swot,
        riskAssessment,
        financialProjections,
        landingPageCopy,
        investorEmail,
        pressRelease,
        linkedinAnnouncement,
        narrationScript,
      ] = await Promise.all([
        fetchOrFallback(ONE_LINER_PROMPT, transcript, 200, { oneLiner: "" }),
        fetchOrFallback(ELEVATOR_PROMPT, transcript, 400, { fifteenSec: "", thirtySec: "", sixtySec: "" }),
        fetchOrFallback(PROBLEM_STATEMENT_PROMPT, transcript, 300, { problemStatement: "" }),
        fetchOrFallback(VALUE_PROP_PROMPT, transcript, 300, { valueProposition: [] as string[] }),
        fetchOrFallback(TARGET_CUSTOMER_PROMPT, transcript, 300, { targetCustomer: "" }),
        fetchOrFallback(GTM_PROMPT, transcript, 250, { gtmStrategy: "" }),
        fetchOrFallback(VALIDATION_QUESTIONS_PROMPT, transcript, 400, { validationQuestions: [] as string[] }),
        fetchOrFallback(SWOT_PROMPT, transcript, 500, { swot: EMPTY_SWOT }),
        fetchOrFallback(RISK_ASSESSMENT_PROMPT, transcript, 350, { riskAssessment: [] as string[] }),
        fetchOrFallback(FINANCIAL_PROJECTIONS_PROMPT, transcript, 350, { financialProjections: [] as string[] }),
        fetchOrFallback(LANDING_PAGE_PROMPT, transcript, 350, { landingPageCopy: "" }),
        fetchOrFallback(INVESTOR_EMAIL_PROMPT, transcript, 400, { investorEmail: "" }),
        fetchOrFallback(PRESS_RELEASE_PROMPT, transcript, 400, { pressRelease: "" }),
        fetchOrFallback(LINKEDIN_PROMPT, transcript, 350, { linkedinAnnouncement: "" }),
        fetchOrFallback(NARRATION_SCRIPT_PROMPT, transcript, 600, { narrationScript: "" }),
      ]);

      const kit: FounderKit = {
        oneLiner: oneLiner.oneLiner,
        elevatorPitch,
        problemStatement: problemStatement.problemStatement,
        targetCustomer: targetCustomer.targetCustomer,
        valueProposition: valueProposition.valueProposition,
        gtmStrategy: gtmStrategy.gtmStrategy,
        validationQuestions: validationQuestions.validationQuestions,
        swot: swot.swot,
        riskAssessment: riskAssessment.riskAssessment,
        financialProjections: financialProjections.financialProjections,
        landingPageCopy: landingPageCopy.landingPageCopy,
        investorEmail: investorEmail.investorEmail,
        pressRelease: pressRelease.pressRelease,
        linkedinAnnouncement: linkedinAnnouncement.linkedinAnnouncement,
        narrationScript: narrationScript.narrationScript,
      };

      if (!kit.oneLiner && !kit.problemStatement) {
        setFailed(true);
      } else {
        setFounderKit(kit);
      }
    } catch {
      setFailed(true);
    } finally {
      setIsGenerating(false);
    }
  }, []);

  // Clears the kit so a fresh session can regenerate
  const reset = useCallback(() => {
    setFounderKit(null);
    setFailed(false);
  }, []);

  return { founderKit, isGenerating, failed, generate, reset };
}
