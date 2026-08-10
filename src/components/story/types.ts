import type { ComponentType } from 'react';

/**
 * What the stage knows about where the reader is (M10/T-76, ADR-005 #3).
 *
 * Replaces the old shell's contract, which passed visualisations **nothing**:
 * `viz: Record<string, ComponentType>` meant a visual could only ever render
 * one fixed picture per scene, and the only way to change it was to unmount
 * and remount. That is why a map panning across scenes was structurally
 * impossible rather than merely unimplemented.
 */
export interface StageState {
  /** Id of the scene under the reading line. */
  sceneId: string;
  sceneIndex: number;
  sceneCount: number;
  /** 0..1 through the active scene. Quantised — see QUANTISE. */
  sceneProgress: number;
  /** 0..1 across the whole story. Quantised. */
  storyProgress: number;
  /** 1 while scrolling down, -1 while scrolling up. */
  direction: 1 | -1;
  /**
   * Whether the reading line is inside the story's span at all.
   *
   * Gates the mobile dock, which must not stay pinned over the tags and
   * related-posts rail below the story. The old shell answered this with a
   * second IntersectionObserver; with offsets already cached it is a
   * comparison, and it works in the verification environment where an
   * observer never fires.
   */
  withinStory: boolean;
  /**
   * Resolved once by the stage and passed down, never re-read from a hook by
   * each visual (ADR-005 #4). RULES.md puts the reduced-motion obligation on
   * every island individually because the global CSS net cannot reach JS
   * motion; an obligation repeated at twenty call sites is one that will
   * eventually be missed.
   */
  reduceMotion: boolean;
}

/** A visual that reads the reader's position. */
export type SceneViz = ComponentType<StageState>;

/**
 * How a story drives its visuals.
 *
 * `per-scene` is the existing behaviour, kept so the four live modules can
 * migrate without their visuals being rewritten: one component per scene,
 * swapped on change. `persistent` is the new capability (T-77) — a single
 * mount whose props change as the reader scrolls, so its elements survive
 * scene boundaries and can morph rather than restart.
 */
export type StageVisual =
  | { kind: 'per-scene'; viz: Record<string, SceneViz> }
  | { kind: 'persistent'; stage: SceneViz };

/** Absolute document geometry of one scene. Measured once, then cached. */
export interface SceneOffset {
  id: string;
  /** Document Y of the scene's top edge. */
  top: number;
  height: number;
}

/**
 * Progress is rounded to 1/200 before it reaches React.
 *
 * A scroll event fires far more often than a visual can meaningfully change.
 * Quantising collapses roughly 60 events/second into at most a few renders,
 * because the hook can then skip `setState` whenever the rounded figure is
 * unchanged. 200 steps is finer than a pixel of movement on any element the
 * stage draws, so nothing visible is lost.
 */
export const QUANTISE = 200;

function quantise(n: number): number {
  return Math.round(n * QUANTISE) / QUANTISE;
}

function clamp01(n: number): number {
  return n < 0 ? 0 : n > 1 ? 1 : n;
}

/**
 * The whole of the scroll maths, as a pure function.
 *
 * Exported and free of DOM access on purpose. T-71 measured that scroll events
 * never fire in this project's verification environment — but `window.scrollY`
 * and `getBoundingClientRect()` both return real values there. So the event is
 * untestable while the *computation* is completely testable: harvest real
 * offsets from the live DOM, call this with any scroll position, and check the
 * result. The listener that wraps it carries no logic worth testing.
 *
 * `viewportHeight` is a parameter rather than a `window.innerHeight` read for
 * the same reason, and one sharper one: in that environment every viewport
 * probe reads 0. A function that read it internally would divide by zero here
 * while being perfectly correct in a browser — the worst kind of failure,
 * because it looks like a logic bug. Passing it in also keeps the scroll
 * handler free of layout reads.
 */
export function computeStageState(args: {
  scrollY: number;
  previousScrollY: number;
  offsets: SceneOffset[];
  viewportHeight: number;
  reduceMotion: boolean;
}): StageState {
  const { scrollY, previousScrollY, offsets, viewportHeight, reduceMotion } = args;
  const direction: 1 | -1 = scrollY >= previousScrollY ? 1 : -1;

  if (offsets.length === 0) {
    return {
      sceneId: '',
      sceneIndex: 0,
      sceneCount: 0,
      sceneProgress: 0,
      storyProgress: 0,
      direction,
      withinStory: false,
      reduceMotion,
    };
  }

  /*
   * The reading line sits at the vertical middle of the viewport. That
   * reproduces what the old IntersectionObserver did with
   * `rootMargin: '-40% 0px -40% 0px'` — activate a scene once it occupies the
   * middle band — but as a position rather than a threshold, which is what
   * makes continuous progress possible at all.
   *
   * With viewportHeight 0 this degrades to the viewport's top edge. Still
   * ordered, still monotonic, no division involved: the verification
   * environment gets sensible numbers instead of NaN.
   */
  const readingLine = scrollY + viewportHeight / 2;

  let index = 0;
  for (let i = 0; i < offsets.length; i++) {
    if (readingLine >= offsets[i].top) index = i;
    else break;
  }

  const active = offsets[index];
  // A zero-height scene would otherwise produce Infinity. Can happen while
  // fonts are still swapping, before the re-measure lands.
  const sceneProgress = active.height > 0 ? clamp01((readingLine - active.top) / active.height) : 0;

  const first = offsets[0];
  const last = offsets[offsets.length - 1];
  const span = last.top + last.height - first.top;
  const storyProgress = span > 0 ? clamp01((readingLine - first.top) / span) : 0;

  return {
    sceneId: active.id,
    sceneIndex: index,
    sceneCount: offsets.length,
    sceneProgress: quantise(sceneProgress),
    storyProgress: quantise(storyProgress),
    direction,
    withinStory: readingLine >= first.top && readingLine <= last.top + last.height,
    reduceMotion,
  };
}

/** True when two states would render identically — used to skip `setState`. */
export function sameStageState(a: StageState, b: StageState): boolean {
  return (
    a.sceneId === b.sceneId &&
    a.sceneIndex === b.sceneIndex &&
    a.sceneCount === b.sceneCount &&
    a.sceneProgress === b.sceneProgress &&
    a.storyProgress === b.storyProgress &&
    a.direction === b.direction &&
    a.withinStory === b.withinStory &&
    a.reduceMotion === b.reduceMotion
  );
}
