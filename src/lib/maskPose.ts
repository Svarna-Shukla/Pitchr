export type MaskState = "idle" | "speaking" | "listening" | "strong" | "average" | "weak" | "winning" | "gameover";

export type MaskPose = { scale: number; z: number; tilt: number; eye: number; hot: number; mouth: number };

// Per-state target pose: uniform scale, forward/back lean (z), head-tilt (rotation.z), eye glow
// intensity + color mix toward white-hot, and how open the mouth slit is.
export const MASK_TARGETS: Record<MaskState, MaskPose> = {
  idle: { scale: 1, z: 0, tilt: 0, eye: 1.6, hot: 0, mouth: 0.15 },
  speaking: { scale: 1.15, z: 0.35, tilt: 0, eye: 3.2, hot: 0.15, mouth: 0.7 },
  listening: { scale: 0.9, z: -0.15, tilt: 0, eye: 0.9, hot: 0, mouth: 0.05 },
  strong: { scale: 0.85, z: -0.25, tilt: 0, eye: 1.2, hot: 0, mouth: 0.2 },
  average: { scale: 1.0, z: 0.05, tilt: 0.04, eye: 2.0, hot: 0.3, mouth: 0.45 },
  weak: { scale: 1.3, z: 0.45, tilt: 0.12, eye: 4, hot: 0.85, mouth: 1.1 },
  winning: { scale: 1.05, z: 0.1, tilt: 0, eye: 2.2, hot: 0.1, mouth: 0.35 },
  gameover: { scale: 2.4, z: 1.6, tilt: 0, eye: 6, hot: 1, mouth: 1.4 },
};

// Blends a state's target pose toward idle by `intensity` (< 1 dampens the reaction, > 1 exaggerates
// it) — this is how each investor personality's mask feels calmer or more volatile
export function scaleMaskTarget(target: MaskPose, intensity: number): MaskPose {
  const idle = MASK_TARGETS.idle;
  return {
    scale: idle.scale + (target.scale - idle.scale) * intensity,
    z: idle.z + (target.z - idle.z) * intensity,
    tilt: idle.tilt + (target.tilt - idle.tilt) * intensity,
    eye: idle.eye + (target.eye - idle.eye) * intensity,
    hot: idle.hot + (target.hot - idle.hot) * intensity,
    mouth: idle.mouth + (target.mouth - idle.mouth) * intensity,
  };
}
