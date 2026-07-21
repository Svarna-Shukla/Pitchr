import * as THREE from "three";
import { bandCutout, buildAccentShell, buildFacetedHead, widthKeyframes } from "./geometryFactory";

// Chad Vance's silhouette: sleek and narrow, sharp cheek angle, tapering hard to a pointed jaw —
// no soft edges anywhere, reading as a machined tech-bro face rather than an organic one.
const WIDTH = widthKeyframes([
  [0, 0.42],
  [0.15, 0.5],
  [0.3, 0.66],
  [0.5, 1.0],
  [0.72, 0.58],
  [0.88, 0.26],
  [1, 0.06],
]);

const VISOR_V_MIN = 0.34;
const VISOR_V_MAX = 0.44;

function depthAt(_u: number, v: number, absU: number) {
  let z = 0;
  z += Math.max(0, 1 - Math.abs(v - 0.1) * 5) * 0.08; // low sleek forehead
  z += Math.max(0, 1 - Math.abs(v - 0.39) * 6) * 0.24; // visor browline ridge
  z += Math.max(0, 1 - Math.abs(v - 0.55) * 3.6) * (0.26 - absU * 0.22); // sharp cheekbones
  z += Math.max(0, 1 - absU * 3.4) * Math.max(0, 1 - Math.abs(v - 0.5) * 2) * 0.22; // narrow nose ridge
  z += Math.max(0, 1 - Math.abs(v - 0.88) * 4.5) * 0.18; // angular jaw thrust
  return z;
}

// Slicked-back angular hair: a row of swept spikes jutting up and back from the forehead's top edge.
function buildHairAccent(widthAtTop: number) {
  const baseY = 1.18;
  const topWidth = widthAtTop * 1.3;
  const spikes = 6;
  const triangles: THREE.Vector3[][] = [];
  for (let i = 0; i < spikes; i++) {
    const t0 = (i / spikes) * 2 - 1;
    const t1 = ((i + 1) / spikes) * 2 - 1;
    const x0 = t0 * topWidth;
    const x1 = t1 * topWidth;
    const xm = (x0 + x1) / 2;
    const peakY = baseY + 0.2 + (i % 2 === 0 ? 0.1 : 0);
    const base0 = new THREE.Vector3(x0, baseY, -0.04);
    const base1 = new THREE.Vector3(x1, baseY, -0.04);
    const peak = new THREE.Vector3(xm, peakY, -0.3);
    triangles.push([base0, base1, peak]);
  }
  return buildAccentShell(triangles, 0.94);
}

export function buildChadVanceGeometry() {
  const head = buildFacetedHead({
    seed: 11,
    widthAt: WIDTH,
    depthAt,
    isCutoutCell: bandCutout(VISOR_V_MIN, VISOR_V_MAX),
  });

  const visor = head.profileAt(0, (VISOR_V_MIN + VISOR_V_MAX) / 2);
  const visorPosition = new THREE.Vector3(0, (0.5 - (VISOR_V_MIN + VISOR_V_MAX) / 2) * 2.4, visor.z - 0.14);
  const visorWidth = WIDTH((VISOR_V_MIN + VISOR_V_MAX) / 2) * 1.3 * 2 * 0.92;

  const chinProfile = head.profileAt(0, 0.94);
  const chin = new THREE.Vector3(0, (0.5 - 0.94) * 2.4, chinProfile.z - 0.1);

  const hairAccent = buildHairAccent(WIDTH(0));

  return { shell: head.shell, backing: head.backing, chin, visorPosition, visorWidth, hairAccent };
}
