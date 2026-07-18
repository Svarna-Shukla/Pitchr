import { useCallback, useState } from "react";

export type Theme = "dark" | "light";

// Tracks the active slide theme (dark/light) shared by the deck panel and presentation mode
export function useTheme() {
  const [theme, setTheme] = useState<Theme>("dark");

  // Flips between dark and light
  const toggle = useCallback(() => {
    setTheme((t) => (t === "dark" ? "light" : "dark"));
  }, []);

  return { theme, toggle };
}
