import { useRef, type ReactNode } from "react";

type Props = { children: ReactNode; className?: string; style?: React.CSSProperties; maxTilt?: number; holo?: boolean };

// Wraps children in a perspective container that tilts toward the cursor, with a tracked specular highlight
// and an optional trading-card-style holo foil sheen (used by the Battle Card Pokemon cards)
export default function TiltCard({ children, className = "", style, maxTilt = 8, holo = false }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  // Computes tilt angles, glint position, and (if holo) the foil sheen angle from the pointer's offset
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    const rotY = (px - 0.5) * maxTilt * 2;
    const rotX = (0.5 - py) * maxTilt * 2;
    el.style.setProperty("--tilt-x", `${rotX}deg`);
    el.style.setProperty("--tilt-y", `${rotY}deg`);
    el.style.setProperty("--glint-x", `${px * 100}%`);
    el.style.setProperty("--glint-y", `${py * 100}%`);
    el.style.setProperty("--glint-opacity", "1");
    if (holo) {
      const angle = Math.atan2(py - 0.5, px - 0.5) * (180 / Math.PI) + 90;
      el.style.setProperty("--holo-angle", `${angle}deg`);
      el.style.setProperty("--holo-opacity", "0.55");
    }
  };

  // Settles the card back to flat and hides the highlights when the cursor leaves
  const handlePointerLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--tilt-x", "0deg");
    el.style.setProperty("--tilt-y", "0deg");
    el.style.setProperty("--glint-opacity", "0");
    if (holo) el.style.setProperty("--holo-opacity", "0");
  };

  return (
    <div style={{ perspective: "1000px" }}>
      <div
        ref={ref}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        className={`relative transition-transform duration-200 ease-out will-change-transform ${className}`}
        style={{
          ...style,
          transform: "rotateX(var(--tilt-x, 0deg)) rotateY(var(--tilt-y, 0deg))",
          transformStyle: "preserve-3d",
        }}
      >
        {children}
        <div
          className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-[var(--glint-opacity,0)] transition-opacity duration-200"
          style={{
            background: "radial-gradient(circle at var(--glint-x,50%) var(--glint-y,50%), rgba(255,255,255,0.14), transparent 55%)",
          }}
        />
        {holo && (
          <div
            className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-[var(--holo-opacity,0)] mix-blend-color-dodge transition-opacity duration-300"
            style={{
              background:
                "conic-gradient(from var(--holo-angle,0deg), #ff6ec7, #ffd76e, #6effc6, #6ec7ff, #c76eff, #ff6ec7)",
            }}
          />
        )}
      </div>
    </div>
  );
}
