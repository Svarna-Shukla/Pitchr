import type { ComponentType } from "react";
import type { MaskTheme, PersonalityId } from "../../../types/investor";
import type { MaskState } from "../../../lib/maskPose";
import ArenaMask from "./ArenaMask";
import ChadVanceArenaMask from "./ChadVanceArenaMask";
import VictoriaSterlingArenaMask from "./VictoriaSterlingArenaMask";
import DrQuirkArenaMask from "./DrQuirkArenaMask";
import ArthurPendeltonArenaMask from "./ArthurPendeltonArenaMask";

export type ArenaMaskProps = { state: MaskState; intensity?: number; isSpeaking?: boolean; theme: MaskTheme };

// Tai Lung's ArenaMask predates per-investor theming and owns its own hardcoded charcoal/orange
// palette, so it's adapted here to the same { state, intensity, isSpeaking, theme } shape as the
// other four (theme is accepted but unused — his colors are baked into his geometry component).
function TaiLungArenaMask({ state, intensity, isSpeaking }: ArenaMaskProps) {
  return <ArenaMask state={state} intensity={intensity} isSpeaking={isSpeaking} />;
}

// Every investor's dedicated, hand-sculpted BufferGeometry mask for the live battle arena — no
// primitive wireframe fallbacks. Keyed by investor id so ArenaMaskScene can mount the right one.
export const ARENA_MASKS: Record<PersonalityId, ComponentType<ArenaMaskProps>> = {
  tailung: TaiLungArenaMask,
  techbro: ChadVanceArenaMask,
  mogul: VictoriaSterlingArenaMask,
  wildcard: DrQuirkArenaMask,
  mentor: ArthurPendeltonArenaMask,
};
