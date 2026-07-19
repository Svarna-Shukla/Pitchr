import { useCallback, useState } from "react";
import { fetchGroqJSON, GROQ_MODELS } from "../lib/groq";
import { sanitizeAccentColor } from "../lib/premiumSlideTheme";
import { sanitizeChartData } from "../lib/chartPalette";
import { LAYOUT_TYPES, type ChartSpec, type QuadrantData, type Slide } from "../types/slide";

// Elite presentation architect system prompt enforcing an Apple-Keynote-style minimalist deck
const DECK_PROMPT = `You are an elite Presentation Architect inspired by Apple Keynote and high-end tech-product launch slides. Transform raw founder transcripts into a stunning minimalist presentation JSON array.

Design language: massive typography, clean whitespace, deep monochromatic tones (#000000, #111111, #ffffff) paired EXCLUSIVELY with neon orange accent (#ff7700).

CRITICAL RULES:
1. NO TEXT WALLS: Maximum 3 bullet points per slide. Maximum 10 words per bullet.
2. ORANGE ACCENT ONLY: All highlights and chart primary colors use #ff7700. No other accent colors.
3. CHART INJECTION: For any slide covering financials, market share, user growth, or problem size, generate a chart object and set layoutType to "chart".
4. COMPETITOR MATRIX: For the competitive-advantage slide, set layoutType to "competitor_radar" and generate a quadrant object plotting the founder's startup and 2-4 competitors on a 2x2 matrix.
5. BOLD TITLES: Titles are statements not labels. Not "The Problem" but "Founders waste 6 hours prepping a pitch they lose anyway."

Generate exactly 8 slides: Problem, Solution, Market Size, Business Model, Traction, Competitive Advantage, Team, Ask.

Return ONLY this raw JSON array, no markdown, no explanation:
[
  {
    "title": "string — bold statement",
    "bulletPoints": ["max 10 words", "max 10 words", "max 10 words"],
    "layoutType": "hero | split | problem | solution | chart | competitor_radar",
    "accentColor": "#ff7700",
    "stat": "one powerful statistic or null",
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
    "requiresRealTimeData": false,
    "searchQueries": []
  }
]
Omit "chart" for non-chart slides and "quadrant" for non-competitor_radar slides.

Transcript:`;

const IMPROVE_PROMPT = `You previously helped build a pitch deck from a transcript, following the elite Presentation Architect design language: massive typography, deep monochromatic tones (#000000, #111111, #ffffff) paired EXCLUSIVELY with neon orange accent (#ff7700), max 3 bullets per slide at max 10 words each. The founder was then grilled with brutal investor questions and given specific improvement suggestions. Using the original transcript plus the Q&A and suggestions below, produce an IMPROVED complete pitch deck as JSON only, no markdown — a single JSON array of exactly 8 slides in the same shape as before:
{"title":"bold statement","bulletPoints":["...","...","..."],"layoutType":"hero | split | problem | solution | chart | competitor_radar","accentColor":"#ff7700","stat":"a statistic or null","chart":{"type":"bar | line | pie | donut","label":"string","data":[{"name":"string","value":0,"color":"#ff7700"}]},"quadrant":{"xAxisLabel":"string","yAxisLabel":"string","points":[{"name":"string","x":0,"y":0,"isFounder":true}]},"requiresRealTimeData":false,"searchQueries":[]}
Omit "chart" for non-chart slides and "quadrant" for non-competitor_radar slides. Directly address the weaknesses the questions and suggestions exposed.

Original transcript, investor Q&A, and suggestions:
`;

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

// Forces one raw Groq slide into a safe shape, downgrading to the always-safe "split" layout if the
// data a richer layout needs (chart/quadrant) is missing or malformed
function normalizeSlide(raw: Partial<Slide> | null | undefined): Slide | null {
  if (!raw || typeof raw.title !== "string" || !Array.isArray(raw.bulletPoints)) return null;
  const bulletPoints = raw.bulletPoints.filter((b): b is string => typeof b === "string").slice(0, 3);
  if (!bulletPoints.length) return null;

  let layoutType = LAYOUT_TYPES.includes(raw.layoutType as Slide["layoutType"]) ? (raw.layoutType as Slide["layoutType"]) : "split";
  const chart = normalizeChart(raw.chart);
  const quadrant = normalizeQuadrant(raw.quadrant);
  if (layoutType === "chart" && !chart) layoutType = "split";
  if (layoutType === "competitor_radar" && !quadrant) layoutType = "split";

  return {
    title: raw.title,
    bulletPoints,
    layoutType,
    accentColor: sanitizeAccentColor(raw.accentColor),
    stat: typeof raw.stat === "string" ? raw.stat : null,
    chart: layoutType === "chart" ? chart : undefined,
    quadrant: layoutType === "competitor_radar" ? quadrant : undefined,
    requiresRealTimeData: raw.requiresRealTimeData === true,
    searchQueries: Array.isArray(raw.searchQueries) ? raw.searchQueries.filter((q): q is string => typeof q === "string") : [],
  };
}

// Validates a raw Groq response is a non-empty array of usable slides
function normalizeDeck(raw: Partial<Slide>[] | null): Slide[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((s) => normalizeSlide(s)).filter((s): s is Slide => s !== null);
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
    const list = normalizeDeck(raw);
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
      const list = normalizeDeck(raw);
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
