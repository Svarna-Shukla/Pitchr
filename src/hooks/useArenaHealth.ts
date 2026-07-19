import { useCallback, useRef, useState } from "react";
import type { AnswerTier } from "../types/arena";

const MAX_HEALTH = 100;
const START_HEALTH = 100;
const DELTAS: Record<AnswerTier, number> = { strong: 8, average: -8, weak: -20, timeout: -30 };
const STREAK_BONUS = 15;
const CRITICAL_PENALTY = -40;
const STREAK_LENGTH = 3;

export type StreakEvent = { type: "fire" | "critical"; key: number } | null;

// Tracks the founder's single "YOUR PITCH" health bar (100 -> 0, never higher/lower) plus the streak
// machine: 3 strong answers in a row grants a bonus and fires "ON FIRE"; 3 weak/timeout answers in a
// row arms a "CRITICAL" flag that turns the very next round's damage into a flat -40, whatever its tier
export function useArenaHealth() {
  const [health, setHealthState] = useState(START_HEALTH);
  const [streakEvent, setStreakEvent] = useState<StreakEvent>(null);
  // Positive while on a strong streak, negative while on a weak/timeout streak, 0 otherwise — lets a
  // single small HUD counter show "current streak, whichever direction is active" without two fields
  const [streakCount, setStreakCount] = useState(0);
  const healthRef = useRef(START_HEALTH);
  const strongStreak = useRef(0);
  const weakStreak = useRef(0);
  const criticalArmed = useRef(false);
  const eventKey = useRef(0);

  // Keeps both the ref (read synchronously below) and the render-triggering state in sync
  const setHealth = useCallback((v: number) => {
    healthRef.current = v;
    setHealthState(v);
  }, []);

  // Applies one round's result to the health bar, running the streak machine first, then clamps to
  // [0,100] and returns the resulting health so the caller can immediately check for game over
  const applyResult = useCallback(
    (tier: AnswerTier) => {
      let delta = DELTAS[tier];

      if (criticalArmed.current) {
        delta = CRITICAL_PENALTY;
        criticalArmed.current = false;
        strongStreak.current = 0;
        weakStreak.current = 0;
        setStreakCount(0);
      } else if (tier === "strong") {
        weakStreak.current = 0;
        strongStreak.current += 1;
        setStreakCount(strongStreak.current);
        if (strongStreak.current >= STREAK_LENGTH) {
          delta += STREAK_BONUS;
          strongStreak.current = 0;
          setStreakCount(0);
          eventKey.current += 1;
          setStreakEvent({ type: "fire", key: eventKey.current });
        }
      } else if (tier === "weak" || tier === "timeout") {
        strongStreak.current = 0;
        weakStreak.current += 1;
        setStreakCount(-weakStreak.current);
        if (weakStreak.current >= STREAK_LENGTH) {
          weakStreak.current = 0;
          criticalArmed.current = true;
          setStreakCount(0);
          eventKey.current += 1;
          setStreakEvent({ type: "critical", key: eventKey.current });
        }
      } else {
        strongStreak.current = 0;
        weakStreak.current = 0;
        setStreakCount(0);
      }

      const next = Math.max(0, Math.min(MAX_HEALTH, healthRef.current + delta));
      setHealth(next);
      return next;
    },
    [setHealth]
  );

  // Resets health and every streak counter for a fresh session
  const reset = useCallback(() => {
    setHealth(START_HEALTH);
    setStreakEvent(null);
    setStreakCount(0);
    strongStreak.current = 0;
    weakStreak.current = 0;
    criticalArmed.current = false;
  }, [setHealth]);

  return { health, streakEvent, streakCount, applyResult, reset, isGameOver: health <= 0 };
}
