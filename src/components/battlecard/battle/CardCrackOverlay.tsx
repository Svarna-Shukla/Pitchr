type Props = { count: number };

const PATHS = [
  "M40,0 L60,60 L30,90 L70,140",
  "M240,20 L190,70 L220,120 L180,170",
  "M20,180 L80,200 L50,260 L100,300",
];

// Overlays jagged crack lines across the card art, one per round the card has lost, using a CSS-driven draw-in
export default function CardCrackOverlay({ count }: Props) {
  if (count === 0) return null;
  return (
    <svg className="pointer-events-none absolute inset-0 h-[400px] w-[280px]" viewBox="0 0 280 400">
      {PATHS.slice(0, Math.min(count, PATHS.length)).map((d, i) => (
        <path
          key={i}
          d={d}
          fill="none"
          stroke="rgba(255,255,255,0.85)"
          strokeWidth={2}
          strokeDasharray={240}
          style={{ animation: "crack-in 0.4s ease-out forwards" }}
        />
      ))}
    </svg>
  );
}
