import { useEffect, useRef } from "react";
import gsap from "gsap";

type Props = { recording: boolean };

// Slowly drifts and pulses two blurred gradient orbs in the background
export default function BackgroundOrbs({ recording }: Props) {
  const purpleRef = useRef<HTMLDivElement>(null);
  const blueRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const purple = purpleRef.current;
    const blue = blueRef.current;
    if (!purple || !blue) return;

    // Purple orb drifts diagonally and gently pulses in size
    gsap.to(purple, {
      x: 80,
      y: -60,
      scale: 1.15,
      duration: 12,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });

    // Blue orb drifts the opposite direction and pulses on a different rhythm
    gsap.to(blue, {
      x: -70,
      y: 50,
      scale: 1.2,
      duration: 14,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });
  }, []);

  return (
    <div
      className="absolute inset-0 transition-colors duration-700"
      style={{ background: recording ? "#120808" : "#080808" }}
    >
      <div
        ref={purpleRef}
        className="absolute -left-32 top-1/4 h-[500px] w-[500px] rounded-full opacity-60 blur-[120px]"
        style={{ background: recording ? "#6b1030" : "#4c1d95" }}
      />
      <div
        ref={blueRef}
        className="absolute -right-32 bottom-1/4 h-[500px] w-[500px] rounded-full opacity-60 blur-[120px]"
        style={{ background: recording ? "#1a3060" : "#2563eb" }}
      />
    </div>
  );
}
