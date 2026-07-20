import { useCallback, useState } from "react";
import { fetchGroqJSON, GROQ_MODELS } from "../lib/groq";
import { sanitizeAccentColor } from "../lib/premiumSlideTheme";
import { sanitizeChartData } from "../lib/chartPalette";
import { LAYOUT_TYPES, type ChartSpec, type FeatureItem, type QuadrantData, type Slide, type TimelineStep } from "../types/slide";

const LAYOUT_ENUM =
  "hero | hero_split | hero_minimal | split | problem | solution | value_props | timeline | narrative_quote | chart | metric_callout | competitor_radar";
const QUALITATIVE_LAYOUTS = "hero, hero_split, hero_minimal, split, problem, solution, value_props, timeline, or narrative_quote";

// Shared between the deck prompt and the improve prompt: the model is instructed here, but
// normalizeDeck() below is the actual enforcement — every slide is re-checked against whether the
// source text contained a real number and forcibly stripped of chart/stat if it didn't, regardless
// of what the model returns.
const ANTI_HALLUCINATION_RULES = `DATA ACCURACY RULES — ZERO HALLUCINATED NUMBERS:
1. NEVER invent or fabricate numbers, percentages, dollar amounts, or years that are not explicitly present in the source text below.
2. If the source text contains NO explicit numbers, percentages, dollar amounts, or years:
   - "stat" MUST be null on every slide.
   - Do NOT set layoutType to "chart" or "metric_callout", and do NOT include a "chart" object on any slide.
   - Only choose layoutType from the qualitative set: ${QUALITATIVE_LAYOUTS}. ("competitor_radar" is still allowed since it plots qualitative positioning, not a fabricated metric.)
3. If the source text DOES contain explicit numbers: only use those exact stated values for "stat" and "chart" data — never round, extrapolate, or invent additional figures beyond what's stated. "metric_callout" (one giant number, no chart) is only for a slide whose entire point is a single stated stat.

FLUID LAYOUT VARIETY:
1. The opening slide should use layoutType "hero", "hero_split", or "hero_minimal" for a strong opening beat.
2. Vary layoutType across the deck — do not repeat the same layoutType on two consecutive slides.
3. Use "value_props" (with a "featureGrid" of 2-4 short { "title", "description" } items) for slides about product features or offerings that don't hinge on a number. Use "timeline" (with "timelineSteps" of { "phase", "title", "detail" }) for roadmap or traction narratives that don't hinge on a number. Use "narrative_quote" for a single testimonial or mission-statement beat — the "title" IS the quote, and the first "bulletPoints" entry (if any) is its attribution.`;

// Elite presentation architect system prompt enforcing an Apple-Keynote-style minimalist deck
const DECK_PROMPT = `You are an elite Presentation Architect inspired by Apple Keynote and high-end tech-product launch slides. Transform raw founder transcripts into a stunning minimalist presentation JSON array.

Design language: massive typography, clean whitespace, deep monochromatic tones (#000000, #111111, #ffffff) paired EXCLUSIVELY with neon orange accent (#ff7700).

CRITICAL RULES:
1. NO TEXT WALLS: Maximum 3 bullet points per slide. Maximum 10 words per bullet.
2. ORANGE ACCENT ONLY: All highlights and chart primary colors use #ff7700. No other accent colors.
3. CHART INJECTION: For any slide covering financials, market share, user growth, or problem size WHERE THE TRANSCRIPT STATES A REAL NUMBER, generate a chart object and set layoutType to "chart". Never do this if the transcript has no real number for that slide — see the data accuracy rules below.
4. COMPETITOR MATRIX: For the competitive-advantage slide, set layoutType to "competitor_radar" and generate a quadrant object plotting the founder's startup and 2-4 competitors on a 2x2 matrix.
5. BOLD TITLES: Titles are statements not labels. Not "The Problem" but "Founders waste 6 hours prepping a pitch they lose anyway."

${ANTI_HALLUCINATION_RULES}

Generate exactly 8 slides: Problem, Solution, Market Size, Business Model, Traction, Competitive Advantage, Team, Ask.

Return ONLY this raw JSON array, no markdown, no explanation:
[
  {
    "title": "string — bold statement",
    "bulletPoints": ["max 10 words", "max 10 words", "max 10 words"],
    "layoutType": "${LAYOUT_ENUM}",
    "accentColor": "#ff7700",
    "stat": "one powerful statistic explicitly present in the transcript, or null",
    "chart": {
      "type": "bar | line | pie | donut",
      "label": "string",
      "data": [
        { "name": "string", "value": 55, "color": "#ff7700" },
        { "name": "string", "value": 45, "color": "#222222" }
      ]
    },
    "quadrant": {
      "xAxisLabel": "string",
      "yAxisLabel": "string",
      "points": [{ "name": "string", "x": 0-100, "y": 0-100, "isFounder": true }]
    },
    "featureGrid": [{ "title": "string", "description": "string" }],
    "timelineSteps": [{ "phase": "string", "title": "string", "detail": "string" }],
    "requiresRealTimeData": false,
    "searchQueries": []
  }
]
Omit "chart" for non-chart slides, "quadrant" for non-competitor_radar slides, "featureGrid" for non-value_props slides, and "timelineSteps" for non-timeline slides.

Transcript:`;

