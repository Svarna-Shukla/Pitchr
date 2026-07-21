import { useRef } from "react";
import type { RefObject } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { MASK_TARGETS, scaleMaskTarget, type MaskState } from "../../../lib/maskPose";

type MaskRefs = {
  group: RefObject<THREE.Group | null>;
  mouth: RefObject<THREE.Mesh | null>;
  backingMat: RefObject<THREE.MeshStandardMaterial | null>;
  eyeMats: RefObject<(THREE.MeshStandardMaterial | null)[]>;
};

// Drives every frame of the mask's pose animation: body lean/scale/tilt, idle sway/bob, eye glow
// color+intensity, and the mouth slit's open amount. The mouth pulses while `isTalking` — the mask is
// asking a question ("speaking"), or the judgment line is actually playing via Web Speech Synthesis —
// and settles back to the state's idle slit shape the instant that stops. `eyeColor` lets each
// investor's mask glow its own signature color instead of Tai Lung's fixed orange.
export function useMaskAnimation(
  state: MaskState,
  intensity: number,
  isSpeaking: boolean,
  refs: MaskRefs,
  eyeColor: string = "#FF4500"
) {
  const clock = useRef(0);

  useFrame((_, delta) => {
    const { group, mouth, backingMat, eyeMats } = refs;
    if (!group.current) return;
    const t = state === "idle" || state === "gameover" ? MASK_TARGETS[state] : scaleMaskTarget(MASK_TARGETS[state], intensity);
    const lerp = Math.min(1, delta * 4.5);
    clock.current += delta;
    const idleSway = state === "idle" ? Math.sin(clock.current * 0.4) * 0.12 : 0;
    const idleBob = state === "idle" ? Math.sin(clock.current * 0.6) * 0.04 : 0;
    const nod = state === "winning" ? Math.sin(clock.current * 1.2) * 0.05 : 0;
    group.current.scale.setScalar(THREE.MathUtils.lerp(group.current.scale.x, t.scale, lerp));
    group.current.position.z = THREE.MathUtils.lerp(group.current.position.z, t.z, lerp);
    group.current.position.y = THREE.MathUtils.lerp(group.current.position.y, idleBob, lerp);
    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, idleSway, lerp);
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, nod, lerp);
    group.current.rotation.z = THREE.MathUtils.lerp(group.current.rotation.z, t.tilt, lerp);

    if (mouth.current) {
      const isTalking = state === "speaking" || isSpeaking;
      const openPulse = isTalking ? 1 + Math.sin(clock.current * 10) * 0.35 : 1;
      const targetScaleY = t.mouth * openPulse;
      mouth.current.scale.y = THREE.MathUtils.lerp(mouth.current.scale.y, Math.max(0.06, targetScaleY), lerp);
      const targetTiltZ = state === "strong" || state === "winning" ? -0.35 : 0;
      mouth.current.rotation.z = THREE.MathUtils.lerp(mouth.current.rotation.z, targetTiltZ, lerp);
    }

    const hotEyeColor = new THREE.Color(eyeColor).lerp(new THREE.Color("#ffffff"), t.hot);
    for (const mat of eyeMats.current) {
      if (!mat) continue;
      mat.emissiveIntensity = THREE.MathUtils.lerp(mat.emissiveIntensity, t.eye, lerp);
      mat.emissive.lerp(hotEyeColor, lerp);
    }
    if (backingMat.current) backingMat.current.emissiveIntensity = THREE.MathUtils.lerp(backingMat.current.emissiveIntensity, 1.1 + t.eye * 0.25, lerp);
  });
}
