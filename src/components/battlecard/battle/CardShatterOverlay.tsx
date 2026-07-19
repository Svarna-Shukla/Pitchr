import type { CSSProperties } from "react";

const SHARDS = Array.from({ length: 14 }, (_, i) => i);

// Breaks the losing card into flying fragments on final defeat, each shard given a random outward trajectory
export default function CardShatterOverlay() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-visible">
      {SHARDS.map((i) => {
        const angle = (i / SHARDS.length) * Math.PI * 2;
        const dist = 140 + (i % 4) * 30;
        const style = {
          "--shard-x": `${Math.cos(angle) * dist}px`,
          "--shard-y": `${Math.sin(angle) * dist}px`,
          "--shard-r": `${(i % 2 === 0 ? 1 : -1) * (90 + i * 12)}deg`,
          left: `${20 + (i % 5) * 12}%`,
          top: `${10 + ((i * 7) % 10) * 9}%`,
          animation: "shatter-fragment 0.7s ease-in forwards",
          animationDelay: `${i * 0.02}s`,
        } as CSSProperties;
        return <span key={i} className="absolute h-6 w-6 rounded-sm bg-[#0f0f1a] ring-1 ring-white/10" style={style} />;
      })}
    </div>
  );
}