const IMPROVE_PROMPT = `You previously helped build a pitch deck from a transcript, following the elite Presentation Architect design language: massive typography, deep monochromatic tones (#000000, #111111, #ffffff) paired EXCLUSIVELY with neon orange accent (#ff7700), max 3 bullets per slide at max 10 words each. The founder was then grilled with brutal investor questions and given specific improvement suggestions. Using the original transcript plus the Q&A and suggestions below, produce an IMPROVED complete pitch deck as JSON only, no markdown — a single JSON array of exactly 8 slides in the same shape as before:
{"title":"bold statement","bulletPoints":["...","...","..."],"layoutType":"${LAYOUT_ENUM}","accentColor":"#ff7700","stat":"a statistic explicitly present in the source text, or null","chart":{"type":"bar | line | pie | donut","label":"string","data":[{"name":"string","value":0,"color":"#ff7700"}]},"quadrant":{"xAxisLabel":"string","yAxisLabel":"string","points":[{"name":"string","x":0,"y":0,"isFounder":true}]},"featureGrid":[{"title":"string","description":"string"}],"timelineSteps":[{"phase":"string","title":"string","detail":"string"}],"requiresRealTimeData":false,"searchQueries":[]}
Omit "chart" for non-chart slides, "quadrant" for non-competitor_radar slides, "featureGrid" for non-value_props slides, and "timelineSteps" for non-timeline slides. Directly address the weaknesses the questions and suggestions exposed.

${ANTI_HALLUCINATION_RULES}

Original transcript, investor Q&A, and suggestions:
`;

// True if the given text contains at least one digit — the deterministic signal for whether the
// source material has any real number to ground a chart or stat in. Used as a hard backstop in
// normalizeDeck() below, independent of whether the model actually followed the prompt's rules.
function hasExplicitNumbers(text: string): boolean {
  return /\d/.test(text);
}

// Validates a raw chart object, sanitizing its colours, or returns undefined if unusable
function normalizeChart(raw: unknown): ChartSpec | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const c = raw as Partial<ChartSpec>;
  if (!c.type || !Array.isArray(c.data) || !c.data.length) return undefined;
  const data = c.data
    .filter((d): d is { name: string; value: number; color: string } => typeof d?.name === "string" && typeof d?.value === "number")
    .map((d) => ({ name: d.name, value: d.value, color: typeof d.color === "string" ? d.color : "" }));
  if (!data.length) return undefined;
  return { type: c.type, label: typeof c.label === "string" ? c.label : "", data: sanitizeChartData(data) };
}

// Validates a raw quadrant object, or returns undefined if unusable
function normalizeQuadrant(raw: unknown): QuadrantData | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const q = raw as Partial<QuadrantData>;
  if (typeof q.xAxisLabel !== "string" || typeof q.yAxisLabel !== "string" || !Array.isArray(q.points) || !q.points.length) return undefined;
  const points = q.points.filter((p): p is { name: string; x: number; y: number; isFounder?: boolean } => typeof p?.name === "string" && typeof p?.x === "number" && typeof p?.y === "number");
  if (!points.length) return undefined;
  return { xAxisLabel: q.xAxisLabel, yAxisLabel: q.yAxisLabel, points };
}

// Validates a raw featureGrid array, or returns undefined if unusable
function normalizeFeatureGrid(raw: unknown): FeatureItem[] | undefined {
  if (!Array.isArray(raw)) return undefined;
  const items = raw.filter((f): f is FeatureItem => typeof f?.title === "string" && typeof f?.description === "string");
  return items.length ? items : undefined;
}

// Validates a raw timelineSteps array, or returns undefined if unusable
function normalizeTimelineSteps(raw: unknown): TimelineStep[] | undefined {
  if (!Array.isArray(raw)) return undefined;
  const steps = raw.filter(
    (s): s is TimelineStep => typeof s?.phase === "string" && typeof s?.title === "string" && typeof s?.detail === "string"
  );
  return steps.length ? steps : undefined;
}

