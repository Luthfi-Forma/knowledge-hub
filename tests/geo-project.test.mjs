/*
 * Tests for the spatial layer's projection (M10/T-77).
 *
 * Same reasoning as story-progress.test.mjs: pure maths that `astro build`
 * cannot check, feeding geometry that will carry real published figures. A
 * projection that is subtly wrong produces a map that looks like a map, which
 * is exactly the failure mode worth a test.
 *
 * Run: npm test
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  createProjector,
  toPath,
  lerp,
  lerpRing,
} from '../src/components/story/geo/project.ts';

// Cikarang, Bekasi — the area T-78's story covers.
const BOUNDS = { west: 107.0, east: 107.25, north: -6.2, south: -6.4 };
const W = 800;
const H = 600;
const project = createProjector(BOUNDS, W, H);

const near = (a, b, tol = 1e-6) => Math.abs(a - b) <= tol;

test('corners map to the corners of the viewBox', () => {
  const [nwX, nwY] = project([BOUNDS.west, BOUNDS.north]);
  const [seX, seY] = project([BOUNDS.east, BOUNDS.south]);
  assert.ok(near(nwX, 0), `north-west x should be 0, got ${nwX}`);
  assert.ok(near(nwY, 0), `north-west y should be 0, got ${nwY}`);
  assert.ok(near(seX, W), `south-east x should be ${W}, got ${seX}`);
  assert.ok(near(seY, H), `south-east y should be ${H}, got ${seY}`);
});

test('north is up and east is right', () => {
  const [, northY] = project([107.1, -6.25]);
  const [, southY] = project([107.1, -6.35]);
  assert.ok(northY < southY, 'a more northern latitude must have a smaller y');

  const [westX] = project([107.05, -6.3]);
  const [eastX] = project([107.2, -6.3]);
  assert.ok(westX < eastX, 'a more eastern longitude must have a larger x');
});

test('longitude is linear, latitude is not', () => {
  // Longitude maps linearly in Mercator; the midpoint lands exactly halfway.
  const [midX] = project([(BOUNDS.west + BOUNDS.east) / 2, -6.3]);
  assert.ok(near(midX, W / 2), `longitude midpoint should be ${W / 2}, got ${midX}`);

  // Latitude does not — that is the whole point of the projection. Over a
  // 0.2-degree span near the equator the deviation is small but must exist,
  // otherwise the projection has silently degraded to a linear scale.
  const [, midY] = project([107.1, (BOUNDS.north + BOUNDS.south) / 2]);
  assert.notEqual(midY, H / 2, 'latitude midpoint must not be exactly half');
  assert.ok(Math.abs(midY - H / 2) < 1, 'but should be within a pixel at this scale');
});

test('coordinates outside the bounds project outside the box, not clamped', () => {
  const [x, y] = project([BOUNDS.east + 0.1, BOUNDS.south - 0.1]);
  assert.ok(x > W, `x should exceed ${W}, got ${x}`);
  assert.ok(y > H, `y should exceed ${H}, got ${y}`);
});

test('degenerate bounds produce zeros, not NaN or Infinity', () => {
  const flat = createProjector({ west: 107, east: 107, north: -6.3, south: -6.3 }, W, H);
  const [x, y] = flat([107, -6.3]);
  assert.ok(Number.isFinite(x) && Number.isFinite(y), `got ${x}, ${y}`);
  assert.equal(x, 0);
  assert.equal(y, 0);
});

test('toPath closes the ring and rounds to two decimals', () => {
  const d = toPath([
    [0, 0],
    [10.123456, 0],
    [10, 5.987654],
  ]);
  assert.equal(d, 'M0,0L10.12,0L10,5.99Z');
  assert.equal(toPath([]), '');
});

test('lerp and lerpRing interpolate endpoint to endpoint', () => {
  assert.equal(lerp(0, 10, 0), 0);
  assert.equal(lerp(0, 10, 1), 10);
  assert.equal(lerp(0, 10, 0.25), 2.5);

  const a = [[107.0, -6.2], [107.1, -6.2]];
  const b = [[107.2, -6.4], [107.3, -6.4]];
  assert.deepEqual(lerpRing(a, b, 0), a.map((p) => [p[0], p[1]]));
  assert.deepEqual(lerpRing(a, b, 1), b.map((p) => [p[0], p[1]]));
  const mid = lerpRing(a, b, 0.5);
  assert.ok(near(mid[0][0], 107.1) && near(mid[0][1], -6.3), `got ${mid[0]}`);
});

test('lerpRing refuses mismatched vertex counts instead of truncating', () => {
  assert.throws(
    () => lerpRing([[0, 0]], [[0, 0], [1, 1]], 0.5),
    /matching vertex counts/,
    'a half-morphed outline looks plausible on screen — this must fail loudly',
  );
});
