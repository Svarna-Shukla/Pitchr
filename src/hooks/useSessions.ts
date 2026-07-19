import { useCallback, useState } from "react";
import type { SessionRecord } from "../types/session";
import type { Slide } from "../types/slide";
import type { FounderKit } from "../types/founderKit";

const STORAGE_KEY = "pitchr:sessions";
const MAX_SESSIONS = 5;

// Reads the saved session list from localStorage, tolerating a missing/corrupt value and dropping
// any pre-migration record whose slides predate the current layoutType-based Slide shape
function readSessions(): SessionRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as SessionRecord[]) : [];
    return parsed.filter((s) => !s.slides.length || typeof s.slides[0]?.layoutType === "string");
  } catch {
    return [];
  }
}

// Manages saving, listing, and loading past pitch sessions from localStorage
export function useSessions() {
  const [sessions, setSessions] = useState<SessionRecord[]>(readSessions);

  // Saves a new session, keeping only the most recent MAX_SESSIONS
  const save = useCallback(
    (slides: Slide[], founderKit?: FounderKit | null, arenaStats?: { healthRemaining: number; grade: string; questionsSurvived: number }) => {
      const record: SessionRecord = {
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        slides,
        founderKit,
        ...arenaStats,
      };
      const next = [record, ...readSessions()].slice(0, MAX_SESSIONS);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // Storage unavailable or quota exceeded — skip persisting, keep it in memory for this tab
      }
      setSessions(next);
    },
    []
  );

  // Finds a saved session by id
  const load = useCallback((id: string) => sessions.find((s) => s.id === id) ?? null, [sessions]);

  // Wipes every saved session from localStorage and clears the in-memory list
  const clearAll = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Storage unavailable — nothing persisted to clear anyway
    }
    setSessions([]);
  }, []);

  return { sessions, save, load, clearAll };
}
