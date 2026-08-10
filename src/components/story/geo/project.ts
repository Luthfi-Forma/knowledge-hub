/*
 * Web Mercator projection for hand-authored geometry (M10/T-77, ADR-005 #7).
 *
 * This is the whole of the spatial layer's machinery. ADR-005 rejected
 * MapLibre and friends: ~200KB gzip plus a tile fetch to a third-party host
 * on every page view, and a remote tile endpoint is functionally a backend,
 * which PROJECT_BRIEF rules out. WebGL is also unverifiable here — the same
 * reason ROADMAP killed three.js.
 *
 * What replaces it: coordinates written as plain number arrays in a data
 * module, projected by the ~15 lines below, drawn as <path>. No dependency,
 * no asset in public/, nothing to fetch, and the result is diffable in git.
 *
 * The important property is not the byte count. Because the geometry is DATA,
 * two states of the same shape can be interpolated as numbers and re-projected
 * — see `lerpRing`. That is an exact morph with no constraint on path command
 * structure, unlike interpolating a `d` string, and it is what lets a shape
 * survive a scene change instead of being swapped out (ADR-005 #3).
 */

const DEG_TO_RAD = Math.PI / 180;

/** Web Mercator's y, in radians-of-latitude space. Unbounded near the poles. */
function mercatorY(latitude: number): number {
  const phi = latitude * DEG_TO_RAD;
  return Math.log(Math.tan(Math.PI / 4 + phi / 2));
}

/** [longitude, latitude] in degrees. */
export type LngLat = readonly [number, number];
/** [x, y] in viewBox units. */
export type Point = readonly [number, number];

export interface Bounds {
  west: number;
  east: number;
  north: number;
  south: number;
}

/**
 * Build a projector that maps `bounds` onto a `width` x `height` viewBox.
 *
 * Coordinates outside the bounds project outside the box rather than being
 * clamped — that is deliberate, so a shape extending past the frame is
 * visibly clipped by the SVG instead of silently deformed against its edge.
 */
export function createProjector(bounds: Bounds, width: number, height: number) {
  const { west, east, north, south } = bounds;
  const xSpan = east - west;
  // North first: mercatorY grows northward while SVG y grows downward, so
  // this ordering is what puts north at the top without a separate flip.
  const yNorth = mercatorY(north);
  const ySpan = mercatorY(south) - yNorth;

  return function project([lng, lat]: LngLat): Point {
    const x = xSpan === 0 ? 0 : ((lng - west) / xSpan) * width;
    const y = ySpan === 0 ? 0 : ((mercatorY(lat) - yNorth) / ySpan) * height;
    return [x, y];
  };
}

/** Turn a projected ring into a closed SVG path. */
export function toPath(points: readonly Point[]): string {
  if (points.length === 0) return '';
  const [first, ...rest] = points;
  const head = `M${round(first[0])},${round(first[1])}`;
  const tail = rest.map((p) => `L${round(p[0])},${round(p[1])}`).join('');
  return `${head}${tail}Z`;
}

/*
 * Two decimals. At the viewBox sizes these stages use, further precision is
 * invisible and only inflates the DOM — a 40-point ring re-rendered on every
 * quantised progress step is a string the browser reparses each time.
 */
function round(n: number): number {
  return Math.round(n * 100) / 100;
}

/** Scalar interpolation. */
export function lerp(from: number, to: number, t: number): number {
  return from + (to - from) * t;
}

/**
 * Interpolate one ring toward another, vertex by vertex.
 *
 * Requires equal vertex counts, and throws otherwise rather than silently
 * truncating to the shorter ring — a half-morphed outline is the kind of
 * wrong that looks plausible on screen. Hand-authored geometry is written in
 * matched pairs on purpose, so a mismatch is a data error worth stopping for.
 */
export function lerpRing(from: readonly LngLat[], to: readonly LngLat[], t: number): LngLat[] {
  if (from.length !== to.length) {
    throw new Error(
      `lerpRing needs matching vertex counts, got ${from.length} and ${to.length}`,
    );
  }
  return from.map((p, i) => [lerp(p[0], to[i][0], t), lerp(p[1], to[i][1], t)] as const);
}
