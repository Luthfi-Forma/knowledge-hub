import { useEffect, useRef, useState } from 'react';
import {
  computeStageState,
  sameStageState,
  type SceneOffset,
  type StageState,
} from './types';

export interface UseStoryProgressOptions {
  /** Ordered scene ids, from the post's `story.scenes` frontmatter. */
  sceneIds: string[];
  reduceMotion: boolean;
  /**
   * Mount at a chosen reading position instead of the top.
   *
   * This exists for verification, and deliberately as a PROP rather than a
   * hardcoded `useState` inside the shell. LESSONS (2026-07-21) records the
   * old workaround — temporarily editing the shared shell and remembering to
   * revert — and warns that a stray edit left behind would silently break
   * every scrollytelling post at once. Passing it from one page cannot do
   * that.
   *
   * It seeds a scroll position and runs it through the real computation
   * rather than short-circuiting to a state object, so what gets verified is
   * the actual maths.
   */
  initial?: { sceneIndex: number; sceneProgress: number };
}

/**
 * Tracks the reader's position through a story (M10/T-76, ADR-005 #5).
 *
 * Design constraints, all load-bearing:
 *
 * - Offsets are measured on mount, on resize, and after `load` (web fonts
 *   swapping changes scene heights), then CACHED. The scroll handler performs
 *   zero layout reads — no `getBoundingClientRect`, no `offsetTop` — so it
 *   cannot force a reflow no matter how often it fires.
 * - Viewport height is cached alongside them for the same reason, and handed
 *   to the pure function rather than read inside it.
 * - `setState` runs only when the quantised result actually differs, so ~60
 *   scroll events per second collapse into a handful of renders.
 */
export function useStoryProgress({
  sceneIds,
  reduceMotion,
  initial,
}: UseStoryProgressOptions): StageState {
  const [state, setState] = useState<StageState>(() => ({
    sceneId: sceneIds[0] ?? '',
    sceneIndex: 0,
    sceneCount: sceneIds.length,
    sceneProgress: 0,
    storyProgress: 0,
    direction: 1,
    withinStory: false,
    reduceMotion,
  }));

  const offsetsRef = useRef<SceneOffset[]>([]);
  const viewportRef = useRef(0);
  const previousScrollYRef = useRef(0);

  const idsKey = sceneIds.join(',');

  useEffect(() => {
    const ids = idsKey ? idsKey.split(',') : [];

    const measure = () => {
      const found: SceneOffset[] = [];
      const missing: string[] = [];
      for (const id of ids) {
        const el = document.getElementById(`sec-${id}`);
        if (!el) {
          missing.push(id);
          continue;
        }
        const rect = el.getBoundingClientRect();
        found.push({ id, top: rect.top + window.scrollY, height: rect.height });
      }
      offsetsRef.current = found;
      viewportRef.current = window.innerHeight;

      /*
       * The build cannot check that every frontmatter scene id has a matching
       * `<Scene id>` in the MDX — nothing can read rendered MDX (ADR-005 #1),
       * which is why the assertion planned for T-75 had to be dropped. This
       * recovers part of it at runtime, in dev only: a mistyped id shows up
       * immediately instead of quietly costing that scene its citations.
       */
      if (import.meta.env.DEV && missing.length > 0) {
        console.warn(
          `[story] scene id(s) in frontmatter have no matching <Scene id> in the MDX body: ${missing.join(', ')}`,
        );
      }
    };

    const read = (scrollY: number) => {
      const next = computeStageState({
        scrollY,
        previousScrollY: previousScrollYRef.current,
        offsets: offsetsRef.current,
        viewportHeight: viewportRef.current,
        reduceMotion,
      });
      previousScrollYRef.current = scrollY;
      setState((current) => (sameStageState(current, next) ? current : next));
    };

    const onScroll = () => read(window.scrollY);

    const onResize = () => {
      measure();
      read(window.scrollY);
    };

    measure();

    if (initial && offsetsRef.current.length > 0) {
      // Convert the requested scene position into the scroll position that
      // would produce it, then run the real computation on that — so the
      // verified path is the same one a reader exercises.
      const i = Math.min(Math.max(initial.sceneIndex, 0), offsetsRef.current.length - 1);
      const target = offsetsRef.current[i];
      const seeded =
        target.top + target.height * initial.sceneProgress - viewportRef.current / 2;
      previousScrollYRef.current = seeded;
      read(seeded);
    } else {
      read(window.scrollY);
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    window.addEventListener('load', onResize);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('load', onResize);
    };
    // `initial` is read once at mount by design; re-running on a new object
    // identity would yank the reader back to the seeded position.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idsKey, reduceMotion]);

  return state;
}
