import { useCallback, useState } from "react";
import type { SessionRecord } from "../types/session";
import type { Slide } from "../types/slide";
import type { FounderKit } from "../types/founderKit";

const STORAGE_KEY = "echodraft:sessions";
const MAX_SESSIONS = 3;

// Reads the saved session list from localStorage, tolerating a missing or corrupt value
function readSessions(): SessionRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as SessionRecord[]) : [];
  } catch {
    return [];
  }
}

// Manages saving, listing, and loading past pitch sessions from localStorage
export function useSessions() {
  const [sessions, setSessions] = useState<SessionRecord[]>(readSessions);

  // Saves a new session, keeping only the most recent MAX_SESSIONS
  const save = useCallback((slides: Slide[], founderKit?: FounderKit | null) => {
    const record: SessionRecord = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      slides,
      founderKit,
    };
    const next = [record, ...readSessions()].slice(0, MAX_SESSIONS);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Storage unavailable or quota exceeded — skip persisting, keep it in memory for this tab
    }
    setSessions(next);
  }, []);

  // Finds a saved session by id
  const load = useCallback((id: string) => sessions.find((s) => s.id === id) ?? null, [sessions]);

  return { sessions, save, load };
}