// Forces one raw Groq slide into a safe shape, downgrading to the always-safe "split" layout if the
// data a richer layout needs (chart/quadrant/featureGrid/timelineSteps) is missing or malformed.
// hasNumbers is the deterministic anti-hallucination backstop: when the source text had no real
// number in it, "chart" and "stat" are stripped regardless of what the model returned, since the
// prompt's rules are a request the model can ignore but this check cannot be talked out of.
function normalizeSlide(raw: Partial<Slide> | null | undefined, hasNumbers: boolean): Slide | null {
  if (!raw || typeof raw.title !== "string" || !Array.isArray(raw.bulletPoints)) return null;
  const bulletPoints = raw.bulletPoints.filter((b): b is string => typeof b === "string").slice(0, 3);
  if (!bulletPoints.length) return null;

  let layoutType = LAYOUT_TYPES.includes(raw.layoutType as Slide["layoutType"]) ? (raw.layoutType as Slide["layoutType"]) : "split";
  const chart = normalizeChart(raw.chart);
  const quadrant = normalizeQuadrant(raw.quadrant);
  const featureGrid = normalizeFeatureGrid(raw.featureGrid);
  const timelineSteps = normalizeTimelineSteps(raw.timelineSteps);
  if (layoutType === "chart" && !chart) layoutType = "split";
  if (layoutType === "competitor_radar" && !quadrant) layoutType = "split";
  if (layoutType === "metric_callout" && typeof raw.stat !== "string") layoutType = "split";
  if (!hasNumbers && (layoutType === "chart" || layoutType === "metric_callout")) layoutType = "split";

  return {
    title: raw.title,
    bulletPoints,
    layoutType,
    accentColor: sanitizeAccentColor(raw.accentColor),
    stat: hasNumbers && typeof raw.stat === "string" ? raw.stat : null,
    chart: layoutType === "chart" ? chart : undefined,
    quadrant: layoutType === "competitor_radar" ? quadrant : undefined,
    featureGrid: layoutType === "value_props" ? featureGrid : undefined,
    timelineSteps: layoutType === "timeline" ? timelineSteps : undefined,
    requiresRealTimeData: raw.requiresRealTimeData === true,
    searchQueries: Array.isArray(raw.searchQueries) ? raw.searchQueries.filter((q): q is string => typeof q === "string") : [],
  };
}

// Validates a raw Groq response is a non-empty array of usable slides
function normalizeDeck(raw: Partial<Slide>[] | null, hasNumbers: boolean): Slide[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((s) => normalizeSlide(s, hasNumbers)).filter((s): s is Slide => s !== null);
}

// Generates and holds the full pitch deck from a single one-shot Groq call
export function useClaude() {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [failed, setFailed] = useState(false);
  const [lastInput, setLastInput] = useState("");

  // Sends the entire transcript (or typed idea) once and parses the full 8-slide deck back
  const generate = useCallback(async (fullText: string) => {
    if (!fullText.trim()) return;
    setLastInput(fullText);
    setIsGenerating(true);
    setFailed(false);
    const raw = await fetchGroqJSON<Partial<Slide>[]>(DECK_PROMPT, fullText, 2400, GROQ_MODELS.quality);
    const list = normalizeDeck(raw, hasExplicitNumbers(fullText));
    if (list.length) setSlides(list);
    else setFailed(true);
    setIsGenerating(false);
  }, []);

  // Rebuilds the deck using the original transcript plus Pitcherator's investor Q&A and suggestions
  const regenerateWithFeedback = useCallback(
    async (transcript: string, qa: { question: string; answer: string }[], suggestions: string[]) => {
      setLastInput(transcript);
      setIsGenerating(true);
      setFailed(false);
      const qaText = qa.map((p) => `Q: ${p.question}\nA: ${p.answer}`).join("\n\n");
      const suggestionText = suggestions.map((s) => `- ${s}`).join("\n");
      const content = `${transcript}\n\nInvestor Q&A:\n${qaText}\n\nSuggestions to address:\n${suggestionText}`;
      const raw = await fetchGroqJSON<Partial<Slide>[]>(IMPROVE_PROMPT, content, 2400, GROQ_MODELS.quality);
      const list = normalizeDeck(raw, hasExplicitNumbers(content));
      if (list.length) setSlides(list);
      else setFailed(true);
      setIsGenerating(false);
    },
    []
  );

  // Resets everything
  const reset = useCallback(() => {
    setSlides([]);
    setFailed(false);
    setLastInput("");
  }, []);

  // Replaces the current deck with a previously saved one (used by Session Save)
  const loadSlides = useCallback((saved: Slide[]) => {
    setSlides(saved);
  }, []);

  return { slides, isGenerating, failed, lastInput, generate, regenerateWithFeedback, reset, loadSlides };
}
