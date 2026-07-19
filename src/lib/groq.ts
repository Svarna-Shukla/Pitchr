const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

// The two models used across the app: fast for latency-sensitive arena Q&A, quality for
// one-shot generation (deck, founder kit, competitor research) where thoroughness matters more
export const GROQ_MODELS = { fast: "llama-3.1-8b-instant", quality: "llama-3.3-70b-versatile" } as const;
type GroqModel = (typeof GROQ_MODELS)[keyof typeof GROQ_MODELS];

let warnedMissingKey = false;

// Pulls the first JSON object or array out of a response string, stripping any ```json fences first
function extractJson(text: string): string | null {
  const stripped = text.replace(/```json|```/g, "");
  const match = stripped.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
  return match ? match[0] : null;
}

// Calls Groq with a system prompt + user content and parses the JSON reply into T, or null on any failure
export async function fetchGroqJSON<T>(
  prompt: string,
  userContent: string,
  maxTokens = 512,
  model: GroqModel = GROQ_MODELS.fast
): Promise<T | null> {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY;
  if (!apiKey) {
    if (!warnedMissingKey) {
      console.warn("VITE_GROQ_API_KEY is not set — copy .env.example to .env and add your Groq key.");
      warnedMissingKey = true;
    }
    return null;
  }
  try {
    const res = await fetch(GROQ_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        max_tokens: maxTokens,
        messages: [{ role: "user", content: `${prompt}\n\n${userContent}` }],
      }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    const text = data.choices?.[0]?.message?.content ?? "";
    const json = extractJson(text);
    if (!json) return null;
    return JSON.parse(json) as T;
  } catch {
    return null;
  }
}
