/*
 * The project's first automated test (M10/T-76), and deliberately a narrow one.
 *
 * docs/TESTING.md lists "no automated unit/integration/e2e test suite" as a
 * known gap and explains why `astro build` has been enough: almost everything
 * here is static rendering, which the build itself validates. `computeStageState`
 * is the exception — the only non-trivial pure computation in the codebase, and
 * the one thing a build cannot check.
 *
 * It also cannot be checked in the browser. T-71 measured that scroll events
 * never fire in this project's verification environment, so the reader's
 * position can never be exercised there by scrolling. Making the maths a pure
 * exported function was ADR-005 #5's answer to exactly that, and this file is
 * the other half of it: the function is verified here, and the listener that
 * wraps it carries no logic worth testing.
 *
 * Worth keeping through T-77, which adds the persistent stage on top of these
 * same numbers.
 *
 * Run: npm test   (Node's built-in runner + type stripping; no dependencies)
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { computeStageState, QUANTISE } from '../src/components/story/types.ts';

// Geometry harvested from a real rendered story page, not invented.
const OFFSETS = [
  { id: 'intro', top: 610, height: 504 },
  { id: 'problem', top: 1114, height: 504 },
  { id: 'nocites', top: 1618, height: 504 },
];
const VH = 722;
const STORY_TOP = 610;
const STORY_END = 1618 + 504;
const SPAN = STORY_END - STORY_TOP;

const q = (n) => Math.round(n * QUANTISE) / QUANTISE;
const clamp01 = (n) => Math.min(1, Math.max(0, n));

/** Scroll position that puts the reading line at `line`. */
const scrollFor = (line) => line - VH / 2;

const at = (line, previousLine = line - 1) =>
  computeStageState({
    scrollY: scrollFor(line),
    previousScrollY: scrollFor(previousLine),
    offsets: OFFSETS,
    viewportHeight: VH,
    reduceMotion: false,
  });

test('reading line maps to the right scene at every boundary', () => {
  const cases = [
    { line: 0, index: 0, within: false },
    { line: STORY_TOP, index: 0, within: true },
    { line: 862, index: 0, within: true },
    { line: 1113, index: 0, within: true },
    { line: 1114, index: 1, within: true },
    { line: 1617, index: 1, within: true },
    { line: 1618, index: 2, within: true },
    { line: STORY_END, index: 2, within: true },
    { line: 5000, index: 2, within: false },
  ];
  for (const c of cases) {
    const s = at(c.line);
    assert.equal(s.sceneIndex, c.index, `scene index at line ${c.line}`);
    assert.equal(s.sceneId, OFFSETS[c.index].id, `scene id at line ${c.line}`);
    assert.equal(s.withinStory, c.within, `withinStory at line ${c.line}`);
    assert.equal(s.sceneCount, 3);
  }
});

test('progress is continuous, clamped, and quantised', () => {
  for (const line of [0, 610, 862, 1114, 1366, 1618, 1870, 2122, 5000]) {
    const s = at(line);
    const active = OFFSETS[s.sceneIndex];
    assert.equal(
      s.sceneProgress,
      q(clamp01((line - active.top) / active.height)),
      `sceneProgress at line ${line}`,
    );
    assert.equal(
      s.storyProgress,
      q(clamp01((line - STORY_TOP) / SPAN)),
      `storyProgress at line ${line}`,
    );
    assert.ok(s.sceneProgress >= 0 && s.sceneProgress <= 1);
    assert.ok(s.storyProgress >= 0 && s.storyProgress <= 1);
    // Quantised: an exact multiple of 1/QUANTISE.
    assert.equal(Math.round(s.sceneProgress * QUANTISE), s.sceneProgress * QUANTISE);
  }
});

test('story progress runs 0 to 1 across the whole story', () => {
  assert.equal(at(STORY_TOP).storyProgress, 0);
  assert.equal(at(STORY_END).storyProgress, 1);
  assert.equal(at(STORY_TOP + SPAN / 2).storyProgress, 0.5);
});

test('direction follows the scroll, not the position', () => {
  assert.equal(at(1000, 900).direction, 1);
  assert.equal(at(1000, 1100).direction, -1);
  // Standing still counts as forward rather than flapping.
  assert.equal(at(1000, 1000).direction, 1);
});

test('reduceMotion is passed through untouched', () => {
  const on = computeStageState({
    scrollY: 0, previousScrollY: 0, offsets: OFFSETS, viewportHeight: VH, reduceMotion: true,
  });
  assert.equal(on.reduceMotion, true);
});

/*
 * The degenerate cases are the reason viewportHeight is a parameter. In the
 * verification environment every viewport probe reads 0, so a function that
 * read it internally would divide by zero there while being perfectly correct
 * in a browser — a failure that looks like a logic bug.
 */
test('degenerate inputs produce finite numbers, never NaN', () => {
  const empty = computeStageState({
    scrollY: 500, previousScrollY: 0, offsets: [], viewportHeight: VH, reduceMotion: false,
  });
  assert.equal(empty.sceneCount, 0);
  assert.equal(empty.sceneId, '');
  assert.equal(empty.withinStory, false);
  assert.ok(Number.isFinite(empty.storyProgress));

  const zeroViewport = computeStageState({
    scrollY: 1200, previousScrollY: 0, offsets: OFFSETS, viewportHeight: 0, reduceMotion: false,
  });
  assert.ok(Number.isFinite(zeroViewport.sceneProgress));
  assert.ok(Number.isFinite(zeroViewport.storyProgress));

  const zeroHeight = computeStageState({
    scrollY: 1200, previousScrollY: 0,
    offsets: [{ id: 'x', top: 0, height: 0 }],
    viewportHeight: VH, reduceMotion: false,
  });
  assert.ok(Number.isFinite(zeroHeight.sceneProgress));
  assert.equal(zeroHeight.sceneProgress, 0);
});
