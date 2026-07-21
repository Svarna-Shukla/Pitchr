import * as THREE from "three";
import { buildAccentShell, buildFacetedHead, ovalCutout, widthKeyframes } from "./geometryFactory";

// Arthur Pendelton's silhouette: wide and rounded throughout, never taut or pointed — a warmer, wiser
// face that stays broad even down at the jaw, where the beard accent picks up.
const WIDTH = widthKeyframes([
  [0, 0.5],
  [0.2, 0.62],
  [0.38, 0.78],
  [0.5, 1.0],
  [0.7, 0.88],
  [0.85, 0.72],
  [1, 0.6],
]);

const EYE_CENTERS: [number, number][] = [
  [-0.42, 0.36],
  [0.42, 0.36],
];
const EYE_RU = 0.19;
const EYE_RV = 0.1; // wide, soft, warm

function depthAt(_u: number, v: number, absU: number) {
  let z = 0;
  z += Math.max(0, 1 - Math.abs(v - 0.14) * 3) * 0.14; // soft rounded forehead
  z += Math.max(0, 1 - Math.abs(v - 0.3) * 3.4) * 0.14; // gentle brow
  z += Math.max(0, 1 - Math.abs(v - 0.55) * 2.6) * (0.22 - absU * 0.16); // soft wide cheeks
  z += Math.max(0, 1 - absU * 2.6) * Math.max(0, 1 - Math.abs(v - 0.5) * 1.6) * 0.18; // gentle nose
  z += Math.max(0, 1 - Math.abs(v - 0.85) * 2.8) * 0.16; // soft rounded jaw
  return z;
}

// Stylized geometric beard: a fan of triangles hanging from the jaw edge down to a few converging
// points, low-poly but readable as a beard silhouette rather than a flat cutoff.
function buildBeardAccent(head: ReturnType<typeof buildFacetedHead>) {
  const edgeV = 1;
  const samples = 9;
  const edgePoints: THREE.Vector3[] = [];
  for (let i = 0; i <= samples; i++) {
    const u = (i / samples) * 2 - 1;
    const { width, z } = head.profileAt(u, edgeV);
    edgePoints.push(new THREE.Vector3(u * width * 1.3, (0.5 - edgeV) * 2.4, z - 0.06));
  }

  const tipCenter = new THREE.Vector3(0, edgePoints[0].y - 0.55, edgePoints[Math.floor(samples / 2)].z - 0.1);
  const tipSides: THREE.Vector3[] = [
    new THREE.Vector3(-0.18, edgePoints[0].y - 0.3, tipCenter.z + 0.04),
    new THREE.Vector3(0.18, edgePoints[0].y - 0.3, tipCenter.z + 0.04),
  ];

  const triangles: THREE.Vector3[][] = [];
  for (let i = 0; i < edgePoints.length - 1; i++) {
    const a = edgePoints[i];
    const b = edgePoints[i + 1];
    const mid = i < edgePoints.length / 2 ? tipSides[0] : tipSides[1];
    triangles.push([a, b, mid]);
  }
  triangles.push([tipSides[0], tipSides[1], tipCenter]);

  return buildAccentShell(triangles, 0.9);
}

export function buildArthurPendeltonGeometry() {
  const head = buildFacetedHead({
    seed: 47,
    jitter: 0.04,
    widthAt: WIDTH,
    depthAt,
    isCutoutCell: ovalCutout(EYE_CENTERS, EYE_RU, EYE_RV),
  });

  const eyePositions = EYE_CENTERS.map(([u, v]) => {
    const { width, z } = head.profileAt(u, v);
    return new THREE.Vector3(u * width * 1.3, (0.5 - v) * 2.4, z - 0.14);
  });

  const chinProfile = head.profileAt(0, 0.98);
  const chin = new THREE.Vector3(0, (0.5 - 0.98) * 2.4, chinProfile.z - 0.06);

  const beardAccent = buildBeardAccent(head);

  return { shell: head.shell, backing: head.backing, chin, eyePositions, beardAccent };
}
