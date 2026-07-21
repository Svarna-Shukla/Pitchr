import * as THREE from "three";
import { buildAccentShell, buildFacetedHead, widthKeyframes } from "./geometryFactory";

// Dr. Quirk's silhouette is deliberately lopsided: the base curve is the same piecewise taper as the
// others, but it's skewed asymmetrically by raw (signed) u instead of |u|, so the left and right
// halves of the face never quite match — a mismatched, fractured sculpture rather than a mirrored one.
const BASE_WIDTH = widthKeyframes([
  [0, 0.38],
  [0.18, 0.5],
  [0.32, 0.66],
  [0.5, 1.0],
  [0.72, 0.58],
  [0.88, 0.3],
  [1, 0.1],
]);

function widthAt(v: number, u: number) {
  const skew = u < 0 ? 1.18 : 0.82;
  return BASE_WIDTH(v) * skew;
}

// Big circular "monocle" socket on the right, a thin sharp slit on the left
const MONOCLE_CENTER: [number, number] = [0.42, 0.36];
const MONOCLE_RU = 0.22;
const MONOCLE_RV = 0.17;
const SLIT_CENTER: [number, number] = [-0.4, 0.4];
const SLIT_RU = 0.15;
const SLIT_RV = 0.04;

function isEyeCutout(u: number, v: number) {
  const mDu = (u - MONOCLE_CENTER[0]) / MONOCLE_RU;
  const mDv = (v - MONOCLE_CENTER[1]) / MONOCLE_RV;
  if (mDu * mDu + mDv * mDv < 1) return true;
  const sDu = (u - SLIT_CENTER[0]) / SLIT_RU;
  const sDv = (v - SLIT_CENTER[1]) / SLIT_RV;
  return sDu * sDu + sDv * sDv < 1;
}

function depthAt(u: number, v: number, absU: number) {
  let z = 0;
  z += Math.max(0, 1 - Math.abs(v - 0.15) * 4) * 0.1; // tilt-warped forehead
  z += Math.max(0, 1 - Math.abs(v - 0.32) * 4) * 0.2;
  z += Math.sin(u * 9 + v * 13) * 0.09; // fractured, chaotic ripple across every panel
  z += Math.max(0, 1 - Math.abs(v - 0.55) * 3) * (0.24 - absU * 0.18);
  z += Math.max(0, 1 - Math.abs(v - 0.88) * 3.6) * 0.22 * (u > 0 ? 1.5 : 0.7); // jagged asymmetric jaw
  return z;
}

// A handful of shards jutting off the jaw edge at random-looking (but deterministic) angles, so the
// jawline reads as physically cracked apart rather than just an uneven taper.
function buildJawShards(head: ReturnType<typeof buildFacetedHead>) {
  const triangles: THREE.Vector3[][] = [];
  const slots = [-0.85, -0.5, -0.15, 0.2, 0.55, 0.85];
  slots.forEach((u, i) => {
    const v = 0.92 + (i % 2 === 0 ? 0.02 : -0.01);
    const { width, z } = head.profileAt(u, v);
    const base = new THREE.Vector3(u * width * 1.3, (0.5 - v) * 2.4, z - 0.1);
    const spread = 0.14;
    const p1 = base.clone().add(new THREE.Vector3(spread * (i % 2 === 0 ? 1 : -1), -0.02, 0.05));
    const kick = 0.12 + (i % 3) * 0.05;
    const p2 = base.clone().add(new THREE.Vector3(spread * 0.4, -kick, -0.18 * (i % 2 === 0 ? 1 : -1)));
    triangles.push([base, p1, p2]);
  });
  return buildAccentShell(triangles, 0.85);
}

export function buildDrQuirkGeometry() {
  const head = buildFacetedHead({
    seed: 37,
    jitter: 0.12,
    cols: 9,
    rows: 13,
    widthAt,
    depthAt,
    isCutoutCell: isEyeCutout,
  });

  const monocle = head.profileAt(MONOCLE_CENTER[0], MONOCLE_CENTER[1]);
  const monoclePosition = new THREE.Vector3(
    MONOCLE_CENTER[0] * monocle.width * 1.3,
    (0.5 - MONOCLE_CENTER[1]) * 2.4,
    monocle.z - 0.16
  );

  const slit = head.profileAt(SLIT_CENTER[0], SLIT_CENTER[1]);
  const slitPosition = new THREE.Vector3(SLIT_CENTER[0] * slit.width * 1.3, (0.5 - SLIT_CENTER[1]) * 2.4, slit.z - 0.16);

  const chinProfile = head.profileAt(0.1, 0.93);
  const chin = new THREE.Vector3(0.1 * chinProfile.width * 1.3, (0.5 - 0.93) * 2.4, chinProfile.z - 0.1);

  const jawShards = buildJawShards(head);

  return {
    shell: head.shell,
    backing: head.backing,
    chin,
    monoclePosition,
    monocleRadius: MONOCLE_RU,
    slitPosition,
    jawShards,
  };
}
