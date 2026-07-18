import { useEffect, useState } from "react";

type Props = { text: string };

const LETTER_INTERVAL_MS = 18;

// Reveals the investor's question one letter at a time once its projectile has landed, for a
// typewriter-style "impact" readout rather than an instant flash of text
export default function TypedQuestion({ text }: Props) {
  const [visibleCount, setVisibleCount] = useState(0);

  // Advances the visible letter count on a fixed interval until the whole question is shown
  useEffect(() => {
    setVisibleCount(0);
    const id = window.setInterval(() => {
      setVisibleCount((count) => {
        if (count >= text.length) {
          window.clearInterval(id);
          return count;
        }
        return count + 1;
      });
    }, LETTER_INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [text]);

  return (
    <p className="max-w-md text-xl font-bold text-white">
      {text.slice(0, visibleCount)}
      <span className="text-orange-400">{visibleCount < text.length ? "▌" : ""}</span>
    </p>
  );
}
