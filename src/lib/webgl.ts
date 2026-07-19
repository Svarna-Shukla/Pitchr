// Detects whether the browser can actually create a WebGL context, used to gate the 3D hero mask
// scene in favor of a plain CSS fallback on devices/browsers where WebGL is unavailable or disabled
export function isWebGLAvailable(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    return !!(window.WebGLRenderingContext && (canvas.getContext("webgl") || canvas.getContext("experimental-webgl")));
  } catch {
    return false;
  }
}
