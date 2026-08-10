import { useEffect } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { EASE_OUT, STAGE_DURATION_S } from '../components/story/motion';
import { useStoryProgress } from '../components/story/useStoryProgress';
import type { StageState, StageVisual } from '../components/story/types';

/*
 * The visual stage of a story (M10/T-76, ADR-005) — the only hydrated part of
 * a story page.
 *
 * Everything that used to surround it (hero, prose column, citations, sources
 * panel) is now static Astro, so this island carries the visuals and nothing
 * else. It is mounted with `client:load` rather than `client:visible`: the
 * stage sits above the fold and IS the page's main content, so deferring buys
 * nothing, and T-71 measured that both `client:visible` (IntersectionObserver)
 * and `client:idle` (requestIdleCallback) never hydrate at all in this
 * project's verification environment.
 *
 * `visual` holds component functions, which cannot cross Astro's hydration
 * boundary (props are JSON-serialised; LESSONS 2026-07-18). So a post does
 * not mount this directly — it exports a small wired-up island that supplies
 * `visual` internally and takes only JSON props from the page, exactly the
 * arrangement ADR-002 already requires of the existing modules.
 */
export interface StoryStageProps {
  /** Ordered scene ids, from the post's `story.scenes` frontmatter. */
  sceneIds: string[];
  /** Per-scene now; a single persistent visual lands in T-77. */
  visual: StageVisual;
  /** Provenance caption per scene id, from frontmatter. JSON-safe. */
  vizCitations?: Record<string, { fig: string; source: string }>;
  /** Verification hook — mount at a chosen reading position. See useStoryProgress. */
  initial?: { sceneIndex: number; sceneProgress: number };
}

function renderVisual(visual: StageVisual, state: StageState) {
  if (visual.kind === 'persistent') {
    const Stage = visual.stage;
    return <Stage {...state} />;
  }
  const Viz = visual.viz[state.sceneId];
  return Viz ? <Viz {...state} /> : null;
}

