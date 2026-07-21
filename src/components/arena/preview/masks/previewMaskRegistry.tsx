import type { ComponentType } from "react";
import type { MaskTheme, PersonalityId } from "../../../../types/investor";
import TaiLungPreviewMask from "./TaiLungPreviewMask";
import ChadVancePreviewMask from "./ChadVancePreviewMask";
import VictoriaSterlingPreviewMask from "./VictoriaSterlingPreviewMask";
import DrQuirkPreviewMask from "./DrQuirkPreviewMask";
import ArthurPendeltonPreviewMask from "./ArthurPendeltonPreviewMask";

export type PreviewMaskProps = { theme: MaskTheme };

// Every investor's dedicated, hand-sculpted BufferGeometry mask for the pre-battle preview modal —
// idle rotation, mouse-tilt, hover glow, all keyed by investor id. No wireframe primitive fallbacks.
export const PREVIEW_MASKS: Record<PersonalityId, ComponentType<PreviewMaskProps>> = {
  tailung: TaiLungPreviewMask,
  techbro: ChadVancePreviewMask,
  mogul: VictoriaSterlingPreviewMask,
  wildcard: DrQuirkPreviewMask,
  mentor: ArthurPendeltonPreviewMask,
};
