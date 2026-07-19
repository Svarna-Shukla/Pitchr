import type { ReactNode } from "react";
import EmberParticles from "./EmberParticles";
import LowHealthVignette from "./LowHealthVignette";

const CRITICAL_HEALTH = 10;

type Props = { children: ReactNode; health?: number };

// Full-viewport interrogation shell: almost-pure-black backdrop with slow-drifting embers and a
// faint cinematic scanline texture. Sits above the app's normal nav (z-30) so the arena fully takes
// over the screen while tabs stay clickable. Pulses a red edge vignette once health is critical.
export default function ArenaLayout({ children, health }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col" style={{ background: "#0a0a0a" }}>
      <EmberParticles />
      <div className="arena-scanlines pointer-events-none absolute inset-0 z-[5]" />
      <LowHealthVignette active={health !== undefined && health <= CRITICAL_HEALTH} />
      <div className="relative z-10 flex h-full w-full flex-col overflow-y-auto pt-16">{children}</div>
    </div>
  );
}