export default function StoryStage({ sceneIds, visual, vizCitations, initial }: StoryStageProps) {
  const reduceMotion = useReducedMotion() ?? false;
  const state = useStoryProgress({ sceneIds, reduceMotion, initial });
  const citation = vizCitations?.[state.sceneId];

  /*
   * Page-by-page keyboard navigation, ported from the old shell. Anchors are
   * read from the DOM here rather than from the hook's cached offsets: this
   * fires on a keypress, not on every scroll event, so one layout read costs
   * nothing and staying current matters more than staying cheap.
   */
  useEffect(() => {
    const isTypingTarget = (el: EventTarget | null) => {
      if (!(el instanceof HTMLElement)) return false;
      return el.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(el.tagName);
    };
    let animating = false;
    const onKey = (e: KeyboardEvent) => {
      if (isTypingTarget(e.target) || e.metaKey || e.ctrlKey || e.altKey) return;
      const isDown = e.key === 'PageDown' || (e.key === ' ' && !e.shiftKey);
      const isUp = e.key === 'PageUp' || (e.key === ' ' && e.shiftKey);
      if (!isDown && !isUp) return;

      const anchors = [
        0,
        ...sceneIds
          .map((id) => {
            const el = document.getElementById(`sec-${id}`);
            return el ? el.getBoundingClientRect().top + window.scrollY - 96 : null;
          })
          .filter((n): n is number => n !== null),
      ].sort((a, b) => a - b);

      const y = window.scrollY;
      let target: number | null = null;
      if (isDown) {
        target = anchors.find((a) => a > y + 8) ?? null;
      } else {
        for (let i = anchors.length - 1; i >= 0; i--) {
          if (anchors[i] < y - 8) {
            target = anchors[i];
            break;
          }
        }
      }
      if (target == null || animating) return;
      e.preventDefault();
      animating = true;
      window.scrollTo({ top: Math.max(0, target), behavior: reduceMotion ? 'auto' : 'smooth' });
      window.setTimeout(() => {
        animating = false;
      }, 700);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [sceneIds, reduceMotion]);

  const figure = String(state.sceneIndex + 1).padStart(2, '0');

  return (
    <>
      {/* Desktop: sticky panel beside the prose column. */}
      <div className="hidden lg:block">
        <div className="sticky top-20 flex h-[calc(100vh-6rem)] flex-col justify-center gap-3">
          <div className="border-line bg-paper-raised relative h-[68vh] w-full overflow-hidden border">
            <div className="bg-line absolute inset-x-0 top-0 z-10 h-[2px]">
              {/*
                Bound straight to storyProgress with no animation, deliberately.
                The old bar stepped in whole scenes — a discrete active-section
                id was the only signal it had — so easing between those jumps
                was what made them read as movement. Now the value is already
                continuous and already tracks the scroll, so animating toward
                it would only add lag between the reader's gesture and the bar.
                A progress indicator that trails the thing it measures is
                wrong, not smooth.

                It also removes the last rAF dependency from the stage chrome,
                which is what makes this bar observable in verification at all
                (T-71: requestAnimationFrame never fires there, so a
                motion-driven transform stays unset).
              */}
              <div
                className="bg-research h-full origin-left"
                style={{ transform: `scaleX(${state.storyProgress})` }}
              />
            </div>

            {visual.kind === 'per-scene' ? (
              <AnimatePresence mode="wait">
                <motion.div
                  key={state.sceneId}
                  initial={{ opacity: 0, y: reduceMotion ? 0 : 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: reduceMotion ? 0 : -8 }}
                  transition={{ duration: reduceMotion ? 0 : STAGE_DURATION_S, ease: EASE_OUT }}
                  className="absolute inset-0"
                >
                  {renderVisual(visual, state)}
                </motion.div>
              </AnimatePresence>
            ) : (
              /* No AnimatePresence: the whole point of a persistent stage is
                 that it is never unmounted, so its elements can morph. */
              <div className="absolute inset-0">{renderVisual(visual, state)}</div>
            )}

            <div className="text-ink-muted pointer-events-none absolute right-4 bottom-3 font-mono text-[10px] tracking-widest uppercase">
              fig. {figure}
            </div>
          </div>

          {citation && (
            <div className="border-line bg-paper-raised/60 flex items-center justify-between gap-4 border px-4 py-2 text-xs">
              <span className="text-ink-muted flex items-center gap-2">
                <span className="text-research font-mono text-[10px] tracking-widest uppercase">Drawn from</span>
                <span className="text-ink">{citation.fig}</span>
              </span>
              <span className="text-ink-muted truncate">{citation.source}</span>
            </div>
          )}
        </div>
      </div>

      {/*
        Mobile: a fixed dock, shown only while the reader is inside the story
        so it never covers the tags and related plates below it.

        28vh is COUPLED to Scene.astro's min-height of 70vh: 100 - 28 = 72vh of
        reading room, a 2vh margin over what a scene demands. T-67 measured
        what a negative margin does — `justify-content: center` centres text
        against the full viewport rather than the visible area, so prose sits
        behind the dock. Change both together. Tailwind's JIT needs a literal
        class string, so this value and the spacer below cannot share a
        constant either.
      */}
      {state.withinStory && (
        <div className="border-line bg-paper-raised fixed inset-x-0 bottom-0 z-30 h-[28vh] border-t lg:hidden">
          {visual.kind === 'per-scene' ? (
            <AnimatePresence mode="wait">
              <motion.div
                key={state.sceneId}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: reduceMotion ? 0 : STAGE_DURATION_S, ease: EASE_OUT }}
                className="h-full"
              >
                {renderVisual(visual, state)}
              </motion.div>
            </AnimatePresence>
          ) : (
            <div className="h-full">{renderVisual(visual, state)}</div>
          )}
        </div>
      )}
      <div className="h-[28vh] lg:hidden" />
    </>
  );
}
