import * as THREE from "three";
import { buildAccentShell, buildFacetedHead, ovalCutout, widthKeyframes } from "./geometryFactory";

// Victoria Sterling's silhouette: narrow forehead, dramatically flared cheekbones, and a jaw that
// tapers to a razor point — an intimidating, highly structured executive face.
const WIDTH = widthKeyframes([
  [0, 0.32],
  [0.15, 0.46],
  [0.3, 0.6],
  [0.48, 1.0],
  [0.7, 0.48],
  [0.86, 0.2],
  [1, 0.04],
]);

const EYE_CENTERS: [number, number][] = [
  [-0.38, 0.36],
  [0.38, 0.36],
];
const EYE_RU = 0.13;
const EYE_RV = 0.045; // narrow calculating slit

function depthAt(_u: number, v: number, absU: number) {
  let z = 0;
  z += Math.max(0, 1 - Math.abs(v - 0.12) * 6) * 0.06; // minimal, sleek forehead
  z += Math.max(0, 1 - Math.abs(v - 0.5) * 4.2) * (0.34 - absU * 0.28); // high, sharp cheekbones
  z += Math.max(0, 1 - absU * 3.6) * Math.max(0, 1 - Math.abs(v - 0.48) * 2.2) * 0.18; // narrow nose ridge
  z += Math.max(0, 1 - Math.abs(v - 0.92) * 5) * 0.2; // razor jaw point
  return z;
}

// Slick geometric crown/hairframe: three tall symmetric spikes above the forehead, tallest at center.
function buildCrownAccent(widthAtTop: number) {
  const baseY = 1.18;
  const topWidth = widthAtTop * 1.3;
  const heights = [0.22, 0.42, 0.22];
  const triangles: THREE.Vector3[][] = [];
  for (let i = 0; i < heights.length; i++) {
    const t0 = (i / heights.length) * 2 - 1;
    const t1 = ((i + 1) / heights.length) * 2 - 1;
    const x0 = t0 * topWidth;
    const x1 = t1 * topWidth;
    const xm = (x0 + x1) / 2;
    const base0 = new THREE.Vector3(x0, baseY, -0.02);
    const base1 = new THREE.Vector3(x1, baseY, -0.02);
    const peak = new THREE.Vector3(xm, baseY + heights[i], -0.1);
    triangles.push([base0, base1, peak]);
  }
  return buildAccentShell(triangles, 0.92);
}

export function buildVictoriaSterlingGeometry() {
  const head = buildFacetedHead({
    seed: 23,
    widthAt: WIDTH,
    depthAt,
    isCutoutCell: ovalCutout(EYE_CENTERS, EYE_RU, EYE_RV),
  });

  const eyePositions = EYE_CENTERS.map(([u, v]) => {
    const { width, z } = head.profileAt(u, v);
    return new THREE.Vector3(u * width * 1.3, (0.5 - v) * 2.4, z - 0.16);
  });

  const chinProfile = head.profileAt(0, 0.95);
  const chin = new THREE.Vector3(0, (0.5 - 0.95) * 2.4, chinProfile.z - 0.1);

  const crownAccent = buildCrownAccent(WIDTH(0));

  return { shell: head.shell, backing: head.backing, chin, eyePositions, crownAccent };
}
