import * as THREE from "three";

// Generalizes the shattered-shell technique from maskGeometry.ts (Tai Lung's original hand-sculpted
// mask) into a reusable low-poly head builder: a grid of quads split into triangles, each shrunk
// toward its own centroid so cracks of glowing backing show through the seams, with per-vertex jitter
// and an arbitrary sculpting profile so every investor can get a genuinely distinct silhouette.
export type FacetedHeadConfig = {
  cols?: number;
  rows?: number;
  shellShrink?: number;
  jitter?: number;
  widthScale?: number;
  heightScale?: number;
  seed?: number;
  /** 0..1 fraction of half-width at silhouette position v (0 = forehead top, 1 = chin), for signed u so asymmetric faces are possible. */
  widthAt: (v: number, u: number) => number;
  /** Forward/back sculpting (brow, cheeks, nose, jaw) at a given signed u/v position. */
  depthAt: (u: number, v: number, absU: number) => number;
  /** Cells passing this predicate are left open (eye sockets, visor bands, etc). */
  isCutoutCell?: (u: number, v: number) => boolean;
};

export type FacetedHead = {
  shell: THREE.BufferGeometry;
  backing: THREE.BufferGeometry;
  profileAt: (u: number, v: number) => { width: number; z: number };
  vertexAt: (ci: number, ri: number) => THREE.Vector3;
  cols: number;
  rows: number;
};

export function buildFacetedHead(config: FacetedHeadConfig): FacetedHead {
  const cols = config.cols ?? 10;
  const rows = config.rows ?? 14;
  const shellShrink = config.shellShrink ?? 0.9;
  const jitterAmt = config.jitter ?? 0.05;
  const widthScale = config.widthScale ?? 1.3;
  const heightScale = config.heightScale ?? 2.4;
  const seed = config.seed ?? 0;

  function hash(i: number, j: number) {
    const s = Math.sin(i * 127.1 + j * 311.7 + seed * 74.7 + 13.1) * 43758.5453;
    return s - Math.floor(s);
  }

  function profileAt(u: number, v: number) {
    const width = config.widthAt(v, u);
    const absU = Math.abs(u);
    const z = config.depthAt(u, v, absU);
    return { width, z };
  }

  function vertexAt(ci: number, ri: number) {
    const u = (ci / cols) * 2 - 1;
    const v = ri / rows;
    const { width, z } = profileAt(u, v);
    const jitter = (hash(ci, ri) - 0.5) * jitterAmt;
    return new THREE.Vector3(u * width * widthScale, (0.5 - v) * heightScale, z + jitter);
  }

  const shellPositions: number[] = [];
  const backingPositions: number[] = [];

  for (let ri = 0; ri < rows; ri++) {
    for (let ci = 0; ci < cols; ci++) {
      const cu = ((ci + 0.5) / cols) * 2 - 1;
      const cv = (ri + 0.5) / rows;
      if (config.isCutoutCell?.(cu, cv)) continue;

      const a = vertexAt(ci, ri);
      const b = vertexAt(ci + 1, ri);
      const c = vertexAt(ci, ri + 1);
      const d = vertexAt(ci + 1, ri + 1);

      for (const tri of [
        [a, c, b],
        [b, c, d],
      ]) {
        for (const p of tri) backingPositions.push(p.x, p.y, p.z - 0.05);

        const centroid = new THREE.Vector3().add(tri[0]).add(tri[1]).add(tri[2]).divideScalar(3);
        for (const p of tri) {
          const shrunk = p.clone().sub(centroid).multiplyScalar(shellShrink).add(centroid);
          shellPositions.push(shrunk.x, shrunk.y, shrunk.z);
        }
      }
    }
  }

  const shell = new THREE.BufferGeometry();
  shell.setAttribute("position", new THREE.Float32BufferAttribute(shellPositions, 3));
  shell.computeVertexNormals();

  const backing = new THREE.BufferGeometry();
  backing.setAttribute("position", new THREE.Float32BufferAttribute(backingPositions, 3));
  backing.computeVertexNormals();

  return { shell, backing, profileAt, vertexAt, cols, rows };
}

// Converts a hand-placed list of triangles (hair spikes, a crown, a beard fan, jagged jaw shards) into
// a BufferGeometry with the same crack-shrink aesthetic as the main shell, so accent pieces read as
// part of the same shattered sculpture rather than a bolted-on prop.
export function buildAccentShell(triangles: THREE.Vector3[][], shrink = 0.9) {
  const positions: number[] = [];
  for (const tri of triangles) {
    const centroid = new THREE.Vector3().add(tri[0]).add(tri[1]).add(tri[2]).divideScalar(3);
    for (const p of tri) {
      const shrunk = p.clone().sub(centroid).multiplyScalar(shrink).add(centroid);
      positions.push(shrunk.x, shrunk.y, shrunk.z);
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geo.computeVertexNormals();
  return geo;
}

export function ovalCutout(centers: [number, number][], ru: number, rv: number) {
  return (u: number, v: number) => {
    for (const [cu, cv] of centers) {
      const du = (u - cu) / ru;
      const dv = (v - cv) / rv;
      if (du * du + dv * dv < 1) return true;
    }
    return false;
  };
}

export function bandCutout(vMin: number, vMax: number, uMin = -1, uMax = 1) {
  return (u: number, v: number) => v >= vMin && v <= vMax && u >= uMin && u <= uMax;
}

// Piecewise-linear silhouette helper — the same width-keyframe technique the original mask used.
export function widthKeyframes(keyframes: [number, number][]) {
  return (v: number) => {
    for (let i = 0; i < keyframes.length - 1; i++) {
      const [v0, w0] = keyframes[i];
      const [v1, w1] = keyframes[i + 1];
      if (v >= v0 && v <= v1) {
        const t = (v - v0) / (v1 - v0);
        return w0 + (w1 - w0) * t;
      }
    }
    return keyframes[keyframes.length - 1][1];
  };
}
