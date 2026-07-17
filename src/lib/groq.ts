const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = "llama-3.1-8b-instant";

// Pulls the first JSON object or array out of a response string
function extractJson(text: string): string | null {
  const match = text.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
  return match ? match[0] : null;
}

// Calls Groq with a system prompt + user content and parses the JSON reply into T, or null on any failure
export async function fetchGroqJSON<T>(
  prompt: string,
  userContent: string,
  maxTokens = 512
): Promise<T | null> {
  try {
    const res = await fetch(GROQ_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: MODEL,
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
