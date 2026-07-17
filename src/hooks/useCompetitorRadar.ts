import { useCallback, useState } from "react";
import type { Competitor } from "../types/competitor";
import { fetchGroqJSON } from "../lib/groq";

const PROMPT = `Based on this pitch, name 3-4 plausible competitors using your own training knowledge only — this is not a live web search, so do not claim real-time information. Return JSON array only, no markdown:
[{"name":"...","whatTheyDo":"...","weakness":"their weakness versus this idea","threat":"low|medium|high"}]

Transcript:`;

// Generates a list of plausible competitors from the LLM's own knowledge, based on the pitch transcript
export function useCompetitorRadar() {
  const [competitors, setCompetitors] = useState<Competitor[] | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [failed, setFailed] = useState(false);

  // Fires the Groq call and stores the parsed competitor list
  const generate = useCallback(async (transcript: string) => {
    setIsGenerating(true);
    setFailed(false);
    const list = await fetchGroqJSON<Competitor[]>(PROMPT, transcript, 700);
    if (list) setCompetitors(list);
    else setFailed(true);
    setIsGenerating(false);
  }, []);

  // Clears the results so a fresh session can regenerate
  const reset = useCallback(() => {
    setCompetitors(null);
    setFailed(false);
  }, []);

  return { competitors, isGenerating, failed, generate, reset };
}
